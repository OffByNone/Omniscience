const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const Constants = require('../../Constants');

const MediaRendererDevice = Class({
	initialize: function initialize() {
        this.instanceId = 0;
        this.connectionId = 0;
        this.serviceKey = Constants.Services.MediaRenderer;
	}
});

exports.MediaRendererDevice = MediaRendererDevice;