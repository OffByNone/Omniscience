const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const { URL } = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url

const Constants = require('../../Constants');
const { Sender } = require("../../libs/SenderDaemon");

const MatchStickService = Class({
	extends: EventTarget,
    initialize: function initialize(emitter, messageFactory, messageService, defer) {
		this._messageFactory = messageFactory;
		this._messageService = messageService;
        this._emitter = emitter;
        this._defer = defer;
        this.serviceType = "unknown";
	},
    launchMedia: function launchMedia(matchstick, fileUri){
        this.loadMedia(matchstick, fileUri);
        this.executeCommand('play');
    },
    loadMedia: function loadMedia(matchstick, fileUri){
        var matchstickAddress = new URL(matchstick.address).host;
        sender = new Sender(matchstickAddress);
        sender.load("http://offbynone.github.io/Omniscience/DeviceFiles/Matchstick/MatchStickMediaPlayer.html", fileUri);
    },
	register: function register(matchstick) {
		var data = {
			data: {name: "wifi-setting"},
			message_type: "register",
			meta: {reply: false /*, connection_mode: "single"*/},
			protocol_version: "1.0"
		};
		this._messageService.send(data, matchstick.address);
	},
	reboot: function reboot(matchstick) {
        var address = new URL(matchstick.address).host;
		var message = this._messageFactory.build("setting", "reboot_cast");
		this._messageService.send(message, address);
	},
    setScale: function setScale(matchstick, ratio){
        //ratio should be a number between 0-100
        var address = new URL(matchstick.address).host;
        var message = this._messageFactory.build('scale', 'command', {ratio: ratio});
        this._messageService.send(message, address);
    },
	setWifi: function setWifi(matchstick, network) {
		var message = this._messageFactory.build("setting", "wifi", {
			"wifi-hidden": network.isHidden,
			"wifi-password": network.password,
			"wifi-type": network.securityType,
			"wifi-name": network.ssid,
			"wifi-bssid": network.routerMac
		});
		this._messageService.send(message, matchstick.address);
	},
	setTimezone: function setTimezone(matchstick, timezone) {
		var message = this._messageFactory.build("setting", "wifi", {timezone: timezone});
		this._messageService.send(message, matchstick.address);
	},
	setName: function setName(matchstick, name) {
        var address = new URL(matchstick.address).host;
		var message = this._messageFactory.build("setting", "change_ssid", {name: name});
		this._messageService.send(message, address);
	},
	getAccessPoints: function getAccessPoints(matchstick) {
		var message = this._messageFactory.build("query", "ap-list");
		this._messageService.on("responseReceived", (response) => {
			console.log(response);
		});
		this._messageService.send(message, matchstick.address);
	},
	getAdditionalInformation: function getAdditionalInformation(matchstick) {
		var message = this._messageFactory.build("query", "device_info");
		this._messageService.on("responseReceived", (response) => {
			matchstick.langauge = response.data.language;
			matchstick.macAddress = response.data.macAddress;
			matchstick.timezone = response.data.timezone;
			matchstick.softwareVersion = response.data.version;
			this._emitter.emit(this, "additionalInformationFound", matchstick);
		});
        var address = new URL(matchstick.address).host;
		this._messageService.send(message, address);
	},
	getTVKeyCode: function getTVKeyCode(matchstick) {
		var message = this._messageFactory.build("query", "key_code", {
			ap_mac: matchstick.macAddress.replaceAll("-", ":"),
			imei: 863985028265716
		});
		this._messageService.on("responseReceived", (response) => {
			console.log(response);
		});
		this._messageService.send(data, matchstick.address);
	}
});

module.exports = MatchStickService;