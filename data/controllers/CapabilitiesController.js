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
		$scope.mediums = protocolInfo.map(x => x.contentFormat.medium).filter((value, index, self) => self.indexOf(value) === index);
		$scope.protocolInfo = protocolInfo;
		$scope.protocolInfoFilter = $scope.medium[0];
	});
	//todo: there is probably a better/faster/easier to read way to get the unique values out

	connectionManagerService.subscribe(
		function GenericEventCallback(eventXmlAsString) {
			console.log("Generic Event Received for connection manager");
			console.log(eventXmlAsString);
		}, function lastChangeEventCallback(lastChangeEventObj) {
			console.log("Last Change Event Received for connection manager");
			console.log(lastChangeEventObj);
		}
	);

	$scope.$on('$destroy', () => connectionManagerService.unsubscribe());
});

