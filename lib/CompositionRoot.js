const { fetch } = require('./libs/fetch');
const MD5 = require('./libs/MD5');


const Panel = require('./UI/Panel');
const Tab = require('./UI/Tab');
const Button = require('./UI/Button');

const Constants = require('./Utilities/Constants');
const TCPSocketProvider = require('./Utilities/TCPSocketProvider');

const HttpServer = require("omniscience-httpserver");
const DeviceLocator = require("omniscience-ssdp-searcher");

class CompositionRoot {
	constructor(sdk) {
		this._sdk = sdk;
		this._httpServer = HttpServer.createHttpServer()
		this._httpServer.start();

		this._tcpSender = new TCPSender(PubSub, this._sdk.timers(), new TCPSocketProvider(sdk), new SocketSender(), NetworkingUtils); //used by matchstick
	}
	createDeviceLocator(){
		return DeviceLocator.createDeviceLocator();
	}
	/*
	from SubscriptionService, but it doesnt belong there and needs to be somewhere in the glue
		this._pubSub.sub('Subscribe', (uniqueId, subscriptionUrl, subscriptionId, serviceHash, serverIP, timeout) =>

		this.subscribe(subscriptionUrl, subscriptionId, serviceHash, serverIP, timeout).
			then((eventSubscriptionId) => this._pubSub.pub("emitResponse", uniqueId, eventSubscriptionId)));

		this._pubSub.sub('Unsubscribe', (uniqueId, subscriptionUrl, subscriptionId, serviceHash) =>
			this.unsubscribe(subscriptionUrl, subscriptionId, serviceHash).
				then(() => this._pubSub.pub("emitResponse", uniqueId))
		);

		from subscribe
			var directResponsesTo = `http://${serverIP}:${this._httpServer.port}/events/${serviceHash}`;

			this._httpServer.registerPath(directResponsesTo, (request, resolve) => {
				this.emit("UPnPEvent", serviceHash, request.body);
				this._httpResponder.sendOkResponse(request.socket);
			});

		from unsubscribe
			this._httpServer.registerPath(`/events/${serviceHash}`, null );

	from ServiceExecutor
        this._pubSub.sub('CallService', (uniqueId, service, serviceMethod, data) =>
        	this.callService(service.controlUrl, service.hash, serviceMethod, data).
				then((response) => this._pubSub.pub("emitResponse", uniqueId, response)));

	from FilePicker
		this._pubSub.sub('chooseFiles', (uniqueId) => {
        	this.openFile().then(files => {
        		this._pubSub.pub('emitResponse', uniqueId, files ? files : []);
        	});
		});

	from filesharer
		this._pubSub.sub('shareFile', (uniqueId, file, serverIP) => {
        	this._pubSub.pub('emitResponse', uniqueId, this.shareFile(file, serverIP));
        });

*/
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

}

module.exports = CompositionRoot;