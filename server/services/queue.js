const RedisSMQ = require('rsmq');
const redis = require('redis');
let rsmq, client, config;


function sendMessage(message) {
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
                return resolve(resp.message);
            }
            reject('Not empty yet');
        });
    });
}

function createRevision(data) {
    return new Promise((resolve, reject) => {
        if (data) {
            data = JSON.parse(data);
            console.log('Revision exists', data.revision);
            return resolve();
        }
        const revision = (new Date()).getTime();
        console.log(`Starting revision: ${revision}`);
        let promises = config.urls.map(url => {
            let message = {
                url,
                revision
            };
            return sendMessage(message).then(() => {
                console.log(`added: ${url}`);
            })
        });
        resolve(Promise.all(promises));
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

function createQueues() {
    return new Promise((resolve, reject) => {
        let headlineParser = rsmq.createQueue({ qname: config.queues.headlineParser.name, vt: 10 }, function(err, resp) {
            if (err) {
                return reject(err);
            }
            resolve(resp);
        });
        let articleParser = rsmq.createQueue({ qname: config.queues.articleParser.name, vt: 10 }, function(err, resp) {
            if (err) {
                return reject(err);
            }
            resolve(resp);
        });
        let client = rsmq.createQueue({ qname: config.queues.client.name, vt: 10 }, function(err, resp) {
            if (err) {
                return reject(err);
            }
            resolve(resp);
        });
        return Promise.all([headlineParser, articleParser, client]);
    });
}
exports.init = (initConfig) => {
    config = initConfig;
    rsmq = new RedisSMQ(config.redis);
    client = redis.createClient(config.redis);

    checkQueue().then((data) => {
        setInterval(() => {
            checkRevision()
                .then(createRevision)
                .catch(console.error);
        }, config.queue.updateInterval);
    });
}