var config = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        {
            urls: 'turn:192.158.29.39:3478?transport=tcp',
            credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
            username: '28224511:1379330808'
        }
    ]
};


var uuid = Math.floor(Math.random() * 10000);
var sc = new WebSocket(`wss://local:8080/?uuid=${uuid}`);
var peerUuids = [];
var offerPeer;
var answerPeer;
var answerPeers = {};
var offerPeers = {};
var connectedUuids = [];
var receivedMessages = [];

function sendMessage(message) {
    if (typeof message !== 'string') {
        message = JSON.stringify(message);
    }
    sc.send(message);
}

sc.onopen = function() {
    sendPeer();
    sendOffer();
    getOffer();
}

sc.onmessage = function(message) {
    var action = JSON.parse(message.data);    
    console.log(action);
    switch(action.type) {
        case 'newOffer': 
            getOffer();
            break;
        case 'offer': 
            answerOffer(action.data);
            break;
        case 'answer':
            completeConnection(action.data);
            break;
    }
};

function getOffer() {
    sendMessage({
        type: 'requestOffer'
    });
}
/*
*  Adds peer to a peer list on server
*/
function sendPeer() {
    sendMessage({
        type: 'sendPeer',
        data: {
            uuid
        }
    });
}

/*
*   Adds offer to an offer list on server
*/
function sendOffer() {
    let peer = createPeerConnection('offer');
    offerPeers[peer.id] = peer;

    return peer.localConnection
        .createOffer()
        .then((desc) => {
            let promiseDesc = peer.localConnection
                .setLocalDescription(desc)
                .then(() => desc);
            let promiseIce = peer.getIceCandidate();
            return Promise.all([promiseDesc, promiseIce]);
        })
        .then(([desc, ice]) => {
            console.log('offer sent', desc, ice)
            sendMessage({
                type: 'sendOffer',
                data: {
                    uuid,
                    desc,
                    ice,
                    id: peer.id
                }
            });
        })
        .catch((err) => {
            console.log(err);
        });
}

function answerOffer(offer) {
    

    if (!offer) {
        return false;
    }

    if (!offer.desc || offer.uuid === uuid || connectedUuids.indexOf(offer.uuid) !== -1) {
        return;
    }

    if (connectedUuids.indexOf(offer.uuid) === -1) {
        connectedUuids.push(offer.uuid);
    }

    var peer = createPeerConnection('answer');

    answerPeers[peer.id] = peer;
    peer.target.uuid = offer.uuid;

    console.log('getOffer', offer.desc);
    peer.localConnection
        // set remote description to remote desc
        .setRemoteDescription(new RTCSessionDescription(offer.desc))
        .then(() => peer.localConnection.createAnswer())
        .then((desc) => {
            let promiseDesc = peer.localConnection
            // set local description to local desc
                .setLocalDescription(desc)
                .then(() => desc);
            let promiseIce = peer.getIceCandidate();
            return Promise.all([promiseDesc, promiseIce]);
        })
        .then(([desc, ice]) => {
            return peer.localConnection.addIceCandidate(new RTCIceCandidate(ice))
                .then(() => [desc, ice]);
        })
        .then(([desc, ice]) => {
            console.log('answer sent', desc, ice);
            sendMessage({
                type: 'sendAnswer',
                data: {
                    uuid,
                    target: offer.uuid,
                    desc,
                    ice,
                    offerId: offer.id,
                    answerId: peer.id
                }
            });
        })
        .catch(function(err) {
            console.log('create answer desc error', err);
        });
}

function completeConnection(answer) {
    if (!answer.desc || answer.uuid === uuid) {
        return;
    }
    
    var peer = offerPeers[answer.offerId];
    peer.localConnection
        //set remote description to remote desc
        .setRemoteDescription(new RTCSessionDescription(answer.desc))
        .then(() => {
            return peer.localConnection.addIceCandidate(new RTCIceCandidate(answer.ice))
        })
        .catch(function(err) {
            console.log('setRemoteDescription answer error', err);
        });
}

function commitMessage(message) {
    console.log('got RTC message', message);
    let p = document.createElement('li');
    p.innerHTML = message;
    document.getElementById('messages').appendChild(p);
}

function dictToArray(dict) {
    return Object.keys(dict).map(key => dict[key]);
}

function createPeerConnection(peerType) {
    var localConnection, sendChannel, receiveChannel;
    var target = {
        uuid: null
    };

    localConnection = new RTCPeerConnection(config);
    sendChannel = localConnection.createDataChannel(`channel`);

    localConnection.ondatachannel = function(event) {
        receiveChannel = event.channel;
        receiveChannel.onmessage = function(message) {
            var payload = JSON.parse(message.data);

            if (receivedMessages.indexOf(payload.data.id) === -1) {
                receivedMessages.push(payload.data.id);
                commitMessage(payload.data.value);
                broadcast(message.data);
            }
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

    function getIceCandidate() {
        return new Promise((resolve, reject) => {
            localConnection.onicecandidate = function(event) {
                if (event.candidate !== null) {
                    resolve(event.candidate);
                }
            };
        });
    }


    return {
        sendChannel,
        receiveChannel,
        localConnection,
        getIceCandidate,
        target,
        id: Math.floor(Math.random() * 100000)
    };
}

function broadcast(message) {
    let offerPeersArray = dictToArray(offerPeers);
    let answerPeersArray = dictToArray(answerPeers);

    if (typeof message !== 'string') {
        message = JSON.stringify(message);
    }
    
    [...offerPeersArray, ...answerPeersArray]
    .filter(peer => peer.sendChannel.readyState === 'open')
        .forEach((peer) => {
            peer.sendChannel.send(message);
        })
}
document.getElementById('submit').addEventListener('click', function() {
    let message = document.getElementById('input').value;
    commitMessage(message);

    let messageId = Math.floor(Math.random() * 10000);
    receivedMessages.push(messageId);

    broadcast({
        type: 'text',
        data: {
            value: message,
            id: messageId
        }
    });
    document.getElementById('input').value = '';
});