omniscience.controller('DeviceController', function DeviceController($scope, $routeParams, $rootScope, eventService, pubSub, informationService, persistenceService) {
	"use strict";

	eventService.emit("loadDevices");
	$scope.device = $rootScope.devices.filter(device => device.id === $routeParams.deviceId)[0] || {};
	$scope.hasService = function hasService(rawServiceType) {
		if ($scope.device && Array.isArray($scope.device.services))
			return $scope.device.services.some(service => service.type.raw === rawServiceType);

		return false;
	};
	$scope.device.services.forEach(informationService.put);
	persistenceService.initialize($scope.device);

	if (!$scope.protocolInfoFilter) { //todo: I don't like this.  Find a better way to show the first available capability
		if ($scope.device.capabilities.video)
			$scope.protocolInfoFilter = 'video';
		else if ($scope.device.capabilities.audio)
			$scope.protocolInfoFilter = 'audio';
		else if ($scope.device.capabilities.image)
			$scope.protocolInfoFilter = 'image';
		else if ($scope.device.capabilities.mirror)
			$scope.protocolInfoFilter = 'mirror';
	}
});