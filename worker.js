const Koa = require('koa');
const emitter = require('./emitter');

class Worker {
    static get port() {
        return 3000;
    }

    constructor() {
        this.port = Worker.port;
        this.app = new Koa();


        emitter.on('addedWorker', (port) => {
            if (port !== this.port) {
                console.log(`Worker ${this.port} acknowledged new worker: ${port}`);
            }
        });
        emitter.on('closedWorker', (port) => {
            if (port !== this.port) {
                console.log(`Worker ${this.port} acknowledged closing worker: ${port}`);
            }
        });
        this.app.use(async ctx => {
            ctx.body = 'Hello World';
        });

        this.init();
    }

    init() {
        let openApp = () => {
            this.server = this.app.listen(this.port, (data) => {
                    console.log('Worker listening on', this.port);
                    emitter.emit('addedWorker', this.port);
                })
                .on('error', (err) => {
                    if (err.code === 'EADDRINUSE') {
                        this.port++;
                        openApp();
                    }
                })
                .on('close', (data) => {
                    emitter.emit('closedWorker', this.port);
                })
        }
        openApp(this.port);
    }

    close() {
        this.server.close();
    }
}

module.exports = Worker;