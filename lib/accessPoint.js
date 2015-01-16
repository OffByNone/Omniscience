const { Class } = require("sdk/core/heritage"); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { merge } = require("sdk/util/object"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/util_object
const { emit } = require("sdk/event/core"); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/event/core.html
const { EventTarget } = require("sdk/event/target"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const { Network } = require("./network");

const AccessPoint = Class({
  extends: EventTarget,
  macAddress: null,
  network: null,
  signal: null,
  _matchStickMacAddresses: ["98:3B:16","02:1A:11"],
  initialize: function initialize(options) {
    EventTarget.prototype.initialize.call(this, options);
    merge(this, options);
  },
  isMatchStick: function(){
    return this._matchStickMacAddresses.some(x => x.startsWith(this.macAddress.toUpperCase()));
  },
  isChromeCast: function(){
    return false;
  }

});

exports.AccessPoint = AccessPoint;
