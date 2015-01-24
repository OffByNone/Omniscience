//will contain a search, continuous search, list of devices
const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { emit } = require('sdk/event/core'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/event/core.html
const { merge } = require('sdk/util/object'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/util_object
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const timers = require('sdk/timers'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers

const { DeviceDiscoverer } = require('./DeviceDiscoverer');

const Searcher = Class({
	extends: EventTarget,
	devices: [],
	continuous: false,
	interval: 5000,
	_staleDevices: [],
	_isSearching: false,
	initialize: function initialize(options) {
		EventTarget.prototype.initialize.call(this, options);
		merge(this, options);

		this._deviceDiscoverer = new DeviceDiscoverer();
		this._deviceDiscoverer.on('deviceFound',(device)=> this._addUpdateDevice(device));
		this._deviceDiscoverer.on('error',(error) => this._error(error));
	},
	search: function search() {
		this._isSearching = true;
		if (this._searchTimeout) {
			//if there is a currently running search
			timers.clearTimeout(this._searchTimeout);
			this._searchTimeout = null;
		}

		this._staleDevices = this.devices.slice(); //need to clone or bad shit will happen!
		this._searchTimeout = timers.setTimeout(() => this._removeStaleDevices(), 2500);
		this._deviceDiscoverer.discover();
	},
	stopSearch: function stopSearch() {
		this._deviceDiscoverer.stop();
		this._isSearching = false;
	},
	_removeStaleDevices: function _removeStaleDevices() {
		this._isSearching = false;
		this._staleDevices.forEach(staleDevice => {
			if (this.devices.some(x=> x.address.href === staleDevice.address.href)) {
				this.devices = this.devices.filter(x=> x.address.href !== staleDevice.address.href);
				emit(this, "removedevice", staleDevice);
			}
		});
		this._staleDevices = [];
	},
	_addUpdateDevice: function _addUpdateDevice(device){
		if (this._isSearching && this._staleDevices.some(x=> x.address.href === device.address.href)) {
			this._staleDevices = this._staleDevices.filter(x=> x.address.href !== device.address.href);
			emit(this, 'updatedevice', device);
		}
		if (this.devices.some(x=> x.address.href === device.address.href)) return;
		this.devices.push(device);
		device.on('additionalInformationFound', ()=> {
			emit(this, 'updatedevice', device);
		});
		emit(this, 'devicefound', device);
	},
	_error: function _error(error){
		console.log(error);
	}
});

/**
 *
 */
exports.Searcher = Searcher;