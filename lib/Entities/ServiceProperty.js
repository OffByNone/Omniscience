const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const ServiceProperty = Class({
	datatype: null,
	name: null,
	defaultValue: null,
	evented: false,
	allowedValues: [],
	allowedValueRange: null,
	initialize: function initialize() {}
});

module.exports = ServiceProperty;