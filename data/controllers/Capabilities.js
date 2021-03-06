﻿window.omniscience.controller('CapabilitiesController', function CapabilitiesController($scope, persistenceService, connectionManagerService) {
	"use strict";

	$scope.currentConnectionInfo = {};
	$scope.currentConnectionIds = {};
	$scope.protocolInfo = [];

	$scope.setProtocolInfoFilter = function (newFilter) {
		$scope.protocolInfoFilter = newFilter;
	};

	$scope.mediums = [];

	connectionManagerService.getCurrentConnectionInfo().then(currentConnectionInfo => $scope.currentConnectionInfo = currentConnectionInfo);
	function parseProtocolInfo(rawProtocolInfo) {
		var protocolInfo = connectionManagerService.parseProtocolInfo(rawProtocolInfo);

		$scope.mediums = protocolInfo.map(x => x.contentFormat.medium).filter((value, index, self) => self.indexOf(value) === index); //todo: better/faster/easier way to get unique medium values
		$scope.protocolInfo = protocolInfo;
		$scope.protocolInfo.forEach(item => {
			item.additionalInfoFlags = [];
			if (item.additionalInfo && typeof item.additionalInfo.flags === "object") {
				for (var key in item.additionalInfo.flags) {
					if (item.additionalInfo.flags[key])
						item.additionalInfoFlags.push(key);
				}
				delete item.additionalInfo.flags;
			}
		});

		$scope.protocolInfoFilter = $scope.mediums[0];
	}


	connectionManagerService.subscribe((eventArray) => {
		if (!Array.isArray(eventArray)) return;

		eventArray.forEach(eventObj => {
			if (eventObj.hasOwnProperty("currentconnectioninfo"))
				$scope.currentConnectionInfo = eventObj.currentConnectionInfo;
			if (eventObj.hasOwnProperty("currentconnectionids"))
				$scope.currentConnectionIds = eventObj.currentConnectionIds;
			if (typeof eventObj.sourceprotocolinfo === "string")
				parseProtocolInfo(eventObj.sourceprotocolinfo);
			if (typeof eventObj.sinkprotocolinfo === "string")
				parseProtocolInfo(eventObj.sinkprotocolinfo);
		});
	}, null);

	$scope.$on('$destroy', () => connectionManagerService.unsubscribe());
});

