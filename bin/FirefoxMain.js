'use strict';

var button;
/**
 * extension startup
 */
module.exports.main = function main() {
	var CompositionRoot = require('./CompositionRoot');
	var SdkResolver = require('omniscience-sdk-resolver');
	var sdkResolver = new SdkResolver();
	var compositionRoot = new CompositionRoot(sdkResolver.resolve());

	var serviceExecutor = compositionRoot.createServiceExecutor();
	var httpServer = compositionRoot.createHttpServer();
	httpServer.start();

	compositionRoot.createDeviceService(serviceExecutor).then(function (deviceService) {
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