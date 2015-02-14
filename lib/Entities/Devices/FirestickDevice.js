const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const constants = require('../../Constants');

const FirestickDevice = Class({
    initialize: function initialize() {
        this.mirrorCapable = true;
        this.audioCapable = true;
        this.videoCapable = true;
        this.serviceKey = constants.Services.Firestick;
	}
});

exports.FirestickDevice = FirestickDevice;