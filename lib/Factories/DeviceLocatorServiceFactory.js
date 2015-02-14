const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const Emitter = require('sdk/event/core'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const timers = require('sdk/timers'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers

const { DeviceFactory } = require('./DeviceFactory');
const { SSDPFactory } = require('./SSDPFactory');

const { DeviceLocatorService } = require('../Services/DeviceLocatorService');
const utilities = require('../Utilities');

const DeviceLocatorServiceFactory = Class({
	initialize: function initialize(){
        this._deviceFactory = new DeviceFactory();
        this._ssdpFactory = new SSDPFactory();
	},
	createDeviceLocatorService: function createDeviceLocatorService(){
		return new DeviceLocatorService(this._ssdpFactory, this._deviceFactory, utilities, Emitter, timers);
	}
});

exports.DeviceLocatorServiceFactory = DeviceLocatorServiceFactory;