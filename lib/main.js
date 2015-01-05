var DeviceLocator = require("./deviceLocator");
var deviceLocator;

exports.main = function main(){
    const buttons = require('sdk/ui/button/toggle'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/ui
    const notifications = require("sdk/notifications"); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications
    const panels = require("sdk/panel"); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/panel

    var button = buttons.ToggleButton({
        id: "rotary",
        label: "Rotary",
        icon: {
            16: "./rotary-16.png",
            32: "./rotary-32.png",
            64: "./rotary-64.png"
        },
        onChange: handleChange
    });

    var panel = panels.Panel({
        contentURL: "./panel.html",
        contentScriptFile : "./panel.js",
        contentStyleFile : "./panel.css",
        onHide: handleHide,
    });

    function handleChange(state) {
        if (state.checked) {
            deviceLocator.search();
            panel.show({ position: button });
        }
    }

    function handleHide() {
        button.state('window', {checked: false});
    }
    
    deviceLocator = DeviceLocator.createDeviceLocator();
    
    deviceLocator.on("removedevice", (device) => {
        panel.port.emit("removedevice", device);
    });
    
    deviceLocator.on("updatedevice",(device) => {
        panel.port.emit("updatedevice",device);
    });
    
    deviceLocator.on("devicefound",(device) => {
        notifications.notify({
            title: "DIAL Device Found",
            text: "Found " + device.name + " at " + device.address,
            iconURL: device.icon.url
        });
        panel.port.emit("newdevice", device);
    });
}

exports.onUnload = function onUnload(){
    deviceLocator.close();
}