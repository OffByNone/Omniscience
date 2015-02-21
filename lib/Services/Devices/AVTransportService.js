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
        this.SetAVTransportURI(device, serverAddress, fileUri);
        this.play(device);
    },
    SetAVTransportURI: function SetAVTransportURI(device, serverAddress, fileUri){
        this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, 
                               this._serviceType, 
                               "SetAVTransportURI",
                               { InstanceID: 0, CurrentURI: serverAddress + fileUri, CurrentURIMetaData: "" });    
    },
    SetNextAVTransportURI: function SetNextAVTransportURI(device, instanceId, NextURI, NextURIMetaData){
        this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, 
                               this._serviceType, 
                               "SetNextAVTransportURI", 
                               { InstanceID: 0, NextURI: serverAddress + fileUri, NextURIMetaData: "" });        
    },
    GetMediaInfo: function GetMediaInfo(device, instanceId){
        var mediaInfo =  this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, 
                                                this._serviceType, 
                                                "GetMediaInfo", 
                                                { InstanceID: 0});
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
    GetTransportInfo: function GetTransportInfo(device, instanceId){
        var transportInfo =  this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, 
                                                this._serviceType, 
                                                "GetTransportInfo", 
                                                { InstanceID: 0});
        return transportInfo;        
        /*{
            CurrentTransportState: this.TransportState,
            CurrentTransportStatus: this.TransportStatus,
            CurrentSpeed: this.TransportPlaySpeed
        };*/
    },
    GetPositionInfo: function GetPositionInfo(device, instanceId){
        var positionInfo =  this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, 
                                                this._serviceType, 
                                                "GetPositionInfo", 
                                                { InstanceID: 0});
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
    GetDeviceCapabilities: function GetDeviceCapabilities(device, instanceId){
        var deviceCapabilities =  this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, 
                                                this._serviceType, 
                                                "GetDeviceCapabilities", 
                                                { InstanceID: 0});
        return deviceCapabilities;          
        
        /*{
            PlayMedia: this.PossiblePlaybackStorageMedia,
            RecMedia: this.PossibleRecordStorageMedia,
            RecQualityModes: this.PossibleRecordQualityModes
        };*/
    },
    GetTransportSettings: function GetTransportSettings(InstanceID){
        var transportSettings =  this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, 
                                                this._serviceType, 
                                                "GetTransportSettings", 
                                                { InstanceID: 0});
        return transportSettings;           
        /*{
            PlayMode: this.CurrentPlayMode,
            RecQualityMode: this.CurrentRecordQualityMode
        };*/
    },
    GetCurrentTransportActions: function GetCurrentTransportActions(InstanceID){ 
         var actions = this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, 
                                                this._serviceType, 
                                                "GetCurrentTransportActions", 
                                                { InstanceID: 0 });            
        return actions;
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
    record: function record(device){
        this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, this._serviceType, "Record", { InstanceID: 0 });
    },
    next: function next(device){
        this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, this._serviceType, "Mext", { InstanceID: 0 });
    },
    previous: function previous(device){
        this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, this._serviceType, "Previous", { InstanceID: 0 });    
    },
    seek: function seek(device, instanceId, unit, target){
         this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, 
                                                this._serviceType, 
                                                "GetTransportSettings", 
                                                { InstanceID: 0, Unit: unit, Target: target});    
    },    
    setPlayMode: function setPlayMode(device, instanceId, newPlayMode){
         this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, 
                                                this._serviceType,
                                                "GetTransportSettings", 
                                                { InstanceID: 0, NewPlayMode: newPlayMode});
    },
    setRecordQualityMode: function (device, instanceId, newRecordQualityMode){
        this._soapService.post(device.services.filter(x=> x.type.urn === this._serviceType)[0].controlUrl, 
                                                this._serviceType, 
                                                "GetTransportSettings", 
                                                { InstanceID: 0, NewRecordQualityMode: newRcordQualityMode});
    }
});

exports.AVTransportService = AVTransportService;