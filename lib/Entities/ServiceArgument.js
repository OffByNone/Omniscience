const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const ServiceArgument = Class({
	initialize: function initialize() {
		this.name = null;
		this.backingProperty = null;
		this.datatype = null;
		this.allowedValues = [];
		this.allowedValueRange = null;
	}
});

module.exports = ServiceArgument;