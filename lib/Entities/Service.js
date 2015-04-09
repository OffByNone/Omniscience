﻿const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const Service = Class({
	initialize: function initialize() {
		this.type = null; //Type
		this.upnpVersion = null; //UPnPVersion
		this.id = null;
	}
});

module.exports = Service;