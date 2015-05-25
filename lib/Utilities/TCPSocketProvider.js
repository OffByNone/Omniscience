class TCPSocketProvider {
	constructor(sdk) {
		this._sdk = sdk;
	}
	createTCPSocket() {
		return this._sdk.createTCPSocket();
	}
}

module.exports = TCPSocketProvider;