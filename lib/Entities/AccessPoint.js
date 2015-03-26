const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const Constants = require('../Constants');

const AccessPoint = Class({
	macAddress: null,
	network: null,
	signal: null,
	initialize: function initialize() {

    },
	isMatchStick: function() {
		return Constants.MatchStickMacAddresses.some(x => x.startsWith(this.macAddress.toUpperCase()));
	},
	isChromeCast: function() {
		return false;
	}
});

/**
 * Un-configured DIAL devices show up as accesspoints
 */
module.exports = AccessPoint;
