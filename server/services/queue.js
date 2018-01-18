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
        rsmq.receiveMessage({ qname: config.queues.headlineParser.name }, function(err, resp) {
            if (err) {
                return reject(err);
            }
            resolve(resp.message);
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
            if (!resp.length) {
                return createQueue().then(resolve);
            }
            resolve(resp);
        });
    });
}

function createQueue() {
    return new Promise((resolve, reject) => {
        rsmq.createQueue({ qname: config.queues.headlineParser.name }, function(err, resp) {
            if (err) {
                return reject(err);
            }
            resolve(resp);
        });
    });
}
exports.init = (initConfig) => {
    config = initConfig;
    rsmq = new RedisSMQ(config.redis);
    client = redis.createClient(config.redis);

    checkQueue().then((data) => {
        setInterval(() => {
            checkRevision(data)
                .then(createRevision)
                .catch(err => {
                    debugger;
                });
        }, config.queue.updateInterval);
    });
}