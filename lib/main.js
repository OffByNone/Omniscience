var button;
/**
 * extension startup
 */

module.exports.main = function main() {
    const timers = require('sdk/timers'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers
    const notifications = require('sdk/notifications'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications
    const Constants = require('./Utilities/Constants');
    const CompositionRoot = require('./CompositionRoot');
    var compositionRoot = new CompositionRoot();

    compositionRoot.createDeviceLocatorService().then((deviceLocatorService) => {

        button = compositionRoot.createButton();
        button.on('change', (state) => {
            if (!state || state.checked) {
                deviceLocatorService.search();
                tab.openFocus();
            }
        });

        var tab = compositionRoot.createTab();

        tab.on("refreshDevices", () => deviceLocatorService.search());
        tab.on("loadDevices", () => deviceLocatorService.devices.forEach(device => tab.emit('deviceFound', device)));
        tab.on("updateState", (deviceId, serviceName, state) => {
            var deviceToUpdate = deviceLocatorService.devices.filter(device => device.id === deviceId)[0];
            if (deviceToUpdate && deviceToUpdate[serviceName])
                deviceToUpdate[serviceName].state = state;
        });

        deviceLocatorService.on('deviceLost', (device) => tab.emit('deviceLost', device));
        deviceLocatorService.on('deviceFound', (device, isNew) => {
            if (isNew) {
                notifications.notify({
                    title: 'Found ' + device.name,
                    text: "a " + device.model.name + " by " + device.manufacturer.name,
                    iconURL: device.icons.length > 0 && device.icons[0].url ? device.icons[0].url.href : Constants.icon['64']
                });
            }

            tab.emit('deviceFound', device);
        });

        deviceLocatorService.search();
    });
};
/**
 * extension shutdown
 */
module.exports.onUnload = function onUnload() {
    button.remove();
    //todo: loop over devices and unsubscribe from all events
};
