class TCPSocket {
	constructor(socket, socketSender) {
		this._socket = socket;
		this._socketSender = socketSender;
	}
	open(ip, port) {
		this._socket.open(ip, port);
	}
	onopen(func) {
		this._socket.onopen = func;
	}
	onerror(func) {
		this._socket.onerror = func;
	}
	ondata(func) {
		this._socket.ondata = func;
	}
	send(data, keepOpen) {
		this._socketSender(this._socket, data, keepOpen);
	}
	close() {
		this._socket.close();
	}
}

module.exports = TCPSocket;