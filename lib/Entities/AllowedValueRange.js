const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const AllowedValueRange = Class({
	minimum: null,
	maximum: null,
	step: null,
	initialize: function initialize() {}
});

module.exports = AllowedValueRange;