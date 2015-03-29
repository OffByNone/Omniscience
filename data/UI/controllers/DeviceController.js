rotaryApp.controller('DeviceController', function DeviceController($scope, $routeParams, $interval, $rootScope, eventService, pubSub) {
	"use strict";

	$scope.deviceId = $routeParams.deviceId;
	$scope.device = $rootScope.devices.filter(device => device.id === $scope.deviceId)[0] || {};
	$scope.interval = $interval(() => eventService.emit('getPositionInfo', $scope.device), 1000);

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
		if ($scope.device.videoCapable)
			$scope.protocolInfoFilter = 'video';
		else if ($scope.device.audioCapable)
			$scope.protocolInfoFilter = 'audio';
		else if ($scope.device.imageCapable)
			$scope.protocolInfoFilter = 'image';
		else if ($scope.device.mirrorCapable)
			$scope.protocolInfoFilter = 'mirror';
	}
});