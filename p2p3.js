var socket = new Socket('wss://local:8080');
var Local = {};

Local.init = socket => {
    let subject = new Rx.ReplaySubject(1);
    var uuid = Math.floor(Math.random() * 10000);
    console.log('Local UUID', uuid);

    socket.onopen = () => {
        socket.send('peer', {
            uuid
        });
        subject.next({
            uuid,
            socket,
            peerUuids: []
        });
    };

    return subject;
};

let local = Local.init(socket);

let peers = Peers.create(local);
peers.pool.subscribe(peers => {
    console.log('PEERs', peers.map(peer => peer.uuid));
});