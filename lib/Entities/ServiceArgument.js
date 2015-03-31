const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const ServiceArgument = Class({
	name: null,
	backingProperty: null,
	datatype: null,
	allowedValues: [],
	allowedValueRange: null,
	initialize: function initialize() {}
});

module.exports = ServiceArgument;