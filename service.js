peers.subscribe(peer => {
    debugger;
    navigator.serviceWorker.addEventListener('message', event => {
        console.log('!!! Message', event);
        var blob = new Blob();

        console.log('request', event.data);
        peer.send('request', {
            url: event.data.url
        });

        peer.on('response', (response) => {
            console.log('response', response);

            navigator.serviceWorker.controller.postMessage({
                url: event.data.url,
                blob
            });
        });
    });


    setTimeout(() => {
        let img = document.createElement('img');
        img.src = 'https://placeimg.com/480/400/people';
        document.body.appendChild(img);
    }, 1000);

    setTimeout(() => {
        let img = document.createElement('img');
        img.src = 'https://placeimg.com/1024/768/people';
        document.body.appendChild(img);
    }, 1000);
});
window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
        .then(() => {
            console.log('ServiceWorker registration successfull');



        }, (err) => {
            console.log('ServiceWorker registration failed', err);
        });
});