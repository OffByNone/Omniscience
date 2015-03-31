const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const Network = Class({
	security: null,
	name: null,
	initialize: function initialize() {
	},
	isSecure: function(){
		return (this.security !== null);
	}
});

/**
 * WiFi network
 */
module.exports = Network;
