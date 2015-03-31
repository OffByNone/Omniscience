const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const Capabilities = Class({
	mirror: false,
	audio: false,
	video: false,
	image: false,
	router: false,
	server: false,
	initialize: function initialize() {}
});

module.exports = Capabilities;