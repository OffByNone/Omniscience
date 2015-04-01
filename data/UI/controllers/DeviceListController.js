rotaryApp.controller('DeviceListController', function DeviceListController($scope, eventService, pubSub) {
	"use strict";

	eventService.emit("loadDevices");
});