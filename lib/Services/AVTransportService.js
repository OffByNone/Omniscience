const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');
const Utilities = require('../Utilities');

const AVTransportService = Class({
	extends: EventTarget,
    initialize: function initialize(emitter, soapService, subscriptionService, defer) {
        this._emitter = emitter;
        this._soapService = soapService;
        this._serviceType = Constants.ServiceTypes.filter(y=> y[0] === "AV Transport").map(y=> y[1])[0];
        this._subscriptionService = subscriptionService;
        this._defer = defer;
	},
    launchMedia: function launchMedia(device, serverAddress, fileUri){
        var deferred = this._defer();
        this.loadMedia(device, serverAddress, fileUri).then( ( response ) => deferred.resolve(this.play(device)));
        
        return deferred.promise;
    },    
    loadMedia: function loadMedia(device, serverAddress, fileUri){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                               this._serviceType, 
                               "SetAVTransportURI",
                               { InstanceID: device.instanceId, CurrentURI: serverAddress + fileUri, CurrentURIMetaData: "" }
                              ).then(response => deferred.resolve(response));
        return deferred.promise;
    },
    setNextAVTransportURI: function setNextAVTransportURI(device, NextURI, NextURIMetaData){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                               this._serviceType, 
                               "SetNextAVTransportURI", 
                               { InstanceID: device.instanceId, NextURI: serverAddress + fileUri, NextURIMetaData: "" }
                              ).then(response => deferred.resolve(response));  
        return deferred.promise;
    },
    getMediaInfo: function getMediaInfo(device){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                this._serviceType, 
                                "GetMediaInfo", 
                                { InstanceID: device.instanceId}
                              ).then(mediaInfo => {
                                //todo: parse xml response here
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
                                deferred.resolve(mediaInfo);
                                });

        return deferred.promise;
    },
    getTransportInfo: function getTransportInfo(device){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                this._serviceType, 
                                "GetTransportInfo", 
                                { InstanceID: device.instanceId}
                                ).then(response => {
            //todo: parse xml response here
            deferred.resolve(response)
        });
        return deferred.promise;
        /*{
            CurrentTransportState: this.TransportState,
            CurrentTransportStatus: this.TransportStatus,
            CurrentSpeed: this.TransportPlaySpeed
        };*/
    },
    getPositionInfo: function getPositionInfo(device){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                this._serviceType, 
                                "GetPositionInfo", 
                                { InstanceID: device.instanceId}
                              ).then(response => {
            //todo: parse xml response here
            deferred.resolve(response)
            });
        return deferred.promise;
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
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                this._serviceType, 
                                "GetDeviceCapabilities", 
                                { InstanceID: device.instanceId}
                              ).then(response => {
            //todo: parse xml response here
            deferred.resolve(response)
        });
        return deferred.promise;
        /*{
            PlayMedia: this.PossiblePlaybackStorageMedia,
            RecMedia: this.PossibleRecordStorageMedia,
            RecQualityModes: this.PossibleRecordQualityModes
        };*/
    },
    getTransportSettings: function getTransportSettings(){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                this._serviceType, 
                                "GetTransportSettings", 
                                { InstanceID: device.instanceId}
                              ).then(response => {
            //todo: parse xml response here
            deferred.resolve(response)
        });
        return deferred.promise;
        /*{
            PlayMode: this.CurrentPlayMode,
            RecQualityMode: this.CurrentRecordQualityMode
        };*/
    },
    getCurrentTransportActions: function getCurrentTransportActions(){ 
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                this._serviceType, 
                                "GetCurrentTransportActions", 
                                { InstanceID: device.instanceId}
                              ).then(response => {
            //todo: parse xml response here
            deferred.resolve(response)
        });
        return deferred.promise;
    },    
    stop: function stop(device){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                               this._serviceType, "Stop", { InstanceID: device.instanceId }
                              ).then(response => deferred.resolve(response));
        return deferred.promise;
    },
    play: function play(device){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                               this._serviceType, 
                               "Play",
                               { InstanceID: device.instanceId, Speed: 1 }
                              ).then( response => {
                                    deferred.resolve(this.getMediaInfo(device));
                                });
        return deferred.promise;
    },
    pause: function pause(device){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                               this._serviceType, "Pause", { InstanceID: device.instanceId }
                              ).then(response => deferred.resolve(response));
        return deferred.promise;
    },
    record: function record(device){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                               this._serviceType, "Record", { InstanceID: device.instanceId }
                              ).then(response => deferred.resolve(response));
        return deferred.promise;
    },
    next: function next(device){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                               this._serviceType, "Mext", { InstanceID: device.instanceId }
                              ).then(response => deferred.resolve(response));
        return deferred.promise;
    },
    previous: function previous(device){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                               this._serviceType, "Previous", { InstanceID: device.instanceId }
                              ).then(response => deferred.resolve(response));
        return deferred.promise;
    },
    seek: function seek(device, unit, target){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                this._serviceType, 
                                "Seek", 
                                { InstanceID: device.instanceId, Unit: unit, Target: target}
                              ).then(response => deferred.resolve(response));
        return deferred.promise;
    },    
    setPlayMode: function setPlayMode(device, newPlayMode){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                this._serviceType,
                                "SetPlayMode", 
                                { InstanceID: device.instanceId, NewPlayMode: newPlayMode}
                              ).then(response => deferred.resolve(response));
        return deferred.resolve();
    },
    setRecordQualityMode: function setRecordQualityMode(device, newRecordQualityMode){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), 
                                this._serviceType, 
                                "SetRecordQualityMode", 
                                { InstanceID: device.instanceId, NewRecordQualityMode: newRcordQualityMode}
                              ).then(response => deferred.resolve(response));
        return deferred.promise;
    },
    subscribe: function subscribe(device){
        var deferred = this._defer();
        this._subscriptionService.subscribe(Utilities.getEventSubUrl(device, this._serviceType), 
                                            "http://192.168.1.4:5634/test"
                                           ).then(response => deferred.resolve(response));
        return deferred.promise;
    },
    unsubscribe: function unsubscribe(device){
        var deferred = this._defer();
        this._subscriptionService.subscribe(Utilities.getEventSubUrl(device, this._serviceType), 
                                            "http://192.168.1.4:8080"
                                           ).then(response => deferred.resolve(response));
        return deferred.promise;
    }
});

exports.AVTransportService = AVTransportService;