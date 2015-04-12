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

		this._subscriptionService.on("EventOccured", (serviceHash, request) => this._emitter.emit(this, "EventOccured", serviceHash, this._eventParser.parseEvent(request), request));
	},
	callService: function (serviceControlUrl, rawType, serviceMethod, data){
		if(!serviceControlUrl || !rawType || !serviceMethod)
			return;

		var serviceClass = this._services[rawType];
		if(!serviceClass) return;

		var serviceFunc = serviceClass[serviceMethod];
		if(typeof serviceFunc !== "function") return;

		return serviceFunc(serviceControlUrl, data);
	},
	addServices: function (servicesToAdd){
		if(!Array.isArray(servicesToAdd)) return;

		servicesToAdd.forEach(serviceInfo => {
			if(!serviceInfo.type || !serviceInfo.type.raw) return;

			var service = this._serviceFactory.create(serviceInfo);
			if(!service) return;
			if(!this._services.hasOwnProperty(serviceInfo.type.raw))
				this._services[serviceInfo.type.raw] = service;
			else
				for (var methodName in service)
					if(!this._services[serviceInfo.type.raw].hasOwnProperty(methodName))
						this._services[serviceInfo.type.raw][methodName] = service[methodName];
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