const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const { URL } = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url

const Constants = require('../Constants');

const DeviceServices = Class({
	extends: EventTarget,
	initialize: function initialize(emitter, utilities, serviceFactory, subscriptionService, fxosWebServer, matchStickService){
		this._emitter = emitter;
		this._utilities = utilities;
		this._fxosWebServer = fxosWebServer;
		this._serviceFactory = serviceFactory;
		this._subscriptionService = subscriptionService;
		this._services = {};
		//this._services[Constants.ServiceTypes.MatchStick] = matchstickService;  todo: fixme
		//this._services[Constants.ServiceTypes.Chromecast] = chromecastService;  todo: fixme
		//this._services[Constants.ServiceTypes.Firestick] = firestickService;  todo: fixme
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
	subscribe: function subscribe(subscriptionUrl, subscriptionId, serviceHash, timeout){
		var myIp = this._getServerIp(subscriptionUrl);
		var directResponsesTo = `${myIp}:${this._fxosWebServer.port}/events/${serviceHash}`;

		this._fxosWebServer.registerPath(directResponsesTo, (request, response) => {
			this._emitter.emit(this, "UPnPEvent", serviceHash, request.body);
			response.send( 'ok', '200' );
		});

		return this._subscriptionService.subscribe(subscriptionUrl, subscriptionId, serviceHash, timeout, directResponsesTo);
	},
	unsubscribe: function unsubscribe(subscriptionUrl, subscriptionId, serviceHash){
		this._fxosWebServer.registerPath( `/events/${serviceHash}`, null );

		return this._subscriptionService.unsubscribe(subscriptionUrl, subscriptionId, serviceHash);
	},
	//todo: the below is more or less duplicated from the fileservice.  move them both to a better location
	_getServerIp: function _getServerIp(url){
		var deviceIp = new URL(url).host;
		//todo: pains me to hardcode http
		return "http://" + this._utilities.getMyIPAddresses().filter(x=> this._areIPsInSameSubnet(x, deviceIp))[0];
	},
	_areIPsInSameSubnet: function _areIPsInSameSubnet(ip1, ip2){
		//todo: this only works for ipv4 addresses
		//meaning it wont work for ipv6 or hostnames

		//todo: if two adapters are on the same subnet it will grab whichever it finds first
		//which is probably not what you want as my laptop shows both ethernet and wifi even if one is disconnected
		//should probably ping the ip to validate it can be hit

		var ip3 = ip1.split(".");
		var ip4 = ip2.split(".");

		if((ip3.length > 2 && ip4.length > 2)
            && (ip3[0] === ip4[0] && ip3[1] === ip4[1] && ip3[2] === ip4[2]))
			return true;

		return false;
	}
});

module.exports = DeviceServices;