const Constants = require('../Utilities/Constants');

class AccessPoint {
    constructor() {
        this.mac = null;
        this.ssid = null;
        this.signal = null;
    }
}

/**
 * Un-configured DIAL devices show up as accesspoints
 */
module.exports = AccessPoint;
