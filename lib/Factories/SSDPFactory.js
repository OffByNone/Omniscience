const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const Emitter = require('sdk/event/core'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target


const ComponentFactory  = require("./ComponentFactory");
const utilities = require('../Utilities');
const { SSDP } = require('../Network/SSDP');


const SSDPFactory = Class({
    initialize: function initialize(){
    },
	createSSDP: function createSSDP(){
		return new SSDP(Emitter, ComponentFactory.createUDPSocket(), utilities);
	}
});

exports.SSDPFactory = SSDPFactory;