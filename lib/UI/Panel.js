const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');

class Panel extends EventTarget{
    constructor(filePicker, deviceServices, emitter, panels) {
        this._emitter = emitter;
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
        this._panel.on('hide', () => this._onHide());
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
        this._panel.port.on('openFocusTab', () => {
            this._emitter.emit(this, 'openFocusTab');
        });

        this._deviceServices.on( 'EventOccured', ( device, event, request ) => this.emit( 'EventOccured', device, event, request ) );
    }
    emit(event, data){
        this._panel.port.emit(event, data);
    }
    _onHide(){
        this._emitter.emit(this, 'hide');
    }
    show(ar){
        this._panel.show(ar);
    }
}

module.exports = Panel;