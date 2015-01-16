const { Class } = require("sdk/core/heritage"); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { emit } = require("sdk/event/core"); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/event/core.html
const { merge } = require("sdk/util/object"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/util_object
const { EventTarget } = require("sdk/event/target"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const { Buffer } = require("sdk/io/buffer");
const ioc = require("./ioc");

const SSDP = Class({
    extends: EventTarget,
    _socket: ioc.createUDPSocket(),
    multicastIP: '239.255.255.250',
    multicastPort: 1900,

    initialize: function initialize(options) {
        EventTarget.prototype.initialize.call(this, options);
        merge(this, options);

        this._socket.init(this.sourcePort, false);
        this._socket.asyncListen(this);

        this.on('message', (message, rinfo) => {
            var headers = this._parseHeaders(message.data);
            emit(this,'deviceresponse', headers);
        });
    },
    search : function search (service) {
        var message = new Buffer(
            'M-SEARCH * HTTP/1.1\r\n' +
            'HOST: ' + this.multicastIP + ':' + this.multicastPort + '\r\n' +
            'ST: ' + service + '\r\n' +
            'MAN: "ssdp:discover"\r\n' +
            'MX: 1\r\n\r\n');

        this._socket.send(this.multicastIP, this.multicastPort, message, message.length);
    },
    shutdown : function close (){
        this._socket.close();
    },
    startListening : function(){
        this._socket.joinMulticast(this.multicastIP);
    },
    stopListening : function(){
        this._socket.leaveMulticast(this.multicastIP);
    },
    onStopListening: function onStopListening(socket, status) { // nsIUDPSocketListener
        emit(this, 'close', status);
    },
    onPacketReceived: function onPacketReceived(socket, message) { // See: https://bugzilla.mozilla.org/show_bug.cgi?id=952927
        emit(this, 'message', message);
    },
    _parseHeaders : function _parseHeaders(headerString) {
        var headers = {};
        headerString.split("\r\n").forEach(x => {
            if(x === null || x.indexOf(":") === -1) return;
            var colon = x.indexOf(":");
            headers[x.substring(0,colon).toUpperCase()] = x.substring(colon+1).trim();
        });
        return headers;
    }
});

exports.SSDP = SSDP;
