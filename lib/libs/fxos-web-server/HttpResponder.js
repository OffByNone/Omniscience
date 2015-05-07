const BinaryUtils = require('./binary-utils');
const HTTPStatus = require('./http-status');
const Constants = require('../../Utilities/Constants');

class HttpResponder {

    constructor(bufferProvider, timer, fileUtils, localFileFactory, osFile) {
        this._bufferProvider = bufferProvider;
        this._fileUtils = fileUtils;
        this._localFileFactory = localFileFactory;
        this._osFile = osFile;
    }

    send(socket, body, status, headers) {
        var response = this.createResponse(body, status, headers);
        socket.ondrain = this.sendNextPart;
        this.sendNextPart(socket, 0, response.length, response);
    }

    sendNextPart(socket, offset, remaining, response) {
        var length = Math.min(remaining, Constants.HTTPServer.BUFFER_SIZE);
        var bufferFull = socket.send(response, offset, length);

        offset += length;
        remaining -= length;

        if (remaining > 0) {
            if (!bufferFull)
                this.sendNextPart(socket, offset, remaining, response);
        }
        else
            socket.close();
    }

    sendFile(socket, fileOrPath) {
        try {
            var localFile = this._localFileFactory.createLocalFile(fileOrPath);
            var contentType = this._fileUtils.getTypeForFile(localFile);

            var headers = {
                'Content-Type': contentType,
                'Connection': 'close'
            };
            this._osFile.read(localFile.path).then(fileBytes => this.send(socket, fileBytes, 200, headers));
            return;
        }
        catch (e) {
            console.log(e);
            this.send(socket, "File Not Found", 404);
        }
    }

    createResponseHeaders(status, headers) {
        var header = HTTPStatus.getStatusLine(status);
        for (var name in headers)
            header += name + ': ' + headers[name] + Constants.HTTPServer.CRLF;

        return header;
    }

    createResponse(body, status, headers) {
        body = body || '';
        status = status || 200;
        headers = headers || {
            'Content-Type': 'text/html',
            'Connection': 'close'
        };

        headers['Content-Length'] = body.length || body.byteLength;

        if (typeof body === "object" && ArrayBuffer.isView(body)) { //assuming it is Uint8Array (file), should probably be more specific but I am not sure how to check
            var part1 = this._bufferProvider.createBuffer(this.createResponseHeaders(status, headers) + Constants.HTTPServer.CRLF);
            return BinaryUtils.mergeArrayBuffers([part1, body]);
        }
        else
            return this._bufferProvider.createBuffer(this.createResponseHeaders(status, headers) + Constants.HTTPServer.CRLF + body);
    }
}

module.exports = HttpResponder;