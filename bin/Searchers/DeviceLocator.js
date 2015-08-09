'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Constants = require('../Utilities/Constants');
var Device = require('../Entities/Device');

var DeviceLocator = (function () {
	function DeviceLocator(pubSub, md5, timer, fetch, deviceFactory, activeSearcher, passiveSearcher, accessPointSearcher, storageService, serviceExecutor, notifications) {
		var _this = this;

		_classCallCheck(this, DeviceLocator);

		this._pubSub = pubSub;
		this._deviceFactory = deviceFactory;
		this._md5 = md5;
		this._timer = timer;
		this._fetch = fetch;
		this._activeSearcher = activeSearcher;
		this._passiveSearcher = passiveSearcher;
		this._accessPointSearcher = accessPointSearcher;
		this._storageService = storageService;
		this._serviceExecutor = serviceExecutor;
		this._notifications = notifications;

		this._debounceTimeout = 15000;
		this._deviceTimeouts = {};
		this.devices = [];
		this._foundButNotCreatedDevices = [];

		this._initializeSearchers();
		this._pubSub.sub('refreshDevices', function () {
			return _this.search();
		});
		this._pubSub.sub('loadDevices', function () {
			return _this.devices.forEach(function (device) {
				return _this._pubSub.pub('deviceFound', device);
			});
		});
	}

	_createClass(DeviceLocator, [{
		key: 'search',
		value: function search() {
			var _this2 = this;

			this.devices.forEach(function (device) {
				return _this2._checkForLostDevice(device);
			});
			this._activeSearcher.search();
		}
	}, {
		key: '_initializeSearchers',
		value: function _initializeSearchers() {
			var _this3 = this;

			this.devices = this._storageService.devices || [];

			this._accessPointSearcher.search(); //this will start a repeating search
			this._pubSub.sub('searcher.found', function (headers, ignoreDebounce) {
				return _this3._deviceFound(headers, ignoreDebounce);
			});
			this._pubSub.sub('searcher.lost', function (headers) {
				_this3._removeLostDevice(headers.usn.split('::')[0]);
			});
		}
	}, {
		key: '_checkForLostDevice',
		value: function _checkForLostDevice(device) {
			var _this4 = this;

			this._fetch(device.ssdpDescription).then(function (response) {}, function (response) {
				/*pinging device errored out, consider lost.*/
				//todo: actually pinging would be better than downloading their ssdp description.
				//is this going to create too much network traffic at once?
				_this4._removeLostDevice(device.id);
			});
		}
	}, {
		key: '_removeLostDevice',
		value: function _removeLostDevice(deviceId) {
			for (var i = 0; i < this.devices.length; i++) {
				if (this.devices[i].id === deviceId) {
					var lostDevice = this.devices.splice(i, 1)[0];
					this._deviceTimeouts[lostDevice.id] = null;
					this._pubSub.pub('deviceLost', lostDevice);
					i--;
				}
			}
			this._storageService.devices = this.devices;
		}
	}, {
		key: '_deviceFound',
		value: function _deviceFound(headers, ignoreDebounce) {
			var _this5 = this;

			var id = Constants.uuidRegex.exec(headers.usn)[1];

			this._timer.clearTimeout(this._deviceTimeouts[id]);
			var previouslyFound = this.devices.filter(function (device) {
				return device.id === id;
			})[0];

			if (previouslyFound && previouslyFound.lastDeviceFoundResponse >= (Date.now() - this._debounceTimeout && ignoreDebounce)) return this._updateTimeoutInformation(previouslyFound, headers['cache-control']);

			var theDevice = previouslyFound;
			if (!theDevice) {
				//todo: this feels ugly and wrong.  Find a better way to do this
				//this is here to stop a race condition where the device announces itself multiple times
				//faster than the device factory can create a new device
				//this also ensures that when a device is updated the updated info ends up in this.devices
				theDevice = new Device();
				theDevice.id = id;
				theDevice.fromAddress = headers.fromAddress;
				this.devices.push(theDevice);
			}

			this._deviceFactory.create(headers.location, headers, theDevice, 0).then(function (device) {
				if (device === null) return;

				_this5._serviceExecutor.addExecutableServices(device.services);
				device.lastDeviceFoundResponse = Date.now();
				var isNew = previouslyFound == null;

				_this5._updateTimeoutInformation(device, headers['cache-control']);
				if (isNew) {
					_this5._notifications.notify({
						title: 'Found ' + device.name,
						text: 'a ' + device.model.name + ' by ' + device.manufacturer.name,
						iconURL: device.icons.length > 0 && device.icons[0].url ? device.icons[0].url.href : Constants.icon['64']
					});
				}

				_this5._pubSub.pub('deviceFound', device);
			});
		}
	}, {
		key: '_updateTimeoutInformation',
		value: function _updateTimeoutInformation(device, cacheControl) {
			var _this6 = this;

			device.lastResponse = Date.now();
			this._storageService.devices = this.devices;
			if (!cacheControl) return;

			var waitTime = cacheControl.split('=')[1] * 1000;
			this._deviceTimeouts[device.id] = this._timer.setTimeout(function () {
				return _this6._checkForLostDevice(device);
			}, waitTime);
		}
	}]);

	return DeviceLocator;
})();

module.exports = DeviceLocator;
/*we heard back from device, do nothing.*/