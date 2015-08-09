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
				var [eventSubUrl, serviceUUID, serverIP, timeoutInSeconds, subscriptionId] = data;

				var directResponsesTo = `http://${serverIP}:${this._simpleServer.port}/events/${serviceUUID}`;
				this._simpleServer.registerPath(`/events/${serviceUUID}`, (request) => this.sendToFrontEnd("UPnPEvent", serviceUUID, request.body));
				this._subscriptionService.subscribe(directResponsesTo, eventSubUrl, timeoutInSeconds, subscriptionId).then(
				(subscriptionId) => this.sendToFrontEnd("emitResponse", uniqueId, subscriptionId),
				(err) => this.sendToFrontEnd("emitResponse", uniqueId));
				break;
			case 'Unsubscribe':
				this._simpleServer.registerPath(`/events/${data[2]}`, null );
				this._subscriptionService.unsubscribe(...data).then(() => this.sendToFrontEnd("emitResponse", uniqueId));
				break;
			case 'CallService':
				var [service, method, info] = data;
				this._serviceExecutor.callService(service.controlUrl, service.uuid, method, info).then((response) => this.sendToFrontEnd("emitResponse", uniqueId, response));
				break;
			case 'chooseFiles':
				this._fileUtilities.openFileBrowser().then(files => this.sendToFrontEnd("emitResponse", uniqueId, files ? files : []));
				break;
			case 'shareFile':
				this.sendToFrontEnd("emitResponse", uniqueId, this._simpleServer.registerFile(...data));
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
}

module.exports = FrontEndBridge;