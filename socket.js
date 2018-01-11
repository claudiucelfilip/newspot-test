class Socket extends WebSocket {
    constructor(url) {
        super(url);
        this.handlers = {};
        this.onmessage = (message) => {
            let payload = JSON.parse(message.data);

            (this.handlers[payload.type] || []).forEach((handler) => {
                handler(payload.data);
            });
        }
    }



    on(type, handler) {
        this.handlers[type] = this.handlers[type] || [];
        this.handlers[type].push(handler);
        return this;
    }

    once(type, handler) {
        this.handlers[type] = this.handlers[type] || [];
        let handlerWrapper = (message) => {
            handler(message);
            this.off(type, handlerWrapper);
        }
        this.handlers[type].push(handlerWrapper);
        return this;
    }

    off(type, handler) {
        this.handlers[type] = (this.handlers[type] || []).filter(item => item !== handler);
        return this;
    }

    send(type, data) {
        let message;
        message = JSON.stringify({
            type,
            data: data
        });
        WebSocket.prototype.send.call(this, message);
    }
}