"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TCPSender = (function () {
	function TCPSender(timers, tcpSocketProvider, socketSender, networkingUtils) {
		_classCallCheck(this, TCPSender);

		this.responseTimeout = 5000;
		this._timers = timers;
		this._tcpSocketProvider = tcpSocketProvider;
		this._socketSender = socketSender;
		this._networkingUtils = networkingUtils;
	}

	_createClass(TCPSender, [{
		key: "send",
		value: function send(ip, port, data, waitForResponse) {
			var _this = this;

			return new Promise(function (resolve, reject) {
				var socket = _this._tcpSocketProvider.createTCPSocket().open(ip, port); //todo: I think this is a race as I open before I assign onopen and onerror but I might need to do it this way
				socket.onopen = function () {
					_this._socketSender.send(socket, data, waitForResponse);
				};
				socket.onerror = function (err) {
					console.log(err);
				};
				socket.ondata = function (dataReceived) {
					//todo: this will only work when the entire response fits into a single packet, need to loop over this and parse it like in the HttpRequestParser, only different
					socket.close();
					resolve(dataReceived);
				};
				//this._timers.setTimeout(() => {
				//	try {
				//		socket.close();
				//		throw new Error('Device did not respond within ' + (this.responseTimeout / 1000) + ' seconds.');//todo: maybe reject instead
				//	}
				//	catch (e) {
				//		//already closed, meaning we already got the response
				//		//nothing to see here, move along
				//	}
				//}, this.responseTimeout);
			});
		}
	}]);

	return TCPSender;
})();

module.exports = TCPSender;