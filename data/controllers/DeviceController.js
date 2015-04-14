omniscience.controller('DeviceController', function DeviceController($scope, $routeParams, $rootScope, eventService, informationService, persistenceService, subscriptionService) {
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


	$scope.device.services
		.filter((service) => {
			try {
				var url = new URL(service.eventSubUrl);
				return url.hostname && url.protocol;
			} catch (error) {
				return false;
			}
		})
		.forEach((service) => {
			subscriptionService.subscribe(service, function GenericEventCallback(eventXmlAsString) {
				console.log("Generic Event Received");
				console.log(eventXmlAsString);
			}, function lastChangeEventCallback(lastChangeEventObj) {
				console.log("Last Change Event Received");
				console.log(lastChangeEventObj);
			}).then((subscriptionId) => service.subscriptionId = subscriptionId);
		});
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

	//persistenceService.initialize($scope.device);
});