const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const componentFactory = require('../Factories/ComponentFactory');
const Constants = require('../Constants');
const HTTPServer = require("./libs/fxos-web-server/http-server");

//https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIHttpServer
const HttpServer = Class({
	_registeredPaths : [],
	_registeredPrefixes : [],
	_registeredDirectories : [],
	_registeredFiles : [],

	initialize: function initialize(){
		this._port = this._getRandomPort();
		this._httpServer = new HTTPServer(this._port);
		this.isRunning = false;

		this._httpServer.addEventListener('request', function(evt) {
			var request  = evt.request;
			var response = evt.response;

			this._registeredPrefixes.foreach( registeredPrefix => {
				if( request.path.indexOf( registeredPrefix.prefix ) === 0 ){
					registeredPrefix.callback( request, response );
					return;
				}
			});
			this._registeredPaths.foreach( registeredPath => {
				if( request.path === registeredPath ) {
					registeredPath.callback( request, response );
					return;
				}
			});
			this._registeredDirectories.foreach( registeredDirectory => {
				if( request.path === registeredDirectory.path ) {
					registeredDirectory.callback( request, response );
					return;
				}
			});
			this._registeredFiles.foreach( registeredFile => {
				if( request.path === registeredFile.path ) {
					registeredFile.callback( request, response );
					return;
				}
			});

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
		if(fileOrPath) this._registeredFiles.push( { path: serverPath, file: filepath } );
		else this._registeredFiles = this._registeredFiles.filter(path => path != serverPath.path);
	},
	registerDirectory : function registerDirectory(serverPath, directorypath) {
		//does not currently work but it is in the server itself not here that it doesn't work
		if(directorypath) this._registeredDirectories.push( { path: serverPath, directory: directorypath } );
		else this._registeredDirectories = this._registeredDirectories.filter(path => path != serverPath.path);
	},
	registerPath: function registerPath(serverPath, callback) {
		if(callback) this._registeredPaths.push( { path: serverPath, callback: callback } );
		else this._registeredPaths = this._registeredPaths.filter(path => path != serverPath.path);
	},
	registerPrefix: function registerPrefix(serverPathprefix, callback) {
		if(callback) this._registeredPrefixes.push( { prefix: serverPathprefix, callback: callback } );
		else this._registeredPrefixes = this._registeredPrefixes.filter(prefix => prefix != serverPathprefix.prefix);
	},
	_getRandomPort: function _getRandomPort(){
		return Math.floor(Math.random() * (65535 - 10000)) + 10000;
	}
});

exports.HttpServer = HttpServer;

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