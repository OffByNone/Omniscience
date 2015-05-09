const Constants = require('../Utilities/Constants');

class HttpResponder {
    constructor(networkingUtils, socketSender) {
    	this._networkingUtils = networkingUtils;
        this._socketSender = socketSender;
    }

    sendOkResponse(socket) { this._sendResponse(socket, Constants.httpOkStatus); }
    sendFileNotFoundResponse(socket) { this._sendResponse(socket, Constants.httpFileNotFoundStatus); }
    sendTimeoutResponse(socket) { this._sendResponse(socket, Constants.httpTimeoutStatus); }
    sendErrorResponse(socket) { this._sendResponse(socket, Constants.httpErrorStatus); }
    _sendResponse(socket, httpStatus) {
        var headers = [
            `${Constants.httpVersion} ${httpStatus.code} ${httpStatus.reason}`,
            `Server: ${Constants.serverName }`,
            `Content-Type: text\\plain`,
            `Connection: close`,
            `Content-Length: 0`
        ];

        var headersBuffer = this._networkingUtils.toByteArray(headers.join(Constants.headerLineDelimiter)).buffer;
        this._socketSender.send(socket, headersBuffer, false);
    }
}

module.exports = HttpResponder;