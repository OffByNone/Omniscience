const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const constants = require('../../Constants');

const GenericDevice = Class({
	initialize: function initialize() {
        this.audioCapable = false;
        this.videoCapable = false;
        this.mirrorCapable = false;
        this.serviceKey = constants.Services.GenericDevice;
	}
});

exports.GenericDevice = GenericDevice;