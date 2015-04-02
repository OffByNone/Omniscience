const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');

const DeviceServices = Class({
	extends: EventTarget,
	initialize: function initialize(emitter, matchStickService, chromecastService, firestickService, avTransportService, connectionManagerService,
										renderingControlService, contentDirectoryService, mediaReceiverRegistrarService, wfaWlanConfigService){
		this._emitter = emitter;
		this._services = {};
		//this._services[Constants.ServiceTypes.MatchStick] = matchstickService;  todo: fixme
		//this._services[Constants.ServiceTypes.Chromecast] = chromecastService;  todo: fixme
		//this._services[Constants.ServiceTypes.Firestick] = firestickService;  todo: fixme

		var avTransportKey = Constants.ServiceTypes.filter( serviceType => serviceType[0] === "AV Transport").map( serviceType => serviceType[1])[0];
		var contentDirectoryKey = Constants.ServiceTypes.filter( serviceType => serviceType[0] === "Content Directory").map( serviceType => serviceType[1])[0];
		var connectionManagerKey = Constants.ServiceTypes.filter( serviceType => serviceType[0] === "Connection Manager").map( serviceType => serviceType[1])[0];
		var renderingControlKey = Constants.ServiceTypes.filter( serviceType => serviceType[0] === "Rendering Control").map( serviceType => serviceType[1])[0];
		var mediaReceiverRegistrarKey = Constants.ServiceTypes.filter( serviceType => serviceType[0] === "Media Receiver Registrar").map( serviceType => serviceType[1])[0];
		var wfaWlanConfigKey = Constants.ServiceTypes.filter( serviceType => serviceType[0] === "WFA WLAN Config").map( serviceType => serviceType[1])[0];

		this._services[avTransportKey] = avTransportService;
		this._services[contentDirectoryKey] = connectionManagerService;
		this._services[connectionManagerKey] = renderingControlService;
		this._services[renderingControlKey] = contentDirectoryService;
		this._services[mediaReceiverRegistrarKey] = mediaReceiverRegistrarService;
		this._services[wfaWlanConfigKey] = wfaWlanConfigService;

		for (var service in this._services){
			this._services[service].on("additionalInformationFound", device => this._emitter.emit(this, "additionalInfoFound", device));
			this._services[service].on("EventOccured", ( device, event, request ) => this._emitter.emit(this, "EventOccured", device, event, request));
		}
	},
	getAdditionalInformation: function getAdditionalInformation(device){
		device.services.forEach(service => {
			var serviceInstance = this._services[service.type.urn];
			if(serviceInstance && typeof serviceInstance.getAdditionalInfo === "function")
				serviceInstance.getAdditionalInfo(device);
		});
	},




});

module.exports = DeviceServices;