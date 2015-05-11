class UDPSocketFactory {
    constructor (firefox){
        this._firefox = firefox;
    }
    createUDPSocket (sourcePort){
        var socket = this._firefox.createUDPSocket();
        socket.init(sourcePort || -1, false, this._firefox.getScriptSecurityManager());

        return socket;
    }
}

module.exports = UDPSocketFactory;