var sc = new WebSocket(`wss://local:8080`);

Peer.configure({
    webSocket: sc
});

function addPeers(count) {
    var peerPromises = [];
    while (count--) {
        peerPromises.push(new Peer());
    }
    return Promise.all(peerPromises);
}

addPeers(3).then(function(peers) {
    Peer.broadcast('foo');
    Peer.on('bar', function(payload) {
        console.log(payload);
    });

    peers[0].send('foobar');
});
