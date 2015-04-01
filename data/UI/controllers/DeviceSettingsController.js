rotaryApp.controller('DeviceSettingsController', function DeviceSettingsController($scope, eventService, pubSub) {
	"use strict";

	$scope.setName = function setName(device, name) {
		eventService.emit('setName', device, name);
	};
	$scope.setTimezone = function setTimezone(device, timezone) {
		eventService.emit('setTimezone', device, timezone);
	};
	$scope.setLanguage = function setLanguage(device, language) {
		eventService.emit('setLanguage', device, language);
	};
	$scope.setWiFi = function setWiFi(device, wifiSettings) {
		eventService.emit('setWiFi', device, wifiSettings);
	};
	$scope.setScale = function setScale(device, scale) {
		eventService.emit('setScale', device, scale);
	};
	$scope.setTimeSync = function setTimeSync(device, timeSync) {
		eventService.emit('setTimeSync', device, timeSync);
	};
	$scope.setUSBMode = function setUSBMode(device, usbMode) {
		eventService.emit('setUSBMode', device, usbMode);
	};
	$scope.reboot = function reboot(device) {
		eventService.emit('reboot', device);
	};
	$scope.reset = function reset(device) {
		eventService.emit('reset', device);
	};
	$scope.isUpdateAvailable = function isUpdateAvailable(device) {
		eventService.emit('isUpdateAvailable', device);
	};
	$scope.applyUpdate = function (device) {
		eventService.emit('applyUpdate', device);
	};
});