const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');

const DeviceLocatorService = Class({
	extends: EventTarget,
	devices: [],
	initialize: function initialize(emitter, md5, deviceFactory, searcherService, listenerService, storageService) {
		this._emitter = emitter;
		this._deviceFactory = deviceFactory;
		this._md5 = md5;
		this._searcherService = searcherService;
		this._listenerService = listenerService;
		this._storageService = storageService;

		this._initializeServices();
	},
	search: function search() {
		this._searcherService.search();
	},
	_initializeServices: function _initializeServices(){

		this.devices = this._storageService.devices || [];
		//this.devices.forEach((device) => this._deviceFound(device)); //this is a device object and I am expecting to pass headers into the device found.  Find another place or way to do this

		this._searcherService.on("deviceFound", (headers) => this._deviceFound(headers));
		this._searcherService.on("deviceLost", (headers) => this._deviceLost(headers));
		this._searcherService.on("addResponseHeaders", (headers) => this._addResponseHeaders(headers));

		this._listenerService.on("deviceFound", (headers) => this._deviceFound(headers));
		this._listenerService.on("deviceLost", (headers) => this._deviceLost(headers));
		this._listenerService.on("addResponseHeaders", (headers) => this._addResponseHeaders(headers));
	},
	_addResponseHeaders: function _addResponseHeaders(headers){
		var id = this._md5(headers.LOCATION);
		var key = this._md5(headers.USN || headers.ST || headers.LOCATION);
		var alreadyFoundDevice = this.devices.filter( device => device.id === id)[0];
		if (alreadyFoundDevice)
			alreadyFoundDevice.ssdpResponseHeaders[key] = headers;

		this._emitter.emit(this, "addUpdateDevice", alreadyFoundDevice);
	},
	_deviceLost: function _deviceLost(headers) {
		//the listenerservice wont have access to the location so we can't use id.  But we will always have the fromaddress
		var deviceUdn = headers.USN.split("::")[0];
		
		for (var i = 0; i < this.devices.length; i++ ){
			if(this.devices[i].udn === deviceUdn){
				var lostDevice = this.devices.splice( i , 1 );
				this._emitter.emit(this, "deviceLost", lostDevice[0]);
				i--;
			}
		}
		this._storageService.devices = this.devices;
	},
	_deviceFound: function _deviceFound(headers){
		var id = this._md5(headers.LOCATION);
		var previouslyFound = this.devices.filter(device => device.id === id);
		var previouslyFoundDevice = previouslyFound.length > 0 ? previouslyFound[0] : null;

		this._deviceFactory.create(headers.LOCATION, headers, previouslyFoundDevice, 0).then( device => {
			if(device === null) return;

			var isNew = previouslyFoundDevice == null;
			if(isNew) this.devices.push(device);

			this._emitter.emit(this, 'deviceFound', device, isNew);
		});
		this._storageService.devices = this.devices;
	}
});

module.exports = DeviceLocatorService;