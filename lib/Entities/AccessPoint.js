const Constants = require('../Utilities/Constants');

class AccessPoint {
    constructor() {
        this.macAddress = null;
        this.network = null;
        this.signal = null;
    }
    isMatchStick() {
        return Constants.MatchStickMacAddresses.some(x => x.startsWith(this.macAddress.toUpperCase()));
    }
    isChromeCast() {
        return false;
    }
}

/**
 * Un-configured DIAL devices show up as accesspoints
 */
module.exports = AccessPoint;
