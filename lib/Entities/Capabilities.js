const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const Capabilities = Class({
	initialize: function initialize() {
		this.mirror = false;
		this.audio = false;
		this.video = false;
		this.image = false;
		this.router = false;
		this.server = false;
	}
});

module.exports = Capabilities;