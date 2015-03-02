const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');
const Utilities = require('../Utilities');

const RenderingControlService = Class({
	extends: EventTarget,
    initialize: function initialize(emitter, soapService) {
        this._emitter = emitter;
        this._soapService = soapService;
        this._serviceType = Constants.ServiceTypes.filter(y=> y[0] === "Rendering Control").map(y=> y[1])[0];
	},
    getMute: function getMute(mediaRenderer){
        return this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "GetMute", { InstanceID: device.instanceId, Channel: 'Master' });
    },
    getVolume: function getVolume(mediaRenderer){
        return this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "GetVolume", { InstanceID: device.instanceId, Channel: 'Master' });
    },
    listPresets: function listPresets(mediaRenderer){
        return this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "ListPresets", { InstanceID: device.instanceId });
    },
    selectPresets: function selectPresets(mediaRenderer, presetName){
        return this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "SelectPresets", { InstanceID: device.instanceId, PresetName: presetName });
    },
    setMute: function setMute(mediaRenderer, desiredMute){
        return this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "SetMute", { InstanceID: device.instanceId, Channel: 'Master', DesiredMute: desiredMute });
    },
    setVolume: function setVolume(mediaRenderer, desiredVolume){
        return this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "SetVolume", { InstanceID: device.instanceId, Channel: 'Master', DesiredVolume: desiredVolume });
    },    
});

exports.RenderingControlService = RenderingControlService;