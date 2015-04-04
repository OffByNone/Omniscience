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

				//many of the below properties are found on the getAdditionalInformation search and therefore not
				//defined when the device first appears.  This means that on a subsequent search if not for the null
				//checks the devices would for a short time have incorrect information shown
				if (device.hasOwnProperty(device.videoCapable)) scopeDevice.videoCapable = device.videoCapable;
				if (device.hasOwnProperty(device.imageCapable)) scopeDevice.imageCapable = device.imageCapable;
				if (device.hasOwnProperty(device.audioCapable)) scopeDevice.audioCapable = device.audioCapable;
				if (device.hasOwnProperty(device.mirrorCapable)) scopeDevice.mirrorCapable = device.mirrorCapable;

				if (device.hasOwnProperty(device.isMuted)) scopeDevice.isMuted = device.isMuted;
				if (device.hasOwnProperty(device.volume)) scopeDevice.volume = device.volume;
				if (device.hasOwnProperty(device.presets)) scopeDevice.presets = device.presets;
				if (device.hasOwnProperty(device.currentConnectionIds)) scopeDevice.currentConnectionIds = device.currentConnectionIds;

				if (device.hasOwnProperty(device.protocolInfo)) scopeDevice.protocolInfo = device.protocolInfo;
				if (device.hasOwnProperty(device.rawDiscoveryInfo)) scopeDevice.rawDiscoveryInfo = device.rawDiscoveryInfo;
				if (device.hasOwnProperty(device.currentConnectionInfo)) scopeDevice.currentConnectionInfo = device.currentConnectionInfo;
				if (device.hasOwnProperty(device.mediaInfo)) scopeDevice.mediaInfo = device.mediaInfo;
				if (device.hasOwnProperty(device.transportInfo)) scopeDevice.transportInfo = device.transportInfo;
				if (device.hasOwnProperty(device.positionInfo)) scopeDevice.positionInfo = device.positionInfo;
				if (device.hasOwnProperty(device.deviceCapabilities)) scopeDevice.deviceCapabilities = device.deviceCapabilities;
				if (device.hasOwnProperty(device.transportSettings)) scopeDevice.transportSettings = device.transportSettings;
				if (device.hasOwnProperty(device.currentTransportActions)) scopeDevice.currentTransportActions = device.currentTransportActions;

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