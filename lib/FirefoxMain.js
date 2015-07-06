var button;
/**
 * extension startup
 */
module.exports.main = function main() {
	const CompositionRoot = require('./CompositionRoot');
	var compositionRoot = new CompositionRoot();

	var serviceExecutor = compositionRoot.getServiceExecutor();
	var httpServer = compositionRoot.createHttpServer();
	httpServer.start();

	compositionRoot.createDeviceService().then((deviceService) => {
		var frontEndBridge = compositionRoot.createFrontEndBridge(deviceService, serviceExecutor, httpServer);

		button = compositionRoot.createButton();
		var tab = compositionRoot.createTab(button, frontEndBridge);
	});
};
/**
 * extension shutdown
 */
module.exports.onUnload = function onUnload() {
	if (button) button.remove();
	//todo: loop over devices and unsubscribe from all events
};
