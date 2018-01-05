
peers.subscribe((peers) => {
    console.log('Peers opened', peers);
    let url;
    navigator.serviceWorker.addEventListener('message', event => {
        console.log('!!! Message', event);

        url = event.data.url;
        peers[0].send('request', {
            url
        }); 
    });

    peers.forEach(peer => {
        peer.on('request', (request) => {
            fetch(request.url, {mode: 'cors'})
                .then(response =>  response.arrayBuffer())
                .then(blob => {
                    peer.send('response', {
                        blob
                    });
                });
        });
        peer.on('response', (data) => {
            console.log('response', data);
            navigator.serviceWorker.controller.postMessage({
                url,
                blob: new Blob([new Uint8Array(data)])
            });
        }); 
    });

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
})

// peers.subscribe(([peer1, peer2]) => {
//     navigator.serviceWorker.addEventListener('message', event => {
//         console.log('!!! Message', event);
//         var blob = new Blob();

//         console.log('request', event.data);
//         peer2.send('request', {
//             url: event.data.url
//         });

//         peer1.on('request', (request) => {
//         
//         })

//         peer2.on('response', (response) => {
//             console.log('response', response);

//             navigator.serviceWorker.controller.postMessage({
//                 url: event.data.url,
//                 blob
//             });
//         });
//     });
// });
window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
        .then(() => {
            console.log('ServiceWorker registration successfull');
        }, (err) => {
            console.log('ServiceWorker registration failed', err);
        });
});