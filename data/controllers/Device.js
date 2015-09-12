window.omniscience.controller('DeviceController', function DeviceController($scope, $routeParams, $rootScope, $timeout, eventService, informationService, subscriptionService, loggerService) {
	"use strict";

	informationService.init();
	$scope.eventLog = [];
	$scope.subscriptions = {};


	$scope.hasService = function hasService(rawServiceType) {
		if ($scope.device && Array.isArray($scope.device.services))
			return $scope.device.services.some(service => service.type.raw === rawServiceType);

		return false;
	};

	$scope.isMatchStick = function isMatchStick() {
		if ($scope.device && $scope.device.model && $scope.device.manufacturer)
			return $scope.device.model.name === "MatchStick" && $scope.device.manufacturer.name === "openflint";

		return false;
	};

	function getDevice() {
		var device = $rootScope.devices.filter(device => device.id === $routeParams.deviceId)[0];
		if (!device) return $timeout(() => getDevice(), 100);

		$scope.device = device || {};
		$scope.device.services.forEach(informationService.put);
		$scope.device.services
		.filter((service) => {
			try {
				var url = new URL(service.eventSubUrl);
				return url.hostname && url.protocol;
			} catch (error) {
				return false;
			}
		})
		.forEach((service) => subscriptionService.subscribe(service,
				(subEvents) => {
					var loggable = {};
					loggable[service.type.name] = subEvents;
					loggerService.log(loggable);
				},
				(subEvents) => {
					var loggable = {};
					loggable[service.type.name] = subEvents;
					loggerService.log(loggable);
				})
			.then((subscriptionId) => $scope.subscriptions[service.hash] = subscriptionId));
	}

	getDevice();

	$scope.$on('$destroy', function () {
		for (var serviceHash in $scope.subscriptions) {
			if ($scope.subscriptions.hasOwnProperty(serviceHash)) {
				var service = $scope.device.services.filter(deviceService => serviceHash === deviceService.hash)[0];
				subscriptionService.unsubscribe(service.hash, $scope.subscriptions[serviceHash], service.eventSubUrl);
				delete $scope.subscriptions[serviceHash];
			}
		}
	});
});