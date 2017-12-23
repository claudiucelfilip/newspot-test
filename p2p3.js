var socket = new Socket('wss://local:8080');
var Local = {};
var Peer = {};

Local.init = () => {
    var uuid = Math.floor(Math.random() * 10000);
    socket.send('peer', {
        uuid
    });

    console.log('Local UUID', uuid);
    return new Promise((resolve) => resolve({
        uuid,
        peerUuids: []
    }));
}

Peer.offer = (local) => {
    let offer = new Connection();

    return offer.connection
        .createOffer()
        .then(desc => {
            let promiseDesc = offer.connection
                .setLocalDescription(desc)
                .then(() => desc);
            let promiseIce = offer.getIceCandidate();
            return Promise.all([promiseDesc, promiseIce]);
        })
        .then(([desc, ice]) => {
            console.log("offer sent", desc, ice);
            socket.send('sendOffer', {
                uuid: local.uuid,
                desc,
                ice,
                id: offer.id

            });
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                socket.once('answer', (answer) => {
                    offer.uuid = answer.uuid;
                    resolve({
                        local,
                        offer,
                        answer
                    });
                });

            });
        });
};

Peer.ask = (local) => {
    socket.send('requestOffer');

    return new Promise((resolve, reject) => {
        let handleNewOffer = (offer) => {
            if (local.peerUuids.indexOf(offer.uuid) === -1) {
                socket.send('requestOffer', {
                    id: offer.id
                });
            }
        };

        let handleOffer = (offer) => {
            if (!offer || !offer.desc || offer.uuid === local.uuid || local.peerUuids.indexOf(offer.uuid) !== -1) {
                return;
            }

            console.log('Got offer', offer);
            socket.off('offer', handleOffer);
            socket.off('newOffer', handleNewOffer);

            local.peerUuids.push(offer.uuid);
            resolve({
                local,
                offer
            });
        };

        socket.on('offer', handleOffer);
        socket.on('newOffer', handleNewOffer);
    });
};


Peer.answer = ({ local, offer }) => {
    let answer = new Connection();

    answer.uuid = offer.uuid;
    return answer.connection
        .setRemoteDescription(new RTCSessionDescription(offer.desc))
        .then(() => answer.connection.createAnswer())
        .then(desc => {
            let promiseDesc = answer.connection
                .setLocalDescription(desc)
                .then(() => desc);
            let promiseIce = answer.getIceCandidate();
            return Promise.all([promiseDesc, promiseIce]);
        })
        .then(([desc, ice]) => {
            return answer.connection
                .addIceCandidate(new RTCIceCandidate(ice))
                .then(() => [desc, ice]);
        })
        .then(([desc, ice]) => {
            console.log("answer sent", desc, ice);
            socket.send('sendAnswer', {
                uuid: local.uuid,
                target: offer.uuid,
                desc,
                ice,
                offerId: offer.id,
                answerId: answer.id
            });
        })
        .then(() => answer.onOpen);
}

Peer.connect = ({ local, offer, answer }) => {
    if (!answer.desc || answer.uuid === local.uuid) {
        return;
    }

    local.peerUuids.push(answer.uuid);

    return offer.connection
        .setRemoteDescription(new RTCSessionDescription(answer.desc))
        .then(() => {
            return offer.connection.addIceCandidate(new RTCIceCandidate(answer.ice))
        })
        .then(() => offer.onOpen);
}

Peer.setHandlers = (peer) => {
    peer.on('message', (message) => {
        console.log('got RTC message', message);
        let p = document.createElement('li');
        p.innerHTML = message;
        document.getElementById('messages').appendChild(p);
    });

    return peer;
}

Peer.onClose = (peer) => {
    return peer.onClose();
}

socket.onopen = () => {
    var local1 = Local.init()
        .then((local) => {
            var peer1 = createPeer(local);

            peer1.broadcast('hello');
        });
}

function createPeer(local) {
    setTimeout(() => {
        var peer2 = createAsk(local);
    }, 1000);
    return createOffer(local);
}

function createOffer(local) {
    return Peer
        .offer(local)
        .then(Peer.connect)
        .then(Peer.onClose)
        .then(peer => {
            return createOffer(local);
        });
}

function createAsk(local) {
    return Peer
        .ask(local)
        .then(Peer.answer)
        .then(Peer.onClose)
        .then(peer => {
            return createAsk(local);
        });
}