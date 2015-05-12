const Constants = require('../Utilities/Constants');

class PassiveSearcher {
	constructor(eventer, ssdpClients) {
		this._eventer = eventer;
		this._ssdpClients = ssdpClients;

		this._initializeSSDPClients();
	}
	_initializeSSDPClients() {
		this._ssdpClients.forEach((ssdpClient) => {
			ssdpClient.joinMulticast();
			this._eventer.on(Constants.passiveEventPrefix + 'ssdpClient.error', error => this._error(error));
			this._eventer.on(Constants.passiveEventPrefix + 'ssdpClient.messageReceived', headers => {
				if (headers.st === Constants.PeerNameResolutionProtocolST)
					return;//this is a Microsoft thing to resolve names on ipv6 networks and in this case just causes problems
				
				var nts = (headers.nts || "").toLowerCase();

				if (nts === "ssdp:update" || nts === "ssdp:alive")
					this._eventer.emit('searcher.found', headers, nts === "ssdp:update");
				else if (nts === "ssdp:byebye")
					this._eventer.emit("searcher.lost", headers);
			});
		});

	}
	_error(error) {
		console.log(error);
	}
}

module.exports = PassiveSearcher;