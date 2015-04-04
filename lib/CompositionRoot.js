const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { defer } = require('sdk/core/promise'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/core_promise
const { Request } = require('sdk/request'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/request
const { nsHttpServer } = require("./Network/httpd"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/test_httpd  http://mxr.mozilla.org/mozilla-central/source/netwerk/test/httpserver/nsIHttpServer.idl
const tabs = require("sdk/tabs");
const buttons = require('sdk/ui/button/toggle'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/ui_button_toggle
const panels = require('sdk/panel'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/panel
const Timer = require('sdk/timers'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers
const Emitter = require('sdk/event/core'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const ComponentFactory  = require("./Factories/ComponentFactory");
const DeviceFactory = require('./Factories/DeviceFactory');
const MessageFactory = require('./Factories/MessageFactory');
const TransportServiceFactory = require('./Factories/TransportServiceFactory');
const SSDPFactory = require('./Factories/SSDPFactory');
const ServiceInfoFactory = require('./Factories/ServiceInfoFactory');
const ServiceFactory = require('./Factories/ServiceFactory');

const DeviceServices = require('./Services/DeviceServices');

const ChromecastService = require('./Services/UPnP/ChromecastService');
const MatchStickService = require('./Services/UPnP/MatchStickService');
const FirestickService = require('./Services/UPnP/FirestickService');

const SOAPService = require('./Services/SOAPService');
const SubscriptionService = require('./Services/SubscriptionService');
const MessageService = require('./Services/MessageService');
const DeviceLocatorService = require('./Services/DeviceLocatorService');

const Panel = require('./UI/Panel');
const Tab = require('./UI/Tab');
const Button = require('./UI/Button');
const FilePicker = require("./FilePicker");
const HttpServer = require("./Network/HttpServer");
const fxosWebServer = require('./Network/fxosWebServer');
const XmlParser = require('./XmlParser');
const { fetch } = require('./libs/fetch');

const Network = require('./Entities/Network');
const AccessPoint = require('./Entities/AccessPoint');

const EventParser = require('./EventParser');
const Utilities = require('./Utilities');
const MD5 = require('./libs/MD5');

const CompositionRoot = Class({
	initialize: function initialize() {
		this._fxosWebServer = new fxosWebServer();
		this._fxosWebServer.start();
		this._httpd = new HttpServer(new nsHttpServer(), Utilities, MD5);
		this._httpd.start();

		this._deviceServices = new DeviceServices(Emitter,
									new EventParser(ComponentFactory.createDOMParser(), new XmlParser()),
									new ServiceFactory(new XmlParser(), new SOAPService(Request, defer, ComponentFactory.createDOMParser(), Utilities)),
									new MatchStickService(Emitter, new MessageFactory(), new MessageService(new TransportServiceFactory(), Emitter, Timer), defer));
	},
	createDeviceLocatorService: function createDeviceLocatorService(){
		return new DeviceLocatorService( Utilities, Emitter, Timer, MD5, new SSDPFactory(Emitter, Utilities, ComponentFactory),
					new DeviceFactory(ComponentFactory.createDOMParser(), Request, defer, new MessageFactory(), this._deviceServices, Emitter, new XmlParser(), Utilities, MD5,
						new ServiceInfoFactory(Request, ComponentFactory.createDOMParser(), new XmlParser(), Utilities, MD5 ) ) );
	},
	createButton: function createButton(){
		return new Button(Emitter, buttons);
	},
	createPanel: function createPanel(){
		return new Panel(FilePicker, this._deviceServices , Emitter, panels);
	},
	createTab: function createTab(){
		return new Tab(FilePicker, this._deviceServices, Emitter, tabs);
	}
});



exports.CompositionRoot = CompositionRoot;
