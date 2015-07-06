'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _require = require('omniscience-utilities');

var Eventable = _require.Eventable;

var FrontEndBridge = (function (_Eventable) {
	function FrontEndBridge(subscriptionService, serviceExecutor, fileUtilities, fileSharer, deviceService, httpServer) {
		var _this = this;

		_classCallCheck(this, FrontEndBridge);

		_get(Object.getPrototypeOf(FrontEndBridge.prototype), 'constructor', this).call(this);
		this._subscriptionService = subscriptionService;
		this._serviceExecutor = serviceExecutor;
		this._fileUtilities = fileUtilities;
		this._fileSharer = fileSharer;
		this._deviceService = deviceService;
		this._httpServer = httpServer;

		this._deviceService.on('deviceFound', function () {
			for (var _len = arguments.length, data = Array(_len), _key = 0; _key < _len; _key++) {
				data[_key] = arguments[_key];
			}

			return _this.sendToFrontEnd.apply(_this, ['deviceFound'].concat(data));
		});
		this._deviceService.on('deviceLost', function () {
			for (var _len2 = arguments.length, data = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				data[_key2] = arguments[_key2];
			}

			return _this.sendToFrontEnd.apply(_this, ['deviceLost'].concat(data));
		});
	}

	_inherits(FrontEndBridge, _Eventable);

	_createClass(FrontEndBridge, [{
		key: 'handleMessageFromFrontEnd',
		value: function handleMessageFromFrontEnd(eventType, uniqueId) {
			var _subscriptionService,
			    _fileSharer,
			    _tcpSender,
			    _this2 = this;

			for (var _len3 = arguments.length, data = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
				data[_key3 - 2] = arguments[_key3];
			}

			switch (eventType) {
				case 'Subscribe':
					var eventSubUrl = data[0],
					    subscriptionId = data[1],
					    serviceHash = data[2],
					    serverIP = data[3],
					    timeoutInSeconds = data[4];

					var directResponsesTo = 'http://' + serverIP + ':' + this._httpServer.port + '/events/' + serviceHash;
					this._httpServer.registerPath(directResponsesTo, function (request) {
						_this2.sendToFrontEnd('UPnPEvent', serviceHash, request.body);
						//this._httpResponder.sendOkResponse(request.socket);
					});
					this._subscriptionService.subscribe(directResponsesTo, eventSubUrl, timeoutInSeconds, subscriptionId).then(function (subscriptionId) {
						return _this2.sendToFrontEnd('emitResponse', uniqueId, subscriptionId);
					});
					break;
				case 'Unsubscribe':
					this._httpServer.registerPath('/events/' + data[2], null);
					(_subscriptionService = this._subscriptionService).unsubscribe.apply(_subscriptionService, data).then(function () {
						return _this2.sendToFrontEnd('emitResponse', uniqueId);
					});
					break;
				case 'CallService':
					var service = data[0],
					    method = data[1],
					    info = data[2];

					this._serviceExecutor.callService(service.controlUrl, service.hash, method, info).then(function (response) {
						return _this2.sendToFrontEnd('emitResponse', uniqueId, response);
					});
					break;
				case 'chooseFiles':
					this._fileUtilities.openFileBrowser().then(function (files) {
						return _this2.sendToFrontEnd('emitResponse', uniqueId, files ? files : []);
					});
					break;
				case 'shareFile':
					this.sendToFrontEnd('emitResponse', uniqueId, (_fileSharer = this._fileSharer).shareFile.apply(_fileSharer, data));
					break;
				case 'loadDevices':
					this._deviceService.loadDevices();
					break;
				case 'refreshDevices':
					this._deviceService.search();
					break;
				case 'search':
					this._deviceService.search();
					break;
				case 'sendTCP':
					(_tcpSender = this._tcpSender).send.apply(_tcpSender, data).then(function (response) {
						return _this2.sendToFrontEnd('emitResponse', uniqueId, response);
					});
					break;
			}
		}
	}, {
		key: 'sendToFrontEnd',
		value: function sendToFrontEnd(eventType) {
			for (var _len4 = arguments.length, data = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
				data[_key4 - 1] = arguments[_key4];
			}

			this.emit.apply(this, ['sendToFrontEnd', eventType].concat(data));
		}
	}]);

	return FrontEndBridge;
})(Eventable);

module.exports = FrontEndBridge;