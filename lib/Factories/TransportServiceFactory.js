class TransportServiceFactory {
    constructor(eventer, firefox) {
        this._eventer = eventer;
        this._firefox = firefox;
    }
    getTransportService() {
        return new TransportService(this._eventer, this.firefox.getTransportService(), this.firefox.createScriptableInputStream(), this.firefox.createInputStreamPump());
    }
}

/**
 * Sends data over TCP, not entirely sure how it works
 */
module.exports = TransportServiceFactory;