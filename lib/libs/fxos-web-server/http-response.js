/*jshint esnext:true*/
/*exported HTTPResponse*/
'use strict';

module.exports = (function() {

	const { Buffer } = require('sdk/io/buffer'); // https://github.com/mozilla/addon-sdk/tree/master/lib/sdk/io
    const timer = require('sdk/timers');
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
        if (fileOrPath instanceof File) {
			var inputStream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream);
			inputStream.init(iLocalFile, -1, 0, 0);
			xhr.send(inputStream);
            return;
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', fileOrPath, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = () => {
            this.send(xhr.response, status);
        };

        xhr.send(null);
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

		//not sure the buffer needs to get passed an array, look at ssdp where i send in a string
        var response = new Buffer(createResponseHeader(status, headers) + CRLF + body);

        return callback(response);
    }

    return HTTPResponse;

})();
