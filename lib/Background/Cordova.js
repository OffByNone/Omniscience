
let CompositionRoot = require('../CompositionRoot');
let compositionRoot = new CompositionRoot();

let serviceExecutor = compositionRoot.getServiceExecutor();
let simpleServer = compositionRoot.createSimpleServer();
let port = simpleServer.start();
console.log("server started on port:" + port);

compositionRoot.createDeviceService().then((deviceService) => {
	deviceService.search();
	let frontEndBridge = compositionRoot.createFrontEndBridge(deviceService, serviceExecutor, simpleServer);

	frontEndBridge.on("sendToFrontEnd", (eventType, ...data) => {
		let message = JSON.stringify({ eventType, data: makeSafeForEmit(...data) });
		window.parent.postMessage(message, "*");
	});
	window.addEventListener("message", (event) => frontEndBridge.onMessageFromFrontEnd(event.data));
});

function makeSafeForEmit(...args) {
	//The panel serializes out the data object using the below two lines
	//the tab does not, therefore the same data sent to both will not appear the same unless we add the below lines
	let replacer = (key, value) => typeof (value) === "function" ? void (0) : value instanceof URL ? value.toString() : value;

	return args.map(argument => JSON.parse(JSON.stringify(argument, replacer)));
}

