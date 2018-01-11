var socket = new Socket('wss://local:8080');
var Local = {};
var Peer = {};

Local.init = (socket) => {
    let subject = new Rx.Subject();
    socket.onopen = () => {
        var uuid = Math.floor(Math.random() * 10000);
        socket.send('peer', {
            uuid
        });

        console.log('Local UUID', uuid);
        subject.next({
            uuid,
            peerUuids: []
        });
    };

    return subject;
};

Peer.offer = (local) => {
    let subject = new Rx.Subject();
    let offer = new Connection('offer', local.uuid);

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

            subject.next({
                local,
                offer
            });
        })
        .catch((err) => {
            console.log(err);
            subject.error(err);
        });

    return subject;
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
    let answer = new Connection('ask', local.uuid);
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

let peers = new Rx.Subject();
let local = Local.init(socket)
    .flatMap(createPairPeers)
    .subscribe(subscribePeers(peers))


function subscribePeers(peersSubject) {
    return peersSubject.next.bind(peersSubject);
}

function createPairPeers(local) {
    return Rx.Observable
        .merge(
            createOffer(local),
            createAsk(local)
        ).do(peer => {
            console.log('Currently connected to', local.peerUuids);
            peer.onClose()
                .then(() => {
                    console.log('Lost', peer.uuid);
                    local.peerUuids = local.peerUuids
                        .filter(uuid => uuid !== peer.uuid);
                });
        });
}

function createOffer(local) {
    return Peer
        .offer(local)
        .flatMap(Peer.wait)
        .flatMap(Peer.connect);
}

function createAsk(local) {
    let count = 0;
    return Peer
        .ask(local)
        .flatMap(Peer.answer);
}