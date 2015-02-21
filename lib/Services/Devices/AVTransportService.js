const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../../Constants');

const AVTransportService = Class({
	extends: EventTarget,
    initialize: function initialize(emitter, soapService) {
        this._emitter = emitter;
        this._soapService = soapService;
        this._serviceType = Constants.ServiceTypes.filter(y=> y[0] === "AV Transport").map(y=> y[1])[0];
	},
	getAdditionalInformation: function getAdditionalInformation(AVTransportDevice) {
	   //I should totally set the acceptable media types here using GetDeviceCapabilities
    },    
    launchMedia: function launchMedia(device, serverAddress, fileUri){
        this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, 
                               this._serviceType, 
                               "SetAVTransportURI", 
                               { InstanceID: 0, CurrentURI: serverAddress + fileUri, CurrentURIMetaData: "" });
        this.play(device);
    },
    SetNextAVTransportURI: function SetNextAVTransportURI(InstanceID, NextURI, NextURIMetaData){
        //post
    },
    GetMediaInfo: function GetMediaInfo(InstanceID){
        //get
        return {
            NrTracks: this.NumberOfTracks,
            MediaDuration: this.CurrentMediaDuration,
            CurrentURI: this.AVTransportURI,
            CurrentURIMetaData: this.AVTransportURIMetaData,
            NextURI: this.NextAVTransportURI,
            NextURIMetaData: this.NextAVTransportURIMetaData,
            PlayMedium: this.PlaybackStorageMedium,
            RecordMedium: this.RecordStorageMedium,
            WriteStatus: this.RecordMediumWriteStatus
        };
    },
    GetTransportInfo: function GetTransportInfo(InstanceID){
        return {
            CurrentTransportState: this.TransportState,
            CurrentTransportStatus: this.TransportStatus,
            CurrentSpeed: this.TransportPlaySpeed
        };
    },
    GetPositionInfo: function GetPositionInfo(InstanceID){
        return {
            Track: this.CurrentTrack,
            TrackDuration: this.CurrentTrackDuration,
            TrackMetaData: this.CurrentTrackMetaData,
            TrackURI: this.CurrentTrackURI,
            RelTime: this.RelativeTimePosition,
            AbsTime: this.AbsoluteTimePosition,
            RelCount: this.RelativeCounterPosition,
            AbsCount: this.AbsoluteCounterPosition
        };
    },     
    GetDeviceCapabilities: function GetDeviceCapabilities(InstanceID){
        return {
            PlayMedia: this.PossiblePlaybackStorageMedia,
            RecMedia: this.PossibleRecordStorageMedia,
            RecQualityModes: this.PossibleRecordQualityModes
        };
    },
    GetTransportSettings: function GetTransportSettings(InstanceID){
        return {
            PlayMode: this.CurrentPlayMode,
            RecQualityMode: this.CurrentRecordQualityMode
        };
    },
    GetCurrentTransportActions: function GetCurrentTransportActions(InstanceID){ 
        return Actions; 
    },    
    stop: function stop(device){
        this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, this._serviceType, "Stop", { InstanceID: 0 });
    },
    play: function play(device){
        this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, this._serviceType, "Play", { InstanceID: 0, Speed: 1 });
    },
    pause: function pause(device){
        this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, this._serviceType, "Pause", { InstanceID: 0 });
    },
    next: function next(device){
        this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, this._serviceType, "Mext", { InstanceID: 0 });
    },
    previous: function previous(device){
        this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, this._serviceType, "Previous", { InstanceID: 0 });    
    },
    seek: function seek(InstanceID, Unit, Target){
    
    },    
    setPlayMode: function setPlayMode(InstanceID, NewPlayMode){
    
    }
});

exports.AVTransportService = AVTransportService;