const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

class AccessPointService extends EventTarget{
    constructor(emitter, wifiMonitor) {
        this._emitter = emitter;
        this._wifiMonitor = wifiMonitor;
    }
    search(){
        this._wifiMonitor.startWatching(this);
    }
    stop(){
        this._wifiMonitor.stopWatching(this);
    }
    onChange(accessPoints){
        this._emitter.emit(this, 'updateAccessPoints', accessPoints);
    }
    onError(error){
        console.log(error);
        this._emitter.emit(this, 'error', error);
    }
}

/**
 * Searches for access points
 */
module.exports = AccessPointService;
