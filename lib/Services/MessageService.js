class MessageService {
    constructor(transportServiceFactory, eventer, timers) {
        this.port = 8881;
        this.responseTimeout = 5000;
        this._transportServiceFactory = transportServiceFactory;
        this._eventer = eventer;
        this._timers = timers;
    }
    send(data, address) {
        var transportService = this._transportServiceFactory.createTransportService(); //todo: replace with SocketSender and networkingutils.toByteArray
        transportService.open(address, this.port);
        transportService.send(data);
        if (data.data.command === 'query') {
            this._eventer.on('transportService.dataReceived', (data) => {
                data = data.slice(data.length.toString().length + 1);//data will start with the length of the string plus a ":" then the actual JSON Object
                this._eventer.emit('messageService.responseReceived', JSON.parse(data));
                transportService.close();
            });
            this._timers.setTimeout(() => {
                try {
                    transportService.close();
                    throw new Error('Device did not respond within the specified timeout of ' + (this.responseTimeout / 1000) + ' seconds');
                }
                catch (e) {
                    //already closed, meaning we already got the response
                    //nothing to see here, move along
                }
            }, this.responseTimeout);
        }
        else
            transportService.close();
    }
}

module.exports = MessageService;
