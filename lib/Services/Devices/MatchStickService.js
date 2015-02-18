const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const constants = require('../../Constants');
const { Sender } = require("../../SenderDaemon");

const MatchStickService = Class({
	extends: EventTarget,
    initialize: function initialize(emitter, messageFactory, messageService) {
		this._messageFactory = messageFactory;
		this._messageService = messageService;
        this._emitter = emitter;
	},
    launchMediaPlayer: function launchMediaPlayer(matchstickAddress, serverAddress, filePath){
        sender = new Sender(matchstickAddress, serverAddress);
        sender.launch("//offbynone.github.io/Rotary/DeviceFiles/Matchstick/MatchStickMediaPlayer.html", filePath);
        this.setProperty(filePath);
        this.executeCommand('play');
    },
    setProperty: function setProperty (matchstick, property){
    
    },
    executeCommand: function executeCommand(matchstick, command){
    
    },
	register: function register(matchstick) {
		var data = {
			data: {name: "wifi-setting"},
			message_type: "register",
			meta: {reply: false, connection_mode: "single"},
			protocol_version: "1.0"
		};
		this._messageService.send(data, matchstick.address);
	},
	reboot: function reboot(matchstick) {
		var message = this._messageFactory.build("setting", "reboot_cast");
		this._messageService.send(data, matchstick.address);
	},
	setWifi: function setWifi(matchstick, network) {
		var message = this._messageFactory.build("setting", "wifi", {
			"wifi-hidden": network.isHidden,
			"wifi-password": network.password,
			"wifi-type": network.securityType,
			"wifi-name": network.ssid,
			"wifi-bssid": network.routerMac
		});
		this._messageService.send(data, matchstick.address);
	},
	setTimezone: function setTimezone(matchstick, timezone) {
		var message = this._messageFactory.build("setting", "wifi", {timezone: timezone});
		this._messageService.send(data, matchstick.address);
	},
	setName: function setName(matchstick, name) {
		var message = this._messageFactory.build("setting", "wifi", {name: name});
		this._messageService.send(data, matchstick.address);
	},
	getAccessPoints: function getAccessPoints(matchstick) {
		var message = this._messageFactory.build("query", "ap-list");
		this._messageService.on("responseReceived", (response) => {
			console.log(response);
		});
		this._messageService.send(data, matchstick.address);
	},
	getAdditionalInformation: function getAdditionalInformation(matchstick) {
		var message = this._messageFactory.build("query", "device_info");
		this._messageService.on("responseReceived", (response) => {
			matchstick.langauge = response.data.language;
			matchstick.macAddress = response.data.macAddress;
			matchstick.timezone = response.data.timezone;
			matchstick.softwareVersion = response.data.version;
			this._emitter.emit(this, "additionalInformationFound");
		});
		this._messageService.send(message, matchstick.address);
	},
	getTVKeyCode: function getTVKeyCode(matchstick) {
		var message = this._messageFactory.build("query", "key_code", {
			ap_mac: matchstick.macAddress.replaceAll("-", ":"),
			imei: 863985028265716
		});
		this._messageService.on("responseReceived", (response) => {
			//console.log(response);
		});
		this._messageService.send(data, matchstick.address);
	}
});

exports.MatchStickService = MatchStickService;