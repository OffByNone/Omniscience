const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');
const Utilities = require('../Utilities');

const AVTransportService = Class({
	extends: EventTarget,
	initialize: function initialize(emitter, defer, soapService, subscriptionService, DOMParser) {
		this._emitter = emitter;
		this._soapService = soapService;
		this._serviceType = Constants.ServiceTypes.filter(y=> y[0] === "AV Transport").map(y=> y[1])[0];
		this._subscriptionService = subscriptionService;
		this._defer = defer;
		this._DOMParser = DOMParser;

		this._subscriptionService.on( 'EventOccured', ( device, request ) => {
			var event = this._parseEventRequest(request);
			this._emitter.emit( this, 'EventOccured', device, event, request );
		});
	},
	getAdditionalInformation: function getAdditionalInformation(device){
		this.getMediaInfo(device).then( mediaInfo => {
			device.mediaInfo = mediaInfo;
			this._emitter.emit(this, "additionalInformationFound", device);
		});
		this.getTransportInfo(device).then( transportInfo => {
			device.transportInfo = transportInfo;
			this._emitter.emit(this, "additionalInformationFound", device);
		});
		this.getPositionInfo(device).then( positionInfo => {
			device.positionInfo = positionInfo;
			this._emitter.emit(this, "additionalInformationFound", device);
		});
		this.getDeviceCapabilities(device).then( deviceCapabilities => {
			device.deviceCapabilities = deviceCapabilities;
			this._emitter.emit(this, "additionalInformationFound", device);
		});
		this.getTransportSettings(device).then( transportSettings => {
			device.transportSettings = transportSettings;
			this._emitter.emit(this, "additionalInformationFound", device);
		});
		this.getCurrentTransportActions(device).then( currentTransportActions => {
			device.currentTransportActions = currentTransportActions;
			this._emitter.emit(this, "additionalInformationFound", device);
		});
		this.subscribe(device);
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
		this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "GetMediaInfo", { InstanceID: device.instanceId }
                              ).then(response => {
                              	var xml = response.querySelector("Envelope Body GetMediaInfoResponse") || {};
                              	var mediaInfo = {
                              		writeStatus: (xml.querySelector("WriteStatus") || {}).innerHTML,
                              		recordMedium: (xml.querySelector("RecordMedium") || {}).innerHTML,
                              		playMedium: (xml.querySelector("PlayMedium") || {}).innerHTML,
                              		nextURIMetaData: (xml.querySelector("NextURIMetaData") || {}).innerHTML,
                              		nextURI: (xml.querySelector("NextURI") || {}).innerHTML,
                              		currentURIMetaData: (xml.querySelector("CurrentURIMetaData") || {}).innerHTML,
                              		currentURI: (xml.querySelector("CurrentURI") || {}).innerHTML,
                              		mediaDuration: (xml.querySelector("MediaDuration") || {}).innerHTML,
                              		nrTracks: (xml.querySelector("NrTracks") || {}).innerHTML,
                              		_raw: response
                              	};
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
                                	var xml = response.querySelector("Envelope Body GetTransportInfoResponse") || {};
                                	var transportInfo = {
                                		currentTransportState: (xml.querySelector("CurrentTransportState") || {}).innerHTML,
                                		currentTransportStatus: (xml.querySelector("CurrentTransportStatus") || {}).innerHTML,
                                		currentSpeed: (xml.querySelector("CurrentSpeed") || {}).innerHTML,
                                		_raw: response
                                	};
                                	deferred.resolve(transportInfo);
                                });
		return deferred.promise;
	},
	getPositionInfo: function getPositionInfo(device){
		var deferred = this._defer();
		this._soapService.post(Utilities.getControlUrl(device, this._serviceType),
                                this._serviceType,
                                "GetPositionInfo",
                                { InstanceID: device.instanceId}
                              ).then(response => {
                              	var xml = response.querySelector("Envelope Body GetPositionInfoResponse") || {};
                              	var positionInfo = {
                              		track: (xml.querySelector("Track") || {}).innerHTML,
                              		trackDuration: (xml.querySelector("TrackDuration") || {}).innerHTML,
                              		trackMetaData: (xml.querySelector("TrackMetaData") || {}).innerHTML,
                              		trackURI: (xml.querySelector("TrackURI") || {}).innerHTML,
                              		relTime: (xml.querySelector("RelTime") || {}).innerHTML,
                              		absTime: (xml.querySelector("AbsTime") || {}).innerHTML,
                              		relCount: (xml.querySelector("RelCount") || {}).innerHTML,
                              		absCount: (xml.querySelector("AbsCount") || {}).innerHTML,
                              		_raw: response
                              	};
                              	deferred.resolve(positionInfo);
                              });
		return deferred.promise;
	},
	getDeviceCapabilities: function getDeviceCapabilities(device){
		var deferred = this._defer();
		this._soapService.post(Utilities.getControlUrl(device, this._serviceType),
                                this._serviceType,
                                "GetDeviceCapabilities",
                                { InstanceID: device.instanceId}
                              ).then(response => {
                              	var xml = response.querySelector("Envelope Body GetDeviceCapabilitiesResponse") || {};
                              	var playMedia = (xml.querySelector("PlayMedia") || {}).innerHTML;
                              	var recMedia = (xml.querySelector("RecMedia") || {}).innerHTML;
                              	var recQualityModes = (xml.querySelector("RecQualityModes") || {}).innerHTML;
                              	var deviceCapabilities = {
                              		playMedia: !playMedia ? "" : playMedia.split(","),
                              		recMedia: !recMedia ? "" : recMedia.split(","),
                              		recQualityModes: !recQualityModes ? "" : recQualityModes.split(","),
                              		_raw: response
                              	};
                              	deferred.resolve(deviceCapabilities);
                              });
		return deferred.promise;
	},
	getTransportSettings: function getTransportSettings(device){
		var deferred = this._defer();
		this._soapService.post(Utilities.getControlUrl(device, this._serviceType),
                                this._serviceType,
                                "GetTransportSettings",
                                { InstanceID: device.instanceId}
                              ).then(response => {
                              	var xml = response.querySelector("Envelope Body GetTransportSettingsResponse") || {};
                              	var transportSettings = {
                              		playMode: (xml.querySelector("PlayMode") || {}).innerHTML,
                              		recQualityMode: (xml.querySelector("RecQualityMode") || {}).innerHTML,
                              		_raw: response
                              	};
                              	deferred.resolve(transportSettings);
                              });
		return deferred.promise;
	},
	getCurrentTransportActions: function getCurrentTransportActions(device){
		var deferred = this._defer();
		this._soapService.post(Utilities.getControlUrl(device, this._serviceType),
                                this._serviceType,
                                "GetCurrentTransportActions",
                                { InstanceID: device.instanceId}
                              ).then(response => {
                              	var xml = response.querySelector("Envelope Body GetCurrentTransportActionsResponse") || {};
                              	var actions = (xml.querySelector("Actions") || {}).innerHTML;
                              	var currentTransportActions = {
                              		actions: !actions ? "" : actions.split(","),
                              		_raw: response
                              	};
                              	deferred.resolve(currentTransportActions);
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
                               this._serviceType, "Next", { InstanceID: device.instanceId }
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
		this._subscriptionService.subscribe(device, this._serviceType, 'AVTransport' ).then( response => deferred.resolve( response ) );
		return deferred.promise;
	},
	unsubscribe: function unsubscribe(device){
		var deferred = this._defer();
		this._subscriptionService.subscribe( device, this._serviceType, 'AVTransport' ).then( response => deferred.resolve( response ) );
		device.services.filter(x=> x.type.urn === serviceType)[0].isSubscribed = false;
		return deferred.promise;
	},
	_parseEventRequest: function _parseEventRequest(request){
		var requestXML = this._DOMParser.parseFromString(request.body, 'text/xml');
		var lastChanges = requestXML.querySelectorAll("propertyset property LastChange");
		var instances = [];

		Array.prototype.slice.call(lastChanges).map((lastChange)=>{
			var eventString = lastChange.innerHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');
			var eventXML = this._DOMParser.parseFromString(eventString, 'text/xml');

			var instancesXML = eventXML.querySelectorAll("InstanceID");
			Array.prototype.slice.call(instancesXML).map((instanceXML)=>{
				instance = {};
				Array.prototype.slice.call(instanceXML.children).forEach(child => {
					instance[child.tagName] = child.attributes.getNamedItem('val').value;
				});
				instances.push(instance);
			});
		});

		return instances;
	}
});

exports.AVTransportService = AVTransportService;