class TransportServiceFactory {
    constructor(emitter, componentFactory) {
        this._emitter = emitter;
        this._componentFactory = componentFactory;
    }
    createTransportService() {
        return new TransportService(this._emitter, this.componentFactory.createTransportService(), this.componentFactory.createScriptableInputStream(), this.componentFactory.createInputStreamPump());
    }
}

/**
 * Sends data over TCP, not entirely sure how it works
 */
module.exports = TransportServiceFactory;