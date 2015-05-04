const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { URL } = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url

const HTTPServer = Class({
	initialize: function initialize(httpServer, utilities, md5, localFileFactory) {
        this._server = httpServer;
        this._utilities = utilities
        this._md5 = md5;
        this._localFileFactory = localFileFactory;
	},
    start: function start(ipAddresses, port){
        this.port = port || this._getRandomPort();
        this._server.start(this.port, ipAddresses);
    },
    registerDirectory: function registerDirectory(path, directoryPath){
    	var localFile = this._localFileFactory.createLocalFile(directoryPath);
        this._server.registerDirectory(path, localFile);
    },
    _getRandomPort: function _getRandomPort(){
        return Math.floor(Math.random() * (65535 - 10000)) + 10000;
    },
    registerPathHandler: function (path, handler){
        this._server.registerPathHandler(path, handler);
    },
    shareFile: function shareFile(file){
    	var filePathHash = this._md5(file.path);
    	var filePath = `/${filePathHash}/${file.name}`;
    	var encodedFilePath = encodeURI(filePath);
    	var localFile = this._localFileFactory.createLocalFile(file.path);
    	this._server.registerFile(encodedFilePath, localFile);

    	return encodedFilePath;
    }
});

module.exports = HTTPServer;
