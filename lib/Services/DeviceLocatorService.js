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
    initialize: function initialize(utilities, emitter, timers, ssdpFactory, deviceFactory) {
        this._ssdpFactory = ssdpFactory;
        this._utilities = utilities;
        this._emitter = emitter;
        this._deviceFactory = deviceFactory;
        this._timers = timers;

        this._initializeSSDPClients();
        this._deviceFactory.on("additionalInfoFound", (device) => {
            this._addUpdateDevice(device);
        });

	},
	search: function search() {
        this._isSearching = true;
		if (this._searchTimeout) {
			//if there is a currently running search
			this._timers.clearTimeout(this._searchTimeout);
			this._searchTimeout = null;
		}

		this._staleDevices = this.devices.slice(); //need to clone or bad shit will happen!
		this._searchTimeout = this._timers.setTimeout(() => this._removeStaleDevices(), 2500);
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

                if(this._alreadyFoundInCurrentSearch.hasOwnProperty(headers.LOCATION)) return;

                this._alreadyFoundInCurrentSearch[headers.LOCATION] = true;
                this._deviceFactory.createDevice(headers.LOCATION, headers, 0).then((device) => {
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
        this._alreadyFoundInCurrentSearch = {};
		this._staleDevices.forEach(staleDevice => {
			if (this.devices.some(x=> x.address.href === staleDevice.address.href)) {
				this.devices = this.devices.filter(x=> x.address.href !== staleDevice.address.href);
				this._emitter.emit(this, "deviceLost", staleDevice);
			}
		});
		this._staleDevices = [];
	},
	_addUpdateDevice: function _addUpdateDevice(device){
		if (this._isSearching && this._staleDevices.some(x=> x.address.href === device.address.href)) {
			this._staleDevices = this._staleDevices.filter(x=> x.address.href !== device.address.href);
			this._emitter.emit(this, 'deviceFound', device, false);
            return;
		}
		if (this.devices.some(x=> x.address.href === device.address.href)){
            this._emitter.emit(this, 'deviceFound', device, false);
            return;
        }
		this.devices.push(device);
		this._emitter.emit(this, 'deviceFound', device, true);
	},
	_error: function _error(error){
        console.error(error);
        //console.trace(error);
	}
});

/**
 *
 */
exports.DeviceLocatorService = DeviceLocatorService;