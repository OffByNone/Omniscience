const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { URL } = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url

const Constants = require('../Constants');
const HTTPServer = require("../libs/fxos-web-server/http-server");

const fxosWebServer = Class({
	_registeredPaths : [],
	_registeredPrefixes : [],
	_registeredDirectories : [],
	_registeredFiles : [],

	initialize: function initialize(){
		this.port = this._getRandomPort();
		this._httpServer = new HTTPServer(this.port);
		this.isRunning = false;

		this._httpServer.addEventListener('request', evt => {
			var request  = evt.request;
			var response = evt.response;

			//todo: this needs to be a loop where I match the start of the property for this to work.
			if(this._registeredPrefixes.hasOwnProperty(request.path)){
				this._registeredPrefixes[request.path]( request, response );
				return;
			}

			if(this._registeredPaths.hasOwnProperty(request.path)){
				this._registeredPaths[request.path]( request, response );
				return;
			}
			if(this._registeredDirectories.hasOwnProperty(request.path)){
				response.sendFile(this._registeredDirectories[request.path]);
				return;
			}

			if(this._registeredFiles.hasOwnProperty(request.path)){
				response.sendFile(this._registeredFiles[request.path]);
				return;
			}

			response.send('Not Found', 404);
		});
	},
	start: function start(){
		this._httpServer.start();
		this.isRunning = true;
	},
	stop: function stop(callback){
		this._httpServer.stop();
		this.isRunning = false;
	},
	registerFile: function registerFile(serverPath, filepath){
		//does not currently work but it is in the server itself not here that it doesn't work
		//var pathname = new URL(serverPath).pathname;
		if(filepath) this._registeredFiles[serverPath] = filepath;
		else delete this._registeredFiles[serverPath];
	},
	registerDirectory : function registerDirectory(serverPath, directorypath) {
		//does not currently work but it is in the server itself not here that it doesn't work
		var pathname = new URL(serverPath, "http://localhost/").pathname;
		if(directorypath) this._registeredFiles[serverPath] = directorypath;
		else delete this._registeredFiles[serverPath];
	},
	registerPath: function registerPath(serverPath, callback) {
		var pathname = new URL(serverPath,"http://localhost/").pathname;
		if(callback) this._registeredPaths[pathname] = callback;
		else delete this._registeredPaths[pathname];
	},
	registerPrefix: function registerPrefix(serverPathprefix, callback) {
		var prefixName = new URL(serverPathprefix).pathname;
		if(callback) this._registeredPrefixes[prefixName] = callback;
		else delete this._registeredPrefixes[prefixName];
	},
	_getRandomPort: function _getRandomPort(){
		return Math.floor(Math.random() * (65535 - 10000)) + 10000;
	}
});

module.exports = fxosWebServer;
/*
var httpCode = {
	'100': "Continue",
	'101':'Switching Protocols',
	'200': 'OK',
	'201':'Created',
	'202':'Accepted',
	'203':'Non-Authoritative Information',
	'204':'No Content',
	'205':'Reset Content',
	'206':'Partial Content',
	'300':'Multiple Choices',
	'301':'Moved Permanently',
	'302':'Found',
	'303':'See Other',
	'304':'Not Modified',
	'305':'Use Proxy',
	'307':'Temporary Redirect',
	'400': "Bad Request",
	'401': "Unauthorized",
	'402': "Payment Required",
	'403': "Forbidden",
	'404': "Not Found",
	'405': "Method Not Allowed",
	'406': "Not Acceptable",
	'407': "Proxy Authentication Required",
	'408': "Request Timeout",
	'409': "Conflict",
	'410': "Gone",
	'411': "Length Required",
	'412': "Precondition Failed",
	'413': "Request Entity Too Large",
	'414': "Request-URI Too Long",
	'415': "Unsupported Media Type",
	'417': "Expectation Failed",
	'500': "Internal Server Error",
	'501': "Not Implemented",
	'502': "Bad Gateway",
	'503': "Service Unavailable",
	'504': "Gateway Timeout",
	'505': "HTTP Version Not Supported"
}
*/