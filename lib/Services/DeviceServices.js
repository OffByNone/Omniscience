const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');

const DeviceServices = Class({
	extends: EventTarget,
	initialize: function initialize(defer, emitter, fxosWebServer, httpd, utilities, matchstickService, chromecastService, firestickService, mediaRendererService, mediaServerService, wfaService, genericDeviceService){
		this._emitter = emitter;
		this._defer = defer;
		this._utilities = utilities;
		this._httpd = httpd;
		this._httpd.start();
		this[Constants.Services.MatchStick] = matchstickService;
		this[Constants.Services.MatchStick].on("additionalInformationFound", device => this._emitter.emit(this, "additionalInfoFound", device));
		this[Constants.Services.Chromecast] = chromecastService;
		this[Constants.Services.Chromecast].on("additionalInformationFound", device => this._emitter.emit(this, "additionalInfoFound", device));
		this[Constants.Services.Firestick] = firestickService;
		this[Constants.Services.Firestick].on("additionalInformationFound", device => this._emitter.emit(this, "additionalInfoFound", device));
		this[Constants.Services.MediaRenderer] = mediaRendererService;
		this[Constants.Services.MediaRenderer].on("additionalInformationFound", device => this._emitter.emit(this, "additionalInfoFound", device));
		this[Constants.Services.MediaRenderer].on("EventOccured", ( device, event, request ) => this._emitter.emit(this, "EventOccured", device, event, request));
		this[Constants.Services.MediaServer] = mediaServerService;
		this[Constants.Services.MediaServer].on("additionalInformationFound", device => this._emitter.emit(this, "additionalInfoFound", device));
		this[Constants.Services.MediaServer].on("EventOccured", ( device, event, request ) => this._emitter.emit(this, "EventOccured", device, event, request));
		this[Constants.Services.WFA] = wfaService;
		this[Constants.Services.WFA].on("additionalInformationFound", device => this._emitter.emit(this, "additionalInfoFound", device));
		this[Constants.Services.WFA].on("EventOccured", ( device, event, request ) => this._emitter.emit(this, "EventOccured", device, event, request));
		this[Constants.Services.GenericDevice] = genericDeviceService;
		this[Constants.Services.GenericDevice].on("additionalInformationFound", device => this._emitter.emit(this, "additionalInfoFound", device));
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


	play: function(device){
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

exports.DeviceServices = DeviceServices;