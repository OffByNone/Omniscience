const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const ServiceInfo = Class({
	initialize: function initialize() {
		this.controlUrl = null; //URL
		this.eventSubUrl = null; //URL
		this.scpdUrl = null; //URL
		this.type = null; //Type
		this.upnpVersion = null; //UPnPVersion
		this.responseHash = null; //md5 of the scpd response.text
		this.id = null;
		this.properties = [];
		this.methods = [];
	}
});

module.exports = ServiceInfo;