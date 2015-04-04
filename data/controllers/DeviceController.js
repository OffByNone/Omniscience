omniscience.controller('DeviceController', function DeviceController($scope, $routeParams, $rootScope, $injector, eventService, pubSub) {
	"use strict";

	$scope.deviceId = $routeParams.deviceId;
	$scope.device = $rootScope.devices.filter(device => device.id === $scope.deviceId)[0] || {};
	$scope.hasService = function hasService(serviceName) {
		if ($scope.device && Array.isArray($scope.device.services))
			return $scope.device.services.some(service => service.type.name === serviceName);

		return false;
	};

	$scope.$on('keydown', function (notSureWhatThisIs, event) {
		if (event.target.tagName.toLowerCase() === "input") return;

		switch (event.key.toLowerCase()) {
			case " ":
				$scope.togglePlayState($scope.device);
				break;
			case "arrowright":
				$scope.next();
				break;
			case "arrowleft":
				$scope.previous();
				break;
			case "delete":
				if ($scope.track.file) pubSub.pub("remove", $scope.device);
				break;
		}
	});

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