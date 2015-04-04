const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');

const Tab = Class({
	extends: EventTarget,
	initialize: function initialize(filePicker, deviceServices, emitter, tabs) {
		this._tabs = tabs;
		this._pageWorker = null;
		this._emitter = emitter;
		this._filePicker = filePicker;
		this._deviceServices = deviceServices;
	},
	emit: function emit(event, a, b, c, d, e){
		//The panel serializes out the data object using the below two lines
		//the tab does not, therefore the same data sent to both will not appear the same unless we add the below lines

		let replacer = (k, v) => typeof(v) === "function" ?  void(0) : v;

		//todo: not sure I need these null checks
		a = a == null ? null : JSON.parse(JSON.stringify(a, replacer));
		b = b == null ? null : JSON.parse(JSON.stringify(b, replacer));
		c = c == null ? null : JSON.parse(JSON.stringify(c, replacer));
		d = d == null ? null : JSON.parse(JSON.stringify(d, replacer));
		e = e == null ? null : JSON.parse(JSON.stringify(e, replacer));

		if(this._pageWorker)
			this._pageWorker.port.emit( event, a, b, c, d, e ); //todo: use .call to pass in an array for the second param to avoid the stupid a, b, c, d, e
	},
	openFocus: function openFocus() {
		if (this._pageWorker) return this._pageWorker.tab.activate();

		this._tabs.open({
			url: Constants.tab.html,
			onLoad: (tab) => {
				this._pageWorker = tab.attach({
					contentScriptFile: Constants.tab.js
				});
				this._pageWorker.port.on('chooseFile', (device) => {
					this._filePicker.openFile().then( files => {
						this._pageWorker.port.emit('filesChosen', files ? files : []);
					});
				});
				this._deviceServices.on( 'EventOccured', ( service, event, request ) => {
					this.emit( 'EventOccured', service, event, request );
				});
				this._pageWorker.port.on('CallService', (uniqueId, service, serviceMethod, data) =>
					this._deviceServices.callService(service.controlUrl, service.type.urn, serviceMethod, data).
						then( (response) => this.emit("CallServiceResponse", uniqueId, response) ));

				this._pageWorker.port.on('refreshDevices', () => this._emitter.emit(this, "refreshDevices") );
				this._pageWorker.port.on('loadDevices', () => this._emitter.emit(this, "loadDevices") );
			},
			onClose: (tab) => {
				this._pageWorker = null;
			}
		});
	}
});

module.exports = Tab;