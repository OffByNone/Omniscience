let button;
let tab;
let deviceService;
let simpleServer;
/**
 * extension startup
 */
module.exports.main = function main() {
	const CompositionRoot = require('./CompositionRoot');
	let compositionRoot = new CompositionRoot();

	let serviceExecutor = compositionRoot.getServiceExecutor();
	simpleServer = compositionRoot.createSimpleServer();
	let port = simpleServer.start();

	console.log("server started on port:" + port);

	let storageService = compositionRoot.createStorageService();
	storageService.get("devices").then((devices) => {
		compositionRoot.createDeviceService().then((ds) => {
			deviceService = ds;
			if (Array.isArray(devices))
				deviceService.devices = devices;
			deviceService.search();
			let frontEndBridge = compositionRoot.createFrontEndBridge(deviceService, serviceExecutor, simpleServer);
			button = compositionRoot.createButton();
			tab = compositionRoot.createTab(button, frontEndBridge);
		});
	});
};
/**
 * extension shutdown
 */
require("sdk/system/unload").when(function (reason) {
	if (button) button.remove();
	if (deviceService) deviceService.stop();
	if (simpleServer) simpleServer.stop();
	//close tab if open
	//todo: loop over devices and unsubscribe from all events
	//check if uninstall/disable, if so remove saved data
});