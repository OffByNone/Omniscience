const { fetch } = require('./libs/fetch');
const MD5 = require('./libs/MD5');

const Firefox  = require('./SDK/Firefox');
const DeviceFactory = require('./Factories/DeviceFactory');
const MessageFactory = require('./Factories/MessageFactory');
const TransportServiceFactory = require('./Factories/TransportServiceFactory');
const UDPSocketFactory = require('./Factories/UDPSocketFactory');
const ServiceInfoFactory = require('./Factories/ServiceInfoFactory');
const ExecutableServiceFactory = require('./Factories/ExecutableServiceFactory');
const FilePickerFactory = require('./Factories/FilePickerFactory');
const LocalFileFactory = require('./Factories/LocalFileFactory');

const ServiceExecutor = require('./Services/ServiceExecutor');
const MatchStickService = require('./Services/MatchStickService');
const SOAPService = require('./Services/SOAPService');
const SubscriptionService = require('./Services/SubscriptionService');
const MessageService = require('./Services/MessageService');

const DeviceLocator = require('./Searchers/DeviceLocator');
const ActiveSearcher = require('./Searchers/ActiveSearcher');
const AccessPointSearcher = require('./Searchers/AccessPointSearcher');
const PassiveSearcher = require('./Searchers/PassiveSearcher');
const SSDPClient = require('./Searchers/SSDPClient');
const IPResolver = require('./Searchers/IPResolver');

const Panel = require('./UI/Panel');
const Tab = require('./UI/Tab');
const Button = require('./UI/Button');

const FilePicker = require('./Utilities/FilePicker');
const FileSharer = require('./Utilities/FileSharer');
const FileUtils = require('./Utilities/FileUtils');
const UrlProvider = require('./Utilities/UrlProvider');
const XmlParser = require('./Utilities/XmlParser');
const Eventer = require('./Utilities/Eventer');
const Utilities = require('./Utilities/Utilities');
const Constants = require('./Utilities/Constants');

const HttpServer = require('./WebServer/HttpServer');
const HttpResponder = require('./WebServer/HttpResponder');
const HttpRequestParser = require('./WebServer/HttpRequestParser');
const NetworkingUtils = require('./WebServer/NetworkingUtils');
const SocketSender = require('./WebServer/SocketSender');
const FileResponder = require('./WebServer/FileResponder');

class CompositionRoot {
    constructor() {
        this._udpSocketFactory = new UDPSocketFactory(Firefox);
        this._ipResolver = new IPResolver(Firefox.getDNSService(), this._udpSocketFactory, NetworkingUtils);
        this._httpServer = new HttpServer(Firefox.createTCPSocket(), new UrlProvider(Firefox.urlSDK()), new HttpResponder(NetworkingUtils, new SocketSender()), new HttpRequestParser(NetworkingUtils), Firefox.timersSDK(), 
							new FileResponder(Firefox.createFile(), new FileUtils(Firefox.getMimeService()), 
												new LocalFileFactory(Firefox), new HttpResponder(NetworkingUtils, new SocketSender()), 
												NetworkingUtils, new SocketSender()));
        this._httpServer.start();
        this._serviceExecutor = new ServiceExecutor(new ServiceInfoFactory(fetch, new XmlParser(Firefox.createDOMParser()), new UrlProvider(Firefox.urlSDK()), MD5 ),
									new ExecutableServiceFactory(new XmlParser(Firefox.createDOMParser()), new SOAPService(fetch, Firefox.createDOMParser(), Utilities)),
									new MatchStickService(Eventer, new MessageFactory(), new MessageService(new TransportServiceFactory(Eventer, Firefox), Eventer, Firefox.timersSDK()), new UrlProvider(Firefox.urlSDK())));
    }
    createDeviceLocator(){
        return this._ipResolver.resolveIPs().then( (ipAddresses) => {
            return new DeviceLocator(Eventer, MD5,
                        new DeviceFactory(fetch, new XmlParser(Firefox.createDOMParser()), new UrlProvider(Firefox.urlSDK()), MD5),
                        new ActiveSearcher(Eventer, Firefox.timersSDK(), MD5, this.createSSDPClients(Constants.activeEventPrefix, ipAddresses)),
                        new PassiveSearcher(Eventer, Firefox.timersSDK(), MD5, this.createSSDPClients(Constants.passiveEventPrefix, ipAddresses, Constants.MulticastPort)),
                        new AccessPointSearcher(Eventer, Firefox.getWifiMonitor()),
                        Firefox.storageSDK(), this._serviceExecutor);
        });
    }
    createButton(){
        var buttons = null;
        var menu = null;
        try { //desktop Firefox
        	buttons = Firefox.buttonsSDK();
        }
        catch(e){ //Firefox for Android
            menu = Firefox.getNativeWindowMenu();
        }

        return new Button(Eventer, buttons, menu);
    }
    createPanel(){
    	return new Panel(this._serviceExecutor, Eventer, Firefox.panelSDK());
    }
    createTab(){
    	return new Tab(this._serviceExecutor, Eventer, Firefox.tabsSDK(), 
					new FilePicker(new FileUtils(Firefox.getMimeService()), new FilePickerFactory(Firefox), Firefox.filePickerConstants(), new LocalFileFactory(Firefox), Firefox.windowUtilsSDK()), 
					new FileSharer(this._httpServer, new UrlProvider(Firefox.urlSDK()), MD5),
					new SubscriptionService(fetch, Eventer, this._httpServer, new HttpResponder(NetworkingUtils, new SocketSender())));
    }
    createSSDPClients(eventPrefix, ipAddresses, sourcePort){
        return ipAddresses.map((ipAddress) => {
        	var ssdpClient = new SSDPClient(eventPrefix, Eventer, Utilities, this._udpSocketFactory.createUDPSocket(sourcePort), NetworkingUtils);
            ssdpClient.setMulticastInterface(ipAddress);
            return ssdpClient;
        });
    }
}

module.exports = CompositionRoot;