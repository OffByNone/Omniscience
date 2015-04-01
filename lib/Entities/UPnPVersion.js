const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const UPnPVersion = Class({

	initialize: function initialize() {
		this.major = null;
		this.minor = null;
	}
});

module.exports = UPnPVersion;