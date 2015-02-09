const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const constants = require('../Constants');

const MatchStick = Class({
	extends: EventTarget,
    initialize: function initialize(emitter, messageFactory, messenger) {
		this._messageFactory = messageFactory;
		this._messenger = messenger;
        this._emitter = emitter;
        this.mirrorCapable = true;
        this.audioCapable = true;
        this.videoCapable = true;
	},
	register: function register() {
		var data = {
			data: {name: "wifi-setting"},
			message_type: "register",
			meta: {reply: false, connection_mode: "single"},
			protocol_version: "1.0"
		};
		this._messenger.send(data, this.address);
	},
	reboot: function reboot() {
		var message = this._messageFactory.build("setting", "reboot_cast");
		this._messenger.send(data, this.address);
	},
	setWifi: function setWifi(network) {
		var message = this._messageFactory.build("setting", "wifi", {
			"wifi-hidden": network.isHidden,
			"wifi-password": network.password,
			"wifi-type": network.securityType,
			"wifi-name": network.ssid,
			"wifi-bssid": network.routerMac
		});
		this._messenger.send(data, this.address);
	},
	setTimezone: function setTimezone(timezone) {
		var message = this._messageFactory.build("setting", "wifi", {timezone: timezone});
		this._messenger.send(data, this.address);
	},
	setName: function setName(name) {
		var message = this._messageFactory.build("setting", "wifi", {name: name});
		this._messenger.send(data, this.address);
	},
	getAccessPoints: function getAccessPoints() {
		var message = this._messageFactory.build("query", "ap-list");
		this._messenger.on("responseReceived", (response) => {
			console.log(response);
		});
		this._messenger.send(data, this.address);
	},
	getAdditionalInformation: function getAdditionalInformation() {
		var message = this._messageFactory.build("query", "device_info");
		this._messenger.on("responseReceived", (response) => {
			this.langauge = response.data.language;
			this.macAddress = response.data.macAddress;
			this.timezone = response.data.timezone;
			this.softwareVersion = response.data.version;
			this._emitter.emit(this, "additionalInformationFound");
		});
		this._messenger.send(message, this.address);
	},
	getTVKeyCode: function getTVKeyCode() {
		var message = this._messageFactory.build("query", "key_code", {
			ap_mac: this.macAddress.replaceAll("-", ":"),
			imei: 863985028265716
		});
		this._messenger.on("responseReceived", (response) => {
			//console.log(response);
		});
		this._messenger.send(data, this.address);
	}
});

exports.MatchStick = MatchStick;