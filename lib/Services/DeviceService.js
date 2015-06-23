const Constants = require('../Utilities/Constants');
const Eventable = require('../Eventable');

class DeviceService extends Eventable {
	constructor(deviceFactory, deviceLocator, storageService, serviceExecutor, notifications) {
		super();
		this._deviceFactory = deviceFactory;
		this._storageService = storageService;
		this._serviceExecutor = serviceExecutor;
		this._deviceLocator = deviceLocator;
		this._notifications = notifications;

		this.devices = [];

		this._deviceLocator.on("deviceFound", (id, location, fromAddress, serverIP) => this._addDevice(id, location, fromAddress, serverIP));
		this._deviceLocator.on("deviceLost", (id) => this._removeDevice(id));
	}
	loadDevices() {
		this.devices.forEach(device => this.emit('deviceFound', device));
	}
	search() {
		this._deviceLocator.search(this.devices);
	}
	_removeDevice(id) {
		for (var i = 0; i < this.devices.length; i++) {
			if (this.devices[i].id === id) {
				var lostDevice = this.devices.splice(i, 1)[0];
				this.emit("deviceLost", lostDevice);
				this._saveDeviceList();
				return;
			}
		}
	}
	_addDevice(id, location, fromAddress, serverIP) {
		var previouslyFound = this.devices.filter(device => device.id === id)[0];

		this._deviceFactory.create(id, location, fromAddress, serverIP, previouslyFound, 0).then(device => {
			if (device === null) return;

			this._serviceExecutor.addExecutableServices(device.services);

			if (!previouslyFound) {
				this.devices.push(device);
				this._notifications.notify({
					title: 'Found ' + device.name,
					text: "a " + device.model.name + " by " + device.manufacturer.name,
					iconURL: device.icons.length > 0 && device.icons[0].url ? device.icons[0].url.href : Constants.icon['64']
				});
			}
			this._saveDeviceList();
			this.emit('deviceFound', device);
		});
	}
	_saveDeviceList() {
		this._storageService.devices = this.devices;
	}
}

module.exports = DeviceService;