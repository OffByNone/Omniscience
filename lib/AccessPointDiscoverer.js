const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const AccessPointSearcher = Class({
  extends: EventTarget,
  _wifiMonitor: null,

  initialize: function initialize(emitter, wifiMonitor) {
    this._emitter = emitter;
    this._wifiMonitor = wifiMonitor;
  },
  search: function search(){
    this._wifiMonitor.startWatching(this);
  },
  stop: function stop(){
    this._wifiMonitor.stopWatching(this);
  },
  onChange: function onChange(accessPoints){
    this._emitter.emit(this, 'updateAccessPoints', accessPoints);
  },
  onError: function onError(error){
    console.log(error);
    this._emitter.emit(this, 'error', error);
  }
});

/**
 * Searches for access points
 */
exports.AccessPointSearcher = AccessPointSearcher;
