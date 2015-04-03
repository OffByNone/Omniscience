"use strict";

rotaryApp.controller('ConnectionManager', function ConnectionManager($scope, connectionManagerService) {
	$scope.service = $scope.device.services.filter(service => service.type.urn === 'urn:schemas-upnp-org:service:ConnectionManager:1')[0];

	connectionManagerService.getCurrentConnectionIds($scope.service).then(response => console.log(response));
	connectionManagerService.getCurrentConnectionInfo($scope.service).then(response => console.log(response));
	connectionManagerService.getProtocolInfo($scope.service).then(response => console.log(response));
});