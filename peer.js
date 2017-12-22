class Connection {
    constructor(target) {
        this.target = target;
        this.id = Math.floor(Math.random() * 100000);
        
        this.connection = new RTCPeerConnection(config);

        this.sendChannel = this.connection.createDataChannel(`channel`);

        this.connection.ondatachannel = (event) => {
            this.receiveChannel = event.channel;
            this.receiveChannel.onmessage = (message) => {
                let payload = JSON.parse(message.data);

                this.handlers.forEach((handler) => {
                    handler(payload);
                });
            };
            this.receiveChannel.onopen = () => {
                console.log('receive datachannel opened', this.receiveChannel.readyState);
            };

            this.receiveChannel.onclose = () => {
                console.log('receive datachannel closed', this.receiveChannel.readyState);
            };
        };

        this.sendChannel.onopen = () => {
            console.log('send datachannel opened', this.sendChannel.readyState);
        };
        this.sendChannel.onclose = () => {
            console.log('send datachannel closed', this.sendChannel.readyState);
        };

        this.sendChannel.onerror = (err) => {
            console.log(err);
        };

        window.onbeforeunload = () => {
            this.sendChannel.close();
            if (this.receiveChannel) {
                this.receiveChannel.close();
            }
        }

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

    on(type, handler) {
        this.handlers[type] = (this.handlers[type] || []).push(handler);
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
