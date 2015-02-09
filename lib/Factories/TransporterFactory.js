const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const Emitter = require('sdk/event/core'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const ComponentFactory = require('./ComponentFactory');
const { Transporter } = require('../Network/Transporter');

const TransporterFactory = Class({
	initialize: function intialize() {
	},
	createTransporter: function () {
		return new Transporter(Emitter, ComponentFactory.createTransportService(), ComponentFactory.createScriptableInputStream(), ComponentFactory.createInputStreamPump());
	}
});

/**
 * Sends data over TCP, not entirely sure how it works
 */
exports.TransporterFactory = TransporterFactory;