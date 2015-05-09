"use strict";

angular.module("omniscience").directive("about", function () {
	return ({
		controller: "AboutController",
		link: link,
		restrict: "E",
		templateUrl: "templates/About.html"
	});

	function link(scope, element, attributes) {}
});
angular.module("omniscience").directive("deviceInfo", function () {
	return ({
		controller: "DeviceInfoController",
		link: link,
		restrict: "E",
		templateUrl: "templates/DeviceInfo.html"
	});

	function link(scope, element, attributes) {}
});
angular.module("omniscience").directive("deviceList", function () {
	return ({
		controller: "DeviceListController",
		link: link,
		replace: true,
		restrict: "E",
		templateUrl: "templates/DeviceList.html"
	});

	function link(scope, element, attributes) {}
});
angular.module("omniscience").directive("deviceSettings", function () {
	return ({
		controller: "DeviceSettingsController",
		link: link,
		restrict: "E",
		templateUrl: "templates/DeviceSettings.html"
	});

	function link(scope, element, attributes) {}
});
angular.module("omniscience").directive("playback", function () {
	return ({
		controller: "PlaybackController",

		restrict: "E",
		templateUrl: "templates/Playback.html"
	});

	function link(scope, element, attributes) {}
});
angular.module("omniscience").directive("playlist", function () {
	return ({
		controller: "PlaylistController",
		link: link,
		restrict: "E",
		templateUrl: "templates/Playlist.html"
	});

	function link(scope, element, attributes) {}
});
angular.module("omniscience").directive("capabilities", function () {
	return ({
		controller: "CapabilitiesController",
		link: link,
		restrict: "E",
		templateUrl: "templates/Capabilities.html"
	});

	function link(scope, element, attributes) { }
});