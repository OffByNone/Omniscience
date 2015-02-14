const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const Emitter = require('sdk/event/core'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const timers = require('sdk/timers'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers

const { MessageService } = require('../Services/MessageService');
const { TransportServiceFactory } = require('./TransportServiceFactory');

const MessageServiceFactory = Class({
	initialize: function initialize(){
        this._transportServiceFactory = new TransportServiceFactory();
	},
    createMessageService: function createMessageService(){
        return new MessageService(this._transportServiceFactory.createTransportService(), Emitter, timers);
    }
});

exports.MessageServiceFactory = MessageServiceFactory;