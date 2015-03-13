const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const FirestickService = Class({
	extends: EventTarget,
    initialize: function initialize(emitter, messageFactory, messageService, defer) {
		this._messageFactory = messageFactory;
		this._messageService = messageService;
        this._emitter = emitter;
        this._defer = defer;
	},
	getAdditionalInformation: function getAdditionalInformation(firestickDevice) {
	}
});

exports.FirestickService = FirestickService;