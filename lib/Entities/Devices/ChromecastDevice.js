const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const Constants = require('../../Constants');

const ChromecastDevice = Class({
	initialize: function initialize() {
        this.mirrorCapable = true;
        this.audioCapable = true;
        this.videoCapable = true;
        this.imageCapable = true;
        this.serviceKey = Constants.Services.Chromecast;
    }
});

module.exports = ChromecastDevice;