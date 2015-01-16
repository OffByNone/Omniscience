var deviceLocator;

exports.main = function main(){
    const buttons = require("sdk/ui/button/toggle"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/ui_button_toggle
    const notifications = require("sdk/notifications"); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications
    const panels = require("sdk/panel"); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/panel
    const storage = require("sdk/simple-storage"); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/simple-storage
    const { DeviceLocator } = require("./deviceLocator");
    const { TransportService }  = require("./transportService");

    var button = buttons.ToggleButton({
        id: "rotary",
        label: "Rotary",
        icon: {
            16: "./icons/rotary-16.png",
            32: "./icons/rotary-32.png",
            64: "./icons/rotary-64.png"
        },
        onChange: onButtonChange
    });
    function onButtonChange(state) {
        if (state.checked) {
            deviceLocator.search();
            panel.show({ position: button });
        }
    }
    var panel = panels.Panel({
        contentURL: "./panel.html",
        contentScriptFile : ["./libs/angular.js", "./rotary.js"],
        contentStyleFile : "./panel.css",
        onHide: onPanelHide,
    });
    function onPanelHide() {
        button.state('window', {checked: false});
    }

    deviceLocator = new DeviceLocator();
    deviceLocator.devices = storage.devices || [];
    deviceLocator.search();

    deviceLocator.on("removedevice", (device) => {
        panel.port.emit("removedevice", device);
        storage.devices = deviceLocator.devices;
    });
    deviceLocator.on("updatedevice",(device) => {
        panel.port.emit("updatedevice",device);
        storage.devices = deviceLocator.devices;
    });
    deviceLocator.on("devicefound",(device) => {
        notifications.notify({
            title: "Found new " + device.model,
            text: device.name + " at " + device.address,
            iconURL: device.icon.url
        });
        panel.port.emit("newdevice", device);
        storage.devices = deviceLocator.devices;
    });

    panel.port.on("heightChange",function(newHeight){
      panel.height = newHeight;
    });

}

exports.onUnload = function onUnload(){
    deviceLocator.stop();
}
