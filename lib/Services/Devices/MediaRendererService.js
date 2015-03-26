const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../../Constants');

//todo: add in the promises that are in the sub services for the return values

const MediaRendererService = Class({
	extends: EventTarget,
	initialize: function initialize(emitter, defer, avTransportService, connectionManagerService, renderingControlService) {
        this._emitter = emitter;
        this._avTransport = avTransportService;
        this._avTransport.on('EventOccured', ( device, event, request ) => {
        	this._emitter.emit(this, 'EventOccured', device, event, request );
        });
        this._avTransport.on('additionalInformationFound', ( device) => {
        	this._emitter.emit(this, 'additionalInformationFound', device);
        });
        this._connectionManager = connectionManagerService;
        this._connectionManager.on('EventOccured', ( device, event, request ) => {
        	this._emitter.emit(this, 'EventOccured', device, event, request );
        });
        this._connectionManager.on('additionalInformationFound', ( device) => {
        	this._emitter.emit(this, 'additionalInformationFound', device);
        });
        this._renderingControl = renderingControlService;
        this._renderingControl.on('EventOccured', ( device, event, request ) => {
        	this._emitter.emit(this, 'EventOccured', device, event, request );
        });
        this._renderingControl.on('additionalInformationFound', ( device) => {
        	this._emitter.emit(this, 'additionalInformationFound', device);
        });
        this._defer = defer;
	},
	getAdditionalInformation: function getAdditionalInformation(device) {
		this._connectionManager.getAdditionalInformation(device);
		this._renderingControl.getAdditionalInformation(device);
		this._avTransport.getAdditionalInformation(device);
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
    setMute: function toggleMute(device, desiredMute){
    	return this._renderingControl.setMute(device, desiredMute);
    },
    getVolume: function getVolume(device){
    	return this._renderingControl.getVolume(device);
    },
    setVolume: function setVolume(device, newVolume){
    	return this._renderingControl.setVolume(device, newVolume);
    },
    listPresets: function listPresets(device){
    	return this._renderingControl.listPresets(device);
    },
    selectPresets: function selectPresets(device, presetName){
    	return this._renderingControl.selectPresets(device, presetName);
    },
    loadMedia: function loadMedia(device, serverAddress, fileUri){
        return this._avTransport.loadMedia(device, serverAddress, fileUri);
    },
    setNext: function setNext(device, nextURI, metaData){
        return this._avTransport.SetNextAVTransportURI(device, nextURI, metaData);
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
        return this._avTransport.stop(device);
    },
    play: function play(device){
        return this._avTransport.play(device);
    },
    pause: function pause(device){
        return this._avTransport.pause(device);
    },
    record: function record(device){
        return this._avTransport.record(device);
    },
    next: function next(device){
        return this._avTransport.next(device);
    },
    previous: function previous(device){
        return this._avTransport.previous(device);
    },
    seek: function seek(device, unit, target){
        return this._avTransport.seek(device, unit, target);
    },
    setPlayMode: function setPlayMode(device, newPlayMode){
        return this._avTransport.setPlayMode(device, newPlayMode);
    },
    setRecordQualityMode: function setRecordQualityMode(device, newRecordQualityMode){
        return this._avTransport.setRecordQualityMode(device, newRecordQualityMode);
    }
});

exports.MediaRendererService = MediaRendererService;