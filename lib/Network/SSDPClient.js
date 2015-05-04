const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const { Buffer } = require('sdk/io/buffer'); // https://github.com/mozilla/addon-sdk/tree/master/lib/sdk/io

const Constants = require('../Constants');

const SSDPClient = Class({
    extends: EventTarget,
    multicastIP: Constants.MulticastIP,
    multicastPort: Constants.MulticastPort,
    initialize: function initialize(emitter, utilities, udpSocket) {
        this._socket = udpSocket;
        this._utilities = utilities;
        this._emitter = emitter;

        this._socket.asyncListen(this);
    },
    search: function search(service) {
        var message = new Buffer(this._utilities.format(Constants.MSearch, this.multicastIP, this.multicastPort, service));

        this._socket.send(this.multicastIP, this.multicastPort, message, message.length);
    },
    stopSearch: function stopSearch() {
        this._socket.close();
    },
    setMulticastInterface: function setMulticastInterface(ipAddress){
        this._ipAddress = ipAddress;
        this._socket.multicastInterface = ipAddress;
    },
    joinMulticast: function joinMulticast() {
        this._socket.joinMulticast(this.multicastIP, this._ipAddress);
    },
    leaveMulticast: function leaveMulticast() {
        this._socket.leaveMulticast(this.multicastIP, this._ipAddress);
    },
    onStopListening: function onStopListening(socket, status) { // nsIUDPSocketListener
        this._emitter.emit(this, 'close', status);
    },
    onPacketReceived: function onPacketReceived(socket, message) { // See: https://bugzilla.mozilla.org/show_bug.cgi?id=952927
        var headers = this._parseHeaders(message.data);
        headers.fromAddress = message.fromAddr.address + ":" + message.fromAddr.port;
        headers.serverIP = this._ipAddress;
        this._emitter.emit(this, 'messageReceived', headers);
    },
    _parseHeaders: function _parseHeaders(headerString) {
        var headers = {};
        headerString.split("\r\n").forEach(x => {
            if (x === null || x.indexOf(":") === -1) return;
            var colon = x.indexOf(":");
            headers[x.substring(0, colon).toUpperCase()] = x.substring(colon + 1).trim();
        });
        return headers;
    }
});

/**
 * Simple Service Discovery Protocol
 * DLNA, and DIAL are built on top of this
 */
module.exports = SSDPClient;
