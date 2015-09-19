window.omniscience.controller('InteractiveServiceController', function InteractiveServiceController($scope, $modal, eventService) {
	"use strict";

	$scope.openModal = function (service, method) {
		$scope.currentMethod = method;
		$scope.currentService = service;
		$modal.open({
			templateUrl: "../templates/InteractiveServiceModal.html",
			scope: $scope
		});
	};

	$scope.sendRequest = function () {
		var params = {};
		$scope.currentMethod.parameters.forEach(param => params[param.name] = param.value);

		eventService.callService($scope.currentService, $scope.currentMethod.name, params).then((response) => {
			$scope.response = JSON.stringify(response, null, 2);
		});
	}
});