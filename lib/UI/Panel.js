const Constants = require('../Utilities/Constants');

class Panel {
    constructor(filePicker, deviceServices, eventer, panels) {
        this._eventer = eventer;
        this._filePicker = filePicker;
        this._deviceServices = deviceServices;
        this._panel = panels.Panel({
            height: 415,
            contentURL: Constants.panel.html,
            contentScriptFile: Constants.panel.js,
            contentStyleFile: Constants.panel.css
        });
        this._panel.show();
        this._panel.hide();
        this._panel.on('hide', () => this._eventer.emit('hide'));
        this._panel.port.on('chooseFile', (device, fileType) => {
            var file = this._filePicker.openFile();
            var fileChosen = file ? {
                path: file.path,
                name: file.leafName
            } : null;
            this._panel.port.emit('fileChosen', device, fileChosen);
        });
        this._panel.port.on('launch', (device) => {
            this._deviceServices.launchMedia(device, device.file);
        });
        this._panel.port.on('executeCommand', (device, command) => {
            this._deviceServices.executeCommand(device, command);
        });
        this._panel.port.on('setProperty', (device, property) => {
            this._deviceServices.setProperty(device, property);
        });
        this._panel.port.on('setName', (device, name) => {
            this._deviceServices.setName(device, name);
        });
        this._panel.port.on('reboot', (device) => {
            this._deviceServices.reboot(device);
        });
        this._eventer.on('deviceServices.eventOccured', (device, event, request) => this._panel.port.emit('EventOccured', device, event, request));
    }
}

module.exports = Panel;