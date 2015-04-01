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
		this._deviceServices.on( 'EventOccured', ( device, event, request ) => {
			this.emit( 'EventOccured', device, event, JSON.stringify(request) );
		});
		this._deviceServices.on( 'deviceFound', ( device ) => {
			this.emit( 'additionalInformationFound', device, event, JSON.stringify(request) );
		});
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
			this._pageWorker.port.emit( event, a, b, c, d, e );
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
				this._pageWorker.port.on('load', (device, file) => {
					this._deviceServices.loadMedia(device, file);
				});
				this._pageWorker.port.on('setName', (device, name) => {
					this._deviceServices.setName(device, name);
				});
				this._pageWorker.port.on('reboot', (device) => {
					this._deviceServices.reboot(device);
				});
				this._pageWorker.port.on('play', (device, file) => {
					this._deviceServices.play(device, file);
				});
				this._pageWorker.port.on('pause', (device) => {
					this._deviceServices.pause(device);
				});
				this._pageWorker.port.on('previous', (device) => {
					this._deviceServices.previous(device);
				});
				this._pageWorker.port.on('next', (device) => {
					this._deviceServices.next(device);
				});
				this._pageWorker.port.on('stop', (device) => {
					this._deviceServices.stop(device);
				});
				this._pageWorker.port.on('setVolume', (device, newVolume) => {
					this._deviceServices.setVolume(device, newVolume);
				});
				this._pageWorker.port.on('toggleMute', (device) => {
					this._deviceServices.toggleMute(device);
				});
				this._pageWorker.port.on('getPositionInfo', (device) => {
					this._deviceServices.getPositionInfo(device).then(([deviceId, response]) => this.emit('positionInfo', deviceId, response));
				});

				this._pageWorker.port.on('refreshDevices', () => {
					this._emitter.emit(this, "refreshDevices");
				});
				this._pageWorker.port.on('loadDevices', () => {
					this._emitter.emit(this, "loadDevices");
				});
			},
			onClose: (tab) => {
				this._pageWorker = null;
			}
		});
	}
});

module.exports = Tab;