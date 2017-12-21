class Connection {
    constructor(type) {
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
}
class Offer {
    constructor(socket) {
        this.socket = socket;
    }
}

class Answer {
    constructor(socket) {
        socket.filter()
    }
}
class Peer {
    

    static broadcast() {
        
    }

    static configure (options) {
        Peer.config = options;

        Peer.configure.webSocket.onmessage = function(message) {
            var action = JSON.parse(message.data);    
            console.log(action);
            switch(action.type) {
                case 'newOffer': 
                    requestOffer();
                    break;
                case 'offer': 
                    answerOffer(action.data);
                    break;
                case 'answer':
                    completeConnection(action.data);
                    break;
            }
        }
    }

    constructor() {
        var offer = new Offer(Peer.socket);
        sendPeerInfo();
        sendOffer();
        requestOffer();
    }

    send() {

    }
    answerOffer(offer) {
        if (!offer) {
            return false;
        }
    
        if (!offer.desc || offer.uuid === uuid || connectedUuids.indexOf(offer.uuid) !== -1) {
            return;
        }
    
        if (this.connectedUuids.indexOf(offer.uuid) === -1) {
            this.connectedUuids.push(offer.uuid);
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
    sendOffer() {
        let peer = createPeerConnection('offer');
        Peer.offerPeers[peer.id] = peer;
    
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
                Peer.sendToServer({
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

    sendPeerInfo() {
        Peer.sendToServer({
            type: 'sendPeerInfo',
            data: {
                uuid: this.uuid
            }
        });
    }

    requestOffer() {
        Peer.sendToServer({
            type: 'requestOffer'
        });
    }

    
}