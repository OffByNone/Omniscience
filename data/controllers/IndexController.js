omniscience.controller('IndexController', function IndexController($scope, $rootScope, eventService, pubSub) {
	"use strict";

	$rootScope.devices = [];
	$rootScope.deviceTypes = [];
	$rootScope.serviceTypes = [];
	$rootScope.eventLog = [];

	$rootScope.refreshDevices = function refreshDevices() {
		eventService.emit('refreshDevices');
	};
	$rootScope.loadDevices = function loadDevices() {
		eventService.emit("loadDevices");
	};

	function addUpdateDevice(device) {
		var found = false;
		$rootScope.devices.forEach(function (scopeDevice) {
			if (scopeDevice.id === device.id) {
				scopeDevice.name = device.name;

				device.services.forEach(deviceService => {
					var service = scopeDevice.services.filter(scopeDeviceService => scopeDeviceService.id === deviceService.id && (!scopeDeviceService.scpdUrl || scopeDeviceService.scpdUrl === deviceService.scpdUrl))[0];
					//Match up on Id, but a device could have two services with the same id (should probably make sure that is true), 
					//so also match the scpdUrl which means it is effectively the same service
					//but the dial devices MatchStick and Chromecast don't have scpdUrls so allow for those to be null

					if (!service) {
						scopeDevice.services.push(deviceService);
						return;
					}
					for (var i in deviceService)
						if(deviceService.hasOwnProperty(i) && service[i] !== deviceService[i])
							service[i] = deviceService[i];
				});

				found = true;
			}
		});

		if (!found) {
			device.services.forEach(service => service.htmlId = service.id.replace(/[\:\.]/g, "")); //TODO: change this to use m5d hash
			$rootScope.devices.push(device);
		}

		addTypes(device);
	}
	function removeDevice(device) {
		for (var i = $rootScope.devices.length - 1; i >= 0; i--)
			if ($rootScope.devices[i].id === device.id)
				$rootScope.devices.splice(i, 1);

		removeTypes();
	}
	function addTypes(device) {
		if (!$rootScope.deviceTypes.some(x => x.name === device.type.name && x.urn === device.type.urn))
			$rootScope.deviceTypes.push(device.type);
		device.services.forEach(service => {
			if (!$rootScope.serviceTypes.some(x=> x.name === service.type.name && x.urn === service.type.urn))
				$rootScope.serviceTypes.push(service.type);
		});
	}
	function removeTypes() {
		$rootScope.deviceTypes = $rootScope.deviceTypes.filter(deviceType => $rootScope.devices.some(device => device.type.name === deviceType.name && device.type.urn === deviceType.urn));
		$rootScope.serviceTypes = $rootScope.serviceTypes.filter(serviceType => $rootScope.devices.some(device => device.services.some(service => service.type.name === serviceType.name && service.type.urn === serviceType.urn)));
	}
	function eventOccured(device, events, request) {
		if (!events) { console.log("event is undefined"); return; }
		if (Array.isArray(events))
			events.forEach(event => {
				pubSub.pub("event", device, event, request);
				$rootScope.eventLog.push({ device: device, event: event, request: request });
			});
	}

	eventService.on('deviceLost', removeDevice);
	eventService.on('deviceFound', addUpdateDevice);
	eventService.on('EventOccured', eventOccured);
});


//device.type.urn === "urn:schemas-upnp-org:device:BinaryLight:1"