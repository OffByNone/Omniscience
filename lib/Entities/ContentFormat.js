const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const ContentFormat = Class({
	initialize: function initialize() {
		this.containerType = ""; //mpeg, jpeg
		this.medium = ""; //audio, video, image...
	}
});

module.exports = ContentFormat;
