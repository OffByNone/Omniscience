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

const createDevice = function createDevice(location, headers) {
	if (location.indexOf("http") != 0)
		location = "http://" + location; //fuck you microsoft for returning invalid urls!
	var deferred = defer();
	Request({
		url: location,
		onComplete: (response) => {
			var parser = IOC.createDOMParser();
			var responseXML = parser.parseFromString(response.text, 'text/xml');
			try {
				var responseObj = JXON.build(responseXML.childNodes[0]);
			}
			catch (e) {
				console.log(response);
				deferred.resolve(null);
				return;
			}
			var device = new Device(responseObj);
			var base = responseObj.baseurl || new URL(location).origin;
			device.address = new URL(base);
			device.upnpVersion = responseObj.specversion.major + '.' + responseObj.specversion.minor;
			device.serialNumber = responseObj.device.serialnumber;
			device.webPage = responseObj.device.presentationurl;
			device.type = {
				urn: responseObj.device.devicetype,
				name: constants.DeviceTypes.filter(x=> x[1] === responseObj.device.devicetype).map(x=> x[0])[0]

			};
			device.name = responseObj.device.friendlyname;
			device.manufacturer = {
				name: responseObj.device.manufacturer,
				url: responseObj.device.manufacturerurl
			};
			device.model = {
				number: responseObj.device.modelnumber,
				description: responseObj.device.modeldescription,
				name: responseObj.device.modelname,
				url: responseObj.device.modelurl,
				udn: responseObj.device.udn
			};

			if (!responseObj.device.iconlist || !responseObj.device.iconlist.icon)
				device.icons = [];
			else if (Array.isArray(responseObj.device.iconlist.icon)) {
				device.icons = responseObj.device.iconlist.icon.map(x=> {
					return {
						mimeType: x.mimetype,
						width: x.width,
						height: x.height,
						depth: x.depth,
						url: toURL(base, x.url)
					};
				});
			}
			else if (typeof responseObj.device.iconlist.icon === 'object') {
				device.icons = [];
				device.icons.push({
					mimeType: responseObj.device.iconlist.icon.mimetype,
					width: responseObj.device.iconlist.icon.width,
					height: responseObj.device.iconlist.icon.height,
					depth: responseObj.device.iconlist.icon.depth,
					url: toURL(base, responseObj.device.iconlist.icon.url)
				});
			}
			if (!responseObj.device.servicelist || !responseObj.device.servicelist.service)
				device.services = [];
			else if (Array.isArray(responseObj.device.servicelist.service)) {
				device.services = responseObj.device.servicelist.service.map(x=> {
					return {
						controlUrl: toURL(base, x.controlurl),
						eventsSubUrl: toURL(base, x.eventssuburl),
						scpdUrl: toURL(base, x.scpdurl),
						id: x.serviceid,
						type: {
							urn: x.servicetype,
							name: constants.ServiceTypes.filter(y=> y[1] === x.servicetype).map(y=> y[0])[0]
						}
					};
				});
			}
			else if (typeof responseObj.device.servicelist.service === 'object') {
				device.services = [];
				device.services.push({
					controlUrl: toURL(base, responseObj.device.servicelist.service.controlurl),
					eventsSubUrl: toURL(base, responseObj.device.servicelist.service.eventssuburl),
					scpdUrl: toURL(base, responseObj.device.servicelist.service.scpdurl),
					id: responseObj.device.servicelist.service.serviceid,
					type: {
						urn: responseObj.device.servicelist.service.servicetype,
						name: constants.ServiceTypes.filter(x=> x[1] === responseObj.device.servicelist.service.servicetype).map(x=> x[0])[0]
					}
				});
			}


			if (device.model === constants.MatchstickModelName) device.getAdditionalInformation();
			deferred.resolve(device);
		}
	}).get();

	return deferred.promise;
};

function toURL(baseUrl, path) {
	//this will return null for undefined and not found paths
	if (!path || path === '/ssdp/notfound')
		return null;

	return new URL(baseUrl + path);
}

const Device = Class({
	extends: EventTarget,
	initialize: function initialize(rawResponse) {
		this.rawResponse = rawResponse;
	},
	register: function register() {
		var message = new Message();
		var data = {
			data: {name: "wifi-setting"},
			message_type: "register",
			meta: {reply: false, connection_mode: "single"},
			protocol_version: "1.0"
		};
		message.send(data, this.address);
	},
	reboot: function reboot() {
		var message = new Message();
		var data = message.build("setting", "reboot_cast");
		message.send(data, this.address);
	},
	setUrl: function setUrl(address) {
		if (typeof address === 'URL') this.address = address;
		if (typeof address === 'string') this.address = new URL(address);
	},
	setWifi: function setWifi(network) {
		var message = new Message();
		var data = message.build("setting", "wifi", {
			"wifi-hidden": network.isHidden,
			"wifi-password": network.password,
			"wifi-type": network.securityType,
			"wifi-name": network.ssid,
			"wifi-bssid": network.routerMac
		});
		message.send(data, this.address);
	},
	setTimezone: function setTimezone(timezone) {
		var message = new Message();
		var data = message.build("setting", "wifi", {timezone: timezone});
		message.send(data, this.address);
	},
	setName: function setName(name) {
		var message = new Message();
		var data = message.build("setting", "wifi", {name: name});
		message.send(data, this.address);
	},
	getAccessPoints: function getAccessPoints() {
		var message = new Message();
		var data = message.build("query", "ap-list");
		message.on("responseReceived", (response) => {
			console.log(response);
		});
		message.send(data, this.address);
	},
	getAdditionalInformation: function getAdditionalInformation() {
		var message = new Message();
		var data = message.build("query", "device_info");
		message.on("responseReceived", (response) => {
			this.langauge = response.data.language;
			this.macAddress = response.data.macAddress;
			this.timezone = response.data.timezone;
			this.softwareVersion = response.data.version;
			emit(this, "additionalInformationFound");
		});
		message.send(data, this.address);
	},
	getTVKeyCode: function getTVKeyCode() {
		var message = new Message();
		var data = message.build("query", "key_code", {
			ap_mac: this.macAddress.replaceAll("-", ":"),
			imei: 863985028265716
		});
		message.on("responseReceived", (response) => {
			console.log(response);
		});
		message.send(data, this.address);
	}
});

exports.createDevice = createDevice;