rotaryApp.controller('HomeController', function HomeController($scope, eventService, pubSub) {
	"use strict";

    eventService.emit("loadDevices");
});