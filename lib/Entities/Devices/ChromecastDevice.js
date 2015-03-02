const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const constants = require('../../Constants');

const ChromecastDevice = Class({
	initialize: function initialize() {
        this.mirrorCapable = true;
        this.audioCapable = true;
        this.videoCapable = true;
        this.imageCapable = true;
        this.serviceKey = constants.Services.Chromecast;
    }
});

exports.ChromecastDevice = ChromecastDevice;