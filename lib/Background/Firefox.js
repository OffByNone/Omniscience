let button;
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

	compositionRoot.createDeviceService().then((ds) => {
		deviceService = ds;
		deviceService.search();
		let frontEndBridge = compositionRoot.createFrontEndBridge(deviceService, serviceExecutor, simpleServer);

		button = compositionRoot.createButton();
		let tab = compositionRoot.createTab(button, frontEndBridge);
	});
};
/**
 * extension shutdown
 */
require("sdk/system/unload").when(function(reason) {
	if (button) button.remove();
	if (deviceService) deviceService.stop();
	if (simpleServer) simpleServer.stop();
	//todo: loop over devices and unsubscribe from all events
	//check if uninstall/disable, if so remove saved data
});