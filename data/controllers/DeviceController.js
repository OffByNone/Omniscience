omniscience.controller('DeviceController', function DeviceController($scope, $routeParams, $rootScope, eventService, informationService, persistenceService) {
	"use strict";

	eventService.emit("loadDevices");
	$scope.device = $rootScope.devices.filter(device => device.id === $routeParams.deviceId)[0] || {};
	informationService.init();
	$scope.hasService = function hasService(rawServiceType) {
		if ($scope.device && Array.isArray($scope.device.services))
			return $scope.device.services.some(service => service.type.raw === rawServiceType);

		return false;
	};
	$scope.device.services.forEach(informationService.put);
	//persistenceService.initialize($scope.device);
});