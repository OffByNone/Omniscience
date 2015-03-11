//assume I am on the same subnet as the device.
//activate
//cfx run -b "C:\program files\nightly\firefox.exe"
//jpm run -b "C:\program files\nightly\firefox.exe" -p ExtensionDev --debug
//from addon-debugger console run this to see contents of simplestorage loader.modules['resource://gre/modules/commonjs/sdk/simple-storage.js'].exports.storage
//jpm post --post-url http://localhost:8888/
//jpm watchpost --post-url http://localhost:8888/

var deviceLocatorService;
var httpServer;
/**
 * extension startup
 */
exports.main = function main() {
	const { storage } = require('sdk/simple-storage'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/simple-storage

    const { Tab } = require("./UI/Tab");
    const { Factory } = require('./Factories/Factory');
    const { DeviceLocatorServiceFactory } = require('./Factories/DeviceLocatorServiceFactory');
    const { UIFactory } = require('./Factories/UIFactory');

    var factory = new Factory();
    var uiFactory = new UIFactory();
    var deviceLocatorServiceFactory = new DeviceLocatorServiceFactory();
    var panel = uiFactory.createPanel();
    var button = uiFactory.createButton();
    var tab = uiFactory.createTab();    

    panel.on('hide', () => button.check(false) );
    panel.on('openFocusTab', () => tab.openFocus() );
    tab.on("loadDevices", () => {
        deviceLocatorService.devices.forEach(device => {
            tab.emit('deviceFound', device);
        });
    });

    button.on('change', (state) => {
        if (state.checked) {
            //panel.show( { position: button.getButton() } );
            //deviceLocatorService.search();
            tab.openFocus()
        }
    });
    
    deviceLocatorService = deviceLocatorServiceFactory.createDeviceLocatorService();
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
            //todo: solve the notifications appearing off screen problem
            //todo: group notifications together because a new notification is not shown if one already is
            //todo: add setting to control whether or not to display notifications when new devices are detected
            //todo: re-enable
            notifications.notify({
                title: 'Found ' + device.name,
                text: "a " + device.model.name + " by " + device.manufacturer.name,
                iconURL: device.icons.length > 0 && device.icons[0].url ? device.icons[0].url.href : ""
            });
        }
        
        panel.emit('deviceFound', device);
        tab.emit('deviceFound', device);
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