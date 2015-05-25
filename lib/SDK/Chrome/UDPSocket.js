const Constants = require('../../Utilities/Constants');

class UDPSocket {
	constructor(socketSdk, sourcePort) {
		this._socketSdk = socketSdk;
		this._sourcePort = sourcePort;

		return new Promise( (resolve, reject) => {
			this._socketSdk.create({ bufferSize: Constants.bufferSize }, (createInfo) => {
				this._socketId = createInfo.socketId;
				resolve(this);
			});
		});
	}
	send(destinationIp, destinationPort, message) {
		this._socket.send(destinationIp, destinationPort, message, message.length);
	}
	close() {
		this._socketSdk.close(this._socketId);
	}
	asyncListen(bindTo) {
		this._socket.asyncListen(bindTo);
	}
	multicastInterface(networkInterface) {
		this._socket.multicastInterface = networkInterface;
	}
	joinMulticast(multicastIp, networkInterface) {
		this._socketSdk.joinGroup(this._socketId,);
		this._socket.joinMulticast(multicastIp, networkInterface)
	}
	leaveMulticase(multicastIp, networkInterface) {
		this._socket.leaveMulticast(multicastIp, networkInterface);
	}
}

chrome.sockets.udp.bind(this.id, "0.0.0.0", sourcePort || 0, (resultCode) => {
	if (resultCode < 0)
		reject(resultCode);
	else
		resolve(this);
});

module.exports = UDPSocket;