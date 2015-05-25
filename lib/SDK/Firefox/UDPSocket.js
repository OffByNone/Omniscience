const Constants = require('../../Utilities/Constants');

class UDPSocket {
	constructor(socket, scriptSecurityManager, sourcePort) {
		this._socket = socket;
		this._socket.init(sourcePort || -1, false, scriptSecurityManager);
	}
	send(destinationIp, destinationPort, message) {
		this._socket.send(destinationIp, destinationPort, message, message.length);
	}
	close() {
		this._socket.close();
	}
	asyncListen(bindTo) {
		this._socket.asyncListen(bindTo);
	}
	multicastInterface(networkInterface) {
		this._socket.multicastInterface = networkInterface;
	}
	joinMulticast(multicastIp, networkInterface) {
		this._socket.joinMulticast(multicastIp, networkInterface)
	}
	leaveMulticase(multicastIp, networkInterface) {
		this._socket.leaveMulticast(multicastIp, networkInterface);
	}
}


module.exports = UDPSocket;