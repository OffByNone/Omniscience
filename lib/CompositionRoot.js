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
const ServiceFactory = require('./Factories/ServiceFactory');

const DeviceServices = require('./Services/DeviceServices');

const ChromecastService = require('./Services/UPnP/ChromecastService');
const MatchStickService = require('./Services/UPnP/MatchStickService');
const FirestickService = require('./Services/UPnP/FirestickService');
const AVTransportService = require('./Services/UPnP/AVTransportService');
const ConnectionManagerService = require('./Services/UPnP/ConnectionManagerService');
const RenderingControlService = require('./Services/UPnP/RenderingControlService');
const ContentDirectoryService = require('./Services/UPnP/ContentDirectoryService');
const MediaReceiverRegistrarService = require('./Services/UPnP/MediaReceiverRegistrarService');
const WFAWLANConfigService = require('./Services/UPnP/WFAWLANConfigService');

const SOAPService = require('./Services/SOAPService');
const SubscriptionService = require('./Services/SubscriptionService');
const MessageService = require('./Services/MessageService');
const DeviceLocatorService = require('./Services/DeviceLocatorService');

const Panel = require('./UI/Panel');
const Tab = require('./UI/Tab');
const Button = require('./UI/Button');
const FilePicker = require("./FilePicker");
const HTTPServer = require("./Network/HTTPServer");
const fxosWebServer = require('./Network/fxosWebServer');
const XMLParser = require('./XMLParser');
const { fetch } = require('./libs/fetch');

const Network = require('./Entities/Network');
const AccessPoint = require('./Entities/AccessPoint');

const Utilities = require('./Utilities');
const MD5 = require('./libs/MD5');

const CompositionRoot = Class({
	initialize: function initialize() {
		this._fxosWebServer = new fxosWebServer();
		this._fxosWebServer.start();
		this._httpd = new HTTPServer(new nsHttpServer(), Utilities, MD5);
		this._httpd.start();

		this._deviceServices = new DeviceServices(Emitter,
									new MatchStickService(Emitter, new MessageFactory(), new MessageService(new TransportServiceFactory(), Emitter, Timer), defer),
									new ChromecastService(Emitter, new MessageFactory(), defer),
									new FirestickService(Emitter, new MessageFactory(), defer),
									new AVTransportService( Emitter, defer,
													new SOAPService( Request, defer, ComponentFactory.createDOMParser(), Utilities),
													new SubscriptionService( defer, Emitter, this._fxosWebServer, Utilities, fetch ), ComponentFactory.createDOMParser(), Utilities, new XMLParser() ),
									new ConnectionManagerService( Emitter, defer,
													new SOAPService( Request, defer, ComponentFactory.createDOMParser(), Utilities),
													new SubscriptionService( defer, Emitter, this._fxosWebServer, Utilities, fetch ), ComponentFactory.createDOMParser(), Utilities, new XMLParser() ),
									new RenderingControlService( Emitter, defer,
													new SOAPService( Request, defer, ComponentFactory.createDOMParser(), Utilities),
													new SubscriptionService( defer, Emitter, this._fxosWebServer, Utilities, fetch ), ComponentFactory.createDOMParser(), Utilities, new XMLParser() ),
									new ContentDirectoryService( Emitter, defer,
													new SOAPService( Request, defer, ComponentFactory.createDOMParser(), Utilities),
													new SubscriptionService( defer, Emitter, this._fxosWebServer, Utilities, fetch ), ComponentFactory.createDOMParser(), Utilities, new XMLParser() ),
									new MediaReceiverRegistrarService ( Emitter, defer,
													new SOAPService( Request, defer, ComponentFactory.createDOMParser(), Utilities),
													new SubscriptionService( defer, Emitter, this._fxosWebServer, Utilities, fetch ), ComponentFactory.createDOMParser(), Utilities, new XMLParser() ),
									new WFAWLANConfigService(Emitter, defer,
												new SOAPService( Request, defer, ComponentFactory.createDOMParser(), Utilities),
												new SubscriptionService( defer, Emitter, this._fxosWebServer, Utilities, fetch ), ComponentFactory.createDOMParser(), Utilities, new XMLParser() ));
	},
	createDeviceLocatorService: function createDeviceLocatorService(){
		return new DeviceLocatorService( Utilities, Emitter, Timer, MD5, new SSDPFactory(Emitter, Utilities, ComponentFactory),
					new DeviceFactory(ComponentFactory.createDOMParser(), Request, defer, new MessageFactory(), this._deviceServices, Emitter, new XMLParser(), Utilities, MD5,
						new ServiceFactory(Request, ComponentFactory.createDOMParser(), new XMLParser(), Utilities, MD5 ) ) );
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
