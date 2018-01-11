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
let count = 1;
peers.latest.withLatestFrom(local).subscribe(([peer, localInfo]) => {
    
    peer.on('ping', payload => {
        
        if (payload.nextUuid !== localInfo.uuid) {
            peers.broadcast('ping', payload, null, payload.sourceUuid);
        }
        console.log(payload);
    });
});
peers.pool
    .do(items => {
        console.log('PEERs', items.map(peer => peer.uuid));
    })
    .filter(items => items.length)
    .first()
    .subscribe(() => {
        peers.broadcast('ping', 'hey there');
    });
