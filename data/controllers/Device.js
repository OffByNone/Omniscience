omniscience.controller('DeviceController', function DeviceController($scope, $routeParams, $rootScope, $timeout, eventService, informationService, subscriptionService) {
    "use strict";

    eventService.emit("loadDevices");
    informationService.init();
    $scope.eventLog = [];

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
				(subEvents) => $scope.eventLog.push({ timestamp: new Date(Date.now()).toLocaleTimeString(), service, subEvents }),
				(subEvents) => $scope.eventLog.push({ timestamp: new Date(Date.now()).toLocaleTimeString(), service, subEvents }))
			.then((subscriptionId) => service.subscriptionId = subscriptionId));
	}

	getDevice();

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
			.forEach((service) => subscriptionService.unsubscribe(service.hash, service.subscriptionId, service.eventSubUrl));
	});
});