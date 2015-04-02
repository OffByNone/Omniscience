const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');

const DeviceLocatorService = Class({
	extends: EventTarget,
	devices: [],
	continuous: false,
	interval: 5000,
	_ssdpClients: [],
	_staleDevices: [],
	_isSearching: false,
	_alreadyFoundInCurrentSearch: {},
	initialize: function initialize(utilities, emitter, timers, md5, ssdpFactory, deviceFactory) {
		this._ssdpFactory = ssdpFactory;
		this._utilities = utilities;
		this._emitter = emitter;
		this._deviceFactory = deviceFactory;
		this._timers = timers;
		this._md5 = md5;

		this._initializeSSDPClients();
	},
	search: function search() {
		this._isSearching = true;
		if (this._searchTimeout) {
			//if there is a currently running search
			this._timers.clearTimeout(this._searchTimeout);
			this._searchTimeout = null;
		}

		this._staleDevices = this.devices.slice(); //clone or bad things will happen
		this._searchTimeout = this._timers.setTimeout(() => this._removeStaleDevices(), 3700);
		this._ssdpClients.forEach(ssdpClient => ssdpClient.search(Constants.SSDPServiceType));
	},
	stop: function stop() {
		this._isSearching = false;
		this._alreadyFoundInCurrentSearch = {};
		this._ssdpClients.forEach(ssdpClient => ssdpClient.stopSearch());
	},
	_initializeSSDPClients: function _initializeSSDPClients(){
		var adapters = this._utilities.getMyIPAddresses();
		//ip addresses your machine has.  Bind all to search on all network interfaces

		adapters.forEach(adapter => {
			var ssdpClient = this._ssdpFactory.createSSDP();
			ssdpClient.setMulticastInterface(adapter);
			ssdpClient.joinMulticast();
			ssdpClient.on('error', error => this._error(error));
			ssdpClient.on('deviceResponse', headers => {
				var type = this._getURN(headers);
				if (type === 'unknown')
					console.log(headers.ST);
				if(headers.ST === Constants.PeerNameResolutionProtocolST)
					return;//this is a Microsoft thing to resolve names on ipv6 networks and in this case just causes problems

				var id = this._md5.md5(headers.LOCATION);
				if(this._alreadyFoundInCurrentSearch.hasOwnProperty(id)){
					var alreadyFoundDevice = this.devices.filter( device => device.id === id)[0];
					if (alreadyFoundDevice && Array.isArray(alreadyFoundDevice.ssdpResponseHeaders)) alreadyFoundDevice.ssdpResponseHeaders.push(headers)
					return;
				}

				this._alreadyFoundInCurrentSearch[id] = true;

				var previouslyFound = this.devices.filter(device => device.id === id);
				var previouslyFoundDevice = previouslyFound.length > 0 ? previouslyFound[0] : null;

				this._deviceFactory.create(headers.LOCATION, headers, previouslyFoundDevice, 0).then( device => {
					if(device === null) return;
					this._addUpdateDevice(device);
				});
			});

			this._ssdpClients.push(ssdpClient);
		});

	},
	_getURN: function(headers){
		for(var property in headers)
			return Constants.ServiceTypes.filter(y=> y[1] === property).map(y=> y[0])[0];

		return 'unknown';
	},
	_removeStaleDevices: function _removeStaleDevices() {
		this._isSearching = false;

		for (var j = 0; j < this.devices.length; j++ ){
			if(this._alreadyFoundInCurrentSearch[this.devices[j].id] == null){
				var staleDevice = this.devices.splice( j , 1 );
				this._emitter.emit(this, "deviceLost", staleDevice[0]);
			}
		}
		this._alreadyFoundInCurrentSearch = {};
	},
	_addUpdateDevice: function _addUpdateDevice(device){
		if (this.devices.every(x=> x.id != device.id))
			this.devices.push(device);

		this._emitter.emit(this, 'deviceFound', device, true);
	},
	_error: function _error(error){
		console.error(error);
		//console.trace(error);
	}
});

module.exports = DeviceLocatorService;