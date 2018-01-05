var socket = new Socket('wss://local:8080');
var Local = {};
var Peer = {};

Local.init = (socket) => Rx.Observable.create((observer) => {
    socket.onopen = () => {
        var uuid = Math.floor(Math.random() * 10000);
        socket.send('peer', {
            uuid
        });

        console.log('Local UUID', uuid);
        observer.next({
            uuid,
            peerUuids: []
        });
    };
});

Peer.offer = (local) => {
    let offer = new Connection('offer');
    
    let promise = offer.connection
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

            return {
                local,
                offer
            };
        })
        .catch((err) => {
            console.log(err);
        });

    return Rx.Observable.from(promise);
};

Peer.wait = ({ local, offer }) => {
    let subject = new Rx.Subject();

    socket.once('answer', (answer) => {
        console.log('received answer', answer);
        offer.uuid = answer.uuid;
        subject.next({
            local,
            offer,
            answer
        });
    });

    return subject;
}

Peer.connect = ({ local, offer, answer }) => {
    if (!answer.desc || answer.uuid === local.uuid) {
        return;
    }

    let subject = new Rx.Subject();

    local.peerUuids.push(answer.uuid);

    offer.connection
        .setRemoteDescription(new RTCSessionDescription(answer.desc))
        .then(() => {
            return offer.connection.addIceCandidate(new RTCIceCandidate(answer.ice))
        })
        .then(() => offer.onOpen)
        .then(subject.next.bind(subject), subject.error.bind(subject));

    return subject;
}

Peer.ask = (local) => {
    let subject = new Rx.Subject();
    socket.send('requestOffer');

    let handleNewOffer = (offer) => {
        console.log(local.peerUuids);
        if (local.peerUuids.length < 3 && local.peerUuids.indexOf(offer.uuid) === -1) {
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

        local.peerUuids.push(offer.uuid);
        subject.next({
            local,
            offer
        });
    };

    socket.on('offer', handleOffer);
    socket.on('newOffer', handleNewOffer);

    return subject;
};


Peer.answer = ({ local, offer }) => {
    let answer = new Connection('ask');
    let subject = new Rx.Subject();

    answer.uuid = offer.uuid;
    let promise = answer.connection
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
        .then(() => answer.onOpen)
        .then(subject.next.bind(subject), subject.error.bind(subject));

    return subject;
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

let local = Local.init(socket);
let peers = local.flatMap((local) => createPairPeers(local));

// peers.flatMap(peer => {
//         peer.on('text', (message) => {
//             console.log(message);
//         });
//         return Rx.Observable.timer(1000)
//             .map(() => peer);
//     })
//     .subscribe((peer) => {
//         peer.broadcast('text', `hello ${peer.type} from ${peer.uuid}`);
//     });

function createPairPeers(local) {
    let peers = Rx.Observable
        .zip(
            createOffer(local),
            createAsk(local)
        )
    // peers.subscribe(peers => {
    //     peers.forEach(peer => {
    //         peer.onClose()
    //         .then(() => {
    //             local.peerUuids = local.peerUuids
    //                 .filter(uuid => uuid !== peer.uuid);
    //         })
    //     });
    // });
    return peers;
}

function createOffer(local) {
    let peer = Peer
        .offer(local)
        .flatMap(Peer.wait)
        .flatMap(Peer.connect);

    return peer;
}

function createAsk(local) {
    let count = 0;
    let peer = Peer
        .ask(local)
        .flatMap(Peer.answer);

    return peer;
}