const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const Constants = require('../../Constants');

const MediaServerDevice = Class({
	initialize: function initialize() {
		this.instanceId = 0; // todo: obtain dynamically
		this.connectionId = 0; // todo: obtain dynamically
		this.serviceKey = Constants.Services.MediaServer;
		this.isServer = true;
	}
});

module.exports = MediaServerDevice;