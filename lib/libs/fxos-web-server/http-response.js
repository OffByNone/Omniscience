/*jshint esnext:true*/
/*exported HTTPResponse*/
'use strict';

module.exports = (function() {

	const { Buffer } = require('sdk/io/buffer'); // https://github.com/mozilla/addon-sdk/tree/master/lib/sdk/io
	const {Cu} = require("chrome");
	const {TextDecoder, OS} = Cu.import("resource://gre/modules/osfile.jsm", {});
	const timer = require('sdk/timers');




	const ComponentFactory = require('../../Factories/ComponentFactory.js');
	const Utilities = require('../../Utilities');


	var EventTarget = require('./event-target');
	var BinaryUtils = require('./binary-utils');
	var HTTPStatus  = require('./http-status');

	const CRLF = '\r\n';
	const BUFFER_SIZE = 64 * 1024;

	function HTTPResponse(socket, timeout) {
		this.socket  = socket;
		this.timeout = timeout;

		this.headers = {};
		this.headers['Content-Type'] = 'text/html';
		this.headers['Connection']   = 'close';

		if (this.timeout) {
			this.timeoutHandler = timer.setTimeout(() => {
				this.send(null, 500);
			}, this.timeout);
		}
	}

	HTTPResponse.prototype = new EventTarget();

	HTTPResponse.prototype.constructor = HTTPResponse;

	HTTPResponse.prototype.send = function(body, status) {
		return createResponse(body, status, this.headers, (response) => {
			var offset = 0;
			var remaining = response.byteLength;

			var sendNextPart = () => {
				var length = Math.min(remaining, BUFFER_SIZE);
				var bufferFull = this.socket.send(response, offset, length);

				offset += length;
				remaining -= length;

				if (remaining > 0) {
					if (!bufferFull) {
						sendNextPart();
					}
				}
				else {
					timer.clearTimeout(this.timeoutHandler);
					this.socket.close();
					this.dispatchEvent('complete');
				}
			};

			this.socket.ondrain = sendNextPart;
			sendNextPart();
		});
	};

	HTTPResponse.prototype.sendFile = function(fileOrPath, status) {
		try{
			if(typeof fileOrPath === "string" ) OS.File.read(fileOrPath).then( fileBytes => this.send(fileBytes));
			else fileOrPath.read().then(fileBytes => this.send(fileBytes));
			return;
		}
		catch(e){console.log(e);}
		this.send("File Not Found", 404);
	};

	function createResponseHeader(status, headers) {
		var header = HTTPStatus.getStatusLine(status);

		for (var name in headers) {
			header += name + ': ' + headers[name] + CRLF;
		}

		return header;
	}

	function createResponse(body, status, headers, callback) {
		body    = body    || '';
		status  = status  || 200;
		headers = headers || {};

		headers['Content-Length'] = body.length || body.byteLength;
		var response;

		if(typeof body === "object" && ArrayBuffer.isView(body)){ //assuming it is Uint8Array (file), should probably be more specific but I am not sure how to check
			var part1 = new Buffer(createResponseHeader(status, headers) + CRLF);
			response = BinaryUtils.mergeArrayBuffers( [ part1, body ] );
		}
		else
			response = new Buffer(createResponseHeader(status, headers) + CRLF + body);

		return callback(response);
	}

	return HTTPResponse;

})();
