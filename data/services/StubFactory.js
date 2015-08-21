window.omniscience.factory('stubFactory', function ($rootScope, eventService) {
	"use strict";
	return {
		createServiceStub: function (serviceName, methods) {
			var serviceStub = `omniscience.factory(${serivceName}, function ($rootScope, eventService) {
				return {`;

			serviceStub += methods.map(method => {
				methodStub += `${method.name}: function (service, `;
				methodStub += method.parameters.map(parameter => parameter.name).join(", ") + "){";
				var paramsObject = method.parameters.map(parameter => `${parameter.name}: ${parameter.name}`).join(", ");
				methodStub += `return eventService.callService(service, "${method.name}", ${paramsObject}); }`;
			}).join(", ");

			serviceStub += `};
			}); `;
		},
		createControllerStub: function (serviceName, methods, rawServiceType) {
			var controllerStub = `omniscience.controller("${serviceName}", function ConnectionManager($scope, ${serviceName}Service) {
				"use strict";

				$scope.service = $scope.device.services.filter(service => service.type.raw === "${rawServiceType}")[0];

				//sample calls
				`;

			var methodStubs = methods.map(method => {
				methodStub = `${serviceName}Service.${method.name}($scope.service, `;
				methodStub += method.parameters.map(parameter => parameter.name).join(", ") + ")";
				methodStub += ".then(response => console.log(response));"
			}).reduce((prev, curr) => prev + "\n" + curr);

			controllerStub += methodStubs + "\n});";
			return controllerStub;
		},
		createDirectiveStub: function (serviceName) {
			return `angular.module("omniscience").directive("${serviceName}", function () {
						return ({
							controller: "${serviceName}Controller",
							link: link,
							replace: true,
							restrict: "E",
							templateUrl: "../templates/${serviceName}.html"
						});

						function link(scope, element, attributes) { }
					}); `;
		}
	};
});