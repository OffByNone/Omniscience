const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const ChromecastService = Class({
	extends: EventTarget,
    initialize: function initialize(emitter, messageFactory, messageService) {
		this._messageFactory = messageFactory;
		this._messageService = messageService;
        this._emitter = emitter;
	},
	getAdditionalInformation: function getAdditionalInformation(chromecastDevice) {
	}
});

exports.ChromecastService = ChromecastService;