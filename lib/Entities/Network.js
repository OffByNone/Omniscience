const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const Network = Class({
	initialize: function initialize() {
		this.security = null;
		this.name = null;
	},
	isSecure: function(){
		return (this.security !== null);
	}
});

/**
 * WiFi network
 */
module.exports = Network;
