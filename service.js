var Service = {};

Service.init = () => {
    let subject = new Rx.Subject();
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(service => {
                console.log('ServiceWorker registration successfull');
                subject.next(service);
            }, err => {
                console.log('ServiceWorker registration failed', err);
                subject.error(err);
            });
    });
    return subject;
}

var service = Service.init();
var globalPeer;

Rx.Observable
    .zip(
        peers.latest,
        service
    ).subscribe(([peer, service]) => {
        // addImages();

        globalPeer = peer;
        // serviceMessage('newPeer', peer.uuid);
        // navigator.serviceWorker.addEventListener('message', event => {
        //     console.log('!!! Message', event);

        //     url = event.data.url;
        //     peer.broadcast('request', {
        //         url
        //     }, event.data.uuid);
        // });

        // peer.onClose.subscribe(() => {
        //     serviceMessage('lostPeer', peer.uuid);
        // })

        // peer.on('request', (request) => {
        //     let headers = new Headers();
        //     headers.append('X-Peer-Fetch', 'true');
        //     fetch(request.url, { headers })
        //         .then(response => response.arrayBuffer())
        //         .then(blob => {
        //             peer.send('response', {
        //                 blob
        //             });
        //         });
        // });

        // peer.on('response', (data) => {
        //     console.log('response', data);
        //     serviceMessage('response', {
        //         url,
        //         blob: new Blob([new Uint8Array(data)])
        //     });
        // });

    });

function serviceMessage(type, data) {
    navigator.serviceWorker.controller.postMessage({
        type,
        data
    });
}

function addImages() {
    setTimeout(() => {
        let img = document.createElement('img');
        img.src = 'https://mdn.github.io/dom-examples/streams/simple-pump/tortoise.png';
        document.body.appendChild(img);
    }, 1000);

    setTimeout(() => {
        let img = document.createElement('img');
        img.src = 'https://placeimg.com/1024/768/people';
        document.body.appendChild(img);
    }, 1000);
}