class TCPSender {
	constructor(pubSub, timers, tcpSocketProvider, socketSender, networkingUtils) {
		this.responseTimeout = 5000;
		this._pubSub = pubSub;
		this._timers = timers;
		this._tcpSocketProvider = tcpSocketProvider;
		this._socketSender = socketSender;
		this._networkingUtils = networkingUtils;

		this._pubSub.sub('sendTCP', (uniqueId, hostname, port, data, waitForResponse) =>
			this._tcpSender.send(hostname, port, data, waitForResponse).
				then((response) => this._pubSub.pub("emitResponse", uniqueId, response)));
	}
	send(ip, port, data, waitForResponse) {
		return new Promise((resolve, reject) => {
			var socket = this._tcpSocketProvider.createTCPSocket().open(ip, port); //todo: I think this is a race as I open before I assign onopen and onerror but I might need to do it this way
			socket.onopen = () => { this._socketSender.send(socket, data, waitForResponse); };
			socket.onerror = (err) => { console.log(err); }
			socket.ondata = (dataReceived) => {
				//todo: this isnt going to work, need to loop over this and parse it like in the HttpRequestParser, only different
				socket.close();
				resolve(dataReceived);
			};
			//this._timers.setTimeout(() => {
			//	try {
			//		socket.close();
			//		throw new Error('Device did not respond within ' + (this.responseTimeout / 1000) + ' seconds.');//todo: maybe reject instead
			//	}
			//	catch (e) {
			//		//already closed, meaning we already got the response
			//		//nothing to see here, move along
			//	}
			//}, this.responseTimeout);
		});
	}
}

module.exports = TCPSender;
