const Constants = require('../../Utilities/Constants');
const EventTarget = require('./event-target');
const BinaryUtils = require('./binary-utils');

class HTTPRequest extends EventTarget {
    constructor(socket) {
        var parts = [];
        var receivedLength = 0;

        var checkRequestComplete = () => {
            var contentLength = parseInt(this.headers['content-length'], 10);
            if (isNaN(contentLength)) {
                this.complete = true;
                this.dispatchEvent('complete', this);
                return;
            }

            if (receivedLength < contentLength)
                return;

            BinaryUtils.mergeArrayBuffers(parts, (data) => {
                this.body = this.parseBody(this.headers['content-type'], data);
                this.complete = true;
                this.dispatchEvent('complete', this);
            });

            socket.ondata = null;
        };

        socket.ondata = (event) => {
            var data = BinaryUtils.arrayBufferToString(event.data);

            if (parts.length > 0) {
                var dataAsBuffer = ArrayBuffer.isView(data) ? data : BinaryUtils.stringToArrayBuffer(data);
                parts.push(dataAsBuffer);
                receivedLength += dataAsBuffer.byteLength;
                checkRequestComplete();
                return;
            }

            var firstPart = this.parseHeader(this, data);
            if (this.invalid) {
                this.dispatchEvent('error', this);

                socket.close();
                socket.ondata = null;
                return;
            }

            if (firstPart) {
                parts.push(firstPart);
                receivedLength += firstPart.byteLength;
            }

            checkRequestComplete();
        };
    }
    parseHeader(request, data) {
        if (!data) {
            request.invalid = true;
            return null;
        }

        if (ArrayBuffer.isView(data))
            data = BinaryUtils.arrayBufferToString(data);

        var requestParts = data.split(Constants.HTTPServer.CRLF + Constants.HTTPServer.CRLF);

        var header = requestParts.shift();
        var body = requestParts.join(Constants.HTTPServer.CRLF + Constants.HTTPServer.CRLF);

        var headerLines = header.split(Constants.HTTPServer.CRLF);
        var requestLine = headerLines.shift().split(' ');

        var method = requestLine[0];
        var uri = requestLine[1];
        var version = requestLine[2];

        if (version !== Constants.HTTPServer.HTTP_VERSION) {
            request.invalid = true;
            return null;
        }

        var uriParts = uri.split('?');

        var path = uriParts.shift();
        var params = this.parseURLEncodedString(uriParts.join('?'));

        var headers = {};
        headerLines.forEach((headerLine) => {
            var parts = headerLine.split(': ');
            if (parts.length !== 2)
                return;

            var name = parts[0].toLowerCase();
            var value = parts[1].toLowerCase();

            headers[name] = value;
        });

        request.method = method;
        request.path = path;
        request.params = params;
        request.headers = headers;

        if (headers['content-length']) {
            return BinaryUtils.stringToArrayBuffer(body);
        }

        return null;
    }
    setOrAppendValue(object, name, value) {
        var existingValue = object[name];
        if (existingValue === undefined) {
            object[name] = value;
        }
        else {
            if (Array.isArray(existingValue))
                existingValue.push(value);
            else
                object[name] = [existingValue, value];
        }
    }
    parseURLEncodedString(string) {
        var values = {};

        string.split('&').forEach((pair) => {
            if (!pair) return;

            var parts = decodeURIComponent(pair).split('=');

            var name = parts.shift();
            var value = parts.join('=');

            this.setOrAppendValue(values, name, value);
        });

        return values;
    }
    parseMultipartFormDataString(string, boundary) {
        var values = {};

        string.split('--' + boundary).forEach((data) => {
            data = data.replace(/^\r\n/, '').replace(/\r\n$/, '');

            if (!data || data === '--')
                return;

            var parts = data.split(Constants.HTTPServer.CRLF + Constants.HTTPServer.CRLF);

            var header = parts.shift();
            var value = {
                headers: {},
                metadata: {},
                value: parts.join(Constants.HTTPServer.CRLF + Constants.HTTPServer.CRLF)
            };

            var name;

            var headers = header.split(Constants.HTTPServer.CRLF);
            headers.forEach((header) => {
                var headerParams = header.split(';');
                var headerParts = headerParams.shift().split(': ');

                var headerName = headerParts[0];
                var headerValue = headerParts[1];

                if (headerName.toLowerCase() !== 'content-disposition' ||
					headerValue.toLowerCase() !== 'form-data') {
                    value.headers[headerName] = headerValue;
                    return;
                }

                headerParams.forEach((param) => {
                    var paramParts = param.trim().split('=');

                    var paramName = paramParts[0];
                    var paramValue = paramParts[1];

                    paramValue = paramValue.replace(/\"(.*?)\"/, '$1') || paramValue;

                    if (paramName === 'name')
                        name = paramValue;
                    else
                        value.metadata[paramName] = paramValue;
                });
            });

            if (name)
                this.setOrAppendValue(values, name, value);
        });

        return values;
    }
    parseBody(contentType, data) {
        contentType = contentType.toLowerCase() || 'text/plain';

        var contentTypeParams = contentType.replace(/\s/g, '').split(';');
        var mimeType = contentTypeParams.shift();

        var body = BinaryUtils.arrayBufferToString(data);

        var result;

        try {
            switch (mimeType) {
                case 'application/x-www-form-urlencoded':
                    result = parseURLEncodedString(body);
                    break;
                case 'multipart/form-data':
                    contentTypeParams.forEach((contentTypeParam) => {
                        var parts = contentTypeParam.split('=');

                        var name = parts[0];
                        var value = parts[1];

                        if (name === 'boundary') {
                            result = this.parseMultipartFormDataString(body, value);
                        }
                    });
                    break;
                case 'application/json':
                    result = JSON.parse(body);
                    break;
                case 'application/xml':
                    result = new DOMParser().parseFromString(body, 'text/xml');
                    break;
                default:
                    break;
            }
        } catch (exception) {
            console.log('Unable to parse HTTP request body with Content-Type: ' + contentType);
        }

        return result || body;
    }
}

module.exports = HTTPRequest;