/**
 * Un-configured DIAL devices show up as accesspoints
 */

class AccessPointSearcher {
    constructor(eventer, wifiMonitor) {
        this._eventer = eventer;
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
        return Constants.MatchStickMacAddresses.some(x => x.startsWith(accessPoint.mac.toUpperCase()));
    }
    isChromeCast(accessPoint) {
        return Constants.ChromeCastMacAddresses.some(x => x.startsWith(accessPoint.mac.toUpperCase()));
    }
    isFireTVStick(accessPoint){
        return Constants.FireTVStickMacAddresses.some(x => x.startsWith(accessPoint.mac.toUpperCase()));
    }
    isDialDevice(accessPoint){
        return this.isMatchStick(accessPoint) || this.isChromeCast(accessPoint) || this.isFireTVStick(accessPoint);
    }
    onChange(accessPoints) {
        var newAccessPoints = accessPoints.filter(newAccessPoint => !this._accessPoints.some(oldAccessPoint => oldAccessPoint != newAccessPoint));
        newAccessPoints.forEach(newAccessPoint => console.log("Found new Access Point ssid=" + newAccessPoint.ssid + " mac=" + newAccessPoint.mac + " signal=" + newAccessPoint.signal));
        var lostAccessPoints = this._accessPoints.filter(oldAccessPoint => !accessPoints.some(newAccessPoint => newAccessPoint != oldAccessPoint));
        lostAccessPoints.forEach(lostAccessPoint => console.log("Found new Access Point ssid=" + lostAccessPoint.ssid + " mac=" + lostAccessPoint.mac + " signal=" + lostAccessPoint.signal));

        newAccessPoints.filter(newAccessPoint => this.isDialDevice(newAccessPoint)).foreach(dialDevice => {
            if (this.isMatchStick(dialDevice))
                console.log("Found new Matchstick ssid=" + dialDevice.ssid + " mac=" + dialDevice.mac + " signal=" + dialDevice.signal);
            else if (this.isChromeCast(dialDevice))
                console.log("Found new ChromeCast ssid=" + dialDevice.ssid + " mac=" + dialDevice.mac + " signal=" + dialDevice.signal);
            else if (this.isFireTVStick(dialDevice))
                console.log("Found new FireTVStick ssid=" + dialDevice.ssid + " mac=" + dialDevice.mac + " signal=" + dialDevice.signal);
        });
    }
    onError(error) {
        console.log(error);
        this._eventer.emit('accessPointSerivce.error', error);
    }
}

/**
 * Searches for access points
 */
module.exports = AccessPointSearcher;
