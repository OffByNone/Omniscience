const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const ServiceMethod = Class({
	initialize: function initialize() {
		this.name = null;
		this.parameters = [];
		this.returnValues = [];
	}
});

module.exports = ServiceMethod;