const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const AllowedValueRange = Class({
	initialize: function initialize() {
		this.minimum = null;
		this.maximum = null;
		this.step = null;
	}
});

module.exports = AllowedValueRange;