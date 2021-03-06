const RedisSMQ = require('rsmq');
const redis = require('redis');
const MongoClient = require('mongodb').MongoClient;

let rsmq, db, client, config;


function notiyHeadlinParsers(message) {
    message = JSON.stringify(message);

    return new Promise((resolve, reject) => {
        rsmq.sendMessage({ qname: config.queues.headlineParser.name, message }, (err, resp) => {
            if (err) {
                return reject(err);
            }
            resolve(resp);
        });
    });
}

function checkRevision() {
    return new Promise((resolve, reject) => {
        rsmq.getQueueAttributes({ qname: config.queues.headlineParser.name }, function(err, resp) {
            if (err) {
                return reject(err);
            }
            if (!resp.msgs) {
                return resolve();
            }
            reject('Not empty yet');
        });
    });
}

function getSources() {
    let sources = db.collection('sources');

    return new Promise((resolve, reject) => {
        sources.find({}).toArray((err, resp) => {
            if (err) {
                return reject(err);
            }
            resolve(resp);
        });
    });
}

function triggerRevision(sources) {
    return new Promise((resolve, reject) => {
        console.log(`Starting revision`);

        sources.forEach(source => {
            let message = {
                source
            };
            notiyHeadlinParsers(message).then(() => {
                console.log(`added: ${source.url}`);
            });
        });
        resolve();
    });
}

function checkCollections() {
    return new Promise((resolve, reject) => {
        db.collections((err, resp) => {
            if (resp.length <= 3) {
                return createCollections()
                    .then(populateSources)
                    .then(resolve, console.log);
            }
            resolve(resp);
        })
    });

}

function checkQueue() {
    return new Promise((resolve, reject) => {
        client.smembers(config.redis.ns + ':QUEUES', (err, resp) => {
            if (err) {
                return reject(err);
            }
            if (resp.length < 3) {
                return createQueues().then(resolve, console.log);
            }
            resolve(resp);
        });
    });
}

function promisify(...args) {
    let fn = args.shift();
    let bind = fn;

    if (typeof fn !== 'function') {
        fn = args.shift();
    }

    return new Promise((resolve, reject) => {
        let cb = (err, resp) => {
            if (err) {
                return reject(err);
            }
            resolve(resp);
        };
        fn.apply(bind, [...args, cb]);
    }).catch(console.log);
}

function createQueues() {
    return Promise.all([
        promisify(rsmq.createQueue, { qname: config.queues.headlineParser.name, vt: 10 }),
        promisify(rsmq.createQueue, { qname: config.queues.articleParser.name, vt: 10 }),
        promisify(rsmq.createQueue, { qname: config.queues.client.name, vt: 10 })
    ]);
}

function createCollections() {
    let articles = db.collection('articles');
    let sources = db.collection('sources');

    return Promise.all([
        promisify(articles, articles.ensureIndex, { url: 1 }, { unique: true }),
        promisify(sources, sources.ensureIndex, { url: 1 }, { unique: true })
    ]);
}

function populateSources() {
    let sources = db.collection('sources');
    let sourcesPromisess = config.sources.map(source => {
        return promisify(sources, sources.insert, source);
    });

    return Promise.all(sourcesPromisess);
}

function resetCollections() {
    let articles = db.collection('articles');
    let sources = db.collection('sources');

    return Promise.all([
        promisify(articles, articles.remove, {}),
        promisify(sources, sources.remove, {})
    ]);
}

function resetQueues(err) {
    return Promise.all([
        promisify(rsmq.deleteQueue, { qname: config.queues.headlineParser.name }),
        promisify(rsmq.deleteQueue, { qname: config.queues.articleParser.name }),
        promisify(rsmq.deleteQueue, { qname: config.queues.client.name })
    ])
}

function trigger() {
    checkRevision()
        .then(getSources)
        .then(triggerRevision)
        .catch(console.error);
}

function start() {
    let promiseStart;

    if (config.freshStart) {
        promiseStart = Promise.all([resetQueues(), resetCollections()])
            .then(() => {
                return Promise.all([checkQueue(), checkCollections()])
            });
    } else {
        promiseStart = Promise.all([checkQueue(), checkCollections()]);
    }

    promiseStart
        .then((data) => {
            setInterval(trigger, config.queue.updateInterval);
            trigger();
        });
}
exports.init = (initConfig) => {
    config = initConfig;
    rsmq = new RedisSMQ(config.redis);
    client = redis.createClient(config.redis);


    MongoClient.connect(config.mongo.host, function(err, client) {
        console.log("Connected successfully to server");
        db = client.db(config.mongo.database);

        start();
    });
}