var button;
/**
 * extension startup
 */

module.exports.main = function main() {
    const notifications = require('sdk/notifications'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications
    const Constants = require('./Utilities/Constants');
    const PubSub = require('./Utilities/PubSub');
    const CompositionRoot = require('./CompositionRoot');
    var compositionRoot = new CompositionRoot();

    compositionRoot.createDeviceLocator().then( (deviceLocator) => {
        button = compositionRoot.createButton();
        PubSub.sub('button.click', () => {
            deviceLocator.search();
            tab.openFocus();
        });

        var tab = compositionRoot.createTab();

        PubSub.sub('refreshDevices', () => deviceLocator.search());
        PubSub.sub('loadDevices', () => deviceLocator.devices.forEach(device => PubSub.pub('deviceFound', device)));

        PubSub.sub('saveState', (uniqueId, deviceId, serviceName, state) => {
        	var deviceToUpdate = deviceLocator.devices.filter(device => device.id === deviceId)[0];
        	if (deviceToUpdate && deviceToUpdate[serviceName])
        		deviceToUpdate[serviceName].state = state;
        });

        PubSub.sub('deviceLocator.lost', (device) => PubSub.pub('deviceLost', device));
        PubSub.sub('deviceLocator.found', (device, isNew) => {
            if (isNew) {
                notifications.notify({
                    title: 'Found ' + device.name,
                    text: "a " + device.model.name + " by " + device.manufacturer.name,
                    iconURL: device.icons.length > 0 && device.icons[0].url ? device.icons[0].url.href : Constants.icon['64']
                });
            }

            PubSub.pub('deviceFound', device);
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
