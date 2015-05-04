const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

class ChromecastService extends EventTarget{
    constructor(emitter, messageFactory, messageService, defer) {
        this._messageFactory = messageFactory;
        this._messageService = messageService;
        this._emitter = emitter;
        this._defer = defer;
        this.serviceType = "unknown";
    }
    getAdditionalInformation(chromecastDevice) {
    }
}

module.exports = ChromecastService;