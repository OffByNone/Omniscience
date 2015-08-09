/* global chrome */

chrome.app.runtime.onLaunched.addListener(() => {
	chrome.app.window.create('../data/Chrome_Foreground.html', {
		id: 'omniscience',
		'outerBounds': {
			'width': 400,
			'height': 500
		}
	},
	(appWindow) => {
		var CompositionRoot = require('./CompositionRoot');
		var compositionRoot = new CompositionRoot();

		appWindow.contentWindow.addEventListener('load', (e) => {
			var serviceExecutor = compositionRoot.getServiceExecutor();
			var httpServer = compositionRoot.createHttpServer();
			httpServer.start();

			compositionRoot.createDeviceService().then((deviceService) => {
				deviceService.search();
				var frontEndBridge = compositionRoot.createFrontEndBridge(deviceService, serviceExecutor, httpServer);

				frontEndBridge.on("sendToFrontEnd", (eventType, ...data) => {
					var message = { eventType, data: makeSafeForEmit(...data) };
					chrome.runtime.sendMessage(JSON.stringify(message),() => { });
				});

				chrome.runtime.onMessage.addListener((message) => {
					var messageObj;
					try {
						messageObj = JSON.parse(message);
					}
					catch (err) {
						console.log(message);
						console.log(err);
						return;
					}
					frontEndBridge.handleMessageFromFrontEnd(messageObj.eventType, ...messageObj.data);
				});
			});
		});
	});
});


function makeSafeForEmit(...args) {
	//The panel serializes out the data object using the below two lines
	//the tab does not, therefore the same data sent to both will not appear the same unless we add the below lines
	var replacer = (key, value) => typeof (value) === "function" ? void (0) : value instanceof URL ? value.toString() : value;

	return args.map(argument => JSON.parse(JSON.stringify(argument, replacer)));
}

