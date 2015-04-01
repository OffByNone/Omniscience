const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const DeviceModel = Class({
	initialize: function initialize() {
		this.url = null;
		this.name = null;
		this.number = null;
		this.description = null;
	}
});

module.exports = DeviceModel;