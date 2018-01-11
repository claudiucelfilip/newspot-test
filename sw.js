let peerUuids = [];
self.addEventListener('install', (event) => {
    addMessageHandler('newPeer', (uuid) => {
        peerUuids.push(uuid);
    });

    addMessageHandler('lostPeer', (lostUuid) => {
        peerUuids.filter(uuid => uuid !== lostUuid);
    });
});

function getHeaders(entries) {
    let headers = {};
    for (let entry of entries) {
        headers[entry[0]] = entry[1];
    }
    return headers;
}

function getResponse(url) {
    return new Promise((resolve) => {
        addMessageHandler('response', data => {
            if (data.url === url) {
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
                console.log(event.request.url);
                if (false && event.clientId && peerUuids.length) {
                    const client = await clients.get(event.clientId);

                    if (client) {
                        client.postMessage({
                            url: event.request.url,
                            headers: getHeaders(event.request.headers.entries()),
                            method: event.request.method
                        });

                        let data = await getResponse(event.request.url);
                        var init = { headers: { "Content-Type": "image/png" } };
                        var response = new Response(data.blob, init);

                        cache.put(data.url, response);
                        return response;
                    }
                }
                return fetch(event.request).then(function(response) {
                    if (response.status === 404) {
                        return;
                    }
                    if (/^chrome-extension/.test(event.request.url) === false) {
                        try {
                            // cache.put(event.request.url, response.clone());
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
});

self.addEventListener('activate', function(event) {
    console.log('SW Reactivated');
});

let handlers = {};

function addMessageHandler(type, fn) {
    handlers[type] = handlers[type] || [];
    handlers[type].push(fn);
}
self.addEventListener('message', function(event) {
    var message = event.data;
    var handlerType = handlers[message.type] || [];

    handlerType.forEach(handler => handler(message.data));
});