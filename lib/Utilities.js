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

function toUrl(path, currentUrl, baseUrl) {
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


exports.format = format;
exports.getMyIPAddresses = getMyIPAddresses;
exports.toUrl = toUrl;