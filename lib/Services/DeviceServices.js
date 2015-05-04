const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const { URL } = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url

const Constants = require('../Constants');

const DeviceServices = Class({
    extends: EventTarget,
    initialize: function initialize(emitter, utilities, serviceInfoFactory, executableServiceFactory, subscriptionService, fxosWebServer, matchStickService){
        this._emitter = emitter;
        this._utilities = utilities;
        this._fxosWebServer = fxosWebServer;
        this._executableServiceFactory = executableServiceFactory;
        this._subscriptionService = subscriptionService;
        this._serviceInfoFactory = serviceInfoFactory;
        this._executableServices = {};
        //this._services[Constants.ServiceTypes.MatchStick] = matchstickService;  todo: fixme
        //this._services[Constants.ServiceTypes.Chromecast] = chromecastService;  todo: fixme
        //this._services[Constants.ServiceTypes.Firestick] = firestickService;  todo: fixme
    },
    callService: function (serviceControlUrl, serviceHash, serviceMethod, data){
        if(!serviceControlUrl || !serviceMethod)
            return;

        var serviceClass = this._executableServices[serviceHash];
        if(!serviceClass) return Promise.reject("Executable Service has not yet been created.");

        var serviceFunc = serviceClass[serviceMethod];
        if(typeof serviceFunc !== "function") return Promise.reject("Executable Service has been created, but, service function has not.");

        return serviceFunc(serviceControlUrl, data);
    },
    addExecutableServices: function (services){
        if(!Array.isArray(services)) return;
        services.forEach((basicServiceInfo) => {
            this._serviceInfoFactory.getDetailedServiceInformation(basicServiceInfo).then((detailedServiceInfo) => {
                var executableService = this._executableServiceFactory.create(detailedServiceInfo);
                if(!executableService) return;
                if(!this._executableServices.hasOwnProperty(detailedServiceInfo.hash))
                    this._executableServices[detailedServiceInfo.hash] = executableService;
                else
                    for (var methodName in executableService)
                        this._executableServices[detailedServiceInfo.hash][methodName] = executableService[methodName];
            }).catch(()=>{});
        });
	},
	subscribe: function subscribe(subscriptionUrl, subscriptionId, serviceHash, serverIP, timeout){
		var directResponsesTo = `http://${serverIP}:${this._fxosWebServer.port}/events/${serviceHash}`;

		this._fxosWebServer.registerPath(directResponsesTo, (request, response) => {
			this._emitter.emit(this, "UPnPEvent", serviceHash, request.body);
			response.send( 'ok', '200' );
		});

		return this._subscriptionService.subscribe(subscriptionUrl, subscriptionId, serviceHash, timeout, directResponsesTo);
	},
	unsubscribe: function unsubscribe(subscriptionUrl, subscriptionId, serviceHash){
		this._fxosWebServer.registerPath( `/events/${serviceHash}`, null );

		return this._subscriptionService.unsubscribe(subscriptionUrl, subscriptionId);
	}
});

module.exports = DeviceServices;