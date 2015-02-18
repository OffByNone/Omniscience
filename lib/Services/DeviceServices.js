const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const constants = require('../Constants');
const { URL } = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url

const DeviceServices = Class({
    initialize: function initialize(matchstickService, chromecastService, firestickService, genericDeviceService, server){
        this[constants.Services.MatchStick] = matchstickService;
        this[constants.Services.Chromecast] = chromecastService;
        this[constants.Services.Firestick] = firestickService;
        this[constants.Services.GenericDevice] = genericDeviceService;
        this._server = server;
        this._server.start();
    },
    launchMediaPlayer: function launchMediaPlayer(device, file){
        var filePath = this.shareFile(file);
        var deviceAddress = new URL(device.address).host;
        var serverAddress = this._server.getServerIp(deviceAddress);

        this[device.serviceKey].launchMediaPlayer(deviceAddress, serverAddress, filePath);
    },
    shareFile: function shareFile(file){
        var filePath = "/" + file.name;
        this._server.registerFile(filePath, file.path);
        return filePath;
    },
    setProperty: function setProperty (device, property){
        this[device.serviceKey].setProperty(device, property);
    },
    executeCommand: function executeCommand(device, command){
        this[device.serviceKey].executeCommand(device, command);
    }
});

exports.DeviceServices = DeviceServices;