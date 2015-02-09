const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const constants = require('../Constants');

const GenericDevice = Class({
	extends: EventTarget,
    audioCapable: false,
    videoCapable: false,
    mirrorCapable: false,
	initialize: function initialize(emitter) {
        this._emitter = emitter;
	}
});

exports.GenericDevice = GenericDevice;