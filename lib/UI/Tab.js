const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const tabs = require("sdk/tabs");

const Constants = require('../Constants');

const Tab = Class({
    extends: EventTarget,
    initialize: function initialize(filePickerFactory, deviceServices, emitter) {
        this._pageWorker = null;
        this._emitter = emitter;
        this._filePickerFactory = filePickerFactory;
        this._deviceServices = deviceServices;
        this._eventQueue = [];
    },
    emit: function emit(event, data){
        //The panel serialzes out the data object using the below two lines
        //the tab does not, therefore the same data sent to both will not appear the same unless we add the below two lines
        let replacer = (k, v) => typeof(v) === "function" ? (type === "console" ? Function.toString.call(v) : void(0)): v;
        data = JSON.parse(JSON.stringify(data, replacer));
        
        if(!this._pageWorker)
           this._eventQueue.push({event: event, data: data});
        else
            this._pageWorker.port.emit(event, data);
    },
    openFocusTab: function openFocusTab() {
        if (this._pageWorker) return this._pageWorker.tab.activate();
        
        tabs.open({
            url: Constants.tab.html,
            onLoad: (tab) => {
                this._pageWorker = tab.attach({
                    contentScriptFile: Constants.tab.js
                });
                this._pageWorker.port.on('chooseFile', (device, fileType) => {
                    var filePicker = this._filePickerFactory.createFilePicker();
                    var file = filePicker.openFile();
                    var pickedFile = file ? {
                            path: file.path,
                            name: file.leafName
                        } : null;
                    this._pageWorker.port.emit('pickedFile', device, pickedFile);
                });
                this._pageWorker.port.on('launch', (device) => {
                    this._deviceServices.launchMedia(device, device.file);
                });
                this._pageWorker.port.on('executeCommand', (device, command) => {
                    this._deviceServices.executeCommand(device, command);
                });
                this._pageWorker.port.on('setProperty', (device, property) => {
                    this._deviceServices.setProperty(device, property);
                });
                this._pageWorker.port.on('setName', (device, name) => {
                    this._deviceServices.setName(device, name);
                });
                this._pageWorker.port.on('reboot', (device) => {
                    this._deviceServices.reboot(device);
                });   
                
                while(this._eventQueue.length > 0)
                {
                    var cuedEvent = this._eventQueue.pop();
                    this.emit(cuedEvent.event, cuedEvent.data);
                }
                
            },
            onClose: (tab) => {
                this._pageWorker = null;
            }
        });
      
    }
});

exports.Tab = Tab;