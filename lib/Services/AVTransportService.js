const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');
const Utilities = require('../Utilities');

const AVTransportService = Class({
	extends: EventTarget,
    initialize: function initialize(emitter, soapService) {
        this._emitter = emitter;
        this._soapService = soapService;
        this._serviceType = Constants.ServiceTypes.filter(y=> y[0] === "AV Transport").map(y=> y[1])[0];
	},
    setAVTransportURI: function setAVTransportURI(device, serverAddress, fileUri){
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                               this._serviceType, 
                               "SetAVTransportURI",
                               { InstanceID: device.instanceId, CurrentURI: serverAddress + fileUri, CurrentURIMetaData: "" });
    },
    setNextAVTransportURI: function setNextAVTransportURI(device, NextURI, NextURIMetaData){
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                               this._serviceType, 
                               "SetNextAVTransportURI", 
                               { InstanceID: device.instanceId, NextURI: serverAddress + fileUri, NextURIMetaData: "" });  
    },
    getMediaInfo: function getMediaInfo(device){
        var mediaInfo =  this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                this._serviceType, 
                                "GetMediaInfo", 
                                { InstanceID: device.instanceId});
        return mediaInfo;
        /*{
            NrTracks: this.NumberOfTracks,
            MediaDuration: this.CurrentMediaDuration,
            CurrentURI: this.AVTransportURI,
            CurrentURIMetaData: this.AVTransportURIMetaData,
            NextURI: this.NextAVTransportURI,
            NextURIMetaData: this.NextAVTransportURIMetaData,
            PlayMedium: this.PlaybackStorageMedium,
            RecordMedium: this.RecordStorageMedium,
            WriteStatus: this.RecordMediumWriteStatus
        };*/
    },
    getTransportInfo: function getTransportInfo(device){
        var transportInfo =  this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                this._serviceType, 
                                "GetTransportInfo", 
                                { InstanceID: device.instanceId});
        return transportInfo;        
        /*{
            CurrentTransportState: this.TransportState,
            CurrentTransportStatus: this.TransportStatus,
            CurrentSpeed: this.TransportPlaySpeed
        };*/
    },
    getPositionInfo: function getPositionInfo(device){
        var positionInfo =  this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                this._serviceType, 
                                "GetPositionInfo", 
                                { InstanceID: device.instanceId});
        return positionInfo;
        /*{
            Track: this.CurrentTrack,
            TrackDuration: this.CurrentTrackDuration,
            TrackMetaData: this.CurrentTrackMetaData,
            TrackURI: this.CurrentTrackURI,
            RelTime: this.RelativeTimePosition,
            AbsTime: this.AbsoluteTimePosition,
            RelCount: this.RelativeCounterPosition,
            AbsCount: this.AbsoluteCounterPosition
        };*/
    },     
    getDeviceCapabilities: function getDeviceCapabilities(device){
        var deviceCapabilities =  this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                this._serviceType, 
                                "GetDeviceCapabilities", 
                                { InstanceID: device.instanceId});
        return deviceCapabilities;
        /*{
            PlayMedia: this.PossiblePlaybackStorageMedia,
            RecMedia: this.PossibleRecordStorageMedia,
            RecQualityModes: this.PossibleRecordQualityModes
        };*/
    },
    getTransportSettings: function getTransportSettings(){
        var transportSettings =  this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                this._serviceType, 
                                "GetTransportSettings", 
                                { InstanceID: device.instanceId});
        return transportSettings;           
        /*{
            PlayMode: this.CurrentPlayMode,
            RecQualityMode: this.CurrentRecordQualityMode
        };*/
    },
    getCurrentTransportActions: function getCurrentTransportActions(){ 
         var actions = this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                this._serviceType, 
                                "GetCurrentTransportActions", 
                                { InstanceID: device.instanceId});
        return actions;
    },    
    stop: function stop(device){
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "Stop", { InstanceID: device.instanceId });
    },
    play: function play(device){
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "Play", { InstanceID: device.instanceId, Speed: 1 });
    },
    pause: function pause(device){
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "Pause", { InstanceID: device.instanceId });
    },
    record: function record(device){
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "Record", { InstanceID: device.instanceId });
    },
    next: function next(device){
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "Mext", { InstanceID: device.instanceId });
    },
    previous: function previous(device){
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "Previous", { InstanceID: device.instanceId });    
    },
    seek: function seek(device, unit, target){
         this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                this._serviceType, 
                                "Seek", 
                                { InstanceID: device.instanceId, Unit: unit, Target: target});    
    },    
    setPlayMode: function setPlayMode(device, newPlayMode){
         this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                this._serviceType,
                                "SetPlayMode", 
                                { InstanceID: device.instanceId, NewPlayMode: newPlayMode});
    },
    setRecordQualityMode: function setRecordQualityMode(device, newRecordQualityMode){
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                this._serviceType, 
                                "SetRecordQualityMode", 
                                { InstanceID: device.instanceId, NewRecordQualityMode: newRcordQualityMode});
    }
});

exports.AVTransportService = AVTransportService;