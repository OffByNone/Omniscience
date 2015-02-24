const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const constants = require('../Constants');

const DeviceServices = Class({
    initialize: function initialize(matchstickService, chromecastService, firestickService, avTransportService, genericDeviceService, server){
        this[constants.Services.MatchStick] = matchstickService;
        this[constants.Services.Chromecast] = chromecastService;
        this[constants.Services.Firestick] = firestickService;
        this[constants.Services.AVTransport] = avTransportService;
        this[constants.Services.GenericDevice] = genericDeviceService;
        this._server = server;
        this._server.start();
    },
    launchMedia: function launchMedia(device, file){
        var fileUri = this.shareFile(file);
        var serverAddress = this._server.getServerIp(device);

        this[device.serviceKey].launchMedia(device, serverAddress, fileUri);
    },
    shareFile: function shareFile(file){
        var filePath = encodeURI("/" + file.name);
        this._server.registerFile(filePath, file.path);
        return filePath;
    },
    setProperty: function setProperty (device, property){
        this[device.serviceKey].setProperty(device, property);
    },
    executeCommand: function executeCommand(device, command){
        this[device.serviceKey].executeCommand(device, command);
    },
    setName: function setName(device, name){
        this[device.serviceKey].setName(device, name);
    },
    reboot: function reboot(device){
        this[device.serviceKey].reboot(device);
    }
});

exports.DeviceServices = DeviceServices;