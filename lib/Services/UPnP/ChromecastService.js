class ChromecastService {
    constructor(eventer, messageFactory, messageService, defer) {
        this._messageFactory = messageFactory;
        this._messageService = messageService;
        this._eventer = eventer;
        this._defer = defer;
        this.serviceType = "unknown";
    }
    getAdditionalInformation(chromecastDevice) {
    }
}

module.exports = ChromecastService;