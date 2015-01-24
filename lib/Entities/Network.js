const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { merge } = require('sdk/util/object'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/util_object

const Network = Class({
  security: null,
  name: null,
  initialize: function initialize(options) {
    merge(this, options);
  },
  isSecure: function(){
    return (this.security !== null);
  }
});

/**
 * WiFi network
 */
exports.Network = Network;
