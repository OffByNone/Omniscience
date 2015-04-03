const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');

const DeviceServices = Class({
	extends: EventTarget,
	initialize: function initialize(emitter, eventParser, serviceFactory, subscriptionService, matchStickService){
		this._emitter = emitter;
		this._serviceFactory = serviceFactory;
		this._subscriptionService = subscriptionService;
		this._eventParser = eventParser;
		this._services = {};
		//this._services[Constants.ServiceTypes.MatchStick] = matchstickService;  todo: fixme
		//this._services[Constants.ServiceTypes.Chromecast] = chromecastService;  todo: fixme
		//this._services[Constants.ServiceTypes.Firestick] = firestickService;  todo: fixme

		//var avTransportKey = Constants.ServiceTypes.filter( serviceType => serviceType[0] === "AV Transport").map( serviceType => serviceType[1])[0];
		//var contentDirectoryKey = Constants.ServiceTypes.filter( serviceType => serviceType[0] === "Content Directory").map( serviceType => serviceType[1])[0];
		//var connectionManagerKey = Constants.ServiceTypes.filter( serviceType => serviceType[0] === "Connection Manager").map( serviceType => serviceType[1])[0];
		//var renderingControlKey = Constants.ServiceTypes.filter( serviceType => serviceType[0] === "Rendering Control").map( serviceType => serviceType[1])[0];
		//var mediaReceiverRegistrarKey = Constants.ServiceTypes.filter( serviceType => serviceType[0] === "Media Receiver Registrar").map( serviceType => serviceType[1])[0];
		//var wfaWlanConfigKey = Constants.ServiceTypes.filter( serviceType => serviceType[0] === "WFA WLAN Config").map( serviceType => serviceType[1])[0];

		//this._services[avTransportKey] = avTransportService;
		//this._services[contentDirectoryKey] = connectionManagerService;
		//this._services[connectionManagerKey] = renderingControlService;
		//this._services[renderingControlKey] = contentDirectoryService;
		//this._services[mediaReceiverRegistrarKey] = mediaReceiverRegistrarService;
		//this._services[wfaWlanConfigKey] = wfaWlanConfigService;

		this._subscriptionService.on("EventOccured", (serviceHash, request) => this._emitter.emit(this, "EventOccured", serviceHash, this._eventParser.parseEvent(request), request));
	},
	callService: function (serviceControlUrl, serviceHash, serviceUrn, serviceMethod, data){
		if(!serviceControlUrl || !serviceUrn || !serviceHash || !serviceMethod)
			return;

		var serviceClass = this._services[serviceUrn];
		if(!serviceClass) return;

		var serviceFunc = serviceClass[serviceMethod];
		if(typeof serviceFunc !== "function") return;

		return serviceFunc(serviceHash, serviceControlUrl, data);
	},
	addServices: function (servicesToAdd){
		if(!Array.isArray(servicesToAdd)) return;

		servicesToAdd.forEach(serviceInfo => {
			if(!serviceInfo.type || !serviceInfo.type.urn) return;
			//if(this._services.hasOwnProperty(serviceInfo.type.urn)) return;
			this._services[serviceInfo.type.urn] = this._serviceFactory.create(serviceInfo);
		});
	},
	subscribe: function subscribe(service, timeout){
		return this._subscriptionService.subscribe(service, timeout).then( response => deferred.resolve( response ) );
	},
	unsubscribe: function unsubscribe(service){
		return this._subscriptionService.unsubscribe(service).then( response => deferred.resolve( response ) );
	},
});

module.exports = DeviceServices;