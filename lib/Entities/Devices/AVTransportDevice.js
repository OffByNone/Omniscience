const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const constants = require('../../Constants');

const AVTransportDevice = Class({
	initialize: function initialize() {
        this.audioCapable = true;
        this.videoCapable = true;
        this.mirrorCapable = false;
        this.serviceKey = constants.Services.AVTransport;
	}
});

exports.AVTransportDevice = AVTransportDevice;