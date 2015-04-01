const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const Icon = Class({
	initialize: function initialize() {
		this.mimetype = null;
		this.width = null;
		this.height = null;
		this.depth = null;
		this.url = null;
	}
});

module.exports = Icon;