omniscience.controller('CapabilitiesController', function CapabilitiesController($scope, persistenceService, connectionManagerService) {
	"use strict";

	$scope.currentConnectionInfo = {};
	$scope.currentConnectionIds = {};
	$scope.protocolInfo = {};

	$scope.setProtocolInfoFilter = function (newFilter) {
		$scope.protocolInfoFilter = newFilter;
	};

	$scope.mediums = [];

	connectionManagerService.getCurrentConnectionInfo().then(currentConnectionInfo => $scope.currentConnectionInfo = currentConnectionInfo);
	connectionManagerService.getCurrentConnectionIds().then(currentConnectionIds => $scope.currentConnectionIds = currentConnectionIds);
	connectionManagerService.getProtocolInfo().then(protocolInfo => {
		$scope.mediums = protocolInfo.map(x => x.contentFormat.medium).filter((value, index, self) => self.indexOf(value) === index); //todo: better/faster/easier way to get unique medium values
		$scope.protocolInfo = protocolInfo;
		$scope.protocolInfoFilter = $scope.mediums[0];
	});


	connectionManagerService.subscribe((eventXmlAsString) => {/*todo: something here*/}, null);

	$scope.$on('$destroy', () => connectionManagerService.unsubscribe());
});

