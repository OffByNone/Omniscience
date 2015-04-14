const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { defer } = require('sdk/core/promise'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/core_promise
const { Request } = require('sdk/request'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/request
const { nsHttpServer } = require("./Network/httpd"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/test_httpd  http://mxr.mozilla.org/mozilla-central/source/netwerk/test/httpserver/nsIHttpServer.idl
const tabs = require("sdk/tabs");
const windowUtils = require("sdk/window/utils");
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
const FilePickerFactory = require('./Factories/FilePickerFactory');
const LocalFileFactory = require('./Factories/LocalFileFactory');

const DeviceServices = require('./Services/DeviceServices');

const ChromecastService = require('./Services/UPnP/ChromecastService');
const MatchStickService = require('./Services/UPnP/MatchStickService');
const FirestickService = require('./Services/UPnP/FirestickService');

const SOAPService = require('./Services/SOAPService');
const SubscriptionService = require('./Services/SubscriptionService');
const MessageService = require('./Services/MessageService');
const DeviceLocatorService = require('./Services/DeviceLocatorService');
const FileService = require('./Services/FileService');

const Panel = require('./UI/Panel');
const Tab = require('./UI/Tab');
const Button = require('./UI/Button');
const HttpServer = require("./Network/HttpServer");
const fxosWebServer = require('./Network/fxosWebServer');
const XmlParser = require('./XmlParser');
const { fetch } = require('./libs/fetch');

const Network = require('./Entities/Network');
const AccessPoint = require('./Entities/AccessPoint');

const Utilities = require('./Utilities');
const MD5 = require('./libs/MD5');

const CompositionRoot = Class({
	initialize: function initialize() {
		this._fxosWebServer = new fxosWebServer();
		this._fxosWebServer.start();
		this._httpd = new HttpServer(new nsHttpServer(), Utilities, MD5, new LocalFileFactory(ComponentFactory));
		this._httpd.start();

		this._deviceServices = new DeviceServices(Emitter, Utilities,
									new ServiceFactory(new XmlParser(), new SOAPService(Request, defer, ComponentFactory.createDOMParser(), Utilities)),
									new SubscriptionService(fetch),
									this._fxosWebServer,
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
		return new Panel(this._deviceServices , Emitter, panels);
	},
	createTab: function createTab(){
		return new Tab(this._deviceServices, Emitter, tabs, new FileService(this._httpd, Utilities, defer, ComponentFactory.createMimeService(), new FilePickerFactory(ComponentFactory), ComponentFactory.filePickerConstants(), new LocalFileFactory(ComponentFactory), windowUtils));
	}
});



exports.CompositionRoot = CompositionRoot;
