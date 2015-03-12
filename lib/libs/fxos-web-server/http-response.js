/*jshint esnext:true*/
/*exported HTTPResponse*/
'use strict';

module.exports = (function() {

    const timer = require('sdk/timers');
    var EventTarget = require('./event-target');
    var BinaryUtils = require('./binary-utils');
    var HTTPStatus  = require('./http-status');

    const { Cc, Ci, Cu } = require('chrome'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/chrome.html
    Cu.importGlobalProperties(["Blob"]);

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
                    clearTimeout(this.timeoutHandler);
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
            /* cannot use blobToArrayBuffer from extension
            BinaryUtils.blobToArrayBuffer(fileOrPath, (arrayBuffer) => {
                this.send(arrayBuffer, status);
            });
            */
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

        var response = new Blob([
            createResponseHeader(status, headers),
            CRLF,
            body
        ]);

        //the below does not work but I am not sure I need it to.
        return callback(response); // cannot do inside addon, might be able to do with the transportservice BinaryUtils.blobToArrayBuffer(response, callback);
    }

    return HTTPResponse;

})();
