const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const HTTPServer = Class({
	initialize: function initialize(httpServer, utilities) {
        this._server = httpServer;
        this._utilities = utilities
	},
    start: function start(port){
        var hosts = this._utilities.getMyIPAddresses();
        this._server.start(port, hosts);
    },
    registerDirectory: function registerDirectory(path, directoryPath){
        var localFile = this._utilities.createLocalFile();
        localFile.initWithPath(directoryPath);        
        this._server.registerDirectory(path, localFile);
    },
    registerFile: function registerFile(path, file){
        this._server.registerFile(path, file);
    }
});

exports.HTTPServer = HTTPServer;
