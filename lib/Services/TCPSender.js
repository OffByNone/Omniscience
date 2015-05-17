class TCPSender {
	constructor(eventer, timers, tcpSocketProvider, socketSender, networkingUtils) {
		this.responseTimeout = 5000;
		this._eventer = eventer;
		this._timers = timers;
		this._tcpSocketProvider = tcpSocketProvider;
		this._socketSender = socketSender;
		this._networkingUtils = networkingUtils;
	}
	send(ip, port, data, waitForResponse) {
		return new Promise((resolve, reject) => {
			var socket = this._tcpSocketProvider.createTCPSocket().open(ip, port); //todo: i think this is a race as i open before I assign onopen and onerror but I might need to do it this way
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
