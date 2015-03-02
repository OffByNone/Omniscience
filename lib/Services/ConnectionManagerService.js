const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');
const Utilities = require('../Utilities');

const ConnectionManagerService = Class({
	extends: EventTarget,
    initialize: function initialize(emitter, soapService) {
        this._emitter = emitter;
        this._soapService = soapService;
        this._serviceType = Constants.ServiceTypes.filter(y=> y[0] === "Connection Manager").map(y=> y[1])[0];
	},
    getCurrentConnectionIds: function getCurrentConnectionIds(device){
        return this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "GetCurrentConnectionIds");
    },
    getCurrentConnectionInfo: function getCurrentConnectionInfo(device){
        return this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "GetCurrentConnectionInfo", { ConnectionID: device.connectionId });
    },
    getProtocolInfo: function getProtocolInfo(device){
        return this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "GetProtocolInfo");
    }
});

exports.ConnectionManagerService = ConnectionManagerService;