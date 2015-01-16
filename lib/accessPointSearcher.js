const { Class } = require("sdk/core/heritage"); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { emit } = require("sdk/event/core"); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/event/core.html
const { merge } = require("sdk/util/object"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/util_object
const { EventTarget } = require("sdk/event/target"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const { accessPoint } = require("./accessPoint");
const ioc = require("./ioc");

const AccessPointSearcher = Class({
  extends: EventTarget,
  _wifiMonitor: null,

  initialize: function initialize(options) {
    EventTarget.prototype.initialize.call(this, options);
    merge(this, options);

    this._wifiMonitor = ioc.createWifiMonitor()
  },
  search: function search(){
    this._wifiMonitor.startWatching(this);
  },
  stop: function stop(){
    this._wifiMonitor.stopWatching(this);
  },
  onChange: function onChange(accessPoints){
    emit(this, "updateAccessPoints", accessPoints);
  },
  onError: function onError(error){
    console.log(error);
    emit(this, "error", error);
  }
});


exports.AccessPointSearcher = AccessPointSearcher;
