const Constants = require('../Utilities/Constants');

class ActiveSearcher {
    constructor(pubSub, ssdpClients) {
        this._pubSub = pubSub;
        this._ssdpClients = ssdpClients;

        this._initializeSSDPClients();
    }
    search() {
        this._ssdpClients.forEach(ssdpClient => ssdpClient.search(Constants.SSDPServiceType));
    }
    _initializeSSDPClients(){
        this._ssdpClients.forEach( (ssdpClient) => {
            ssdpClient.joinMulticast();
            this._pubSub.sub(Constants.activeEventPrefix + 'ssdpClient.error', error => this._error(error));
            this._pubSub.sub(Constants.activeEventPrefix + 'ssdpClient.messageReceived', headers => {
                if(headers["st"] === Constants.PeerNameResolutionProtocolST)
                    return;//this is a Microsoft thing to resolve names on ipv6 networks and in this case just causes problems

                this._pubSub.pub("searcher.found", headers);
            });
        });
    }
    _error(error){
        console.error(error);
    }
}

module.exports = ActiveSearcher;