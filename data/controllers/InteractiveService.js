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

	$scope.showText = function (parameter) {
		return !$scope.showSelect(parameter) && !$scope.showSlider(parameter) && !$scope.showCheckbox(parameter);
	};
	$scope.showSelect = function (parameter) {
		return parameter.allowedValues.length > 0;
	};
	$scope.showSlider = function (parameter) {
		return parameter.allowedValueRange.minimum && parameter.allowedValueRange.maximum;
	};
	$scope.showCheckbox = function (parameter) {
		return parameter.backingProperty.jsType === "boolean";
	};
});