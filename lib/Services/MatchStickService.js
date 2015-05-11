const Constants = require('../Utilities/Constants');
const { Sender } = require('../libs/SenderDaemon');

class MatchStickService {
    constructor(eventer, messageFactory, messageService, urlProvider) {
        this._messageFactory = messageFactory;
        this._messageService = messageService;
        this._eventer = eventer;
        this._urlProvider = urlProvider;
    }
    launchMedia(deviceUrl, fileUri){
    	this.loadMedia(deviceUrl, fileUri);
        this.executeCommand('play');
    }
    loadMedia(deviceUrl, fileUri){
    	var deviceUrl = this._urlProvider.createUrl(deviceUrl).host;
        sender = new Sender(deviceUrl);
        sender.load("http://offbynone.github.io/Omniscience/DeviceFiles/Matchstick/MatchStickMediaPlayer.html", fileUri);
    }
    register(deviceUrl) {
        var data = {
            data: {name: "wifi-setting"},
            message_type: "register",
            meta: {reply: false /*, connection_mode: "single"*/},
            protocol_version: "1.0"
        };
        this._messageService.send(data, deviceUrl);
    }
    reboot(deviceUrl) {
        var address = this._urlProvider.createUrl(deviceUrl).host;
        var message = this._messageFactory.build("setting", "reboot_cast");
        this._messageService.send(message, address);
    }
    setScale(deviceUrl, ratio){
        //ratio should be a number between 0-100
    	var address = this._urlProvider.createUrl(deviceUrl).host;
        var message = this._messageFactory.build('scale', 'command', {ratio: ratio});
        this._messageService.send(message, address);
    }
    setWifi(deviceUrl, network) {
        var message = this._messageFactory.build("setting", "wifi", {
            "wifi-hidden": network.isHidden,
            "wifi-password": network.password,
            "wifi-type": network.securityType,
            "wifi-name": network.ssid,
            "wifi-bssid": network.routerMac
        });
        this._messageService.send(message, deviceUrl);
    }
    setTimezone(deviceUrl, timezone) {
        var message = this._messageFactory.build("setting", "wifi", {timezone: timezone});
        this._messageService.send(message, deviceUrl);
    }
    setName(deviceUrl, name) {
        var address = this._urlProvider.createUrl(deviceUrl).host;
        var message = this._messageFactory.build("setting", "change_ssid", {name: name});
        this._messageService.send(message, address);
    }
    getAccessPoints(deviceUrl) {
        var message = this._messageFactory.build("query", "ap-list");
        this._eventer.on("messageService.responseReceived", (response) => console.log(response));
        this._messageService.send(message, deviceUrl);
    }
    getAdditionalInformation(matchstick) {
        var message = this._messageFactory.build("query", "device_info");
        this._eventer.on("messageService.responseReceived", (response) => {
            matchstick.langauge = response.data.language;
            matchstick.macAddress = response.data.macAddress;
            matchstick.timezone = response.data.timezone;
            matchstick.softwareVersion = response.data.version;
            this._eventer.emit("matchstick.additionalInformationFound", matchstick);
        });
        var address = this._urlProvider.createUrl(matchstick.address).host;
        this._messageService.send(message, address);
    }
    getTVKeyCode(deviceUrl, macAddress) {
        var message = this._messageFactory.build("query", "key_code", {
        	ap_mac: macAddress.replaceAll("-", ":"),
            imei: 863985028265716
        });
        this._eventer.on("messageService.responseReceived", (response) => console.log(response));
        this._messageService.send(data, deviceUrl);
    }
}

module.exports = MatchStickService;