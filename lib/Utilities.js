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
    var addresses = ['127.0.0.1'];
    while (record.hasMore())
        addresses.push(record.getNextAddrAsString());
    
    return addresses;
};

var arrayFromMask= function arrayFromMask (nMask) {
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
  for (var nShifted = nMask, aFromMask = []; nShifted; 
       aFromMask.push(Boolean(nShifted & 1)), nShifted >>>= 1);
  return aFromMask;
}

var getControlUrl = function getControlUrl(device, serviceType){
    return device.services.filter(x=> x.type.urn === serviceType)[0].controlUrl;
};

var getEventSubUrl = function getEventSubUrl(device, serviceType){
    return device.services.filter(x=> x.type.urn === serviceType)[0].eventSubUrl;
};

exports.arrayFromMask = arrayFromMask;
exports.getControlUrl = getControlUrl;
exports.getEventSubUrl = getEventSubUrl;
exports.format = format;
exports.getMyIPAddresses = getMyIPAddresses;
exports.createLocalFile = ComponentFactory.createLocalFile