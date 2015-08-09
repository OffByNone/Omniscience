"use strict";

var button = undefined;
var deviceService = undefined;
var simpleServer = undefined;
/**
 * extension startup
 */
module.exports.main = function main() {
	var CompositionRoot = require("./CompositionRoot");
	var compositionRoot = new CompositionRoot();

	var serviceExecutor = compositionRoot.getServiceExecutor();
	simpleServer = compositionRoot.createSimpleServer();
	var port = simpleServer.start();

	console.log("server started on port:" + port);

	compositionRoot.createDeviceService().then(function (ds) {
		deviceService = ds;
		deviceService.search();
		var frontEndBridge = compositionRoot.createFrontEndBridge(deviceService, serviceExecutor, simpleServer);

		button = compositionRoot.createButton();
		var tab = compositionRoot.createTab(button, frontEndBridge);
	});
};
/**
 * extension shutdown
 */
require("sdk/system/unload").when(function (reason) {
	if (button) button.remove();
	if (deviceService) deviceService.stop();
	if (simpleServer) simpleServer.stop();
	//todo: loop over devices and unsubscribe from all events
	//check if uninstall, if so remove storage
});