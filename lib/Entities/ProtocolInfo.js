const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const ProtocolInfo = Class({
	initialize: function initialize() {
		this.additionalInfo = {};
		this.contentFormat = {};
		this.network = ""; //seems to always be "*"
		this.protocol = ""; //usually http-get
		this.type = ""; //either serve or render
	}
});

module.exports = ProtocolInfo;
