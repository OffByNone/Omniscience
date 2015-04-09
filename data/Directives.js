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
		link: link,
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


angular.module("omniscience").directive("connectionManager", function () {
	return ({
		controller: "ConnectionManager",
		link: link,
		restrict: "E",
		templateUrl: "templates/ConnectionManager.html"
	});

	function link(scope, element, attributes) {}
});