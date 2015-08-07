var button;
var deviceService;
/**
 * extension startup
 */
module.exports.main = function main() {
	const CompositionRoot = require('./bin/CompositionRoot');
	var compositionRoot = new CompositionRoot();

	var serviceExecutor = compositionRoot.getServiceExecutor();
	var httpServer = compositionRoot.createHttpServer();
	httpServer.start();

	compositionRoot.createDeviceService().then((ds) => {
		var deviceService = ds;
		var frontEndBridge = compositionRoot.createFrontEndBridge(deviceService, serviceExecutor, httpServer);

		button = compositionRoot.createButton();
		var tab = compositionRoot.createTab(button, frontEndBridge);
	});
};
/**
 * extension shutdown
 */
require("sdk/system/unload").when(function(reason) {
	if (button) button.remove();
	if (deviceService) deviceService.stop();
	//todo: loop over devices and unsubscribe from all events
});