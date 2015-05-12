const Constants = require('../Utilities/Constants');

class DeviceLocator {
	constructor(eventer, md5, timer, fetch, deviceFactory, activeSearcher, passiveSearcher, accessPointSearcher, storageService, serviceExecutor) {
		this._eventer = eventer;
		this._deviceFactory = deviceFactory;
		this._md5 = md5;
		this._timer = timer;
		this._fetch = fetch;
		this._activeSearcher = activeSearcher;
		this._passiveSearcher = passiveSearcher;
		this._accessPointSearcher = accessPointSearcher;
		this._storageService = storageService;
		this._serviceExecutor = serviceExecutor;

		this._debounceTimeout = 15000;
		this._deviceTimeouts = {};
		this.devices = [];

		this._initializeSearchers();
	}
	search() {
		this.devices.forEach((device) => this._checkForLostDevice(device));
		this._activeSearcher.search();
	}
	_initializeSearchers() {
		this.devices = this._storageService.devices || [];

		this._accessPointSearcher.search(); //this will start a repeating search
		this._eventer.on("searcher.found", (headers) => this._deviceFound(headers));
		this._eventer.on("searcher.lost", (headers) => this._deviceLost(headers));
	}
	_checkForLostDevice(device) {
		this._fetch(device.ssdpDescription).then(
			() => { /*we heard back from device, do nothing.*/ },
			() => { /*pinging device errored out, consider lost.*/
				//todo: actually pinging would be better than downloading their ssdp description.
				//is this going to create too much network traffic at once?
				this._removeLostDevice(device.id);
			});
	}
	_removeLostDevice(deviceId) {
		for (var i = 0; i < this.devices.length; i++) {
			if (this.devices[i].id === deviceId) {
				var lostDevice = this.devices.splice(i, 1);
				this._deviceTimeouts[deviceId] = null;
				this._eventer.emit("deviceLocator.remove", lostDevice[0]);
				i--;
			}
		}
		this._storageService.devices = this.devices;
	}
	_deviceFound(headers, ignoreDebounce) {
		var id = this._md5(headers.location);
		this._timer.clearTimeout(this._deviceTimeouts[id]);
		var previouslyFound = this.devices.filter(device => device.id === id)[0];

		if (previouslyFound && previouslyFound.lastDeviceFoundResponse >= (Date.now() - this._debounceTimeout && ignoreDebounce))
			return this._updateTimeoutInformation(previouslyFound, headers["cache-control"]);

		this._deviceFactory.create(headers.location, headers, previouslyFound, 0).then(device => {
			if (device === null) return;

			this._serviceExecutor.addExecutableServices(device.services);
			device.lastDeviceFoundResponse = Date.now();
			var isNew = previouslyFound == null;
			if (isNew) this.devices.push(device);

			this._updateTimeoutInformation(device, headers["cache-control"])
			this._eventer.emit('deviceLocator.addUpdate', device, isNew);
		});
	}
	_updateTimeoutInformation(device, cacheControl) {
		device.lastResponse = Date.now();
		this._storageService.devices = this.devices;
		if (!cacheControl) return;

		var waitTime = cacheControl.split("=")[1] * 1000;
		this._deviceTimeouts[device.id] = this._timer.setTimeout(() => this._checkForLostDevice(device), waitTime);
	}
}

module.exports = DeviceLocator;