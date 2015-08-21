const { Eventable } = require('omniscience-utilities');

class FrontEndBridge extends Eventable {
	constructor(subscriptionService, serviceExecutor, fileUtilities, deviceService, simpleServer, simpleTCP) {
		super();
		this._subscriptionService = subscriptionService;
		this._serviceExecutor = serviceExecutor;
		this._fileUtilities = fileUtilities;
		this._deviceService = deviceService;
		this._simpleServer = simpleServer;
		this._simpleTCP = simpleTCP;

		this._deviceService.on('deviceFound', (...data) => this.sendToFrontEnd("deviceFound", ...data));
		this._deviceService.on('deviceLost', (...data) => this.sendToFrontEnd("deviceLost", ...data));
	}
	handleMessageFromFrontEnd(eventType, uniqueId, ...data) {
		switch (eventType) {
			case 'Subscribe':
				let [eventSubUrl, serviceUUID, serverIP, timeoutInSeconds, subscriptionId] = data;

				let directResponsesTo = `http://${serverIP}:${this._simpleServer.port}/events/${serviceUUID}`;
				this._simpleServer.registerPath(`/events/${serviceUUID}`, (request) => this.sendToFrontEnd("UPnPEvent", serviceUUID, request.body));
				this._subscriptionService.subscribe(directResponsesTo, eventSubUrl, timeoutInSeconds, subscriptionId).then(
					(subscriptionId) => this.sendToFrontEnd("emitResponse", uniqueId, subscriptionId),
					(err) => this.sendToFrontEnd("emitResponse", uniqueId));
				break;
			case 'Unsubscribe':
				this._simpleServer.registerPath(`/events/${data[2]}`, null);
				this._subscriptionService.unsubscribe(...data).then(() => this.sendToFrontEnd("emitResponse", uniqueId));
				break;
			case 'CallService':
				let [service, method, info] = data;
				this._serviceExecutor.callService(service.controlUrl, service.uuid, method, info).then((response) => this.sendToFrontEnd("emitResponse", uniqueId, response));
				break;
			case 'chooseFiles':
				this._fileUtilities.openFileBrowser().then(files => this.sendToFrontEnd("emitResponse", uniqueId, files ? files : []));
				break;
			case 'shareFile':
				let url = this._simpleServer.registerFile(...data);
				console.log(url);
				this.sendToFrontEnd("emitResponse", uniqueId, url);
				break;
			case 'loadDevices':
				this._deviceService.loadDevices();
				break;
			case 'refreshDevices':
				this._deviceService.search();
				break;
			case 'search':
				this._deviceService.search();
				break;
			case 'sendTCP':
				this._simpleTCP.send(...data).then((response) => this.sendToFrontEnd("emitResponse", uniqueId, response));
				break;
		}
	}
	sendToFrontEnd(eventType, ...data) {
		this.emit("sendToFrontEnd", eventType, ...data);
	}
	onMessageFromFrontEnd(message) {
		let messageObj;
		try {
			messageObj = JSON.parse(message);
		}
		catch (err) {
			console.log(message);
			console.log(err);
			return;
		}
		this.handleMessageFromFrontEnd(messageObj.eventType, ...messageObj.data);
	}

}

module.exports = FrontEndBridge;