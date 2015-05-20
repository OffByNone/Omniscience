const Constants = require('../Utilities/Constants');

class SocketSender {
	constructor() { }

	send(socket, message, keepAlive) {
		socket.ondrain = this.sendNextPart;
		this.sendNextPart(socket, 0, message.length, message, keepAlive); //todo: the message.length used to be .byteLength, not sure .length will work for byteArrays, but it is needed for strings
	}

	sendNextPart(socket, offset, remaining, response, keepAlive) {
		var amountToSend = Math.min(remaining, Constants.socketBufferSize);
		var bufferFull = socket.send(response, offset, amountToSend);

		offset += amountToSend;
		remaining -= amountToSend;

		if (remaining > 0) {
			if (!bufferFull)
				this.sendNextPart(socket, offset, remaining, response);
		}
		else if (!keepAlive) {
			socket.close(); //todo: make timer and add params to keep alive so we can time it out
		}
	}
}

module.exports = SocketSender;