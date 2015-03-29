'use strict';
var rotaryApp = angular.module('rotaryApp', ['ngRoute']);

rotaryApp.config(function rotaryApp($routeProvider, $locationProvider, $compileProvider) {
	//$locationProvider.html5Mode({enabled:true});
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