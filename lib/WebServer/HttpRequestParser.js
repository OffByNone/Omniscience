const Constants = require('../Utilities/Constants');
const HttpRequest = require('../Entities/HttpRequest');

class HttpRequestParser {
	constructor(networkingUtils) {
		this._networkingUtils = networkingUtils;
	}
	parseRequest(requestSocket, success, failure) {
		var bodyBytes = [];
		var bytesReceived = 0;
		var request;
		var totalBytes;
		requestSocket.ondata = (event) => {
			var packetBodyBytes;

			if(!request) {
				var [head, body] = this._separateBodyFromHead(event.data);
				packetBodyBytes = this._networkingUtils.toByteArray(body);
				request = this._parseMetadata(head);
				if (!request)
					return failure();

				request.socket = requestSocket;
				totalBytes = parseInt(request.headers['content-length'], 10);
			}
			else
				packetBodyBytes = event.data;

			bytesReceived += packetBodyBytes.byteLength;
			bodyBytes.push(packetBodyBytes);

			if (isNaN(totalBytes) ||  bytesReceived >= totalBytes){
				var data = this._networkingUtils.merge(...bodyBytes);
				request.body = this._networkingUtils.toString(data);
				return success(request);
			}
		};
	}
	_separateBodyFromHead (data){
		if (!data)
			return null;

		var dataStr = this._networkingUtils.toString(data);
		return dataStr.split(Constants.headerLineDelimiter + Constants.headerLineDelimiter);
	}
	_parseMetadata(header) {
		if (!header)
			return null;

		var [requestLine, ...headerLines] = header.split(Constants.headerLineDelimiter);
		var [method, uri, protocol] = requestLine.split(Constants.requestLineDelimiter);

		if (protocol !== Constants.httpVersion)
			return null;

		var [path, params] = uri.split('?');
		var parsedParams = this.parseUrlParams(params);

		var headers = {};
		headerLines.forEach( (headerLine) => {
			var [name, value] = headerLine.split(':');
			if (!name || !value)
				return;
			headers[name.toLowerCase()] = value.trim().toLowerCase();
		});

		var request = new HttpRequest();
		request.headers = headers;
		request.method = method;
		request.parameters = parsedParams;
		request.path = path.toLowerCase();

		return request;
	}
	parseUrlParams(params) {
		if(!params) return null;

		var parsedParams = {};
		params.split('&').forEach( (keyValue) => {
			var [key, value] = decodeURIComponent(keyValue).split('=');
			params[key] = value;
		});

		return parsedParams;
	}
}

module.exports = HttpRequestParser;