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
			button = this._sdk.firefox.button();
		}
		catch(e){ //sdk for Android
			menu = this._sdk.firefox.getNativeWindowMenu();
		}

		const Button = require('./Firefox/Button');
		return new Button(button, menu);
	}
	createSimpleServer() {
		return this._networking.createSimpleServer();
	}
	getServiceExecutor() {
		return this._upnp.getServiceExecutor();
	}
	createDeviceService(serviceExecutor) {
		return this._upnp.createDeviceService();
	}
	createFrontEndBridge(deviceService, serviceExecutor, simpleServer) {
		return new FrontEndBridge(this._upnp.createSubscriptionService(), serviceExecutor, this._sdk.createFileUtilities(), deviceService, simpleServer, this._sdk.createSimpleTCP());
	}
	createTab(button, frontEndBridge) {
		const Tab = require('./Firefox/Tab');
		return new Tab(this._sdk.firefox.tabs(), button, frontEndBridge);
	}

}

module.exports = CompositionRoot;