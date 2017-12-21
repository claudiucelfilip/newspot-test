var config = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
            urls: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
        }
    ]
};
var uuid, serverConnection;
var enable = false;
var offer, answer;

var connections = [];

function createConnection() {
    var localConnection, remoteConnection, sendChannel, receiveChannel;

    localConnection = new RTCPeerConnection(config);
    sendChannel = localConnection.createDataChannel('sendChannel');

    localConnection.ondatachannel = function(event) {
        receiveChannel = event.channel;
        receiveChannel.onmessage = function(message) {
            console.log('got RTC message', message);
        };
        receiveChannel.onopen = function() {
            console.log('receive datachannel opened', receiveChannel.readyState);
        };

        receiveChannel.onclose = function() {
            console.log('receive datachannel closed', receiveChannel.readyState);
        };
    };

    sendChannel.onopen = function() {
        console.log('send datachannel opened', sendChannel.readyState);
    };
    sendChannel.onclose = function() {
        console.log('send datachannel closed', sendChannel.readyState);
    };

    sendChannel.onerror = function(err) {
        console.log(err);
    };

    window.onbeforeunload = function() {
        sendChannel.close();
        if (receiveChannel) {
            receiveChannel.close();
        }
    }

    localConnection.onicecandidate = function(event) {
        if (event.candidate != null) {
            serverConnection.send(JSON.stringify({ 'ice': event.candidate, 'uuid': uuid }));
        }
    };

    connections.push({
        sendChannel,
        receiveChannel,
        localConnection
    })
}

function getLastConnection() {
    var connection = connections[connections.length - 1];
    if (!connection) {
        createConnection();
    }
    return connections[connections.length - 1];
}

function pageReady() {
    uuid = uuid();

    serverConnection = new WebSocket('wss://local:8080');
    serverConnection.onmessage = getMessageFromServer;
    createConnection();

    document.getElementById('submit').addEventListener('click', function() {
        getLastConnection().sendChannel.send('aaaa');
    });

}

function getMessageFromServer(message) {
    var signal = JSON.parse(message.data);
    let localConnection = getLastConnection().localConnection;

    if (signal.getInfo) {
        console.log('getinfo');
        serverConnection.send(JSON.stringify({
            info: {
                uuid: uuid
            }
        }));
        return;
    }

    if (signal.uuid == uuid) return;

    if (signal.newpeer) {
        console.log('to create offer');
        createConnection();
        localConnection.createOffer()
            .then(createdDescription)
            .catch(function(err) {
                console.log(err);
            });
        return;
    }


    if (signal.sdp) {

        localConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp))
            .then(function() {
                if (signal.sdp.type == 'offer') {
                    localConnection.createAnswer()
                        .then(createdDescription)
                        .catch(function(err) {
                            console.log('create answer desc error', err);
                        });
                }
            })
            .catch(function(err) {
                console.log('set remote desc error', err);
            });
        return;
    }
    if (signal.ice) {
        console.log('received ice');
        localConnection.addIceCandidate(new RTCIceCandidate(signal.ice))
            .then(function(ev) {
                console.log(ev);
            })
            .catch(function(err) {
                console.log('add ice candidate error', err);
            });

        return;
    }
}

function errorHandler(error) {
    console.error(error);
}


function createdDescription(description) {
    console.log('got description');
    var localConnection = getLastConnection().localConnection;

    return localConnection.setLocalDescription(description, function() {
        console.log('send', description.type);
        serverConnection.send(JSON.stringify({ 'sdp': description, 'uuid': uuid }));
    }, function(err) {
        console.log('set description error', err);
    });
}

function createOfferError(error) {
    console.log(error);
}

function uuid() {
    return Math.floor(Math.random() * 10000);
}