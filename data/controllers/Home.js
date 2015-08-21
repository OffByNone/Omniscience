window.omniscience.controller('HomeController', function HomeController($scope, eventService) {
	"use strict";

    eventService.emit("loadDevices");
});