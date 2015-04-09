const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const Device = Class({
	initialize: function initialize() {
		this.capabilities = null; //Capabilities
		this.model = null; //DeviceModel
		this.type = null; //Type
		this.manufacturer = null; //DeviceManufacturer
		this.upnpVersion = null; //UPnPVersion
		this.address = null; //URL
		this.id = null; //m5d of device address
		this.serialNumber = "";
		this.webPage = ""; //URL to presentationURL
		this.ssdpDescription = ""; //URL to xml
		this.responseHash = null; //md5 of the response.text
		this.name = "";
		this.udn = "";
		this.rawDiscoveryInfo = ""; //ssdpDescription text
		this.icons = [];
		this.services = [];
		this.ssdpResponseHeaders = {};
		this.playlist = [];
		this.supportedFormats = [];
	}
});

module.exports = Device;