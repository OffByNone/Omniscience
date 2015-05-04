const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');

const Tab = Class({
	extends: EventTarget,
	initialize: function initialize(deviceServices, emitter, tabs, fileService) {
		this._tabs = tabs;
		this._pageWorker = null;
		this._emitter = emitter;
		this._deviceServices = deviceServices;
		this._fileService = fileService;
	},
	emit: function emit(event){
		//accepts n number of arguments, first must be event name
		args = this._makeSafeForEmit.apply(this, arguments);

		if(this._pageWorker)
			this._pageWorker.port.emit.apply(this, args);
	},
	openFocus: function openFocus() {
		if (this._pageWorker) return this._pageWorker.tab.activate();

		this._tabs.open({
			url: Constants.tab.html,
			onLoad: (tab) => {
				this._pageWorker = tab.attach({
					contentScriptFile: Constants.tab.js
				});
				this._pageWorker.port.on('chooseFiles', (uniqueId) => {
					this._fileService.openFile().then( files => {
						this.emit('emitResponse', uniqueId, files ? files : []);
					});
				});
				this._pageWorker.port.on('shareFile', (uniqueId, file, serverIP) => {
				    var result = this._fileService.shareFile(file, serverIP);
					this.emit('emitResponse', uniqueId, result);
				});
				this._pageWorker.port.on('CallService', (uniqueId, service, serviceMethod, data) =>
					this._deviceServices.callService(service.controlUrl, service.hash, serviceMethod, data).
						then( (response) => this.emit("CallServiceResponse", uniqueId, response) ));

				this._pageWorker.port.on('Subscribe', (uniqueId, subscriptionUrl, subscriptionId, serviceHash, serverIP, timeout) =>
					this._deviceServices.subscribe(subscriptionUrl, subscriptionId, serviceHash, serverIP, timeout).
						then( (eventSubscriptionId) => this.emit("emitResponse", uniqueId, eventSubscriptionId) ));
				this._pageWorker.port.on('Unsubscribe', (uniqueId, subscriptionUrl, subscriptionId, serviceHash) =>
					this._deviceServices.unsubscribe(subscriptionUrl, subscriptionId, serviceHash).
						then( () => this.emit("emitResponse", uniqueId) ));
				this._deviceServices.on('UPnPEvent', ( serviceHash, requestBody ) => {
					this.emit( 'UPnPEvent', serviceHash, requestBody );
				});


				this._pageWorker.port.on('saveState', (uniqueId, deviceId, serviceName, state) => this._emitter.emit(this, "updateState", deviceId, serviceName, state));
				this._pageWorker.port.on('refreshDevices', () => this._emitter.emit(this, "refreshDevices") );
				this._pageWorker.port.on('loadDevices', () => this._emitter.emit(this, "loadDevices") );
			},
			onClose: (tab) => {
				this._pageWorker = null;
			}
		});
	},
	_makeSafeForEmit: function () {
		//The panel serializes out the data object using the below two lines
		//the tab does not, therefore the same data sent to both will not appear the same unless we add the below lines
		var replacer = (key, value) => typeof (value) === "function" ? void (0) : value;

		return Array.prototype.map.call(arguments, (argument) => JSON.parse(JSON.stringify(argument, replacer)));
	}
});

module.exports = Tab;