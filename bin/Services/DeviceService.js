'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Constants = require('../Utilities/Constants');
var Eventable = require('../Eventable');

var DeviceService = (function (_Eventable) {
	function DeviceService(deviceFactory, deviceLocator, storageService, serviceExecutor, notifications) {
		var _this = this;

		_classCallCheck(this, DeviceService);

		_get(Object.getPrototypeOf(DeviceService.prototype), 'constructor', this).call(this);
		this._deviceFactory = deviceFactory;
		this._storageService = storageService;
		this._serviceExecutor = serviceExecutor;
		this._deviceLocator = deviceLocator;
		this._notifications = notifications;

		this.devices = [];

		this._deviceLocator.on('deviceFound', function (id, location, fromAddress, serverIP) {
			return _this._addDevice(id, location, fromAddress, serverIP);
		});
		this._deviceLocator.on('deviceLost', function (id) {
			return _this._removeDevice(id);
		});
	}

	_inherits(DeviceService, _Eventable);

	_createClass(DeviceService, [{
		key: 'loadDevices',
		value: function loadDevices() {
			var _this2 = this;

			this.devices.forEach(function (device) {
				return _this2.emit('deviceFound', device);
			});
		}
	}, {
		key: 'search',
		value: function search() {
			this._deviceLocator.search(this.devices);
		}
	}, {
		key: '_removeDevice',
		value: function _removeDevice(id) {
			for (var i = 0; i < this.devices.length; i++) {
				if (this.devices[i].id === id) {
					var lostDevice = this.devices.splice(i, 1)[0];
					this.emit('deviceLost', lostDevice);
					this._saveDeviceList();
					return;
				}
			}
		}
	}, {
		key: '_addDevice',
		value: function _addDevice(id, location, fromAddress, serverIP) {
			var _this3 = this;

			var previouslyFound = this.devices.filter(function (device) {
				return device.id === id;
			})[0];

			this._deviceFactory.create(id, location, fromAddress, serverIP, previouslyFound, 0).then(function (device) {
				if (device === null) return;

				_this3._serviceExecutor.addExecutableServices(device.services);

				if (!previouslyFound) {
					_this3.devices.push(device);
					_this3._notifications.notify({
						title: 'Found ' + device.name,
						text: 'a ' + device.model.name + ' by ' + device.manufacturer.name,
						iconURL: device.icons.length > 0 && device.icons[0].url ? device.icons[0].url.href : Constants.icon['64']
					});
				}
				_this3._saveDeviceList();
				_this3.emit('deviceFound', device);
			});
		}
	}, {
		key: '_saveDeviceList',
		value: function _saveDeviceList() {
			this._storageService.devices = this.devices;
		}
	}]);

	return DeviceService;
})(Eventable);

module.exports = DeviceService;