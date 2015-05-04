const Constants = require('../Utilities/Constants');
const { Buffer } = require('sdk/io/buffer'); // https://github.com/mozilla/addon-sdk/tree/master/lib/sdk/io

class IPResolver {
    constructor(dnsService, udpSocketFactory){
        this._dnsService = dnsService;
        this._udpSocketFactory = udpSocketFactory;
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
        var message = new Buffer("get my ipaddresses");

        socket.send(Constants.IPResolverMulticast, socket.port, message, message.length);
    }
}

module.exports = IPResolver;