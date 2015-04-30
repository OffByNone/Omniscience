const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const SSDP = require('../Network/SSDP');

const SSDPFactory = Class({
	initialize: function initialize(Emitter, Utilities, ComponentFactory){
		this._emitter = Emitter;
		this._utilities = Utilities;
		this._componentFactory = ComponentFactory;
    },
	createSSDP: function createSSDP(sourcePort){
		return new SSDP(this._emitter, this._componentFactory.createUDPSocket(), this._utilities, this._componentFactory.getScriptSecurityManager(), sourcePort);
	}
});

module.exports = SSDPFactory;