module.exports = {
    redis: {
        host: '127.0.0.1',
        port: 6379,
        ns: 'rsmq'
    },
    freshStart: true,
    mongo: {
        host: 'mongodb://db:lola@ds237748.mlab.com:37748/newspot-test2',
        database: 'newspot-test2'
    },
    queue: {
        updateInterval: 10 * 1000
    },
    queues: {
        headlineParser: {
            name: 'headline-parser',
        },
        articleParser: {
            name: 'article-parser',
        },
        client: {
            name: 'client',
        }
    },
    urls: [
        'http://local:8000/test/headlines.html',
        'http://local:8000/test/headlines2.html'
    ]
}