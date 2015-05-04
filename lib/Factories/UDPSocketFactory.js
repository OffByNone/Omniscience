const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const UDPSocketFactory = Class({
    initialize: function(ComponentFactory){
        this._componentFactory = ComponentFactory;
    },
    createUDPSocket: function(sourcePort){
        var socket = this._componentFactory.createUDPSocket();
        socket.init(sourcePort || -1, false, this._componentFactory.getScriptSecurityManager());

        return socket;
    }
});

module.exports = UDPSocketFactory;