class Connection {
    constructor(target) {
        this.initConfig();
        this.target = target;
        this.id = Math.floor(Math.random() * 100000);
        this.handlers = {};

        this.connection = new RTCPeerConnection(this.config);

        this.onOpen = Promise.all([
            this.onSendChannelOpen(),
            this.onReceiveChannelOpen()
        ]).then(() => this);

        this.onClose = this.onChannelClose;
    }

    initConfig() {
        this.config = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                {
                    urls: 'turn:192.158.29.39:3478?transport=tcp',
                    credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                    username: '28224511:1379330808'
                }
            ]
        };
    }
    getIceCandidate() {
        return new Promise((resolve, reject) => {
            this.connection.onicecandidate = (event) => {
                if (event.candidate !== null) {
                    resolve(event.candidate);
                }
            };
        });
    }

    onChannelClose() {
        return new Promise((resolve) => {
            this.sendChannel.onclose = () => {
                console.log('send datachannel closed', this.sendChannel.readyState);
                resolve(this);
            };
        });
    }
    onSendChannelOpen() {
        return new Promise((resolve) => {
            this.sendChannel = this.connection.createDataChannel(`channel`);

            window.onbeforeunload = () => {
                this.sendChannel.close();
            };

            this.sendChannel.onerror = (err) => {
                console.log(err);
            };

            this.sendChannel.onopen = () => {
                console.log('send datachannel opened', this.sendChannel.readyState);
                resolve(this.sendChannel);
            };
        });
    }

    onMessage(message) {
        let payload = JSON.parse(message.data);

        console.log('received', message);
        (this.handlers[payload.type] || []).forEach((handler) => {
            handler(payload.data);
        });
    }
    onReceiveChannelOpen() {
        return new Promise((resolve) => {
            this.connection.ondatachannel = (event) => {
                this.receiveChannel = event.channel;
                this.receiveChannel.onmessage = this.onMessage.bind(this);

                window.onbeforeunload = () => {
                    this.receiveChannel.close();
                };

                this.receiveChannel.onopen = () => {
                    console.log('receive datachannel opened', this.receiveChannel.readyState);
                };

                this.receiveChannel.onclose = () => {
                    console.log('receive datachannel closed', this.receiveChannel.readyState);
                    this.sendChannel.close();
                };

                resolve(this.receiveChannel);
            };
        });
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
            this.off(type, handler);
        }
        this.handlers[type].push(handlerWrapper);
        return this;
    }

    off(type, handler) {
        this.handlers[type] = (this.handlers[type] || []).filter(item => item !== handler);
        return this;
    }

    send(message) {
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
        this.sendChannel.send(message);
    }

}