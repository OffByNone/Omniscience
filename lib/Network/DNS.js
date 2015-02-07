const IOC  = require("../IOC");

getMyIPAddresses = function getMyIPAddresses(){
    const dns = IOC.createDNSService();
    var myName = dns.myHostName;
    var record = dns.resolve(myName, 0);
    var addresses = [];
    while (record.hasMore())
        addresses.push(record.getNextAddrAsString());
    
    return addresses;
};


exports.getMyIPAddresses = getMyIPAddresses;