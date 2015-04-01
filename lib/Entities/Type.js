const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const Type = Class({
	initialize: function initialize() {
		this.urn = null;
		this.name = null;
	}
});

module.exports = Type;