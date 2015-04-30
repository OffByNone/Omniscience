omniscience.controller('DeviceController', function DeviceController($scope, $routeParams, $rootScope, eventService, informationService, subscriptionService, pubSub) {
	"use strict";

	eventService.emit("loadDevices");
	$scope.device = $rootScope.devices.filter(device => device.id === $routeParams.deviceId)[0] || {};
	$scope.eventLog = [];
	informationService.init();
	$scope.hasService = function hasService(rawServiceType) {
		if ($scope.device && Array.isArray($scope.device.services))
			return $scope.device.services.some(service => service.type.raw === rawServiceType);

		return false;
	};
	$scope.device.services.forEach(informationService.put);

	pubSub.sub("UPnPEvent", (event) => {
		$scope.eventLog.push(event);
	}, $scope);

	$scope.device.services
	.filter((service) => {
		try {
			var url = new URL(service.eventSubUrl);
			return url.hostname && url.protocol;
		} catch (error) {
			return false;
		}
	})
	.forEach((service) => subscriptionService.subscribe(service, () => { }, () => { }).then((subscriptionId) => service.subscriptionId = subscriptionId));

	$scope.$on('$destroy', function () {
		$scope.device.services
			.filter((service) => {
				try {
					var url = new URL(service.eventSubUrl);
					return url.hostname && url.protocol;
				} catch (error) {
					return false;
				}
			})
			.forEach((service) => subscriptionService.unsubscribe(service));
	});
});