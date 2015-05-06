class TransportServiceFactory {
    constructor(eventer, componentFactory) {
        this._eventer = eventer;
        this._componentFactory = componentFactory;
    }
    createTransportService() {
        return new TransportService(this._eventer, this.componentFactory.createTransportService(), this.componentFactory.createScriptableInputStream(), this.componentFactory.createInputStreamPump());
    }
}

/**
 * Sends data over TCP, not entirely sure how it works
 */
module.exports = TransportServiceFactory;