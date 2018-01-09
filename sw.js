self.addEventListener('install', (event) => {

});

function getHeaders(entries) {
    let headers = {};
    for (let entry of entries) {
        headers[entry[0]] = entry[1];
    }
    return headers;
}

function getClientResponse(url) {
    return new Promise((resolve) => {
        addHandler(function(data) {

            if (data.url == url) {
                resolve(data);
            }
        });
    });
}
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.open('v1').then(function(cache) {
            return caches.match(event.request).then(async function(response) {
                if (response) {
                    return response;
                }
                if (event.clientId && event.request.mode !== 'cors' && event.request.url === 'https://mdn.github.io/dom-examples/streams/simple-pump/tortoise.png') {
                    const client = await clients.get(event.clientId);

                    if (client) {
                        client.postMessage({
                            url: event.request.url,
                            headers: getHeaders(event.request.headers.entries()),
                            method: event.request.method
                        });
                        return getClientResponse(event.request.url).then((data) => {
                            var init = {headers: { "Content-Type" : "image/png" }};
                            var response = new Response(data.blob, init);

                            cache.put(data.url, response);
                            return response;
                        });
                    }

                }
                return fetch(event.request).then(function(response) {
                    if (response.status === 404) {
                        return;
                    }
                    if (/^chrome-extension/.test(event.request.url) === false) {
                        try {
                            cache.put(event.request.url, response.clone());
                        } catch (e) {
                            console.log(e);
                        }
                    }

                    return response;
                });



            }).catch(function(err) {
                // If both fail, show a generic fallback:
                // return caches.match('/offline.html');
                console.log(err);
            })
        })
    );
    // event.respondWith(async function() {
    //     // console.log(event.request);
    //     // debugger;
    //     let request = event.request.clone();

    //     request.headers = new Headers({
    //         'Content-Type': 'application/json'
    //     });

    //     const responseDefault = await fetch(request).then((response) => {
    //         debugger;
    //         return response;
    //     }, (err) => {
    //         debugger;
    //     });

    //     if (!event.clientId) return responseDefault;
    //     const client = await clients.get(event.clientId);

    //     if (!client) return responseDefault;

    //     // Send a message to the client.
    //     client.postMessage({
    //         url: event.request.url
    //     });
    //     const response = await fetch('https://static.pexels.com/photos/34950/pexels-photo.jpg');

    //     return response;
    // }());
});


self.addEventListener('activate', function(event) {
    console.log('SW Reactivated');
});

let handlers = [];

function addHandler(fn) {
    handlers.push(fn);
}
self.addEventListener('message', function(event) {
    var data = event.data;

    handlers.forEach(handler => handler(data));
});