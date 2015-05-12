var button;
/**
 * extension startup
 */

module.exports.main = function main() {
    const notifications = require('sdk/notifications'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications
    const Constants = require('./Utilities/Constants');
    const Eventer = require('./Utilities/Eventer');
    const CompositionRoot = require('./CompositionRoot');
    var compositionRoot = new CompositionRoot();

    compositionRoot.createDeviceLocator().then( (deviceLocator) => {
        button = compositionRoot.createButton();
        Eventer.on('button.click', () => {
            deviceLocator.search();
            tab.openFocus();
        });

        var tab = compositionRoot.createTab();

        Eventer.on("tab.refreshDevices", () => deviceLocator.search());
        Eventer.on("tab.loadDevices", () => deviceLocator.devices.forEach(device => tab.emit('deviceFound', device)));
        Eventer.on("tab.updateState", (deviceId, serviceName, state) => {
            var deviceToUpdate = deviceLocator.devices.filter(device => device.id === deviceId)[0];
            if (deviceToUpdate && deviceToUpdate[serviceName])
                deviceToUpdate[serviceName].state = state;
        });

        Eventer.on('deviceLocator.lost', (device) => tab.emit('deviceLost', device));
        Eventer.on('deviceLocator.found', (device, isNew) => {
            if (isNew) {
                notifications.notify({
                    title: 'Found ' + device.name,
                    text: "a " + device.model.name + " by " + device.manufacturer.name,
                    iconURL: device.icons.length > 0 && device.icons[0].url ? device.icons[0].url.href : Constants.icon['64']
                });
            }

            tab.emit('deviceFound', device);
        });

        deviceLocator.search();
    });
};
/**
 * extension shutdown
 */
module.exports.onUnload = function onUnload() {
    button.remove();
    //todo: loop over devices and unsubscribe from all events
};
