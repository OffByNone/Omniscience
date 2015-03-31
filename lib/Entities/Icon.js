const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const Icon = Class({
	mimetype: null,
	width: null,
	height: null,
	depth: null,
	url: null,
	initialize: function initialize() {}
});

module.exports = Icon;