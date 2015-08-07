(function () {
	'use strict';
	window.omniscience = angular.module('omniscience', ['ngRoute', 'ui.bootstrap-slider'], function ($provide) {
		// Prevent Angular from sniffing for the history API
		// since it's not supported in chrome packaged apps.
		try {
			$provide.decorator('$window', function ($delegate) {
				$delegate.history = null;
				return $delegate;
			});
		}
		catch (err) {
			//here for firefox
		}
	});

	omniscience.config(function omniscience($routeProvider, $locationProvider, $compileProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'templates/Home.html',
				controller: 'HomeController'
			})
			.when('/home', {
				templateUrl: 'templates/Home.html',
				controller: 'HomeController'
			})
			.when('/about', {
				templateUrl: 'templates/About.html',
				controller: 'AboutController'
			})
			.when('/device/:deviceId', {
				templateUrl: 'templates/Device.html',
				controller: 'DeviceController'
			})
			.otherwise({ redirectTo: '/home' });
		$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|file|blob|ftp|mailto|resource|filesystem:chrome-extension|blob:chrome-extension|chrome‌​-extension|unsafe:chrome-extension):/);
	});
})();