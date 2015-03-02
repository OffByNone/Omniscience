const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const Emitter = require('sdk/event/core'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const { DeviceServices } = require('../Services/DeviceServices');
const { ChromecastService } = require('../Services/Devices/ChromecastService');
const { MatchStickService } = require('../Services/Devices/MatchStickService');
const { FirestickService } = require('../Services/Devices/FirestickService');
const { MediaRendererService } = require('../Services/Devices/MediaRendererService');
const { GenericDeviceService } = require('../Services/Devices/GenericDeviceService');

const { AVTransportService } = require('../Services/AVTransportService');
const { ConnectionManagerService } = require('../Services/ConnectionManagerService');
const { RenderingControlService } = require('../Services/RenderingControlService');


const { Factory } = require("./Factory");
const { MessageServiceFactory } = require('./MessageServiceFactory');
const { MessageFactory } = require('./MessageFactory');
const { SOAPService } = require('../Services/SOAPService');

const DeviceServicesFactory = Class({
	initialize: function initialize(){
        this._messageServiceFactory = new MessageServiceFactory();
        this._factory = new Factory();
	},
    createDeviceServices: function createDeviceServices(){
        return new DeviceServices(this.createMatchStickService(), 
                                  this.createChromecastService(), 
                                  this.createFirestickService(), 
                                  this.createMediaRendererService(), 
                                  this.createGenericDeviceService(), 
                                  this._factory.createHttpServer());
    },
    createMatchStickService: function createMatchStickService(){
        return new MatchStickService(Emitter, new MessageFactory(), this._messageServiceFactory.createMessageService());
    },
    createChromecastService: function createChromecastService(){
        return new ChromecastService(Emitter, new MessageFactory());
    },
    createFirestickService: function createFirestickService(){
        return new FirestickService(Emitter, new MessageFactory());
    },
    createMediaRendererService: function createMediaRendererService(){
        return new MediaRendererService(Emitter, this.createAVTransportService(), this.createConnectionManagerService(), this.createRenderingControlService());
    },
    createGenericDeviceService: function createGenericDeviceService(){
        return new GenericDeviceService(Emitter, new MessageFactory());
    },
    createAVTransportService: function createAVTransportService(){
        return new AVTransportService(Emitter, new SOAPService());
    },
    createConnectionManagerService: function createConnectionManagerService(){
        return new ConnectionManagerService(Emitter, new SOAPService());
    },
    createRenderingControlService: function createRenderingControlService(){
        return new RenderingControlService(Emitter, new SOAPService());
    }
});

exports.DeviceServicesFactory = DeviceServicesFactory;