const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');

const DeviceServices = Class({
	extends: EventTarget,
	initialize: function initialize(defer, emitter, fxosWebServer, httpd, utilities, matchStickService, chromecastService, firestickService, avTransportService,
									connectionManagerService, renderingControlService, contentDirectoryService, mediaReceiverRegistrarService, wfaWlanConfigService){
		this._emitter = emitter;
		this._defer = defer;
		this._utilities = utilities;
		this._httpd = httpd;
		this._httpd.start();
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
	launchMedia: function launchMedia(device, file){
		this.loadMedia(device, file).then(response => this.play(device));
	},
	loadMedia: function loadMedia(device, file){
		var serverAddress = this._httpd.getServerIp(device);
		var fileUri;

		if(file.isLocal)
			fileUri = serverAddress + this.shareFile(file);
		else
			fileUri = file.path;

		return this[device.serviceKey].loadMedia(device, serverAddress, fileUri);
	},

	shareFile: function shareFile(file){
		if(!file.isLocal)
			return file.path; // if file was added by url and not filepicker, don't map, just return the path

		var filePathHash = this._utilities.md5(file.path);
		var filePath = `/${filePathHash}/${file.name}`;
		var encodedFilePath = encodeURI(filePath);

		this._httpd.registerFile(encodedFilePath, file.path);
		return encodedFilePath;
	},

	getAdditionalInformation: function getAdditionalInformation(device){
		for (let service in device.services){
			var serviceInstance = this._services[device.services[service].type.urn];
			if(serviceInstance && typeof serviceInstance.getAdditionalInfo === "function")
				serviceInstance.getAdditionalInfo(device);
		}
	},

	getPositionInfo: function(device){
		return this[device.serviceKey].getPositionInfo(device);
	},
	play: function(device, file){
		if(file)
			this.loadMedia(device, file).then(()=> this[device.serviceKey].play(device));

		return this[device.serviceKey].play(device);
	},
	pause: function(device){
		return this[device.serviceKey].pause(device);
	},
	next: function(device){
		return this[device.serviceKey].next(device);
	},
	previous: function(device){
		return this[device.serviceKey].previous(device);
	},
	stop: function(device){
		return this[device.serviceKey].stop(device);
	},
	isMuted: function isMuted(device){
		return this[device.serviceKey].isMuted(device);
	},
	toggleMute: function toggleMute(device){
		return this[device.serviceKey].setMute(device, !device.isMuted);
	},
	getVolume: function getVolume(device){
		return this[device.serviceKey].getVolume(device);
	},
	setVolume: function setVolume(device, newVolume){
		return this[device.serviceKey].setVolume(device, newVolume);
	},
	seek: function seek(device, unit, target){
		return this[device.serviceKey].seek(device, unit, target);
	},


	setName: function setName(device, name){
		return this[device.serviceKey].setName(device, name);
	},
	reboot: function reboot(device){
		return this[device.serviceKey].reboot(device);
	}
});

module.exports = DeviceServices;