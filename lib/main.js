var deviceLocatorService;
var httpServer;
/**
 * extension startup
 */

exports.main = function main() {
	const { storage } = require('sdk/simple-storage'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/simple-storage

	const { CompositionRoot } = require('./CompositionRoot');
	var compositionRoot = new CompositionRoot();

	deviceLocatorService = compositionRoot.createDeviceLocatorService()

	var panel = compositionRoot.createPanel();
	var button = compositionRoot.createButton();
	var tab = compositionRoot.createTab();

    panel.on('hide', () => button.check(false) );
    panel.on('openFocusTab', () => tab.openFocus() );
    tab.on("loadDevices", () => {
        deviceLocatorService.devices.forEach(device => {
            tab.emit( 'deviceFound', device );
        });
    });

    button.on('change', (state) => {
        if (state.checked) {
            //panel.show( { position: button.getButton() } );
            deviceLocatorService.search();
            tab.openFocus();
        }
    });

	deviceLocatorService.devices = storage.devices || [];
    deviceLocatorService.devices.forEach(device => {
        panel.emit('deviceFound', device);
        tab.emit('deviceFound', device);
    });

	deviceLocatorService.search();

	deviceLocatorService.on('deviceLost', (device) => {
        panel.emit('deviceLost', device);
        tab.emit('deviceLost', device);
		storage.devices = deviceLocatorService.devices;
	});

    const notifications = require('sdk/notifications'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications
	deviceLocatorService.on('deviceFound', (device, isNew) => {
		if(isNew && false) {
            notifications.notify({
                title: 'Found ' + device.name,
                text: "a " + device.model.name + " by " + device.manufacturer.name,
                iconURL: device.icons.length > 0 && device.icons[0].url ? device.icons[0].url.href : ""
            });
        }

        panel.emit( 'deviceFound', device );
        tab.emit( 'deviceFound', device );
		storage.devices = deviceLocatorService.devices;
	});
};
/**
 * extension shutdown
 */
exports.onUnload = function onUnload() {
	if(deviceLocatorService && typeof deviceLocatorService.stopSearch === "function")
        deviceLocatorService.stopSearch();
    if(httpServer && typeof httpServer.stop === 'function')
        httpServer.stop();
};
