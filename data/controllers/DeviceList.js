omniscience.controller('DeviceListController', function DeviceListController($scope, eventService) {
	"use strict";

	eventService.emit("loadDevices");
});