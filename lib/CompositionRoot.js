const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { defer } = require('sdk/core/promise'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/core_promise
const { Request } = require('sdk/request'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/request
const { nsHttpServer } = require("./Network/httpd"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/test_httpd  http://mxr.mozilla.org/mozilla-central/source/netwerk/test/httpserver/nsIHttpServer.idl
const Timer = require('sdk/timers'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers
const Emitter = require('sdk/event/core'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const ComponentFactory  = require("./Factories/ComponentFactory");
const { DeviceFactory } = require('./Factories/DeviceFactory');
const { MessageFactory } = require('./Factories/MessageFactory');
const { TransportServiceFactory } = require('./Factories/TransportServiceFactory');
const { SSDPFactory } = require('./Factories/SSDPFactory');

const { DeviceServices } = require('./Services/DeviceServices');
const { ChromecastService } = require('./Services/Devices/ChromecastService');
const { MatchStickService } = require('./Services/Devices/MatchStickService');
const { FirestickService } = require('./Services/Devices/FirestickService');
const { MediaRendererService } = require('./Services/Devices/MediaRendererService');
const { GenericDeviceService } = require('./Services/Devices/GenericDeviceService');

const { AVTransportService } = require('./Services/AVTransportService');
const { ConnectionManagerService } = require('./Services/ConnectionManagerService');
const { RenderingControlService } = require('./Services/RenderingControlService');

const { SOAPService } = require('./Services/SOAPService');
const { SubscriptionService } = require('./Services/SubscriptionService');
const { MessageService } = require('./Services/MessageService');
const { DeviceLocatorService } = require('./Services/DeviceLocatorService');

const xhr = require('./libs/request');

const { Panel } = require('./UI/Panel');
const { Tab } = require('./UI/Tab');
const { Button } = require('./UI/Button');
const { FilePicker } = require("./FilePicker");
const { HTTPServer } = require("./Network/HTTPServer");
const { fxosWebServer } = require('./Network/fxosWebServer');

const { Network } = require('./Entities/Network');
const { AccessPoint } = require('./Entities/AccessPoint');

const Utilities = require('./Utilities');

const CompositionRoot = Class({
	initialize: function initialize() {
		this._fxosWebServer = new fxosWebServer();
		this._fxosWebServer.start();
		this._deviceServices = new DeviceServices(defer, Emitter, this._fxosWebServer, new HTTPServer(new nsHttpServer(), Utilities),
				new MatchStickService(Emitter, new MessageFactory(), new MessageService(new TransportServiceFactory(), Emitter, Timer), defer),
				new ChromecastService(Emitter, new MessageFactory(), defer),
				new FirestickService(Emitter, new MessageFactory(), defer),
				new MediaRendererService(Emitter, defer,
					new AVTransportService( Emitter, defer, new SOAPService( Request, defer, ComponentFactory.createDOMParser(), Utilities), new SubscriptionService( xhr, defer, Emitter, this._fxosWebServer, Utilities ), ComponentFactory.createDOMParser() ),
					new ConnectionManagerService( Emitter, defer, new SOAPService( Request, defer, ComponentFactory.createDOMParser(), Utilities), new SubscriptionService( xhr, defer, Emitter, this._fxosWebServer, Utilities ), ComponentFactory.createDOMParser() ),
					new RenderingControlService( Emitter, defer, new SOAPService( Request, defer, ComponentFactory.createDOMParser(), Utilities), new SubscriptionService( xhr, defer, Emitter, this._fxosWebServer, Utilities ), ComponentFactory.createDOMParser() ) ),
				new GenericDeviceService( Emitter, new MessageFactory(), defer ));
	},
	createDeviceLocatorService: function createDeviceLocatorService(){
		return new DeviceLocatorService( Utilities, Emitter, Timer, new SSDPFactory(Emitter, Utilities, ComponentFactory),
					new DeviceFactory(ComponentFactory.createDOMParser(), Request, defer, new MessageFactory(), this._deviceServices, Emitter ));
	},
	createButton: function createButton(){
		return new Button(Emitter);
	},
	createPanel: function createPanel(){
		return new Panel(FilePicker, this._deviceServices , Emitter);
	},
	createTab: function createTab(){
		return new Tab(FilePicker, this._deviceServices, Emitter);
	}
});



exports.CompositionRoot = CompositionRoot;