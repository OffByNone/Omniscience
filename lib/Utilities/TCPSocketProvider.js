class TCPSocketProvider {
	constructor(firefoxSDK) {
		this._firefoxSDK = firefoxSDK;
	}
	createTCPSocket() {
		return this._firefoxSDK.createTCPSocket();
	}
}

module.exports = TCPSocketProvider;