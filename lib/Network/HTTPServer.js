const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const HTTPServer = Class({
	initialize: function initialize(httpServer, utilities) {
        this._server = httpServer;
        this._utilities = utilities
	},
    start: function start(port){
        var hosts = this._utilities.getMyIPAddresses();
        this._addresses = hosts;
        this.port = port;
        this._server.start(port, hosts);
    },
    registerDirectory: function registerDirectory(path, directoryPath){
        var localFile = this._utilities.createLocalFile();
        localFile.initWithPath(directoryPath);        
        this._server.registerDirectory(path, localFile);
    },
    registerFile: function registerFile(path, filePath){
        var localFile = this._utilities.createLocalFile();
        localFile.initWithPath(filePath); 
        this._server.registerFile(path, localFile);
    },
    getServerIp: function getServerIp(deviceIp){
        return "http://" + this._addresses.filter(x=> this._areIPsInSameSubnet(x, deviceIp))[0] + ":" + this.port;
    },
    _areIPsInSameSubnet: function _areIPsInSameSubnet(ip1, ip2){
        var ip3 = ip1.split(".");
        var ip4 = ip2.split(".");
        
        if(ip3[0] === ip4[0] && ip3[1] === ip4[1] && ip3[2] === ip4[2])
            return true;
            
        return false;
    }
});

exports.HTTPServer = HTTPServer;
