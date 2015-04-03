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

		this._subscriptionService.on( 'EventOccured', ( service, request ) => {
			var event = this._parseEventRequest(request);
			this._emitter.emit( this, 'EventOccured', service, event, request );
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
	loadMedia: function loadMedia(service, {instanceId, file}) {
		var deferred = this._defer();
		var fileUri = this._httpd.loadMedia(service, file);

		this._soapService.post(service.controlUrl,
							   this.serviceType,
							   "SetAVTransportURI",
							   { InstanceID: instanceId, CurrentURI: fileUri, CurrentURIMetaData: "" }
							  ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	subscribe: function subscribe(service){
		var deferred = this._defer();
		this._subscriptionService.subscribe(service, this.serviceType, 'AVTransport' ).then( response => deferred.resolve( response ) );
		return deferred.promise;
	},
	unsubscribe: function unsubscribe(service){
		var deferred = this._defer();
		this._subscriptionService.subscribe( service, this.serviceType, 'AVTransport' ).then( response => deferred.resolve( response ) );
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
