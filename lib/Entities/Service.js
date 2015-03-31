const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const Service = Class({
	controlUrl: null, //URL
	eventSubUrl: null, //URL
	scpdUrl: null, //URL
	type: null, //Type
	upnpVersion: null, //UPnPVersion
	responseHash: null, //md5 of the scpd response.text
	id: null,
	properties: [],
	methods: [],
	initialize: function initialize() {}
});

module.exports = Service;