const FrontEndBridge = require('./FrontEndBridge');

const Networking = require("omniscience-networking");
const UPnP = require("omniscience-upnp");
const SdkResolver = require('omniscience-sdk-resolver');

class CompositionRoot {
	constructor() {
		this._sdk = new SdkResolver().resolve();
		this._upnp = new UPnP();
		this._networking = new Networking();
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

		const Button = require('./UI/Button');
		return new Button(button, menu);
	}
	createHttpServer() {
		return this._networking.createHttpServer();
	}
	getServiceExecutor() {
		return this._upnp.getServiceExecutor();
	}
	createDeviceService(serviceExecutor) {
		return this._upnp.createDeviceService();
	}
	createFrontEndBridge(deviceService, serviceExecutor, httpServer) {
		return new FrontEndBridge(this._upnp.createSubscriptionService(), serviceExecutor, this._sdk.FileUtilities, this._networking.createFileSharer(httpServer), deviceService, httpServer, this._networking.createTCPCommunicator());
	}
	createTab(button, frontEndBridge) {
		const Tab = require('./UI/Tab');
		return new Tab(this._sdk.tabs(), button, frontEndBridge);
	}

}

module.exports = CompositionRoot;