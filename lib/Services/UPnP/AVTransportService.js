const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../../Constants');

const AVTransportService = Class({
	extends: EventTarget,
	initialize: function initialize(emitter, defer, soapService, subscriptionService, DOMParser, utilities, xmlParser, httpd) {
		this._emitter = emitter;
		this._soapService = soapService;
		this.serviceType = Constants.ServiceTypes.filter(y=> y[0] === "AV Transport").map(y=> y[1])[0];
		this._subscriptionService = subscriptionService;
		this._defer = defer;
		this._DOMParser = DOMParser;
		this._utilities = utilities;
		this._xmlParser = xmlParser;
		this._httpd = httpd;

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
	loadMedia: function loadMedia(device, file){
		var deferred = this._defer();
		var fileUri = this._httpd.loadMedia(device, file);

		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
							   this.serviceType,
							   "SetAVTransportURI",
							   { InstanceID: device.instanceId, CurrentURI: fileUri, CurrentURIMetaData: "" }
							  ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	setNextAVTransportURI: function setNextAVTransportURI(device, NextURI, NextURIMetaData){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
							   this.serviceType,
							   "SetNextAVTransportURI",
							   { InstanceID: device.instanceId, NextURI: serverAddress + fileUri, NextURIMetaData: "" }
							  ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	getMediaInfo: function getMediaInfo(device){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType), this.serviceType, "GetMediaInfo", { InstanceID: device.instanceId }
							  ).then(response => {
							  	var mediaInfo = {
							  		writeStatus: this._xmlParser.getText(response.xml,"WriteStatus"),
							  		recordMedium: this._xmlParser.getText(response.xml,"RecordMedium"),
							  		playMedium: this._xmlParser.getText(response.xml,"PlayMedium"),
							  		nextURIMetaData: this._xmlParser.getText(response.xml,"NextURIMetaData"),
							  		nextURI: this._xmlParser.getText(response.xml,"NextURI"),
							  		currentURIMetaData: this._xmlParser.getText(response.xml,"CurrentURIMetaData"),
							  		currentURI: this._xmlParser.getText(response.xml,"CurrentURI"),
							  		mediaDuration: this._xmlParser.getText(response.xml,"MediaDuration"),
							  		nrTracks: this._xmlParser.getText(response.xml,"NrTracks"),
							  		_raw: response.text
							  	};
							  	deferred.resolve(mediaInfo);
							  });

		return deferred.promise;
	},
	getTransportInfo: function getTransportInfo(device){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
								this.serviceType,
								"GetTransportInfo",
								{ InstanceID: device.instanceId}
								).then(response => {
									var transportInfo = {
										currentTransportState: this._xmlParser.getText(response.xml,"CurrentTransportState"),
										currentTransportStatus: this._xmlParser.getText(response.xml,"CurrentTransportStatus"),
										currentSpeed: this._xmlParser.getText(response.xml,"CurrentSpeed"),
										_raw: response.text
									};
									deferred.resolve(transportInfo);
								});
		return deferred.promise;
	},
	getPositionInfo: function getPositionInfo(device){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
								this.serviceType,
								"GetPositionInfo",
								{ InstanceID: device.instanceId}
							  ).then(response => {
							  	var positionInfo = {
							  		track: this._xmlParser.getText(response.xml,"Track"),
							  		trackDuration: this._xmlParser.getText(response.xml,"TrackDuration"),
							  		trackMetaData: this._xmlParser.getText(response.xml,"TrackMetaData"),
							  		trackURI: this._xmlParser.getText(response.xml,"TrackURI"),
							  		relTime: this._xmlParser.getText(response.xml,"RelTime"),
							  		absTime: this._xmlParser.getText(response.xml,"AbsTime"),
							  		relCount: this._xmlParser.getText(response.xml,"RelCount"),
							  		absCount: this._xmlParser.getText(response.xml,"AbsCount"),
							  		_raw: response.text
							  	};
							  	deferred.resolve([device.id, positionInfo]);
							  });
		return deferred.promise;
	},
	getDeviceCapabilities: function getDeviceCapabilities(device){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
								this.serviceType,
								"GetDeviceCapabilities",
								{ InstanceID: device.instanceId}
							  ).then(response => {
							  	var playMedia = this._xmlParser.getText(response.xml,"PlayMedia");
							  	var recMedia = this._xmlParser.getText(response.xml,"RecMedia");
							  	var recQualityModes = this._xmlParser.getText(response.xml,"RecQualityModes");
							  	var deviceCapabilities = {
							  		playMedia: !playMedia ? "" : playMedia.split(","),
							  		recMedia: !recMedia ? "" : recMedia.split(","),
							  		recQualityModes: !recQualityModes ? "" : recQualityModes.split(","),
							  		_raw: response.text
							  	};
							  	deferred.resolve(deviceCapabilities);
							  });
		return deferred.promise;
	},
	getTransportSettings: function getTransportSettings(device){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
								this.serviceType,
								"GetTransportSettings",
								{ InstanceID: device.instanceId}
							  ).then(response => {
							  	var transportSettings = {
							  		playMode: this._xmlParser.getText(response.xml,"PlayMode"),
							  		recQualityMode: this._xmlParser.getText(response.xml,"RecQualityMode"),
							  		_raw: response.text
							  	};
							  	deferred.resolve(transportSettings);
							  });
		return deferred.promise;
	},
	getCurrentTransportActions: function getCurrentTransportActions(device){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
								this.serviceType,
								"GetCurrentTransportActions",
								{ InstanceID: device.instanceId}
							  ).then(response => {
							  	var actions = this._xmlParser.getText(response.xml,"Envelope Body GetCurrentTransportActionsResponse Actions");
							  	var currentTransportActions = {
							  		actions: !actions ? "" : actions.split(","),
							  		_raw: response.text
							  	};
							  	deferred.resolve(currentTransportActions);
							  });
		return deferred.promise;
	},
	stop: function stop(device){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
							   this.serviceType, "Stop", { InstanceID: device.instanceId }
							  ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	play: function play(device, file){
		var deferred = this._defer();
		if(file)
			this.loadMedia(device, file).then(() => this._play(device, deferred));
		else
			this._play(device, deferred);

		return deferred.promise;
	},
	_play: function(device, deferred){
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
							   this.serviceType,
							   "Play",
							   { InstanceID: device.instanceId, Speed: 1 } //todo: make speed dynamic
							).then( response => deferred.resolve(this.getMediaInfo(device)) );
	},
	pause: function pause(device){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
							   this.serviceType, "Pause", { InstanceID: device.instanceId }
							  ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	record: function record(device){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
							   this.serviceType, "Record", { InstanceID: device.instanceId }
							  ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	next: function next(device){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
							   this.serviceType, "Next", { InstanceID: device.instanceId }
							  ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	previous: function previous(device){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
							   this.serviceType, "Previous", { InstanceID: device.instanceId }
							  ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	seek: function seek(device, unit, target){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
								this.serviceType,
								"Seek",
								{ InstanceID: device.instanceId, Unit: unit, Target: target}
							  ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	setPlayMode: function setPlayMode(device, newPlayMode){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
								this.serviceType,
								"SetPlayMode",
								{ InstanceID: device.instanceId, NewPlayMode: newPlayMode}
							  ).then(response => deferred.resolve(response));
		return deferred.resolve();
	},
	setRecordQualityMode: function setRecordQualityMode(device, newRecordQualityMode){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
								this.serviceType,
								"SetRecordQualityMode",
								{ InstanceID: device.instanceId, NewRecordQualityMode: newRcordQualityMode}
							  ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	subscribe: function subscribe(device){
		var deferred = this._defer();
		this._subscriptionService.subscribe(device, this.serviceType, 'AVTransport' ).then( response => deferred.resolve( response ) );
		return deferred.promise;
	},
	unsubscribe: function unsubscribe(device){
		var deferred = this._defer();
		this._subscriptionService.subscribe( device, this.serviceType, 'AVTransport' ).then( response => deferred.resolve( response ) );
		return deferred.promise;
	},
	_parseEventRequest: function _parseEventRequest(request){
		var requestXml = this._DOMParser.parseFromString(request.body, 'text/xml');
		var lastChanges = this._xmlParser.getElements(requestXml,"propertyset property LastChange");
		var instances = [];

		lastChanges.map( lastChange => {
			var eventString = lastChange.innerHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');
			var eventXml = this._DOMParser.parseFromString(eventString, 'text/xml');

			var instancesXml = this._xmlParser.getElements(eventXml, "InstanceID");
			instancesXml.map( instanceXml => {
				instance = {};
				Array.prototype.slice.call(instanceXml.children).forEach(child => {
					instance[child.tagName] = child.attributes.getNamedItem('val').value;
				});
				instances.push(instance);
			});
		});

		return instances;
	}
});

module.exports = AVTransportService;
