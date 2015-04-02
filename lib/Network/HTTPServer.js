const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { URL } = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url

const HTTPServer = Class({
	initialize: function initialize(httpServer, utilities, md5) {
        this._server = httpServer;
        this._utilities = utilities
        this._md5 = md5;
	},
    start: function start(port){
        var hosts = this._utilities.getMyIPAddresses();
        this._addresses = hosts;
        this.port = port || this._getRandomPort();
        this._server.start(this.port, hosts);
    },
    registerDirectory: function registerDirectory(path, directoryPath){
    	var localFile = this._utilities.createLocalFile(); //todo: this looks like it should really be a file factory, take the line below into the factory as well
        localFile.initWithPath(directoryPath);
        this._server.registerDirectory(path, localFile);
    },
    _getServerIp: function _getServerIp(device){
        var deviceIp = new URL(device.address).host;
        //todo: pains me to hardcode http
        return "http://" + this._addresses.filter(x=> this._areIPsInSameSubnet(x, deviceIp))[0] + ":" + this.port;
    },
    _areIPsInSameSubnet: function _areIPsInSameSubnet(ip1, ip2){
        //todo: this only works for ipv4 addresses
        //meaning it wont work for ipv6 or hostnames

        //todo: if two adapters are on the same subnet it will grab whichever it finds first
        //which is probably not what you want as my laptop shows both ethernet and wifi even if one is disconnected
        //should probably ping the ip to validate it can be hit

        var ip3 = ip1.split(".");
        var ip4 = ip2.split(".");

        if((ip3.length > 2 && ip4.length > 2)
            && (ip3[0] === ip4[0] && ip3[1] === ip4[1] && ip3[2] === ip4[2]))
            return true;

        return false;
    },
    _getRandomPort: function _getRandomPort(){
        return Math.floor(Math.random() * (65535 - 10000)) + 10000;
    },
    registerPathHandler: function (path, handler){
        this._server.registerPathHandler(path, handler);
    },
    loadMedia: function loadMedia(device, file){//todo: this has nothing to do with the server and shouldn't be in here
    	var serverAddress = this._getServerIp(device);
    	var fileUri;

    	if(file.isLocal || !this._utilities.toUrl(file.path))
    		return serverAddress + this._shareFile(file);
    	else
    		return file.path;

    },
    _shareFile: function _shareFile(file){
    	var filePathHash = this._md5.md5(file.path);
    	var filePath = `/${filePathHash}/${file.name}`;
    	var encodedFilePath = encodeURI(filePath);

    	var localFile = this._utilities.createLocalFile(); //todo: this looks like it should really be a file factory, take the line below into the factory as well
    	localFile.initWithPath(file.path);

    	this._server.registerFile(encodedFilePath, localFile);

    	return encodedFilePath;
    }
});

module.exports = HTTPServer;
