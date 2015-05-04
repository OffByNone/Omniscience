class UDPSocketFactory {
    constructor (ComponentFactory){
        this._componentFactory = ComponentFactory;
    }
    createUDPSocket (sourcePort){
        var socket = this._componentFactory.createUDPSocket();
        socket.init(sourcePort || -1, false, this._componentFactory.getScriptSecurityManager());

        return socket;
    }
}

module.exports = UDPSocketFactory;