/**
 * extension startup
 */

module.exports.main = function main() {
	const timers = require('sdk/timers'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers
	const notifications = require('sdk/notifications'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications

	const { CompositionRoot } = require('./CompositionRoot');
	var compositionRoot = new CompositionRoot();

	var deviceLocatorService = compositionRoot.createDeviceLocatorService()

	var button = compositionRoot.createButton();
	var tab = compositionRoot.createTab();

	tab.on("refreshDevices", () => deviceLocatorService.search());
	tab.on("loadDevices", () => deviceLocatorService.devices.forEach(device => tab.emit( 'deviceFound', device )));
    tab.on("updateState", (deviceId, serviceName, state) => {
    	var deviceToUpdate = deviceLocatorService.devices.filter(device => device.id === deviceId)[0];
    	if(deviceToUpdate && deviceToUpdate[serviceName])
    		deviceToUpdate[serviceName].state = state;
    });

    button.on('change', (state) => {
        if (state.checked) {
            deviceLocatorService.search();
            tab.openFocus();
        }
    });

	deviceLocatorService.on('deviceLost', (device) => tab.emit('deviceLost', device));
	deviceLocatorService.on('deviceFound', (device, isNew) => {
		if(isNew) {
            notifications.notify({
                title: 'Found ' + device.name,
                text: "a " + device.model.name + " by " + device.manufacturer.name,
                iconURL: device.icons.length > 0 && device.icons[0].url ? device.icons[0].url.href : './icons/logo_64.png'
            });
        }

        tab.emit( 'deviceFound', device );
	});

	deviceLocatorService.search();

};
/**
 * extension shutdown
 */
module.exports.onUnload = function onUnload() {
	//todo: loop over devices and unsubscribe from all events
};
