omniscience.controller('CapabilitiesController', function CapabilitiesController($scope, persistenceService, connectionManagerService) {
	"use strict";

	$scope.setProtocolInfoFilter = function (newFilter) {
		$scope.protocolInfoFilter = newFilter;
	};

	$scope.state = persistenceService.load('CapabilitiesController');

	if (!Object.keys($scope.state).some(x => x)) { //empty object
		$scope.state.currentConnectionInfo = {};
		$scope.state.currentConnectionIds = {};
		$scope.state.protocolInfo = {};
	}

	function save() {
		persistenceService.save('CapabilitiesController');
	};


	connectionManagerService.getCurrentConnectionInfo().then(currentConnectionInfo => { $scope.state.currentConnectionInfo = currentConnectionInfo; save(); });
	connectionManagerService.getCurrentConnectionIds().then(currentConnectionIds => { $scope.state.currentConnectionIds = currentConnectionIds; save(); });
	connectionManagerService.getProtocolInfo().then(protocolInfo => { $scope.state.protocolInfo = protocolInfo; save(); });
});

