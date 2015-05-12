const Constants = require('../Utilities/Constants');

class SSDPClient {
    constructor(eventPrefix, eventer, utilities, udpSocket, networkingUtils) {
        this._socket = udpSocket;
        this._utilities = utilities;
        this._eventer = eventer;
        this._eventPrefix = eventPrefix;
        this._networkingUtils = networkingUtils;
        this.multicastIP = Constants.MulticastIP;
        this.multicastPort = Constants.MulticastPort;

        this._socket.asyncListen(this);
    }
    search(service) {
    	var message = this._networkingUtils.toByteArray(this._utilities.format(Constants.MSearch, this.multicastIP, this.multicastPort, service));

        this._socket.send(this.multicastIP, this.multicastPort, message, message.length);
    }
    stopSearch() {
        this._socket.close();
    }
    setMulticastInterface(ipAddress){
        this._ipAddress = ipAddress;
        this._socket.multicastInterface = ipAddress;
    }
    joinMulticast() {
        this._socket.joinMulticast(this.multicastIP, this._ipAddress);
    }
    leaveMulticast() {
        this._socket.leaveMulticast(this.multicastIP, this._ipAddress);
    }
    onStopListening(socket, status) { // nsIUDPSocketListener
        this._eventer.emit(this._eventPrefix + 'ssdpClient.close', status);
    }
    onPacketReceived(socket, message) { // See: https://bugzilla.mozilla.org/show_bug.cgi?id=952927
        var headers = this._parseHeaders(message.data);
        headers.fromAddress = message.fromAddr.address + ":" + message.fromAddr.port;
        headers.serverIP = this._ipAddress;
        this._eventer.emit(this._eventPrefix + 'ssdpClient.messageReceived', headers);
    }
    _parseHeaders(headerString) {
        var headers = {};
        headerString.split("\r\n").forEach(x => {
            if (x === null || x.indexOf(":") === -1) return;
            var colon = x.indexOf(":");
            headers[x.substring(0, colon).toLowerCase()] = x.substring(colon + 1).trim();
        });
        return headers;
    }
}

/**
 * Simple Service Discovery Protocol
 * DLNA, and DIAL are built on top of this
 */
module.exports = SSDPClient;
