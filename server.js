var fs = require('fs'),
    https = require('https'),
    express = require('express'),
    WebSocket = require('ws');
var app = express();

app.use(express.static('.'));
const server = https.createServer({
    key: fs.readFileSync('./privateKey.key'),
    cert: fs.readFileSync('./certificate.crt')
}, app);

const wServer = new WebSocket.Server({ server });

var peers = {},
    offers = [];
wServer.on('connection', function(ws) {
    var currentPeer;

    function sendMessage(message, socket) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
        let client = (socket || ws);
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    }

    ws.on('message', function(message) {
        let action = JSON.parse(message);

        switch (action.type) {
            case 'sendPeer':
                peers[action.data.uuid] = ws;
                currentPeer = action.data.uuid;
                break;
            case 'sendOffer':
                offers.push(action.data);
                console.log(offers);
                broadcast({
                    type: 'newOffer'
                });
                break;
            case 'requestOffer':
                console.log(offers);

                sendMessage({
                    type: 'offer',
                    data: getOffer()
                });
                break;
            case 'sendAnswer':
                removeOffer(action.data.id);
                sendMessage({
                    type: 'answer',
                    data: action.data
                }, peers[action.data.target]);
        }

        function broadcast(message) {
            wServer.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    sendMessage(message, client);
                }
            });
        }
    
    });

    
    ws.on('close', function() {
        delete peers[currentPeer];
        offers = offers.filter((offer) => {
            return offer.uuid !== currentPeer;
        });
    });

    function removeOffer(id) {
        return offers = offers.filter(offer => offer.id !== id);
    }
    
    function getOffer() {
        var index = offers.findIndex((offer) => {
            return offer.uuid !== currentPeer;
        });
        if (index == -1) {
            return null;
        }
        return offers.splice(index, 1)[0];
        // return offers[index];
    }

});



server.listen(8080);