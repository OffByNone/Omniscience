const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const panels = require('sdk/panel'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/panel

const Constants = require('../Constants');

const Panel = Class({
    extends: EventTarget,
    initialize: function initialize(filePickerFactory, deviceServices, emitter) {
        this._emitter = emitter;
        this._filePickerFactory = filePickerFactory;
        this._deviceServices = deviceServices;
        this._panel = panels.Panel({
            height: 375,
            contentURL: Constants.panel.html,
            contentScriptFile: Constants.panel.js,
            contentStyleFile: Constants.panel.css
        });
        this._panel.show();
        this._panel.hide();
        this._panel.on('hide', () => this._onHide());
        this._panel.port.on('chooseFile', (device, fileType) => {
            var filePicker = this._filePickerFactory.createFilePicker();
            var file = filePicker.openFile();
            var pickedFile = file ? {
                    path: file.path,
                    name: file.leafName
                } : null;
            this._panel.port.emit('pickedFile', device, pickedFile);
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
    },
    emit: function emit(event, data){
        this._panel.port.emit(event, data);
    },
    _onHide: function _onHide(){
        this._emitter.emit(this, 'hide');
    },
    show: function show(ar){
        this._panel.show(ar);
    }
});

exports.Panel = Panel;