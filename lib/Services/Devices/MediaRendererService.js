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
	getAdditionalInformation: function getAdditionalInformation(mediaRenderer) {
	   //get and parse the getProtocolInfo here, it will tell what the device can play
        //the 360 also exposes a mac address somewhere.
    },
    getCurrentConnectionIds: function getCurrentConnectionIds(mediaRenderer){
        return this._connectionManager.getCurrentConnectionIds(mediaRenderer);
    },
    getCurrentConnectionInfo: function getCurrentConnectionInfo(mediaRenderer){
        return this._connectionManager.getCurrentConnectionInfo(mediaRenderer);
    },
    getProtocolInfo: function getProtocolInfo(mediaRenderer){
        return this._connectionManager.getProtocolInfo(mediaRenderer);
    },
    isMuted: function isMuted(mediaRenderer){
        return this._renderingControl.getMute(mediaRenderer);
    },
    getVolume: function getVolume(mediaRenderer){
        return this._renderingControl.getVolume(mediaRenderer);
    },
    listPresets: function listPresets(mediaRenderer){
        return this._renderingControl.listPresets(mediaRenderer);
    },
    selectPresets: function selectPresets(mediaRenderer, presetName){
        this._renderingControl.selectPresets(mediaRenderer, presetName);
    },
    toggleMute: function toggleMute(mediaRenderer){
        var isMuted = this.isMuted(mediaRenderer);
        this._renderingControl.setMute(mediaRendereer, !isMuted);
    },
    setVolume: function setVolume(mediaRenderer, newVolume){
        this._renderingControl.setVolume(mediaRenderer, newVolume);
    },    
    launchMedia: function launchMedia(mediaRenderer, serverAddress, fileUri){
        this.loadMedia(mediaRenderer, serverAddress, fileUri);
        this.play(mediaRenderer);
    },
    loadMedia: function loadMedia(mediaRenderer, serverAddress, fileUri){
        this._avTransport.loadMedia(mediaRenderer, serverAddress, fileUri);  
    },
    setNext: function setNext(mediaRenderer, nextURI, metaData){
        this._avTransport.SetNextAVTransportURI(mediaRenderer, nextURI, metaData);
    },
    getMediaInfo: function getMediaInfo(mediaRenderer){
        return this._avTransport.GetMediaInfo(mediaRenderer);
    },
    getTransportInfo: function getTransportInfo(mediaRenderer){
        return this._avTransport.GetTransportInfo(mediaRenderer);
    },
    getPositionInfo: function getPositionInfo(mediaRenderer){
        return this._avTransport.GetPositionInfo(mediaRenderer);
    },     
    getDeviceCapabilities: function getDeviceCapabilities(mediaRenderer){
        return this._avTransport.GetDeviceCapabilities(mediaRenderer);
    },
    getTransportSettings: function getTransportSettings(){
        return this._avTransport.GetTransportSettings();
    },
    getCurrentTransportActions: function getCurrentTransportActions(){ 
        return this._avTransport.GetCurrentTransportActions();
    },    
    stop: function stop(mediaRenderer){
        this._avTransport.stop(mediaRenderer);
    },
    play: function play(mediaRenderer){
        this._avTransport.play(mediaRenderer);
    },
    pause: function pause(mediaRenderer){
        this._avTransport.pause(mediaRenderer);
    },
    record: function record(mediaRenderer){
        this._avTransport.record(mediaRenderer);
    },
    next: function next(mediaRenderer){
        this._avTransport.next(mediaRenderer);
    },
    previous: function previous(mediaRenderer){
        this._avTransport.previous(mediaRenderer);
    },
    seek: function seek(mediaRenderer, unit, target){
        this._avTransport.seek(mediaRenderer, unit, target);
    },    
    setPlayMode: function setPlayMode(mediaRenderer, newPlayMode){
        this._avTransport.setPlayMode(mediaRenderer, newPlayMode);
    },
    setRecordQualityMode: function setRecordQualityMode(mediaRenderer, newRecordQualityMode){
        this._avTransport.setRecordQualityMode(mediaRenderer, newRecordQualityMode);
    }
});

exports.MediaRendererService = MediaRendererService;