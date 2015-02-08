const ComponentFactory  = require("./Factories/ComponentFactory");

var format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number] 
        : match
      ;
    });
};

var getMyIPAddresses = function getMyIPAddresses(){
    const dns = ComponentFactory.createDNSService();
    var myName = dns.myHostName;
    var record = dns.resolve(myName, 0);
    var addresses = [];
    while (record.hasMore())
        addresses.push(record.getNextAddrAsString());
    
    return addresses;
};

exports.format = format;
exports.getMyIPAddresses = getMyIPAddresses;
exports.createLocalFile = ComponentFactory.createLocalFile