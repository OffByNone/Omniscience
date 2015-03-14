const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../../Constants');

//todo: add in the promises that are in the sub services for the return values

const MediaRendererService = Class({
	extends: EventTarget,
    initialize: function initialize(emitter, avTransportService, connectionManagerService, renderingControlService, defer) {
        this._emitter = emitter;
        this._avTransport = avTransportService;
        this._connectionManager = connectionManagerService;
        this._renderingControl = renderingControlService;
        this._defer = defer;
	},
	getAdditionalInformation: function getAdditionalInformation(device) {
	   this._connectionManager.getProtocolInfo(device).then( response => {
           if(response.sink){
               if(response.sink.some(x => x.contentFormat.medium.indexOf("video") === 0)) device.videoCapable = true;
               if(response.sink.some(x => x.contentFormat.medium.indexOf("audio") === 0)) device.audioCapable = true;
               if(response.sink.some(x => x.contentFormat.medium.indexOf("image") === 0)) device.imageCapable = true;
           }
           if(response.source){
               if(response.source.some(x => x.contentFormat.medium.indexOf("video") === 0)) device.videoCapable = true;
               if(response.source.some(x => x.contentFormat.medium.indexOf("audio") === 0)) device.audioCapable = true;
               if(response.source.some(x => x.contentFormat.medium.indexOf("image") === 0)) device.imageCapable = true;
           }
           device.rawProtocolInfo = response;
           this._emitter.emit(this, "additionalInformationFound", device);
           this._avTransport.subscribe(device);
       });
        //the 360 also exposes a mac address somewhere.
    },
    getCurrentConnectionIds: function getCurrentConnectionIds(device){
        var deferred = this._defer();
        this._connectionManager.getCurrentConnectionIds(device).then(response => deferred.resolve(deferred));

        return deferred.promise;
    },
    getCurrentConnectionInfo: function getCurrentConnectionInfo(device){
        var deferred = this._defer();
        this._connectionManager.getCurrentConnectionInfo(device).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    getProtocolInfo: function getProtocolInfo(device){
        var deferred = this._defer();
        this._connectionManager.getProtocolInfo(device).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    isMuted: function isMuted(device){
        var deferred = this._defer();
        this._renderingControl.getMute(device).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    toggleMute: function toggleMute(device){
        var isMuted = this.isMuted(device);
        var deferred = this._defer();
        this._renderingControl.setMute(device, !isMuted).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    getVolume: function getVolume(device){
        var deferred = this._defer();
        this._renderingControl.getVolume(device).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    setVolume: function setVolume(device, newVolume){
        var deferred = this._defer();
        this._renderingControl.setVolume(device, newVolume).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    listPresets: function listPresets(device){
        var deferred = this._defer();
        this._renderingControl.listPresets(device).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    selectPresets: function selectPresets(device, presetName){
        var deferred = this._defer();
        this._renderingControl.selectPresets(device, presetName).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    launchMedia: function launchMedia(device, serverAddress, fileUri){
        var deferred = this._defer();
        this._avTransport.launchMedia(device, serverAddress, fileUri).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    loadMedia: function loadMedia(device, serverAddress, fileUri){
        var deferred = this._defer();
        this._avTransport.loadMedia(device, serverAddress, fileUri).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    setNext: function setNext(device, nextURI, metaData){
        var deferred = this._defer();
        this._avTransport.SetNextAVTransportURI(device, nextURI, metaData).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    getMediaInfo: function getMediaInfo(device){
        var deferred = this._defer();
        this._avTransport.GetMediaInfo(device).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    getTransportInfo: function getTransportInfo(device){
        var deferred = this._defer();
        this._avTransport.GetTransportInfo(device).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    getPositionInfo: function getPositionInfo(device){
        var deferred = this._defer();
        this._avTransport.GetPositionInfo(device).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    getDeviceCapabilities: function getDeviceCapabilities(device){
        var deferred = this._defer();
        this._avTransport.GetDeviceCapabilities(device).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    getTransportSettings: function getTransportSettings(){
        var deferred = this._defer();
        this._avTransport.GetTransportSettings().then(response => deferred.resolve(response));

        return deferred.promise;
    },
    getCurrentTransportActions: function getCurrentTransportActions(){
        var deferred = this._defer();
        this._avTransport.GetCurrentTransportActions().then(response => deferred.resolve(response));

        return deferred.promise;
    },
    stop: function stop(device){
        var deferred = this._defer();
        this._avTransport.stop(device).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    play: function play(device){
        var deferred = this._defer();
        this._avTransport.play(device).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    pause: function pause(device){
        var deferred = this._defer();
        this._avTransport.pause(device).then(resposne => deferred.resolve(response));

        return deferred.promise;
    },
    record: function record(device){
        var deferred = this._defer();
        this._avTransport.record(device).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    next: function next(device){
        var deferred = this._defer();
        this._avTransport.next(device).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    previous: function previous(device){
        var deferred = this._defer();
        this._avTransport.previous(device).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    seek: function seek(device, unit, target){
        var deferred = this._defer();
        this._avTransport.seek(device, unit, target).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    setPlayMode: function setPlayMode(device, newPlayMode){
        var deferred = this._defer();
        this._avTransport.setPlayMode(device, newPlayMode).then(response => deferred.resolve(response));

        return deferred.promise;
    },
    setRecordQualityMode: function setRecordQualityMode(device, newRecordQualityMode){
        var deferred = this._defer();
        this._avTransport.setRecordQualityMode(device, newRecordQualityMode).then(response => deferred.resolve(response));

        return deferred.promise;
    }
});

exports.MediaRendererService = MediaRendererService;