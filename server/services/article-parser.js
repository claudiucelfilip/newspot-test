RedisSMQ = require("rsmq");
rsmq = new RedisSMQ( {host: "127.0.0.1", port: 6379, ns: "rsmq"} );

exports.init = () => {
    rsmq.receiveMessage({qname:"myqueue"}, function (err, resp) {
        if (resp && resp.id) {
            console.log("Message received.", resp);
            // rsmq.deleteMessage({qname:"myqueue", id:resp.id}, function (err, resp) {
            //     if (resp===1) {
            //         console.log("Message deleted.")	
            //     }
            //     else {
            //         console.log("Message not found.")
            //     }
            // });
        }
        else {
            console.log("No messages for me...")
        }

        
    });
}