const ComponentFactory  = require("./Factories/ComponentFactory");
const UrlSdk = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url

function format(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
}

function getMyIPAddresses() {
    const dns = ComponentFactory.createDNSService();
    var myName = dns.myHostName;
    var record = dns.resolve(myName, 0);
    var addresses = ['127.0.0.1'];
    while (record.hasMore())
        addresses.push(record.getNextAddrAsString());

    return addresses;
}

function areIPsInSameSubnet(ip1, ip2) {
	//todo: this only works for ipv4 addresses
	//meaning it wont work for ipv6 or hostnames

	//todo: if two adapters are on the same subnet it will grab whichever it finds first
	//which is probably not what you want as my laptop shows both ethernet and wifi even if one is disconnected
	//should probably ping the ip to validate it can be hit

	var ip3 = ip1.split(".");
	var ip4 = ip2.split(".");

	if ((ip3.length > 2 && ip4.length > 2)
		&& (ip3[0] === ip4[0] && ip3[1] === ip4[1] && ip3[2] === ip4[2]))
		return true;

	return false;
}

function getAddressForDevice(url) {
	if (url instanceof UrlSdk.URL)
		url = new UrlSdk.URL(device.address).host;
	//todo: pains me to hardcode http
	var myIp = "http://" + getMyIPAddresses().filter(myIpAddresses => areIPsInSameSubnet(myIpAddresses, url.host))[0];

	return myIp;
}

function toURL(path, currentUrl, baseUrl) {
	//returns null for undefined, and /ssdp/notfound paths as well as invalid Urls
	if (!path || path.length === 0 || path === '/ssdp/notfound')
		return null;
	if (UrlSdk.isValidURI(path))
		return UrlSdk.URL(path);
	try {
		return new UrlSdk.URL(path, baseUrl);
	} catch (e) { }
	try {
		return new UrlSdk.URL(path, currentUrl);
	} catch (e) { }

	return null;
}

var getTypeForFile = function getTypeForFile(file){
 /*
  * Gets a content-type for the given file, by
  * asking the global MIME service for a content-type, and finally by failing
  * over to application/octet-stream.
  *
  * @param file : nsIFile
  * the nsIFile for which to get a file type
  * @returns string
  * the best content-type which can be determined for the file
  */
	try
	{
		var name = file.leafName;
		return ComponentFactory.createMimeService().getTypeFromFile(file);
	}
	catch (e)
	{
		return "application/octet-stream";
	}
};

exports.getTypeForFile = getTypeForFile;
exports.format = format;
exports.getMyIPAddresses = getMyIPAddresses;
exports.createLocalFile = ComponentFactory.createLocalFile;
exports.getAddressForDevice = getAddressForDevice;
exports.areIPsInSameSubnet = areIPsInSameSubnet;
exports.toURL = toURL;