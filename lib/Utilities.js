const UrlSdk = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url

exports.format = function format(format) {
    //a string.format like function
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
}

exports.toUrl = function toUrl(path, currentUrl, baseUrl) {
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