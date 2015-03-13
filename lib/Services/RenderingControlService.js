const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');
const Utilities = require('../Utilities');

const RenderingControlService = Class({
	extends: EventTarget,
    initialize: function initialize(emitter, soapService, subscriptionService, defer) {
        this._emitter = emitter;
        this._soapService = soapService;
        this._defer = defer;
        this._subscriptionService = subscriptionService;
        this._serviceType = Constants.ServiceTypes.filter(y=> y[0] === "Rendering Control").map(y=> y[1])[0];
    },
    getMute: function getMute(mediaRenderer){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                               this._serviceType, "GetMute", { InstanceID: device.instanceId, Channel: 'Master' }
                              ).then(response => {
            //todo: parse xml response here
            //todo: call from getAdditionalInfo
            deferred.resolve(response)
        });
        return deferred.promise;
    },
    getVolume: function getVolume(mediaRenderer){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                      this._serviceType, "GetVolume", { InstanceID: device.instanceId, Channel: 'Master' }
                                     ).then(response => {
            //todo: parse xml response here
            //todo: call from getAdditionalInfo
            deferred.resolve(response)
        });
        return deferred.promise();
    },
    listPresets: function listPresets(mediaRenderer){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                               this._serviceType, "ListPresets", { InstanceID: device.instanceId }
                              ).then(response => {
            //todo: parse xml response
            //todo: maybe call from getAdditionalInfo
            deferred.resolve(response)
        });
        return deferred.promise;
    },
    selectPresets: function selectPresets(mediaRenderer, presetName){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                               this._serviceType, "SelectPresets", { InstanceID: device.instanceId, PresetName: presetName }
                              ).then(response => deferred.resolve(response));
        return deferred.promise;
    },
    setMute: function setMute(mediaRenderer, desiredMute){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                               this._serviceType, "SetMute", { InstanceID: device.instanceId, Channel: 'Master', DesiredMute: desiredMute }
                              ).then(response => deferred.resolve(response));
    },
    setVolume: function setVolume(mediaRenderer, desiredVolume){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                               this._serviceType, "SetVolume", { InstanceID: device.instanceId, Channel: 'Master', DesiredVolume: desiredVolume }
                              ).then(response => deferred.resolve(response));
        return deferred.promise;
    },    
});

exports.RenderingControlService = RenderingControlService;