const { nsHttpServer } = require("./Network/httpd"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/test_httpd  http://mxr.mozilla.org/mozilla-central/source/netwerk/test/httpserver/nsIHttpServer.idl
const { storage } = require('sdk/simple-storage'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/simple-storage
const Timer = require('sdk/timers'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers
const Emitter = require('sdk/event/core'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const tabs = require("sdk/tabs");
const windowUtils = require("sdk/window/utils");

const ComponentFactory  = require("./Factories/ComponentFactory");
const DeviceFactory = require('./Factories/DeviceFactory');
const MessageFactory = require('./Factories/MessageFactory');
const TransportServiceFactory = require('./Factories/TransportServiceFactory');
const UDPSocketFactory = require('./Factories/UDPSocketFactory');
const ServiceInfoFactory = require('./Factories/ServiceInfoFactory');
const ExecutableServiceFactory = require('./Factories/ExecutableServiceFactory');
const FilePickerFactory = require('./Factories/FilePickerFactory');
const LocalFileFactory = require('./Factories/LocalFileFactory');

const DeviceServices = require('./Services/DeviceServices');
const ChromecastService = require('./Services/UPnP/ChromecastService');
const MatchStickService = require('./Services/UPnP/MatchStickService');
const FirestickService = require('./Services/UPnP/FirestickService');
const ActiveSearcher = require('./Services/ActiveSearcher');
const PassiveSearcher = require('./Services/PassiveSearcher');
const SOAPService = require('./Services/SOAPService');
const SubscriptionService = require('./Services/SubscriptionService');
const MessageService = require('./Services/MessageService');
const DeviceLocatorService = require('./Services/DeviceLocatorService');
const FileService = require('./Services/FileService');

const IPResolver = require('./Network/IPResolver');
const SSDPClient = require('./Network/SSDPClient');
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

const Constants = require('./Constants');

class CompositionRoot {
    constructor() {
        this._udpSocketFactory = new UDPSocketFactory(ComponentFactory);
        this._ipResolver = new IPResolver(ComponentFactory.createDNSService(), this._udpSocketFactory);

        this._fxosWebServer = new fxosWebServer();
        this._fxosWebServer.start();
        this._httpd = new HttpServer(new nsHttpServer(), Utilities, MD5, new LocalFileFactory(ComponentFactory), this._ipResolver);

        this._ipResolver.resolveIPs().then((myIPAddresses) => this._httpd.start(myIPAddresses));

        this._deviceServices = new DeviceServices(Emitter, Utilities, new ServiceInfoFactory(fetch, ComponentFactory.createDOMParser(), new XmlParser(), Utilities, MD5 ),
									new ExecutableServiceFactory(new XmlParser(), new SOAPService(fetch, ComponentFactory.createDOMParser(), Utilities)),
									new SubscriptionService(fetch),
									this._fxosWebServer,
									new MatchStickService(Emitter, new MessageFactory(), new MessageService(new TransportServiceFactory(), Emitter, Timer)));
    }
    createDeviceLocatorService(){
        return this._ipResolver.resolveIPs().then( (ipAddresses) => {
            return new DeviceLocatorService(Emitter, MD5,
                        new DeviceFactory(ComponentFactory.createDOMParser(), fetch, new MessageFactory(), Emitter, new XmlParser(), Utilities, MD5),
                        new ActiveSearcher(Emitter, Timer, MD5, this.createSSDPClients(ipAddresses)),
                        new PassiveSearcher(Emitter, Timer, MD5, this.createSSDPClients(ipAddresses, Constants.MulticastPort)),
                        storage, this._deviceServices);
        });
    }
    createButton(){
        var buttons = null;
        var menu = null;
        try { //desktop Firefox
            buttons = require('sdk/ui/button/toggle'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/ui_button_toggle
        }
        catch(e){ //Firefox for Android
            menu = ComponentFactory.getNativeWindowMenu();
        }

        return new Button(Emitter, buttons, menu);
    }
    createPanel(){
        return new Panel(this._deviceServices, Emitter, require('sdk/panel')); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/panel
    }
    createTab(){
        return new Tab(this._deviceServices, Emitter, tabs, new FileService(this._httpd, Utilities, ComponentFactory.createMimeService(), new FilePickerFactory(ComponentFactory), ComponentFactory.filePickerConstants(), new LocalFileFactory(ComponentFactory), windowUtils));
    }
    createSSDPClients(ipAddresses, sourcePort){
        return ipAddresses.map((ipAddress) => {
            var ssdpClient = new SSDPClient(Emitter, Utilities, this._udpSocketFactory.createUDPSocket(sourcePort));
            ssdpClient.setMulticastInterface(ipAddress);
            return ssdpClient;
        });
    }
}

module.exports = CompositionRoot;