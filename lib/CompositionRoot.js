const { fetch } = require('./libs/fetch');
const MD5 = require('./libs/MD5');

const DeviceFactory = require('./Factories/DeviceFactory');
const UDPSocketFactory = require('./Factories/UDPSocketFactory');
const ServiceInfoFactory = require('./Factories/ServiceInfoFactory');
const ExecutableServiceFactory = require('./Factories/ExecutableServiceFactory');
const FilePickerFactory = require('./Factories/FilePickerFactory');
const LocalFileFactory = require('./Factories/LocalFileFactory');

const ServiceExecutor = require('./Services/ServiceExecutor');
const SOAPService = require('./Services/SOAPService');
const SubscriptionService = require('./Services/SubscriptionService');
const TCPSender = require('./Services/TCPSender');

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
const PubSub = require('./Utilities/PubSub');
const Utilities = require('./Utilities/Utilities');
const Constants = require('./Utilities/Constants');
const TCPSocketProvider = require('./Utilities/TCPSocketProvider');

const HttpServer = require('./WebServer/HttpServer');
const HttpResponder = require('./WebServer/HttpResponder');
const HttpRequestParser = require('./WebServer/HttpRequestParser');
const NetworkingUtils = require('./WebServer/NetworkingUtils');
const SocketSender = require('./WebServer/SocketSender');
const FileResponder = require('./WebServer/FileResponder');

class CompositionRoot {
	constructor(sdk) {
		this._sdk = sdk;
		this._udpSocketFactory = new UDPSocketFactory(sdk);
		this._ipResolver = new IPResolver(this._sdk.getDNSService(), this._udpSocketFactory, NetworkingUtils);
		this._httpServer = new HttpServer(this._sdk.createTCPSocket(), new UrlProvider(this._sdk.url()), new HttpResponder(NetworkingUtils, new SocketSender()), new HttpRequestParser(NetworkingUtils), this._sdk.timers(),
							new FileResponder(this._sdk.createFile(), new FileUtils(this._sdk.getMimeService()),
												new LocalFileFactory(sdk), new HttpResponder(NetworkingUtils, new SocketSender()),
												NetworkingUtils, new SocketSender()));
		this._httpServer.start();
		this._serviceExecutor = new ServiceExecutor(new ServiceInfoFactory(fetch, new XmlParser(this._sdk.createDOMParser()), new UrlProvider(this._sdk.url()), MD5 ),
									new ExecutableServiceFactory(new XmlParser(this._sdk.createDOMParser()), new SOAPService(fetch, this._sdk.createDOMParser(), Utilities)), PubSub);

		this._filePicker = new FilePicker(new FileUtils(this._sdk.getMimeService()), new FilePickerFactory(sdk), this._sdk.filePickerConstants(), new LocalFileFactory(sdk), this._sdk.windowUtils(), PubSub);
		this._fileSharer = new FileSharer(this._httpServer, new UrlProvider(this._sdk.url()), MD5, PubSub);
		this._subscriptionService = new SubscriptionService(fetch, PubSub, this._httpServer, new HttpResponder(NetworkingUtils, new SocketSender()));
		this._tcpSender = new TCPSender(PubSub, this._sdk.timers(), new TCPSocketProvider(sdk), new SocketSender(), NetworkingUtils);
	}
	createDeviceLocator(){
		return this._ipResolver.resolveIPs().then( (ipAddresses) => {
			return new DeviceLocator(PubSub, MD5, this._sdk.timers(), fetch,
                        new DeviceFactory(fetch, new XmlParser(this._sdk.createDOMParser()), new UrlProvider(this._sdk.url()), MD5),
                        new ActiveSearcher(PubSub, this.createSSDPClients(Constants.activeEventPrefix, ipAddresses)),
                        new PassiveSearcher(PubSub, this.createSSDPClients(Constants.passiveEventPrefix, ipAddresses, Constants.MulticastPort)),
                        new AccessPointSearcher(PubSub, this._sdk.getWifiMonitor()),
                        this._sdk.storage(), this._serviceExecutor, this._sdk.notifications());
		}).then( (deviceLocator) => {
			deviceLocator.search();
		});
	}
	createButton(){
		var button = null;
		var menu = null;
		try { //desktop sdk
			button = this._sdk.button();
		}
		catch(e){ //sdk for Android
			menu = this._sdk.getNativeWindowMenu();
		}

		return new Button(PubSub, button, menu);
	}
	createPanel(){
		return new Panel(PubSub, this._sdk.panel());
	}
	createTab(){
		return new Tab(PubSub, this._sdk.tabs());
	}
	createSSDPClients(eventPrefix, ipAddresses, sourcePort){
		return ipAddresses.map((ipAddress) => {
			var ssdpClient = new SSDPClient(eventPrefix, PubSub, Utilities, this._udpSocketFactory.createUDPSocket(sourcePort), NetworkingUtils);
			ssdpClient.setMulticastInterface(ipAddress);
			return ssdpClient;
		});
	}
}

module.exports = CompositionRoot;