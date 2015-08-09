/* global chrome */

'use strict';

function _toConsumableArray(arr) {
	if (Array.isArray(arr)) {
		for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;
	} else {
		return Array.from(arr);
	}
}

chrome.app.runtime.onLaunched.addListener(function () {
	var CompositionRoot = require('./CompositionRoot');
	var compositionRoot = new CompositionRoot();

	chrome.app.window.create('../data/Chrome_Foreground.html', {
		'outerBounds': {
			'width': 400,
			'height': 500
		}
	}, function (appWindow) {
		appWindow.contentWindow.addEventListener('load', function (e) {
			var serviceExecutor = compositionRoot.getServiceExecutor();
			var httpServer = {}; //compositionRoot.createHttpServer();
			//httpServer.start();

			compositionRoot.createDeviceService().then(function (deviceService) {
				var frontEndBridge = compositionRoot.createFrontEndBridge(deviceService, serviceExecutor, httpServer);

				frontEndBridge.on('sendToFrontEnd', function (eventType) {
					for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
						data[_key - 1] = arguments[_key];
					}

					var message = { eventType: eventType, data: makeSafeForEmit.apply(undefined, data) };
					chrome.runtime.sendMessage(JSON.stringify(message), function () {});
				});

				chrome.runtime.onMessage.addListener(function (message) {
					var messageObj;
					try {
						messageObj = JSON.parse(message);
					} catch (err) {
						console.log(message);
						console.log(err);
						return;
					}
					frontEndBridge.handleMessageFromFrontEnd.apply(frontEndBridge, [messageObj.eventType].concat(_toConsumableArray(messageObj.data)));
				});
			});
		});
	});
});

function makeSafeForEmit() {
	for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
		args[_key2] = arguments[_key2];
	}

	//The panel serializes out the data object using the below two lines
	//the tab does not, therefore the same data sent to both will not appear the same unless we add the below lines
	var replacer = function replacer(key, value) {
		return typeof value === 'function' ? void 0 : value instanceof URL ? value.toString() : value;
	};
	return args.map(function (argument) {
		return JSON.parse(JSON.stringify(argument, replacer));
	});
}