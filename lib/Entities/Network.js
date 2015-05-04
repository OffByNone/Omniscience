class Network {
    constructor() {
        this.security = null;
        this.name = null;
    }
    isSecure() {
        return (this.security !== null);
    }
}

/**
 * WiFi network
 */
module.exports = Network;
