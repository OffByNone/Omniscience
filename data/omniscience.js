'use strict';
var omniscience = angular.module('omniscience', ['ngRoute', 'ui.bootstrap-slider']);

omniscience.config(function omniscience($routeProvider, $locationProvider, $compileProvider) {
	$routeProvider
		.when('/', {
			templateUrl : 'templates/Home.html',
			controller  : 'HomeController'
		})
		.when('/home', {
			templateUrl : 'templates/Home.html',
			controller  : 'HomeController'
		})
		.when('/about', {
			templateUrl : 'templates/About.html',
			controller  : 'AboutController'
		})
		.when('/device/:deviceId', {
			templateUrl : 'templates/Device.html',
			controller  : 'DeviceController'
		})
        .otherwise({redirectTo: '/home'});
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|blob|ftp|mailto|resource):/);
});