const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const Device = Class({
	capabilities: null, //Capabilities
	model: null, //DeviceModel
	type: null, //Type
	manufacturer: null, //DeviceManufacturer
	upnpVersion: null, //UPnPVersion
	address: null, //URL
	id: null, //m5d of device address
	serialNumber: "",
	webPage: "", //URL to presentationURL
	ssdpDescription: "", //URL to xml
	responseHash: null, //md5 of the response.text
	name: "",
	udn: "",
	rawDiscoveryInfo: "", //ssdpDescription text
	icons: {},
	services: {},
	ssdpResponseHeaders: [],
	playlist: [],
	supportedFormats: [],
	initialize: function initialize() {}
});

module.exports = Device;