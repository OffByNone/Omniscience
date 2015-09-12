window.omniscience.controller('LoggerController', function LoggerController($scope) {
	"use strict";

	$scope.maxHeight = Number(document.documentElement.clientHeight) - Number(document.getElementById("navbar"));
	$scope.maxWidth = "";
});