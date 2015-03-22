const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');

const DeviceServices = Class({
    extends: EventTarget,
    initialize: function initialize(defer, emitter, fxosWebServer, httpd, matchstickService, chromecastService, firestickService, mediaRendererService, mediaServerService, wfaService, genericDeviceService){
        this._emitter = emitter;
        this._defer = defer;
        this[Constants.Services.MatchStick] = matchstickService;
        this[Constants.Services.MatchStick].on("additionalInformationFound", device => this._emitter.emit(this, "additionalInfoFound", device));
        this[Constants.Services.Chromecast] = chromecastService;
        this[Constants.Services.Chromecast].on("additionalInformationFound", device => this._emitter.emit(this, "additionalInfoFound", device));
        this[Constants.Services.Firestick] = firestickService;
        this[Constants.Services.Firestick].on("additionalInformationFound", device => this._emitter.emit(this, "additionalInfoFound", device));
        this[Constants.Services.MediaRenderer] = mediaRendererService;
        this[Constants.Services.MediaRenderer].on("additionalInformationFound", device => this._emitter.emit(this, "additionalInfoFound", device));
        this[Constants.Services.MediaRenderer].on("EventOccured", ( device, event, request ) => this._emitter.emit(this, "EventOccured", device, event, request));
        this[Constants.Services.MediaServer] = mediaServerService;
        this[Constants.Services.MediaServer].on("additionalInformationFound", device => this._emitter.emit(this, "additionalInfoFound", device));
        this[Constants.Services.MediaServer].on("EventOccured", ( device, event, request ) => this._emitter.emit(this, "EventOccured", device, event, request));
        this[Constants.Services.WFA] = wfaService;
        this[Constants.Services.WFA].on("additionalInformationFound", device => this._emitter.emit(this, "additionalInfoFound", device));
        this[Constants.Services.WFA].on("EventOccured", ( device, event, request ) => this._emitter.emit(this, "EventOccured", device, event, request));
        this[Constants.Services.GenericDevice] = genericDeviceService;
        this[Constants.Services.GenericDevice].on("additionalInformationFound", device => this._emitter.emit(this, "additionalInfoFound", device));
        this._httpd = httpd;
        this._httpd.start();
    },
    launchMedia: function launchMedia(device, file){
        var fileUri = this.shareFile(file);
        var serverAddress = this._httpd.getServerIp(device);

        this[device.serviceKey].launchMedia(device, serverAddress, fileUri);
    },
    shareFile: function shareFile(file){
        var filePath = encodeURI("/" + file.name);
        this._httpd.registerFile(filePath, file.path);
        return filePath;
    },

    play: function(device){
        this[device.serviceKey].play(device);
    },
    pause: function(device){
        this[device.serviceKey].pause(device);
    },
    next: function(device){
        this[device.serviceKey].next(device);
    },
    previous: function(device){
        this[device.serviceKey].previous(device);
    },
    stop: function(device){
        this[device.serviceKey].stop(device);
    },
    isMuted: function isMuted(device){
        return this[device.serviceKey].isMuted(device);
    },
    toggleMute: function toggleMute(device){
        this[device.serviceKey].setMute(device, !device.isMuted);
    },
    getVolume: function getVolume(device){
        return this[device.serviceKey].getVolume(device);
    },
    setVolume: function setVolume(device, newVolume){
        this[device.serviceKey].setVolume(device, newVolume);
    },
    seek: function seek(device, unit, target){
        this[device.serviceKey].seek(device, unit, target);
    },

    setName: function setName(device, name){
        this[device.serviceKey].setName(device, name);
    },
    reboot: function reboot(device){
        this[device.serviceKey].reboot(device);
    }
});

exports.DeviceServices = DeviceServices;