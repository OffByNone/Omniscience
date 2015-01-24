const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { merge } = require('sdk/util/object'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/util_object
const { Request } = require('sdk/request'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/request
const { defer } = require('sdk/core/promise'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/core_promise
const { URL } = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url
const { emit } = require('sdk/event/core'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/event/core.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const { Message } = require('../Network/Message');
const IOC = require('../IOC');
const constants = require('../Constants');
const { JXON } = require('../JXON');

const createDevice = function(location) {
	var deferred = defer();
	Request({
		url: location,
		onComplete: (response) => {
			var parser = IOC.createDOMParser();
			var responseXML = parser.parseFromString(response.text, 'text/xml');
			var responseObj = JXON.build(responseXML.childNodes[0]);
			var deviceProperties = {
				address: new URL(responseObj.urlbase),
				type: responseObj.device.devicetype,
				name: responseObj.device.friendlyname,
				manufacturer: responseObj.device.manufacturer,
				model: responseObj.device.modelname,
				udn: responseObj.device.udn,
				version: responseObj.specversion.major + '.' + responseObj.specversion.minor,
				icon: {
					mimeType: responseObj.device.iconlist ? responseObj.device.iconlist.icon.mimetype : '',
					width: responseObj.device.iconlist ? responseObj.device.iconlist.icon.width : 40,
					height: responseObj.device.iconlist ? responseObj.device.iconlist.icon.height : 40,
					depth: responseObj.device.iconlist ? responseObj.device.iconlist.icon.depth : 40,
					url: responseObj.device.iconlist ? responseObj.urlbase + responseObj.device.iconlist.icon.url : ''
				}
			};
			var device = new Device(deviceProperties);
			if (device.model === constants.MatchstickModelName) device.getAdditionalInformation();

			deferred.resolve(device);
		}
	}).get();

	return deferred.promise;
};

const Device = Class({
	extends: EventTarget,
	protocolVersion : "1.0",
	initialize: function initialize(options) {
		EventTarget.prototype.initialize.call(this, options);
		merge(this, options);
	},
	register : function register(){
		var message = new Message();
		var data = {data: {name: "wifi-setting"}, message_type: "register", meta: {reply: false, connection_mode: "single"}, protocol_version: "1.0"};
		message.send(data, this.address);
	},
	reboot : function reboot(){
		var message = new Message();
		var data = message.build("setting","reboot_cast");
		message.send(data, this.address);
	},
	setWiFi : function setWiFi(network){
		var message = new Message();
		var data = message.build("setting", "wifi", { "wifi-hidden": network.isHidden, "wifi-password": network.password, "wifi-type": network.securityType, "wifi-name": network.ssid, "wifi-bssid": network.routerMac });
		message.send(data, this.address);
	},
	setTimezone : function setTimezone(timezone){
		var message = new Message();
		var data = message.build("setting", "wifi", { timezone: timezone });
		message.send(data, this.address);
	},
	setName : function setName(name){
		var message = new Message();
		var data = message.build("setting", "wifi", { name: name });
		message.send(data, this.address);
	},
	getAccessPoints : function getAccessPoints(){
		var message = new Message();
		var data = message.build("query", "ap-list");
		message.on("responseReceived", (response) => {
			console.log(response);
		});
		message.send(data, this.address);
	},
	getAdditionalInformation : function getInfo(){
		var message = new Message();
		var data = message.build("query", "device_info");
		message.on("responseReceived", (response) => {
			this.langauge = response.data.language;
			this.macAddress = response.data.macAddress;
			this.timezone = response.data.timezone;
			this.softwareVersion = response.data.version;
			emit(this,"additionalInformationFound");
		});
		message.send(data, this.address);
	},
	getTVKeyCode : function getTVKeyCode(){
		var message = new Message();
		var data = message.build("query", "key_code", { ap_mac: this.macAddress.replaceAll("-",":"), imei: 863985028265716 });
		message.on("responseReceived", (response) => {
			console.log(response);
		});
		message.send(data, this.address);
	}
});

exports.createDevice = createDevice;