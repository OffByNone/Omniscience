const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const Constants = require('../../Constants');

const GenericDevice = Class({
	initialize: function initialize() {
        this.serviceKey = Constants.Services.GenericDevice;
	}
});

exports.GenericDevice = GenericDevice;