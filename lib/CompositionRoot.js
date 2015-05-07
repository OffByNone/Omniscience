const { nsHttpServer } = require('./Network/httpd'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/test_httpd  http://mxr.mozilla.org/mozilla-central/source/netwerk/test/httpserver/nsIHttpServer.idl
const { storage } = require('sdk/simple-storage'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/simple-storage
const Timer = require('sdk/timers'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers
const tabs = require('sdk/tabs');
const windowUtils = require('sdk/window/utils');
const UrlSdk = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url


const ComponentFactory  = require('./Factories/ComponentFactory');
const DeviceFactory = require('./Factories/DeviceFactory');
const MessageFactory = require('./Factories/MessageFactory');
const TransportServiceFactory = require('./Factories/TransportServiceFactory');
const UDPSocketFactory = require('./Factories/UDPSocketFactory');
const ServiceInfoFactory = require('./Factories/ServiceInfoFactory');
const ExecutableServiceFactory = require('./Factories/ExecutableServiceFactory');
const FilePickerFactory = require('./Factories/FilePickerFactory');
const LocalFileFactory = require('./Factories/LocalFileFactory');

const DeviceServices = require('./Services/DeviceServices');
const MatchStickService = require('./Services/UPnP/MatchStickService');
const SOAPService = require('./Services/SOAPService');
const SubscriptionService = require('./Services/SubscriptionService');
const MessageService = require('./Services/MessageService');
const FilePicker = require('./Utilities/FilePicker');
const FileSharer = require('./Utilities/FileSharer');

const DeviceLocator = require('./Searchers/DeviceLocator');
const ActiveSearcher = require('./Searchers/ActiveSearcher');
const AccessPointSearcher = require('./Searchers/AccessPointSearcher');
const PassiveSearcher = require('./Searchers/PassiveSearcher');

const FileUtils = require('./Utilities/FileUtils');
const BufferProvider = require('./Utilities/BufferProvider');
const UrlProvider = require('./Utilities/UrlProvider');
const IPResolver = require('./Network/IPResolver');
const SSDPClient = require('./Network/SSDPClient');
const Panel = require('./UI/Panel');
const Tab = require('./UI/Tab');
const Button = require('./UI/Button');
const HttpServer = require('./Network/HttpServer');
const fxosWebServer = require('./libs/fxos-web-server/http-server');
const HttpResponder = require('./libs/fxos-web-server/HttpResponder');
const XmlParser = require('./XmlParser');
const { fetch } = require('./libs/fetch');

const Eventer = require('./Utilities/Eventer');
const Utilities = require('./Utilities/Utilities');
const MD5 = require('./libs/MD5');
const Constants = require('./Utilities/Constants');

class CompositionRoot {
    constructor() {
        this._udpSocketFactory = new UDPSocketFactory(ComponentFactory);
        this._ipResolver = new IPResolver(ComponentFactory.createDNSService(), this._udpSocketFactory, BufferProvider);

        this._fxosWebServer = new fxosWebServer(ComponentFactory.createTCPSocket(), new UrlProvider(UrlSdk), new HttpResponder(BufferProvider, Timer, new FileUtils(ComponentFactory.createMimeService()), new LocalFileFactory(ComponentFactory), ComponentFactory.createFile()), MD5);
        this._fxosWebServer.start();
        this._httpd = new HttpServer(new nsHttpServer(), MD5, new LocalFileFactory(ComponentFactory), this._ipResolver);
        //this._ipResolver.resolveIPs().then((myIPAddresses) => this._httpd.start(myIPAddresses));

        this._deviceServices = new DeviceServices(Eventer, new ServiceInfoFactory(fetch, ComponentFactory.createDOMParser(), new XmlParser(), new UrlProvider(UrlSdk), MD5 ),
									new ExecutableServiceFactory(new XmlParser(), new SOAPService(fetch, ComponentFactory.createDOMParser(), Utilities)),
									new SubscriptionService(fetch),
									this._fxosWebServer,
									new MatchStickService(Eventer, new MessageFactory(), new MessageService(new TransportServiceFactory(Eventer, ComponentFactory), Eventer, Timer), new UrlProvider(UrlSdk)));
    }
    createDeviceLocator(){
        return this._ipResolver.resolveIPs().then( (ipAddresses) => {
            return new DeviceLocator(Eventer, MD5,
                        new DeviceFactory(ComponentFactory.createDOMParser(), fetch, new XmlParser(), new UrlProvider(UrlSdk), MD5),
                        new ActiveSearcher(Eventer, Timer, MD5, this.createSSDPClients(Constants.activeEventPrefix, ipAddresses)),
                        new PassiveSearcher(Eventer, Timer, MD5, this.createSSDPClients(Constants.passiveEventPrefix, ipAddresses, Constants.MulticastPort)),
                        new AccessPointSearcher(Eventer, ComponentFactory.createWifiMonitor()),
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

        return new Button(Eventer, buttons, menu);
    }
    createPanel(){
        return new Panel(this._deviceServices, Eventer, require('sdk/panel')); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/panel
    }
    createTab(){
        return new Tab(this._deviceServices, Eventer, tabs, new FilePicker(new FileUtils(ComponentFactory.createMimeService()), new FilePickerFactory(ComponentFactory), ComponentFactory.filePickerConstants(), new LocalFileFactory(ComponentFactory), windowUtils), new FileSharer(this._fxosWebServer, new UrlProvider(UrlSdk)));
    }
    createSSDPClients(eventPrefix, ipAddresses, sourcePort){
        return ipAddresses.map((ipAddress) => {
            var ssdpClient = new SSDPClient(eventPrefix, Eventer, Utilities, this._udpSocketFactory.createUDPSocket(sourcePort), BufferProvider);
            ssdpClient.setMulticastInterface(ipAddress);
            return ssdpClient;
        });
    }
}

module.exports = CompositionRoot;