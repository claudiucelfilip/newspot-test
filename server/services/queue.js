RedisSMQ = require("rsmq");
rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "rsmq"} );

exports.init = () => {
    rsmq.createQueue({qname:"myqueue"}, function (err, resp) {
        if (resp===1) {
            console.log("queue created")
        }
    });
}