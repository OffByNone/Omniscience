const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const DeviceModel = Class({
	url: null,
	name: null,
	number: null,
	description: null,
	initialize: function initialize() {}
});

module.exports = DeviceModel;