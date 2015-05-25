const Constants = require('../../Utilities/Constants');

class IPResolver {
    constructor(dnsService, socket){
        this._dnsService = dnsService;
        this._socket = socket;
    }
    resolveIPs () {
        var myName = this._dnsService.myHostName;
        var record = this._dnsService.resolve(myName, 0);
        var addresses = [];
        while (record.hasMore())
            addresses.push(record.getNextAddrAsString());

        if (!addresses.some(address => address === "127.0.0.1"))
            addresses.push("127.0.0.1");

        return new Promise( (resolve, reject) => {
        	if (addresses.length > 1) {
        		this._socket.close();
        		resolve(addresses.filter((address) => Constants.ipv4Regex.test(address)));
        	}
        	else
        		this._forceGetIPs(resolve);
        });
    }
    _forceGetIPs (resolve){
    	this._socket.joinMulticast(Constants.IPResolverMulticast);

    	this._socket.asyncListen({
    		onPacketReceived: function onPacketReceived(socket, message) { // See: https://bugzilla.mozilla.org/show_bug.cgi?id=952927
    			socket.close();
            	this._socket.close();
                resolve([message.fromAddr.address, '127.0.0.1']);
            }
        });
    	var message = new Uint8Array(1);
    	message[0] = 15;

        this._socket.send(Constants.IPResolverMulticast, this._socket.port, message, message.length);
    }
}

module.exports = IPResolver;