var socket = new WebSocket('wss://local:8080');

var peer = {};

peer.offer = () => {
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
            sendMessage({
                type: "sendOffer",
                data: {
                    uuid,
                    desc,
                    ice,
                    id: offer.id
                }
            });
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                socket.onmessage = message => {
                    let action = JSON.parse(message.data);

                    if (action.type === "answer") {
                        resolve(action.data);
                    }
                };
            });
        })
        .catch(err => {
            console.log(err);
        });
};

peer.ask = () => {
    socket.sendMessage({
        type: "requestOffer"
    });

    return new Promise((resolve, reject) => {
        socket.onmessage = message => {
            let action = JSON.parse(message.data);

            if (action.type === "offer") {
                resolve(action.data);
            }
        };
    });
};

var peer1 = peer.offer().then(answer => connection);

var peer2 = peer.ask().then(() => {
    let answer = new AnswerConnection();

    return answer.connection
        .setRemoteDescription(new RTCSessionDescription(offer.desc))
        .then(() => peer.localConnection.createAnswer())
        .then(desc => {
            let promiseDesc = peer.localConnection
                // set local description to local desc
                .setLocalDescription(desc)
                .then(() => desc);
            let promiseIce = peer.getIceCandidate();
            return Promise.all([promiseDesc, promiseIce]);
        })
        .then(([desc, ice]) => {
            return peer.localConnection
                .addIceCandidate(new RTCIceCandidate(ice))
                .then(() => [desc, ice]);
        })
        .then(([desc, ice]) => {
            console.log("answer sent", desc, ice);
            sendMessage({
                type: "sendAnswer",
                data: {
                    uuid,
                    target: offer.uuid,
                    desc,
                    ice,
                    offerId: offer.id,
                    answerId: peer.id
                }
            });
            return answer;
        })
        .catch(function(err) {
            console.log("create answer desc error", err);
        });
    
});


peer1.send('atrrda');
peer1.request('adasda').then();