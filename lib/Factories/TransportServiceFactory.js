const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const Emitter = require('sdk/event/core'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const ComponentFactory = require('./ComponentFactory');
const TransportService = require('../Services/TransportService');

const TransportServiceFactory = Class({
	initialize: function intialize() { },
	createTransportService: function createTransportService() {
		return new TransportService(Emitter, ComponentFactory.createTransportService(), ComponentFactory.createScriptableInputStream(), ComponentFactory.createInputStreamPump());
	}
});

/**
 * Sends data over TCP, not entirely sure how it works
 */
module.exports = TransportServiceFactory;