/* global angular */

(function () {
	'use strict';
	window.omniscience = angular.module('omniscience', ['ngRoute', 'ui.bootstrap-slider'], function ($provide) {
		// Prevent Angular from sniffing for the history API
		// since it's not supported in chrome packaged apps.
		if(typeof window.chrome !== "undefined")  { //only do this for chrome
			$provide.decorator('$window', function ($delegate) {
				$delegate.history = null;
				return $delegate;
			});
		}
	});

	window.omniscience.config(function omniscience($routeProvider, $locationProvider, $compileProvider) {
		$routeProvider
			.when('/', {
				templateUrl: '../templates/Home.html',
				controller: 'HomeController'
			})
			.when('/home', {
				templateUrl: '../templates/Home.html',
				controller: 'HomeController'
			})
			.when('/about', {
				templateUrl: '../templates/About.html',
				controller: 'AboutController'
			})
			.when('/device/:deviceId', {
				templateUrl: '../templates/Device.html',
				controller: 'DeviceController'
			})
			.otherwise({ redirectTo: '/home' });
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|file|resource|mailto|chrome-extension|gopher):/);
		$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|resource|data|chrome-extension|gopher):|data:image\//);
	});
})();