const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const constants = require('../../Constants');

const MediaRendererDevice = Class({
	initialize: function initialize() {
        this.audioCapable = false;
        this.videoCapable = false;
        this.imageCapable = false;
        this.mirrorCapable = false;
        this.instanceId = 0;
        this.connectionId = 0;
        this.serviceKey = constants.Services.MediaRenderer;
	}
});

exports.MediaRendererDevice = MediaRendererDevice;