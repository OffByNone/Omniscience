"use strict";

angular.module("rotaryApp").directive("about", function () {
	return ({
		controller: "AboutController",
		link: link,
		restrict: "E",
		templateUrl: "templates/About.html"
	});

	function link(scope, element, attributes) {}
});
angular.module("rotaryApp").directive("deviceInfo", function () {
	return ({
		controller: "DeviceInfoController",
		link: link,
		restrict: "E",
		templateUrl: "templates/DeviceInfo.html"
	});

	function link(scope, element, attributes) {}
});
angular.module("rotaryApp").directive("deviceList", function () {
	return ({
		controller: "DeviceListController",
		link: link,
		replace: true,
		restrict: "E",
		templateUrl: "templates/DeviceList.html"
	});

	function link(scope, element, attributes) {}
});
angular.module("rotaryApp").directive("deviceSettings", function () {
	return ({
		controller: "DeviceSettingsController",
		link: link,
		restrict: "E",
		templateUrl: "templates/DeviceSettings.html"
	});

	function link(scope, element, attributes) {}
});
angular.module("rotaryApp").directive("playback", function () {
	return ({
		controller: "PlaylistController",
		link: link,
		restrict: "E",
		templateUrl: "templates/Playback.html"
	});

	function link(scope, element, attributes) {}
});
angular.module("rotaryApp").directive("playlist", function () {
	return ({
		controller: "PlaylistController",
		link: link,
		restrict: "E",
		templateUrl: "templates/Playlist.html"
	});

	function link(scope, element, attributes) {}
});