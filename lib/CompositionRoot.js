const Tab = require('./UI/Tab');
const Button = require('./UI/Button');

const Constants = require('./Utilities/Constants');
const TCPSocketProvider = require('./Utilities/TCPSocketProvider');
const FrontEndBridge = require('./Services/FrontEndBridge');
const DeviceService = require('./Services/DeviceService');

const HttpServer = require("omniscience-http-server");
const SSDPSearcher = require("omniscience-ssdp-searcher");
const Utilities = require("omniscience-utilities");
const UPnP = require("omniscience-upnp");

class CompositionRoot {
	constructor(sdk) {
		this._sdk = sdk;
		//this._tcpSender = new TCPSender(this._sdk.timers(), new TCPSocketProvider(sdk), new SocketSender(), NetworkingUtils); //used by matchstick
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

		return new Button(button, menu);
	}
	createHttpServer() {
		return HttpServer.createHttpServer();
	}
	createServiceExecutor() {
		return UPnP.createServiceExecutor();
	}
	createDeviceService(serviceExecutor) {
		return SSDPSearcher.createDeviceLocator().then((deviceLocator) => {
			return new DeviceService(UPnP.createDeviceFactory(), deviceLocator, this._sdk.storage(), serviceExecutor, this._sdk.notifications());
		});
	}
	createFrontEndBridge(deviceService, serviceExecutor, httpServer) {
		return new FrontEndBridge(UPnP.createSubscriptionService(), serviceExecutor, this._sdk.FileUtilities, HttpServer.createFileSharer(httpServer), deviceService, httpServer);
	}
	createTab(button, frontEndBridge) {
		return new Tab(this._sdk.tabs(), button, frontEndBridge);
	}

}

module.exports = CompositionRoot;