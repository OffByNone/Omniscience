omniscience.controller('DeviceListController', function DeviceListController($scope, eventService, $q) {
	"use strict";
	eventService.emit("loadDevices");
	eventService.emit("refreshDevices");
});