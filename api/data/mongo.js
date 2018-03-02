const MongoClient = require('mongodb').MongoClient;

let db;

function connect(config) {
    return new Promise((resolve, reject) => {
        MongoClient.connect(config.host, function(err, client) {
            if (err) {
                return reject(err);
            }
            db = client.db(config.database);
            resolve(db);
        });
    });
};

module.exports = {
    connect,
    get db() {
        return db;
    }
}