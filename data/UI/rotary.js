'use strict';
var rotaryApp = angular.module('rotaryApp', ['ngRoute']);

rotaryApp.config(function rotaryApp($routeProvider, $locationProvider, $compileProvider) {
	//$locationProvider.html5Mode({enabled:true});
	$routeProvider
		.when('/', {
			templateUrl : 'templates/home.html',
			controller  : 'HomeController'
		})
		.when('/home', {
			templateUrl : 'templates/home.html',
			controller  : 'HomeController'
		})
		.when('/about', {
			templateUrl : 'templates/about.html',
			controller  : 'aboutController'
		})
		.when('/device/:deviceId', {
			templateUrl : 'templates/device.html',
			controller  : 'DeviceController'
		})
        .otherwise({redirectTo: '/home'});
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|blob|ftp|mailto|resource):/);
    
});