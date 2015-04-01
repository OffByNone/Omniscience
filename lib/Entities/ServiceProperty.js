const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const ServiceProperty = Class({
	initialize: function initialize() {
		this.datatype = null;
		this.name = null;
		this.defaultValue = null;
		this.evented = false;
		this.allowedValues = [];
		this.allowedValueRange = null;
	}
});

module.exports = ServiceProperty;