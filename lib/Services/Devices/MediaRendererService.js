const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../../Constants');

const MediaRendererService = Class({
	extends: EventTarget,
    initialize: function initialize(emitter, avTransportService, connectionManagerService, renderingControlService) {
        this._emitter = emitter;
        this._avTransport = avTransportService;
        this._connectionManager = connectionManagerService;
        this._renderingControl = renderingControlService;
	},
	getAdditionalInformation: function getAdditionalInformation(device) {
	   this._connectionManager.getProtocolInfo(device).then( response => {
           if(response.some(x => x.contentFormat.containerType.indexOf("video/") === 0)) device.videoCapable = true;
           if(response.some(x => x.contentFormat.containerType.indexOf("audio/") === 0)) device.audioCapable = true;
           if(response.some(x => x.contentFormat.containerType.indexOf("image/") === 0)) device.imageCapable = true;
       });
        //the 360 also exposes a mac address somewhere.
    },
    getCurrentConnectionIds: function getCurrentConnectionIds(device){
        return this._connectionManager.getCurrentConnectionIds(device);
    },
    getCurrentConnectionInfo: function getCurrentConnectionInfo(device){
        return this._connectionManager.getCurrentConnectionInfo(device);
    },
    getProtocolInfo: function getProtocolInfo(device){
        return this._connectionManager.getProtocolInfo(device);
    },
    isMuted: function isMuted(device){
        return this._renderingControl.getMute(device);
    },
    getVolume: function getVolume(device){
        return this._renderingControl.getVolume(device);
    },
    listPresets: function listPresets(device){
        return this._renderingControl.listPresets(device);
    },
    selectPresets: function selectPresets(device, presetName){
        this._renderingControl.selectPresets(device, presetName);
    },
    toggleMute: function toggleMute(device){
        var isMuted = this.isMuted(device);
        this._renderingControl.setMute(device, !isMuted);
    },
    setVolume: function setVolume(device, newVolume){
        this._renderingControl.setVolume(device, newVolume);
    },    
    launchMedia: function launchMedia(device, serverAddress, fileUri){
        this.loadMedia(device, serverAddress, fileUri);
        this.play(device);
    },
    loadMedia: function loadMedia(device, serverAddress, fileUri){
        this._avTransport.loadMedia(device, serverAddress, fileUri);  
    },
    setNext: function setNext(device, nextURI, metaData){
        this._avTransport.SetNextAVTransportURI(device, nextURI, metaData);
    },
    getMediaInfo: function getMediaInfo(device){
        return this._avTransport.GetMediaInfo(device);
    },
    getTransportInfo: function getTransportInfo(device){
        return this._avTransport.GetTransportInfo(device);
    },
    getPositionInfo: function getPositionInfo(device){
        return this._avTransport.GetPositionInfo(device);
    },     
    getDeviceCapabilities: function getDeviceCapabilities(device){
        return this._avTransport.GetDeviceCapabilities(device);
    },
    getTransportSettings: function getTransportSettings(){
        return this._avTransport.GetTransportSettings();
    },
    getCurrentTransportActions: function getCurrentTransportActions(){ 
        return this._avTransport.GetCurrentTransportActions();
    },    
    stop: function stop(device){
        this._avTransport.stop(device);
    },
    play: function play(device){
        this._avTransport.play(device);
    },
    pause: function pause(device){
        this._avTransport.pause(device);
    },
    record: function record(device){
        this._avTransport.record(device);
    },
    next: function next(device){
        this._avTransport.next(device);
    },
    previous: function previous(device){
        this._avTransport.previous(device);
    },
    seek: function seek(device, unit, target){
        this._avTransport.seek(device, unit, target);
    },    
    setPlayMode: function setPlayMode(device, newPlayMode){
        this._avTransport.setPlayMode(device, newPlayMode);
    },
    setRecordQualityMode: function setRecordQualityMode(device, newRecordQualityMode){
        this._avTransport.setRecordQualityMode(device, newRecordQualityMode);
    }
});

exports.MediaRendererService = MediaRendererService;