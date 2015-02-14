const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const Emitter = require('sdk/event/core'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const { DeviceServices } = require('../Services/DeviceServices');
const { ChromecastService } = require('../Services/Devices/ChromecastService');
const { MatchStickService } = require('../Services/Devices/MatchStickService');
const { FirestickService } = require('../Services/Devices/FirestickService');
const { GenericDeviceService } = require('../Services/Devices/GenericDeviceService');

const { MessageServiceFactory } = require('./MessageServiceFactory');
const { MessageFactory } = require('./MessageFactory');

const DeviceServicesFactory = Class({
	initialize: function initialize(){
        this._messageServiceFactory = new MessageServiceFactory();
	},
    createDeviceServices: function createDeviceServices(){
        return new DeviceServices(this.createMatchStickService(), this.createChromecastService(), this.createFirestickService(), this.createGenericDeviceService());
    },
    createMatchStickService: function createMatchStickService(){
        return new MatchStickService(Emitter, new MessageFactory(), this._messageServiceFactory.createMessageService());
    },
    createChromecastService: function createChromecastService(){
        return new ChromecastService(Emitter, new MessageFactory(), this._messageServiceFactory.createMessageService());
    },
    createFirestickService: function createFirestickService(){
        return new FirestickService(Emitter, new MessageFactory(), this._messageServiceFactory.createMessageService());
    },
    createGenericDeviceService: function createGenericDeviceService(){
        return new GenericDeviceService(Emitter, new MessageFactory(), this._messageServiceFactory.createMessageService());
    }
});

exports.DeviceServicesFactory = DeviceServicesFactory;