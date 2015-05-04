const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../../Utilities/Constants');
const { Sender } = require("../../libs/SenderDaemon");

class MatchStickService extends EventTarget {
    constructor(emitter, messageFactory, messageService, urlProvider) {
        this._messageFactory = messageFactory;
        this._messageService = messageService;
        this._emitter = emitter;
        this.serviceType = "unknown";
        this._urlProvider = urlProvider;
    }
    launchMedia(matchstick, fileUri){
        this.loadMedia(matchstick, fileUri);
        this.executeCommand('play');
    }
    loadMedia(matchstick, fileUri){
        var matchstickAddress = this._urlProvider.createUrl(matchstick.address).host;
        sender = new Sender(matchstickAddress);
        sender.load("http://offbynone.github.io/Omniscience/DeviceFiles/Matchstick/MatchStickMediaPlayer.html", fileUri);
    }
    register(matchstick) {
        var data = {
            data: {name: "wifi-setting"},
            message_type: "register",
            meta: {reply: false /*, connection_mode: "single"*/},
            protocol_version: "1.0"
        };
        this._messageService.send(data, matchstick.address);
    }
    reboot(matchstick) {
        var address = this._urlProvider.createUrl(matchstick.address).host;
        var message = this._messageFactory.build("setting", "reboot_cast");
        this._messageService.send(message, address);
    }
    setScale(matchstick, ratio){
        //ratio should be a number between 0-100
        var address = this._urlProvider.createUrl(matchstick.address).host;
        var message = this._messageFactory.build('scale', 'command', {ratio: ratio});
        this._messageService.send(message, address);
    }
    setWifi(matchstick, network) {
        var message = this._messageFactory.build("setting", "wifi", {
            "wifi-hidden": network.isHidden,
            "wifi-password": network.password,
            "wifi-type": network.securityType,
            "wifi-name": network.ssid,
            "wifi-bssid": network.routerMac
        });
        this._messageService.send(message, matchstick.address);
    }
    setTimezone(matchstick, timezone) {
        var message = this._messageFactory.build("setting", "wifi", {timezone: timezone});
        this._messageService.send(message, matchstick.address);
    }
    setName(matchstick, name) {
        var address = this._urlProvider.createUrl(matchstick.address).host;
        var message = this._messageFactory.build("setting", "change_ssid", {name: name});
        this._messageService.send(message, address);
    }
    getAccessPoints(matchstick) {
        var message = this._messageFactory.build("query", "ap-list");
        this._messageService.on("responseReceived", (response) => {
            console.log(response);
        });
        this._messageService.send(message, matchstick.address);
    }
    getAdditionalInformation(matchstick) {
        var message = this._messageFactory.build("query", "device_info");
        this._messageService.on("responseReceived", (response) => {
            matchstick.langauge = response.data.language;
            matchstick.macAddress = response.data.macAddress;
            matchstick.timezone = response.data.timezone;
            matchstick.softwareVersion = response.data.version;
            this._emitter.emit(this, "additionalInformationFound", matchstick);
        });
        var address = this._urlProvider.createUrl(matchstick.address).host;
        this._messageService.send(message, address);
    }
    getTVKeyCode(matchstick) {
        var message = this._messageFactory.build("query", "key_code", {
            ap_mac: matchstick.macAddress.replaceAll("-", ":"),
            imei: 863985028265716
        });
        this._messageService.on("responseReceived", (response) => {
            console.log(response);
        });
        this._messageService.send(data, matchstick.address);
    }
}

module.exports = MatchStickService;