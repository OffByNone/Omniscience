/**
 * Un-configured DIAL devices show up as accesspoints
 */

const Constants = require('../Utilities/Constants');

class AccessPointSearcher {
    constructor(pubSub, wifiMonitor) {
        this._pubSub = pubSub;
        this._wifiMonitor = wifiMonitor;
        this._accessPoints = [];
    }
    search() {
        this._wifiMonitor.startWatching(this);
    }
    stop() {
        this._wifiMonitor.stopWatching(this);
    }
    isMatchStick(accessPoint) {
        return Constants.MatchStickMacAddresses.some(x => accessPoint.mac.toUpperCase().startsWith(x));
    }
    isChromecast(accessPoint) {
        return Constants.ChromecastMacAddresses.some(x => accessPoint.mac.toUpperCase().startsWith(x));
    }
    isFireTVStick(accessPoint) {
        return Constants.FireTVStickMacAddresses.some(x => accessPoint.mac.toUpperCase().startsWith(x));
    }
    isDialDevice(accessPoint) {
        return this.isMatchStick(accessPoint) || this.isChromecast(accessPoint) || this.isFireTVStick(accessPoint);
    }
    onChange(accessPoints) {
        var newAccessPoints = accessPoints.filter(newAccessPoint => !this._accessPoints.some(oldAccessPoint => oldAccessPoint != newAccessPoint));
        var lostAccessPoints = this._accessPoints.filter(oldAccessPoint => !accessPoints.some(newAccessPoint => newAccessPoint != oldAccessPoint));
        newAccessPoints.forEach(newAccessPoint => this._accessPoints.push(newAccessPoint));
        lostAccessPoints.forEach(lostAccessPoint => {
            //todo: remove lost accesspoints from this._accessPoints
        });

        newAccessPoints.filter(newAccessPoint => this.isDialDevice(newAccessPoint)).forEach(dialDevice => {
            if (this.isMatchStick(dialDevice))
                console.log("Found new Matchstick ssid=" + dialDevice.ssid + " mac=" + dialDevice.mac + " signal=" + dialDevice.signal);
            else if (this.isChromecast(dialDevice))
                console.log("Found new Chromecast ssid=" + dialDevice.ssid + " mac=" + dialDevice.mac + " signal=" + dialDevice.signal);
            else if (this.isFireTVStick(dialDevice))
                console.log("Found new FireTVStick ssid=" + dialDevice.ssid + " mac=" + dialDevice.mac + " signal=" + dialDevice.signal);
        });
    }
    onError(error) {
        console.log(error);
        this._pubSub.pub('accessPointSerivce.error', error);
    }
}

/**
 * Searches for access points
 */
module.exports = AccessPointSearcher;
