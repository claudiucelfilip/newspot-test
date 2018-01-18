module.exports = {
    redis: {
        host: '127.0.0.1',
        port: 6379,
        ns: 'rsmq'
    },
    queue: {
        updateInterval: 5000
    },
    queues: {
        headlineParser: {
            name: 'headline-parser'
        }
    },
    urls: [
        'http://adevarul.ro/',
        'http://www.mediafax.ro/',
        'https://www.digi24.ro/',
        'http://www.bihon.ro/',
        'https://www.agerpres.ro/',
        'https://www.vox.com/',
        'https://thenextweb.com/',
        'https://www.theverge.com/'
    ]
}