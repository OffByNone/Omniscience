const Constants = require('../Utilities/Constants');

class IPResolver {
    constructor(dnsService, udpSocketFactory, networkingUtils){
        this._dnsService = dnsService;
        this._udpSocketFactory = udpSocketFactory;
        this._networkingUtils = networkingUtils;
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
            if(addresses.length > 1)
                resolve(addresses.filter((address) => Constants.ipv4Regex.test(address)));
            else
                this._forceGetIPs(resolve);
        });
    }
    _forceGetIPs (resolve){
        var socket = this._udpSocketFactory.createUDPSocket();
        socket.joinMulticast(Constants.IPResolverMulticast);

        socket.asyncListen({
            onPacketReceived: function onPacketReceived(socket, message) { // See: https://bugzilla.mozilla.org/show_bug.cgi?id=952927
                socket.close();
                resolve([message.fromAddr.address, '127.0.0.1']);
            }
        });
        var message = this._networkingUtils.toByteArray("get my ipaddresses"); //todo: test this on mobile, it might need to be toBuffer instead but I am not sure

        socket.send(Constants.IPResolverMulticast, socket.port, message, message.length);
    }
}

module.exports = IPResolver;