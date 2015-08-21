(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var CompositionRoot = require('../CompositionRoot');
var compositionRoot = new CompositionRoot();

var serviceExecutor = compositionRoot.getServiceExecutor();
var simpleServer = compositionRoot.createSimpleServer();
var port = simpleServer.start();
console.log("server started on port:" + port);

compositionRoot.createDeviceService().then(function (deviceService) {
	deviceService.search();
	var frontEndBridge = compositionRoot.createFrontEndBridge(deviceService, serviceExecutor, simpleServer);

	frontEndBridge.on("sendToFrontEnd", function (eventType) {
		for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			data[_key - 1] = arguments[_key];
		}

		var message = JSON.stringify({ eventType: eventType, data: makeSafeForEmit.apply(undefined, data) });
		window.parent.postMessage(message, "*");
	});
	window.addEventListener("message", function (event) {
		return frontEndBridge.onMessageFromFrontEnd(event.data);
	});
});

function makeSafeForEmit() {
	//The panel serializes out the data object using the below two lines
	//the tab does not, therefore the same data sent to both will not appear the same unless we add the below lines
	var replacer = function replacer(key, value) {
		return typeof value === "function" ? void 0 : value instanceof URL ? value.toString() : value;
	};

	for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
		args[_key2] = arguments[_key2];
	}

	return args.map(function (argument) {
		return JSON.parse(JSON.stringify(argument, replacer));
	});
}

},{"../CompositionRoot":2}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FrontEndBridge = require('./FrontEndBridge');

var Networking = require("omniscience-networking");
var UPnP = require("omniscience-upnp");
var SdkResolver = require('omniscience-sdk-resolver');

var CompositionRoot = (function () {
	function CompositionRoot() {
		_classCallCheck(this, CompositionRoot);

		this._sdk = new SdkResolver().resolve();
		this._upnp = new UPnP();
		this._networking = new Networking();
	}

	_createClass(CompositionRoot, [{
		key: "createButton",
		value: function createButton() {
			var button = null;
			var menu = null;
			try {
				//desktop sdk
				button = this._sdk.firefox.button();
			} catch (e) {
				//sdk for Android
				menu = this._sdk.firefox.getNativeWindowMenu();
			}

			var Button = require('./Firefox/Button');
			return new Button(button, menu);
		}
	}, {
		key: "createSimpleServer",
		value: function createSimpleServer() {
			return this._networking.createSimpleServer();
		}
	}, {
		key: "getServiceExecutor",
		value: function getServiceExecutor() {
			return this._upnp.getServiceExecutor();
		}
	}, {
		key: "createDeviceService",
		value: function createDeviceService(serviceExecutor) {
			return this._upnp.createDeviceService();
		}
	}, {
		key: "createFrontEndBridge",
		value: function createFrontEndBridge(deviceService, serviceExecutor, simpleServer) {
			return new FrontEndBridge(this._upnp.createSubscriptionService(), serviceExecutor, this._sdk.createFileUtilities(), deviceService, simpleServer, this._sdk.createSimpleTCP());
		}
	}, {
		key: "createTab",
		value: function createTab(button, frontEndBridge) {
			var Tab = require('./Firefox/Tab');
			return new Tab(this._sdk.firefox.tabs(), button, frontEndBridge);
		}
	}]);

	return CompositionRoot;
})();

module.exports = CompositionRoot;

},{"./Firefox/Button":3,"./Firefox/Tab":5,"./FrontEndBridge":6,"omniscience-networking":18,"omniscience-sdk-resolver":96,"omniscience-upnp":126}],3:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Constants = require('./Constants');

var _require = require('omniscience-utilities');

var Eventable = _require.Eventable;

var Button = (function (_Eventable) {
	_inherits(Button, _Eventable);

	function Button(buttons, menu) {
		var _this = this;

		_classCallCheck(this, Button);

		_get(Object.getPrototypeOf(Button.prototype), 'constructor', this).call(this);
		this._menu = menu;
		var button;

		//todo: remove these out into their respective sdk files

		if (buttons) {
			//desktop firefox
			button = buttons.ActionButton({
				id: 'omniscience',
				label: 'Omniscience',
				icon: Constants.icon
			});
			button.on('click', function () {
				return _this._onClick();
			});
		} else if (this._menu) {
			//firefox for android
			this._buttonId = this._menu.add("Omniscience", Constants.icon['64'], function () {
				return _this._onClick();
			});
		} else throw new Error("Neither button nor menu were defined.  At least one must be defined.");
	}

	_createClass(Button, [{
		key: 'remove',
		value: function remove() {
			//on android the menu item needs to be removed manually when the extension is disabled or uninstalled
			//this does not need to be done for desktop
			if (this._buttonId) this._menu.remove(this._buttonId);
		}
	}, {
		key: '_onClick',
		value: function _onClick() {
			this.emit("click");
		}
	}]);

	return Button;
})(Eventable);

module.exports = Button;

},{"./Constants":4,"omniscience-utilities":186}],4:[function(require,module,exports){
'use strict';

exports.tab = {
	js: ['./libs/jquery-2.1.3.min.js', './libs/bootstrap/js/bootstrap.min.js', './libs/angular.min.js', './libs/angular-route.min.js', './libs/md5.js', './libs/bootstrap-slider-4.8.3/bootstrap-slider.min.js', './libs/angular-bootstrap-slider-0.1.2/slider.js', './Omniscience.js', './Directives.js', './controllers/Device.js', './controllers/Home.js', './controllers/About.js', './controllers/DeviceInfo.js', './controllers/DeviceList.js', './controllers/Index.js', './controllers/MatchStickSettings.js', './controllers/Playlist.js', './controllers/Playback.js', './controllers/Capabilities.js', './services/LastChangeEventParser.js', './services/PubSub.js', './services/EventService.js', './services/ConnectionManagerService.js', './services/MediaReceiverRegistrarService.js', './services/SubscriptionService.js', './services/AVTransportService.js', './services/ContentDirectoryService.js', './services/RenderingControlService.js', './services/WfaWlanConfigService.js', './services/StubFactory.js', './services/FileService.js', './services/InformationService.js', './services/PersistenceService.js', './services/MatchStickMessageGenerator.js', './services/JXON.js'],
	html: './Foreground/Firefox.html'
};
exports.icon = {
	16: './icons/logo_16.png',
	32: './icons/logo_32.png',
	64: './icons/logo_64.png'
};
exports.avTransportServiceConstants = {
	transportStates: {
		0: 'STOPPED',
		1: 'PLAYING',
		2: 'TRANSITIONING', //optional
		3: 'PAUSED_PLAYBACK', //optional
		4: 'PAUSED_RECORDING', //optional
		5: 'RECORDING', //optional
		6: 'NO_MEDIA_PRESENT' //optional
	},
	transportStatuses: {
		0: 'OK',
		1: 'STOPPED',
		2: 'ERROR_OCCURRED'
	},
	playModes: {
		0: 'NORMAL',
		1: 'SHUFFLE', //optional
		3: 'REPEAT_ONE', //optional
		4: 'REPEAT_ALL', //optional
		5: 'RANDOM', //optional
		6: 'DIRECT_1', //optional
		7: 'INTRO', //optional
		8: 'Vendor-defined' //optional
	},
	transportActions: {
		0: 'Play',
		1: 'Stop',
		2: 'Pause',
		3: 'Seek',
		4: 'Next',
		5: 'Previous',
		6: 'Record'
	}
};

},{}],5:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Constants = require('./Constants');

var _require = require('omniscience-utilities');

var Eventable = _require.Eventable;

var Tab = (function (_Eventable) {
	_inherits(Tab, _Eventable);

	function Tab(tabs, button, frontEndBridge) {
		var _this = this;

		_classCallCheck(this, Tab);

		_get(Object.getPrototypeOf(Tab.prototype), 'constructor', this).call(this);
		this._tabs = tabs;
		this._button = button;
		this._frontEndBridge = frontEndBridge;
		this._pageWorker = null;

		this._button.on('click', function () {
			_this.openFocus();
		});
	}

	_createClass(Tab, [{
		key: 'openFocus',
		value: function openFocus() {
			var _this2 = this;

			if (this._pageWorker) return this._pageWorker.tab.activate();

			this._tabs.open({
				url: Constants.tab.html,
				onLoad: function onLoad(tab) {
					_this2._pageWorker = tab.attach({
						contentScriptFile: Constants.tab.js
					});

					_this2._pageWorker.on("message", function (message) {
						return _this2._frontEndBridge.onMessageFromFrontEnd(message);
					});

					_this2._frontEndBridge.on("sendToFrontEnd", function (eventType) {
						for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
							data[_key - 1] = arguments[_key];
						}

						var message = { eventType: eventType, data: _this2._makeSafeForEmit.apply(_this2, data) };
						_this2._pageWorker.postMessage(JSON.stringify(message));
					});
				},
				onClose: function onClose(tab) {
					_this2._pageWorker = null;
				}
			});
		}
	}, {
		key: '_makeSafeForEmit',
		value: function _makeSafeForEmit() {
			//The panel serializes out the data object using the below two lines
			//the tab does not, therefore the same data sent to both will not appear the same unless we add the below lines
			var replacer = function replacer(key, value) {
				return typeof value === "function" ? void 0 : value;
			};

			for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				args[_key2] = arguments[_key2];
			}

			return args.map(function (argument) {
				return JSON.parse(JSON.stringify(argument, replacer));
			});
		}
	}]);

	return Tab;
})(Eventable);

module.exports = Tab;

},{"./Constants":4,"omniscience-utilities":186}],6:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('omniscience-utilities');

var Eventable = _require.Eventable;

var FrontEndBridge = (function (_Eventable) {
	_inherits(FrontEndBridge, _Eventable);

	function FrontEndBridge(subscriptionService, serviceExecutor, fileUtilities, deviceService, simpleServer, simpleTCP) {
		var _this = this;

		_classCallCheck(this, FrontEndBridge);

		_get(Object.getPrototypeOf(FrontEndBridge.prototype), 'constructor', this).call(this);
		this._subscriptionService = subscriptionService;
		this._serviceExecutor = serviceExecutor;
		this._fileUtilities = fileUtilities;
		this._deviceService = deviceService;
		this._simpleServer = simpleServer;
		this._simpleTCP = simpleTCP;

		this._deviceService.on('deviceFound', function () {
			for (var _len = arguments.length, data = Array(_len), _key = 0; _key < _len; _key++) {
				data[_key] = arguments[_key];
			}

			return _this.sendToFrontEnd.apply(_this, ["deviceFound"].concat(data));
		});
		this._deviceService.on('deviceLost', function () {
			for (var _len2 = arguments.length, data = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				data[_key2] = arguments[_key2];
			}

			return _this.sendToFrontEnd.apply(_this, ["deviceLost"].concat(data));
		});
	}

	_createClass(FrontEndBridge, [{
		key: 'handleMessageFromFrontEnd',
		value: function handleMessageFromFrontEnd(eventType, uniqueId) {
			var _subscriptionService,
			    _simpleServer,
			    _simpleTCP,
			    _this2 = this;

			for (var _len3 = arguments.length, data = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
				data[_key3 - 2] = arguments[_key3];
			}

			switch (eventType) {
				case 'Subscribe':
					var eventSubUrl = data[0],
					    serviceUUID = data[1],
					    serverIP = data[2],
					    timeoutInSeconds = data[3],
					    subscriptionId = data[4];

					var directResponsesTo = 'http://' + serverIP + ':' + this._simpleServer.port + '/events/' + serviceUUID;
					this._simpleServer.registerPath('/events/' + serviceUUID, function (request) {
						return _this2.sendToFrontEnd("UPnPEvent", serviceUUID, request.body);
					});
					this._subscriptionService.subscribe(directResponsesTo, eventSubUrl, timeoutInSeconds, subscriptionId).then(function (subscriptionId) {
						return _this2.sendToFrontEnd("emitResponse", uniqueId, subscriptionId);
					}, function (err) {
						return _this2.sendToFrontEnd("emitResponse", uniqueId);
					});
					break;
				case 'Unsubscribe':
					this._simpleServer.registerPath('/events/' + data[2], null);
					(_subscriptionService = this._subscriptionService).unsubscribe.apply(_subscriptionService, data).then(function () {
						return _this2.sendToFrontEnd("emitResponse", uniqueId);
					});
					break;
				case 'CallService':
					var service = data[0],
					    method = data[1],
					    info = data[2];

					this._serviceExecutor.callService(service.controlUrl, service.uuid, method, info).then(function (response) {
						return _this2.sendToFrontEnd("emitResponse", uniqueId, response);
					});
					break;
				case 'chooseFiles':
					this._fileUtilities.openFileBrowser().then(function (files) {
						return _this2.sendToFrontEnd("emitResponse", uniqueId, files ? files : []);
					});
					break;
				case 'shareFile':
					var url = (_simpleServer = this._simpleServer).registerFile.apply(_simpleServer, data);
					console.log(url);
					this.sendToFrontEnd("emitResponse", uniqueId, url);
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
					(_simpleTCP = this._simpleTCP).send.apply(_simpleTCP, data).then(function (response) {
						return _this2.sendToFrontEnd("emitResponse", uniqueId, response);
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

			this.emit.apply(this, ["sendToFrontEnd", eventType].concat(data));
		}
	}, {
		key: 'onMessageFromFrontEnd',
		value: function onMessageFromFrontEnd(message) {
			var messageObj = undefined;
			try {
				messageObj = JSON.parse(message);
			} catch (err) {
				console.log(message);
				console.log(err);
				return;
			}
			this.handleMessageFromFrontEnd.apply(this, [messageObj.eventType].concat(_toConsumableArray(messageObj.data)));
		}
	}]);

	return FrontEndBridge;
})(Eventable);

module.exports = FrontEndBridge;

},{"omniscience-utilities":186}],7:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Constants = require('../Constants');
var HttpRequest = require('../HttpRequest');

var HttpServer = (function () {
	function HttpServer(urlProvider, httpResponder, httpRequestHandler, timer, fileResponder, chromeTCPServer, chromeTCP) {
		_classCallCheck(this, HttpServer);

		this._chromeTCPServer = chromeTCPServer;
		this._chromeTCP = chromeTCP;
		this._urlProvider = urlProvider;
		this._httpResponder = httpResponder;
		this._timer = timer;
		this._fileResponder = fileResponder;
		this._httpRequestHandler = httpRequestHandler;

		this.isRunning = false;
		this.port = null;
		this.localAddress = '0.0.0.0';
		this.registeredPaths = {};
		this.registeredFiles = {};
		this.incomingConnections = {};
	}

	_createClass(HttpServer, [{
		key: 'start',
		value: function start() {
			var _this = this;

			if (this.isRunning) return;

			this.isRunning = true;
			if (!this.port) this.port = this._getRandomPort();

			this._chromeTCP.onReceive.addListener(function (_ref) {
				var socketId = _ref.socketId;
				var data = _ref.data;

				if (!_this.incomingConnections.hasOwnProperty(socketId)) return; //connection is not to this server

				var httpRequest = _this.incomingConnections[socketId];
				_this._httpRequestHandler.handleRequest(socketId, data, httpRequest, function (request) {
					return _this._onRequestSuccess(request);
				}, function (request, error) {
					return _this._onRequestError(request, error);
				});
			});

			this._chromeTCPServer.onAccept.addListener(function (_ref2) {
				var socketId = _ref2.socketId;
				var clientSocketId = _ref2.clientSocketId;

				if (_this._socketId !== socketId) return; //connection is not to this server

				_this.incomingConnections[clientSocketId] = new HttpRequest();
				_this._chromeTCP.setPaused(clientSocketId, false);
			});

			this._chromeTCPServer.onAcceptError.addListener(function (_ref3) {
				var socketId = _ref3.socketId;
				var resultCode = _ref3.resultCode;

				console.log('error on socket ' + socketId + ' code: ' + resultCode);
				_this._chromeTCPServer.setPaused(socketId, false);
			});

			//todo: should this be persistent?
			this._chromeTCPServer.create({ persistent: false, name: 'httpServerSocket' }, function (_ref4) {
				var socketId = _ref4.socketId;

				_this._socketId = socketId;

				_this._chromeTCPServer.listen(_this._socketId, _this.localAddress, _this.port, null, function (resultCode) {
					if (resultCode < 0) {
						console.log(resultCode);
						_this.isRunning = false;
					}
				});
			});

			return this.port;
		}
	}, {
		key: 'stop',
		value: function stop() {
			var _this2 = this;

			if (!this.isRunning) return;
			this._chromeTCPServer.close(this._socketId, function () {
				return _this2.isRunning = false;
			});
		}
	}, {
		key: '_getRandomPort',
		value: function _getRandomPort() {
			return Math.floor(Math.random() * (65535 - 10000)) + 10000;
		}
	}, {
		key: '_onRequestSuccess',
		value: function _onRequestSuccess(request) {
			var _this3 = this;

			//todo: look into whether or not the below is actually a good idea
			//todo: the firefox server clears the timeout when the socket closes, as it has
			//an onclose event.  As far as I can tell chrome's doesn't.  See if we can detect onclose this
			//if the socket is already closed chrome throws two errors:
			//	Unchecked runtime.lastError while running sockets.tcp.getInfo: Socket not found
			//	and
			//	Error in response to sockets.tcp.getInfo: TypeError: Cannot read property 'connected' of undefined

			delete this.incomingConnections[request.socket]; //request.socket is the socketId, we now have the entire message so we dont need this anymore

			var timeout = this._timer.setTimeout(function () {
				_this3._chromeTCP.getInfo(request.socket, function (_ref5) {
					var connected = _ref5.connected;
					var peerAddress = _ref5.peerAddress;

					if (connected) _this3._httpResponder.sendTimeoutResponse(request.socket);
				});
			}, Constants.serverTimeoutInMilliseconds);

			request.path = request.path.toLowerCase();

			if (this.registeredPaths.hasOwnProperty(request.path)) {
				this.registeredPaths[request.path](request);
				return;
			}

			if (this.registeredFiles.hasOwnProperty(request.path)) {
				this._fileResponder.sendResponse(request, this.registeredFiles[request.path]);
				return;
			}

			this._httpResponder.sendFileNotFoundResponse(request.socket);
		}
	}, {
		key: '_onRequestError',
		value: function _onRequestError(request, err) {
			var _this4 = this;

			if (this.incomingConnections.hasOwnProperty(request.socket)) delete this.incomingConnections[request.socket]; //request.socket is the socketId

			this._chromeTCP.getInfo(request.socket, function (_ref6) {
				var connected = _ref6.connected;
				var peerAddress = _ref6.peerAddress;

				if (connected) _this4._httpResponder.sendErrorResponse(request.socket);
				console.warn('bad request received from ' + peerAddress);
			});
		}
	}]);

	return HttpServer;
})();

module.exports = HttpServer;
},{"../Constants":8,"../HttpRequest":11}],8:[function(require,module,exports){
"use strict";

module.exports = {
	headerLineDelimiter: "\r\n",
	requestLineDelimiter: " ",
	httpOkStatus: {
		code: 200,
		reason: "OK"
	},
	httpFileNotFoundStatus: {
		code: 404,
		reason: "File Not Found"
	},
	httpTimeoutStatus: {
		code: 500,
		reason: "Server Timed out while attempting to respond."
	},
	httpErrorStatus: {
		code: 500,
		reason: "Server has encountered an error."
	},
	httpPartialStatus: {
		code: 206,
		reason: "Partial Content"
	},
	connectionKeepAlive: "keep-alive",
	connectionClose: "close",
	httpVersion: "HTTP/1.1",
	serverName: "omniscience-server-0.2.0",
	serverTimeoutInMilliseconds: 60000,
	socketBufferSize: 64 * 1024
};
},{}],9:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var FileResponder = (function () {
	function FileResponder(fileUtils, httpResponder, networkingUtils, socketSender, responseBuilder) {
		_classCallCheck(this, FileResponder);

		this._httpResponder = httpResponder;
		this._fileUtils = fileUtils;
		this._networkingUtils = networkingUtils;
		this._socketSender = socketSender;
		this._responseBuilder = responseBuilder;
	}

	_createClass(FileResponder, [{
		key: 'sendResponse',
		value: function sendResponse(request, filePath) {
			var _this = this;

			this._fileUtils.readBytes(filePath).then(function (_ref) {
				var fileBytes = _ref.fileBytes;
				var mimetype = _ref.mimetype;

				var keepAlive = false;
				var offset = _this._networkingUtils.parseRange(request.headers['range']);
				var fileResponseBytes = _this._networkingUtils.offsetBytes(offset, fileBytes);

				var responseHeaders = _this._responseBuilder.createResponseHeaders(request.headers, mimetype, fileResponseBytes.byteLength);
				if (request.method.toLowerCase() === 'head') fileResponseBytes = null;
				if (request.headers['connection'] === 'keep-alive') keepAlive = true;

				_this._socketSender.send(request.socket, responseHeaders.buffer, true).then(function () {
					console.log('headers sent, sending body.');
					_this._socketSender.send(request.socket, fileResponseBytes.buffer, keepAlive);
				});
			}, function (err) {
				console.warn(err);
				_this._httpResponder.sendErrorResponse(request.socket);
			});
		}
	}]);

	return FileResponder;
})();

module.exports = FileResponder;
},{}],10:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Constants = require('../Constants');
var HttpRequest = require('../HttpRequest');

var HttpServer = (function () {
	function HttpServer(tcpSocketProvider, urlProvider, httpResponder, httpRequestHandler, timer, fileResponder) {
		_classCallCheck(this, HttpServer);

		this._tcpSocketProvider = tcpSocketProvider;
		this._urlProvider = urlProvider;
		this._httpResponder = httpResponder;
		this._timer = timer;
		this._fileResponder = fileResponder;
		this._httpRequestHandler = httpRequestHandler;

		this.isRunning = false;
		this.port = null;
		this.registeredPaths = {};
		this.registeredFiles = {};
	}

	_createClass(HttpServer, [{
		key: 'start',
		value: function start() {
			var _this = this;

			if (this.isRunning) return;

			if (!this.port) this.port = this._getRandomPort();

			this._socket = this._tcpSocketProvider.create().listen(this.port, { binaryType: 'arraybuffer' });

			this._socket.onconnect(function (incomingSocket) {
				var httpRequest = new HttpRequest();
				incomingSocket.ondata(function (data) {
					return _this._httpRequestHandler.handleRequest(incomingSocket, data, httpRequest, function (request) {
						return _this._onRequestSuccess(request);
					}, function (request, error) {
						return _this._onRequestError(request, error);
					});
				});
			});

			this.isRunning = true;

			return this.port;
		}
	}, {
		key: 'stop',
		value: function stop() {
			if (!this.isRunning) return;
			this._socket.close();
			this.isRunning = false;
		}
	}, {
		key: '_getRandomPort',
		value: function _getRandomPort() {
			return Math.floor(Math.random() * (65535 - 10000)) + 10000;
		}
	}, {
		key: '_onRequestSuccess',
		value: function _onRequestSuccess(request) {
			var _this2 = this;

			/*todo: look into whether or not the below is actually a good idea */
			var timeout = this._timer.setTimeout(function () {}, Constants.serverTimeoutInMilliseconds);

			request.path = request.path.toLowerCase();

			request.socket.onclose = function () {
				return _this2._timer.clearTimeout(timeout);
			};
			if (this.registeredPaths.hasOwnProperty(request.path)) {
				this.registeredPaths[request.path](request);
				return;
			}

			if (this.registeredFiles.hasOwnProperty(request.path)) {
				this._fileResponder.sendResponse(request, this.registeredFiles[request.path]);
				return;
			}

			this._httpResponder.sendFileNotFoundResponse(request.socket);
		}
	}, {
		key: '_onRequestError',
		value: function _onRequestError(request, err) {
			if (request.socket.isOpen()) this._httpResponder.sendErrorResponse(request.socket);
			console.warn('bad request received');
		}
	}]);

	return HttpServer;
})();

module.exports = HttpServer;

/* if (request.socket.isOpen())
 * this._httpResponder.sendTimeoutResponse(request.socket);
 */
},{"../Constants":8,"../HttpRequest":11}],11:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HttpRequest = function HttpRequest() {
	_classCallCheck(this, HttpRequest);

	this.headers = [];
	this.parameters = [];
	this.method = "";
	this.body = "";
	this.path = "";
	this.socket = {};
	this.bytes = {
		body: [],
		receivedBody: 0,
		receivedTotal: 0,
		total: 0
	};
};

module.exports = HttpRequest;
},{}],12:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HttpRequestHandler = (function () {
	function HttpRequestHandler(networkingUtils, httpRequestParser) {
		_classCallCheck(this, HttpRequestHandler);

		this._networkingUtils = networkingUtils;
		this._httpRequestParser = httpRequestParser;
	}

	_createClass(HttpRequestHandler, [{
		key: "handleRequest",
		value: function handleRequest(socket, eventData, request, success, failure) {
			var packetBodyBytes = undefined;

			if (request.bytes.receivedTotal === 0) {
				request.socket = socket;

				var _httpRequestParser$separateBodyFromHead = this._httpRequestParser.separateBodyFromHead(eventData);

				var _httpRequestParser$separateBodyFromHead2 = _slicedToArray(_httpRequestParser$separateBodyFromHead, 2);

				var head = _httpRequestParser$separateBodyFromHead2[0];
				var body = _httpRequestParser$separateBodyFromHead2[1];

				var metadata = this._httpRequestParser.parseMetadata(head);
				if (!metadata) {
					failure(request, "metadata not parsable.");
					return;
				}

				packetBodyBytes = this._networkingUtils.toByteArray(body);

				request.headers = metadata.headers;
				request.parameters = metadata.parameters;
				request.method = metadata.method;
				request.path = metadata.path;
				if (request.headers.hasOwnProperty("content-length")) request.bytes.total = parseInt(request.headers["content-length"], 10);else request.bytes.total = -1;
			} else packetBodyBytes = eventData;

			request.bytes.receivedTotal += eventData.byteLength;
			request.bytes.receivedBody += packetBodyBytes.byteLength;
			request.bytes.body.push(packetBodyBytes);

			if (request.bytes.receivedTotal >= request.bytes.total) {
				var _networkingUtils;

				var mergedBody = (_networkingUtils = this._networkingUtils).merge.apply(_networkingUtils, _toConsumableArray(request.bytes.body));
				request.body = this._networkingUtils.toString(mergedBody);
				success(request);
			}
		}
	}]);

	return HttpRequestHandler;
})();

module.exports = HttpRequestHandler;
},{}],13:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Constants = require('./Constants');

var HttpRequestParser = (function () {
	function HttpRequestParser(networkingUtils) {
		_classCallCheck(this, HttpRequestParser);

		this._networkingUtils = networkingUtils;
	}

	_createClass(HttpRequestParser, [{
		key: 'parseUrlParams',
		value: function parseUrlParams(params) {
			if (!params) return null;

			var parsedParams = {};
			params.split('&').forEach(function (keyValue) {
				var _decodeURIComponent$split = decodeURIComponent(keyValue).split('=');

				var _decodeURIComponent$split2 = _slicedToArray(_decodeURIComponent$split, 2);

				var key = _decodeURIComponent$split2[0];
				var value = _decodeURIComponent$split2[1];

				parsedParams[key] = value;
			});

			return parsedParams;
		}
	}, {
		key: 'separateBodyFromHead',
		value: function separateBodyFromHead(data) {
			if (!data) return null;

			var dataStr = this._networkingUtils.toString(data);
			return dataStr.split(Constants.headerLineDelimiter + Constants.headerLineDelimiter);
		}
	}, {
		key: 'parseMetadata',
		value: function parseMetadata(metadata) {
			if (!metadata) return null;

			var _metadata$split = metadata.split(Constants.headerLineDelimiter);

			var _metadata$split2 = _toArray(_metadata$split);

			var requestLine = _metadata$split2[0];

			var headerLines = _metadata$split2.slice(1);

			var _requestLine$split = requestLine.split(Constants.requestLineDelimiter);

			var _requestLine$split2 = _slicedToArray(_requestLine$split, 3);

			var method = _requestLine$split2[0];
			var uri = _requestLine$split2[1];
			var protocol = _requestLine$split2[2];

			if (protocol !== Constants.httpVersion) return null;

			var _uri$split = uri.split('?');

			var _uri$split2 = _slicedToArray(_uri$split, 2);

			var path = _uri$split2[0];
			var params = _uri$split2[1];

			var parameters = this.parseUrlParams(params);

			var headers = {};
			headerLines.forEach(function (headerLine) {
				var _headerLine$split = headerLine.split(':');

				var _headerLine$split2 = _slicedToArray(_headerLine$split, 2);

				var name = _headerLine$split2[0];
				var value = _headerLine$split2[1];

				if (!name || !value) return;
				headers[name.toLowerCase().trim()] = value.toLowerCase().trim();
			});

			return { headers: headers, method: method, parameters: parameters, path: path.toLowerCase() };
		}
	}]);

	return HttpRequestParser;
})();

module.exports = HttpRequestParser;
},{"./Constants":8}],14:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("./Constants");

var HttpResponder = (function () {
    function HttpResponder(networkingUtils, socketSender) {
        _classCallCheck(this, HttpResponder);

        this._networkingUtils = networkingUtils;
        this._socketSender = socketSender;
    }

    _createClass(HttpResponder, [{
        key: "sendOkResponse",
        value: function sendOkResponse(socket) {
            this._sendResponse(socket, Constants.httpOkStatus);
        }
    }, {
        key: "sendFileNotFoundResponse",
        value: function sendFileNotFoundResponse(socket) {
            this._sendResponse(socket, Constants.httpFileNotFoundStatus);
        }
    }, {
        key: "sendTimeoutResponse",
        value: function sendTimeoutResponse(socket) {
            this._sendResponse(socket, Constants.httpTimeoutStatus);
        }
    }, {
        key: "sendErrorResponse",
        value: function sendErrorResponse(socket) {
            this._sendResponse(socket, Constants.httpErrorStatus);
        }
    }, {
        key: "_sendResponse",
        value: function _sendResponse(socket, httpStatus) {
            var headers = ["" + Constants.httpVersion + " " + httpStatus.code + " " + httpStatus.reason, "Server: " + Constants.serverName, "Content-Type: text\\plain", "Connection: close", "Content-Length: 0"];

            var headersBuffer = this._networkingUtils.toByteArray(headers.join(Constants.headerLineDelimiter) + Constants.headerLineDelimiter + Constants.headerLineDelimiter).buffer;
            this._socketSender.send(socket, headersBuffer);
        }
    }]);

    return HttpResponder;
})();

module.exports = HttpResponder;
},{"./Constants":8}],15:[function(require,module,exports){
"use strict";

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

module.exports = {
    toByteArray: function toByteArray(strToConvert) {
        return new Uint8Array([].map.call(strToConvert || "", function (i) {
            return i.charCodeAt(0);
        }));
    },
    toBuffer: function toBuffer(stringOrByteArray) {
        if (typeof stringOrByteArray === "string") return this.toByteArray(stringOrByteArray).buffer;
        if (stringOrByteArray instanceof Uint8Array) return stringOrByteArray.buffer;else throw new Error("argument must be of type string or Uint8Array");
    },
    toString: function toString(arrayBuffer) {
        var results = [];
        var uint8Array = new Uint8Array(arrayBuffer);

        for (var i = 0, _length = uint8Array.length; i < _length; i += 200000) {
            //todo: figure out what this 200000 means, then move to constants
            results.push(String.fromCharCode.apply(String, _toConsumableArray(uint8Array.subarray(i, i + 200000))));
        }return results.join("");
    },
    merge: function merge() {
        for (var _len = arguments.length, arrayBuffers = Array(_len), _key = 0; _key < _len; _key++) {
            arrayBuffers[_key] = arguments[_key];
        }

        return arrayBuffers.reduce(function (previous, current) {
            var smushed = new Uint8Array(previous.byteLength + current.byteLength);
            smushed.set(new Uint8Array(previous), 0);
            smushed.set(new Uint8Array(current), previous.byteLength);
            return smushed.buffer;
        });
    },
    parseRange: function parseRange(rangeHeader) {
        if (!rangeHeader) return 0;

        var _rangeHeader$split = rangeHeader.split("=");

        var _rangeHeader$split2 = _slicedToArray(_rangeHeader$split, 2);

        var rangeType = _rangeHeader$split2[0];
        var offsetPlusDash = _rangeHeader$split2[1];

        if (rangeType.toLowerCase() !== "bytes") return 0;

        return Number(offsetPlusDash.replace("-", ""));
    },
    offsetBytes: function offsetBytes(offset, fileBytes) {
        if (!offset || offset <= 0) return fileBytes;
        return fileBytes.subarray(offset);
    },

    /* untestable */
    isArrayBuffer: function isArrayBuffer(obj) {
        //this is here because running jasmine cli (node) will cause it to blow up.
        return ArrayBuffer.isView(obj);
    }
};
},{}],16:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Constants = require('./Constants');

var ResponseBuilder = (function () {
  function ResponseBuilder(networkingUtils) {
    _classCallCheck(this, ResponseBuilder);

    this._networkingUtils = networkingUtils;
  }

  _createClass(ResponseBuilder, [{
    key: 'createResponseHeaders',
    value: function createResponseHeaders(requestHeaders, mimetype, contentLength) {
      //todo: validate parameters
      var contentType = mimetype;
      var connection = requestHeaders['connection'] ? Constants.connectionKeepAlive : Constants.connectionClose;
      var httpStatus = requestHeaders['range'] ? Constants.httpPartialStatus : Constants.httpOkStatus;

      var headers = ['' + Constants.httpVersion + ' ' + httpStatus.code + ' ' + httpStatus.reason, 'Server: ' + Constants.serverName, 'Content-Type: ' + contentType, 'Connection: ' + connection, 'Content-Length: ' + contentLength, 'Accept-Ranges: bytes'];

      return this._networkingUtils.toByteArray(headers.join(Constants.headerLineDelimiter) + Constants.headerLineDelimiter + Constants.headerLineDelimiter);
    }
  }]);

  return ResponseBuilder;
})();

module.exports = ResponseBuilder;

/*`Transfer-Encoding: chunked`*/
},{"./Constants":8}],17:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("./Constants");

var SimpleServer = (function () {
	function SimpleServer(httpServer, urlProvider, md5) {
		_classCallCheck(this, SimpleServer);

		this._httpServer = httpServer;
		this._urlProvider = urlProvider;
		this._md5 = md5;
		this.port = null;
	}

	_createClass(SimpleServer, [{
		key: "start",
		value: function start() {
			this.port = this._httpServer.start();
			return this.port;
		}
	}, {
		key: "stop",
		value: function stop() {
			this._httpServer.stop();
			delete this.port;
			this._httpServer.registeredFiles = {};
			this._httpServer.registeredPaths = {};
		}
	}, {
		key: "registerFile",
		value: function registerFile(file, serverIP) {
			var filePathHash = this._md5(file.path);
			var filePath = "/" + filePathHash + "/" + file.name;
			var pathname = encodeURI(filePath).toLowerCase();

			if (!file.isLocal && this._urlProvider.isValidUri(file.path)) return file.path;

			this._httpServer.registeredFiles[pathname] = file.path;
			return "http://" + serverIP + ":" + this._httpServer.port + "" + pathname;
		}
	}, {
		key: "registerPath",
		value: function registerPath(serverPath, callback) {
			serverPath = serverPath.toLowerCase();
			if (callback) this._httpServer.registeredPaths[serverPath] = callback;else delete this._httpServer.registeredPaths[serverPath];
		}
	}]);

	return SimpleServer;
})();

module.exports = SimpleServer;
},{"./Constants":8}],18:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SimpleServer = require('./SimpleServer');
var FileResponder = require('./FileResponder');
var HttpResponder = require('./HttpResponder');
var ResponseBuilder = require('./ResponseBuilder');
var NetworkingUtils = require('./NetworkingUtils');
var HttpRequestParser = require('./HttpRequestParser');
var HttpRequestHandler = require('./HttpRequestHandler');

var SdkResolver = require('omniscience-sdk-resolver');

var _require = require('omniscience-utilities');

var Utilities = _require.Utilities;

var FirefoxServer = require('./Firefox/HttpServer');
var ChromeServer = require('./Chrome/HttpServer');

var Networking = (function () {
	function Networking() {
		_classCallCheck(this, Networking);

		this._sdk = new SdkResolver().resolve();
		this._utilities = new Utilities();
	}

	_createClass(Networking, [{
		key: 'createSimpleServer',
		value: function createSimpleServer() {
			var httpServer = undefined;

			if (this._sdk.isFirefox) httpServer = new FirefoxServer(this._sdk.createTCPSocketProvider(), this._utilities.createUrlProvider(), new HttpResponder(NetworkingUtils, this._sdk.createSocketSender()), new HttpRequestHandler(NetworkingUtils, new HttpRequestParser(NetworkingUtils)), this._sdk.timers(), new FileResponder(this._sdk.createFileUtilities(), new HttpResponder(NetworkingUtils, this._sdk.createSocketSender()), NetworkingUtils, this._sdk.createSocketSender(), new ResponseBuilder(NetworkingUtils)));else if (this._sdk.isChrome) {
				httpServer = new ChromeServer(this._utilities.createUrlProvider(), new HttpResponder(NetworkingUtils, this._sdk.createSocketSender()), new HttpRequestHandler(NetworkingUtils, new HttpRequestParser(NetworkingUtils)), this._sdk.timers(), new FileResponder(this._sdk.createFileUtilities(), new HttpResponder(NetworkingUtils, this._sdk.createSocketSender()), NetworkingUtils, this._sdk.createSocketSender(), new ResponseBuilder(NetworkingUtils)), this._sdk.chrome.TCPServer, this._sdk.chrome.TCP);
			}

			return new SimpleServer(httpServer, this._utilities.createUrlProvider(), this._utilities.MD5());
		}
	}]);

	return Networking;
})();

module.exports = Networking;
},{"./Chrome/HttpServer":7,"./FileResponder":9,"./Firefox/HttpServer":10,"./HttpRequestHandler":12,"./HttpRequestParser":13,"./HttpResponder":14,"./NetworkingUtils":15,"./ResponseBuilder":16,"./SimpleServer":17,"omniscience-sdk-resolver":42,"omniscience-utilities":48}],19:[function(require,module,exports){

/* global Promise */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var FileUtilities = (function () {
	function FileUtilities(mimeService, fileSystem) {
		_classCallCheck(this, FileUtilities);

		this._fileSystem = fileSystem;
		this._mimeService = mimeService;

		//todo: this is all tech debt baby
		window.omniscience = window.omniscience || {};
		window.omniscience.FileUtilities = window.omniscience.FileUtilities || {};
		window.omniscience.FileUtilities._openedFiles = window.omniscience.FileUtilities._openedFiles || {};

		this._openedFiles = window.omniscience.FileUtilities._openedFiles;
	}

	_createClass(FileUtilities, [{
		key: "readBytes",
		value: function readBytes(filePath) {
			var _this = this;

			return new Promise(function (resolve, reject) {
				_this._fileSystem.restoreEntry(_this._openedFiles[filePath], function (entry) {
					entry.file(function (file) {
						var reader = new FileReader();

						reader.onerror = function (err) {
							return reject(err);
						};
						reader.onloadend = function (event) {
							return resolve({ fileBytes: new Uint8Array(event.target.result), mimetype: _this._mimeService.getMimeType(entry) });
						};
						reader.readAsArrayBuffer(file);
					});
				});
			});
		}
	}, {
		key: "openFileBrowser",
		value: function openFileBrowser() {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				_this2._fileSystem.chooseEntry({
					type: Constants.chromeSdk.filePicker.open,
					/*accepts: [Constants.chromeSdk.filePicker.filterAll],*/
					acceptsMultiple: true
				}, function (fileEntries) {
					var files = [];
					fileEntries.forEach(function (file, index) {
						_this2._fileSystem.getDisplayPath(file, function (filePath) {
							var fileInfo = {
								path: filePath,
								name: file.name,
								type: _this2._mimeService.getMimeType(file)
							};
							files.push(fileInfo);

							var fileId = _this2._fileSystem.retainEntry(file);
							_this2._openedFiles[filePath] = fileId;

							if (index === fileEntries.length - 1) resolve(files); //final time through loop resolve the promise
						});
					});
				});
			});
		}
	}]);

	return FileUtilities;
})();

module.exports = FileUtilities;
},{"../Constants":31}],20:[function(require,module,exports){
/* global chrome */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var IPResolver = (function () {
	function IPResolver() {
		_classCallCheck(this, IPResolver);
	}

	_createClass(IPResolver, [{
		key: "resolveIPs",
		value: function resolveIPs() {
			return new Promise(function (resolve, reject) {
				chrome.system.network.getNetworkInterfaces(function (interfaces) {
					interfaces.push("127.0.0.1");
					/* for IPv6 support see https://en.wikipedia.org/wiki/Simple_Service_Discovery_Protocol#Protocol_transport_and_addressing */
					resolve(interfaces.filter(function (_ref) {
						var address = _ref.address;
						return Constants.ipv4Regex.test(address);
					}).map(function (_ref2) {
						var address = _ref2.address;
						return address;
					}));
				});
			});
		}
	}]);

	return IPResolver;
})();

module.exports = IPResolver;
},{"../Constants":31}],21:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var MimeService = (function () {
	function MimeService() {
		_classCallCheck(this, MimeService);
	}

	_createClass(MimeService, [{
		key: "getMimeType",
		value: function getMimeType(file) {
			var fileNameParts = file.name.split(".");
			var extension = fileNameParts[fileNameParts.length - 1];
			return Constants.mimetypes[extension] || Constants.defaultMimeType;
		}
	}]);

	return MimeService;
})();

module.exports = MimeService;
},{"../Constants":31}],22:[function(require,module,exports){
/* global chrome */
"use strict";

module.exports = {
	notify: function notify(options) {
		var chromeOptions = {
			type: "basic",
			title: options.title,
			message: options.text,
			iconUrl: options.iconURL
		};
		chrome.notifications.create(chromeOptions);
	}
};
},{}],23:[function(require,module,exports){
/* global Promise */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SimpleTCPSocket = (function () {
	function SimpleTCPSocket(timers, chromeTCP, lastError) {
		_classCallCheck(this, SimpleTCPSocket);

		this.responseTimeout = 60000;
		this._timers = timers;
		this._chromeTCP = chromeTCP;
		this._lastError = lastError;
	}

	_createClass(SimpleTCPSocket, [{
		key: 'send',
		value: function send(ip, port, data, waitForResponse) {
			var _this = this;

			return new Promise(function (resolve, reject) {
				/*todo: maybe add a timeout?*/
				_this._chromeTCP.create({ name: 'send@' + ip + ':' + port }, function (_ref) {
					var socketId = _ref.socketId;

					var mySocketId = socketId;
					_this._chromeTCP.connect(socketId, ip, parseInt(port, 10), function (resultCode) {
						if (resultCode < 0) reject(_this._lastError.message);

						/* todo: there is likely a better way to do the onReceive and onReceiveError
       * since they are fired for all TCP from this app, if they could be put
       * in a place to only be bound once it would be likely better
       */
						_this._chromeTCP.onReceiveError.addListener(function (_ref2) {
							var socketId = _ref2.socketId;
							var data = _ref2.data;

							if (socketId !== mySocketId) return;

							resolve(data);
							_this._chromeTCP.close(socketId);
						});
						_this._chromeTCP.onReceive.addListener(function (_ref3) {
							var socketId = _ref3.socketId;
							var resultCode = _ref3.resultCode;

							if (socketId !== mySocketId) return;

							reject(_this._lastError.message);
							_this._chromeTCP.close(socketId);
						});

						_this._chromeTCP.send(mySocketId, data, function (_ref4) {
							var resultCode = _ref4.resultCode;
							var bytesSent = _ref4.bytesSent;

							if (resultCode < 0) reject(_this._lastError.message);
							if (!waitForResponse) _this._chromeTCP.close(mySocketId);else {
								_this._timers.setTimeout(function () {
									_this._chromeTCP.close(mySocketId);
									reject('Device did not respond within ' + _this.responseTimeout / 1000 + ' seconds.');
								}, _this.responseTimeout);
							}
						});
					});
				});
			});
		}
	}, {
		key: 'ping',
		value: function ping(ip, port) {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				/*todo: maybe add a timeout?*/
				_this2._chromeTCP.create({ name: 'ping@' + ip + ':' + port }, function (_ref5) {
					var socketId = _ref5.socketId;

					_this2._chromeTCP.connect(socketId, ip, parseInt(port, 10), function (resultCode) {
						resolve(resultCode >= 0);
						_this2._chromeTCP.close(socketId);
					});
				});
			});
		}
	}]);

	return SimpleTCPSocket;
})();

module.exports = SimpleTCPSocket;
},{}],24:[function(require,module,exports){
/* global chrome */
/* global Promise */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var SimpleUDPSocket = (function () {
	function SimpleUDPSocket(udpSocketProvider) {
		_classCallCheck(this, SimpleUDPSocket);

		this._udpSocketProvider = udpSocketProvider;

		this._initialized = false;
		this._sendQueue = [];

		this.localPort;
		this.localIP;
		this.multicastIP;
		this.udpSocket;
	}

	_createClass(SimpleUDPSocket, [{
		key: "init",
		value: function init(localPort, localIP, multicastIP) {
			var _this = this;

			this.udpSocket = this._udpSocketProvider.create();

			this.udpSocket.create({ bufferSize: Constants.socketBufferSize }).then(function () {
				return _this.udpSocket.setMulticastLoopbackMode(true);
			}).then(function (result) {
				if (result < 0) throw new Error("setting multicast loopback mode failed with error code: " + result);
				return _this.udpSocket.bind(localIP, localPort);
			}).then(function (result) {
				if (result < 0) throw new Error("binding udp socket failed with error code: " + result);
				return _this.udpSocket.getInfo();
			}).then(function (socketInfo) {
				_this.localPort = socketInfo.localPort;
				_this.localIP = socketInfo.localAddress;
				_this.multicastIP = multicastIP;
				return _this.udpSocket.joinGroup(_this.multicastIP);
			}).then(function () {
				_this._initialized = true;
				_this._sendQueue.forEach(function (queuedMessage) {
					return _this.udpSocket.send(queuedMessage.message.buffer, queuedMessage.destinationIP, queuedMessage.destinationPort);
				});
			});
		}
	}, {
		key: "send",
		value: function send(destinationIP, destinationPort, message) {
			if (!this._initialized) this._sendQueue.push({ destinationIP: destinationIP, destinationPort: destinationPort, message: message });else this.udpSocket.send(message.buffer, destinationIP, destinationPort);
		}
	}, {
		key: "close",
		value: function close() {
			var _this2 = this;

			this.udpSocket.close().then(function () {
				if (typeof _this2._stopListeningEventHandler === "function") _this2._stopListeningEventHandler();
			});
		}
	}, {
		key: "onStopListeningEvent",
		value: function onStopListeningEvent(callback) {
			this._stopListeningEventHandler = callback;
		}
	}, {
		key: "onPacketReceivedEvent",
		value: function onPacketReceivedEvent(callback) {
			this.udpSocket.onReceive(callback);
		}
	}]);

	return SimpleUDPSocket;
})();

module.exports = SimpleUDPSocket;
},{"../Constants":31}],25:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var SocketSender = (function () {
	function SocketSender(chromeTCP) {
		_classCallCheck(this, SocketSender);

		this._chromeTCP = chromeTCP;
	}

	_createClass(SocketSender, [{
		key: "send",
		value: function send(socketId, data, keepAlive) {
			var _this = this;

			//todo: look into chrome.sockets.tcp.setKeepAlive -- I think it is for the client not the server
			return new Promise(function (resolve, reject) {
				_this._chromeTCP.send(socketId, data, function (resultCode, bytesSent) {
					//todo: i have a sneaking suspicion that the bytesSent is going to be either the buffer size
					//or file size whichever is smaller and I am going to have to loop like I do in FF
					resolve();
					if (!keepAlive) _this._chromeTCP.close(socketId, null);
				});
			});
		}
	}]);

	return SocketSender;
})();

module.exports = SocketSender;
},{"../Constants":31}],26:[function(require,module,exports){
/* global chrome */
"use strict";

module.exports = {
	get: function get(key) {
		return new Promise(function (resolve, reject) {
			if (typeof chrome.runtime.lastError === "undefined") chrome.storage.local.get(key, function (items) {
				return resolve(items);
			});else console.log(chrome.runtime.lastError.message);
		});
	},
	set: function set(key, value) {
		chrome.storage.local.set({ key: value });
	},
	remove: function remove(key) {
		chrome.storage.local.remove(key);
	}
};
},{}],27:[function(require,module,exports){
/* global chrome */
/* global Promise */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var TCPSocket = (function () {
	function TCPSocket(tcp, tcpServer, ipResolver) {
		_classCallCheck(this, TCPSocket);

		this._tcp = tcp; //https://developer.chrome.com/apps/sockets_tcp
		this._tcpServer = tcpServer; //https://developer.chrome.com/apps/sockets_tcpServer
		this._ipResolver = ipResolver;
		this.binaryType = "arraybuffer";
	}

	_createClass(TCPSocket, [{
		key: "listen",
		value: function listen(localPort, options, backlog) {
			var _this = this;

			//HttpServer.js:23
			this.port = localPort;

			this._ipResolver.resolveIPs().then(function (addresses) {
				return addresses.forEach(function (address) {
					return _this._tcpServer.create({}, function (createInfo) {
						return _this._tcpServer.listen(createInfo.socketId, address, localPort);
					});
				});
			});

			return this;
		}
	}, {
		key: "onconnect",
		value: function onconnect(callback) {
			var _this2 = this;

			//HttpServer.js:27
			this._tcpServer.onAccept.addListener(function (info) {
				//info.clientSocketId is the id of the incoming socket and is of this.tcp also it is initially paused and must be unpaused
				_this2._tcp.getSockets(function (socketInfos) {
					_this2._tcp.setPaused(info.clientSocketId, false);
					var nativeSocketInfo = socketInfos.filter(function (socketInfo) {
						return socketInfo.socketId === info.clientSocketId;
					});
					var wrappedSocket = new TCPSocket(_this2._tcp, _this2._tcpServer);
					wrappedSocket.socketId = nativeSocketInfo.socketId;

					callback(wrappedSocket);
				});
			});
		}
	}, {
		key: "open",
		value: function open(host, port) {
			var _this3 = this;

			this.host = host;
			this.port = port;

			this._tcp.create(null, function (createInfo) {
				_this3.socketId = createInfo.socketId;
				_this3._tcp.connect(createInfo.socketId, host, port, _this3.onopen);
			});

			return this;
		}
	}, {
		key: "close",
		value: function close() {
			//there are two close methods, one for _tcp and one for _tcpServer.
			//wonder if i can always call them both or if either will do
			this._tcp.close(this.socketId);
			this._tcpServer.close(this.socketId);
		}
	}, {
		key: "isOpen",
		value: function isOpen() {
			//todo:this is async, and it needs to not look like it.
			//also check if the socketInfo object gets updated in realtime or if i need to call methods for each access to it.
			//i doubt it gets updated in real time
			return this._tcp.getInfo(this.socketId, function (socketInfo) {
				return socketInfo.connected;
			});
		}
	}, {
		key: "send",
		value: function send(data, byteOffset, byteLength) {
			//chrome.sockets.tcp.send(integer socketId, ArrayBuffer data, function callback)
			//chrome does not need the ondrain, as it sends the entire data the first time
			//update networking to take this into account
			this._tcp.send(this.socketId, data, function (sendInfo) {});
		}
	}, {
		key: "onerror",
		value: function onerror(callback) {
			this._onerror = callback;
		}
	}, {
		key: "ondata",
		value: function ondata(callback) {
			this._tcp.onReceive.addListener(function (info) {});
		}
	}, {
		key: "onopen",
		value: function onopen(callback) {
			this._onopen = callback;
		}
	}, {
		key: "onclose",
		value: function onclose(callback) {
			this._onclose = callback;
		}
	}]);

	return TCPSocket;
})();

module.exports = TCPSocket;
},{"../Constants":31}],28:[function(require,module,exports){
/* global chrome */
/* global Promise */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var UDPSocket = (function () {
	function UDPSocket(chromeUdp) {
		_classCallCheck(this, UDPSocket);

		this._chromeUdp = chromeUdp;
		this.socketId;
	}

	_createClass(UDPSocket, [{
		key: "create",
		value: function create(properties) {
			var _this = this;

			return new Promise(function (resolve, reject) {
				_this._chromeUdp.create(properties, function (createInfo) {
					_this.socketId = createInfo.socketId;
					resolve(createInfo.socketId);
				});
			});
		}
	}, {
		key: "bind",
		value: function bind(localAddress, localPort) {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				_this2._chromeUdp.bind(_this2.socketId, localAddress, localPort || 0, function (result) {
					if (result < 0) reject(result);else resolve(result);
				});
			});
		}
	}, {
		key: "send",
		value: function send(data, remoteAddress, remotePort) {
			var _this3 = this;

			return new Promise(function (resolve, reject) {
				_this3._chromeUdp.send(_this3.socketId, data, remoteAddress, remotePort, function (sendInfo) {
					if (sendInfo.resultCode < 0) reject(sendInfo.resultCode);else resolve(sendInfo.resultCode, sendInfo.bytesSent);
				});
			});
		}
	}, {
		key: "close",
		value: function close() {
			var _this4 = this;

			return new Promise(function (resolve, reject) {
				_this4._chromeUdp.close(_this4.socketId, function () {
					resolve();
				});
			});
		}
	}, {
		key: "joinGroup",
		value: function joinGroup(groupAddress) {
			var _this5 = this;

			return new Promise(function (resolve, reject) {
				_this5._chromeUdp.joinGroup(_this5.socketId, groupAddress, function (result) {
					if (result < 0) reject(result);else resolve(result);
				});
			});
		}
	}, {
		key: "setMulticastLoopbackMode",
		value: function setMulticastLoopbackMode(enabled) {
			var _this6 = this;

			return new Promise(function (resolve, reject) {
				_this6._chromeUdp.setMulticastLoopbackMode(_this6.socketId, enabled, function (result) {
					resolve(result);
				});
			});
		}
	}, {
		key: "getInfo",
		value: function getInfo() {
			var _this7 = this;

			return new Promise(function (resolve, reject) {
				_this7._chromeUdp.getInfo(_this7.socketId, function (socketInfo) {
					resolve(socketInfo);
				});
			});
		}
	}, {
		key: "onReceive",
		value: function onReceive(callback) {
			var _this8 = this;

			this._chromeUdp.onReceive.addListener(function (info) {
				if (_this8.socketId !== info.socketId) return;
				var message = {
					data: info.data,
					fromAddr: {
						address: info.remoteAddress,
						port: info.remotePort
					}
				};
				callback(message);
			});
		}
	}, {
		key: "onReceiveError",
		value: function onReceiveError(callback) {
			var _this9 = this;

			this._chromeUdp.onReceiveError.addListener(function (info) {
				if (_this9.socketId !== info.socketId) return;
				callback(info.socketId, info.resultCode);
			});
		}
	}]);

	return UDPSocket;
})();

module.exports = UDPSocket;
},{"../Constants":31}],29:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UrlSdk = (function () {
	function UrlSdk(windowUrl) {
		_classCallCheck(this, UrlSdk);

		this._windowUrl = windowUrl;
	}

	_createClass(UrlSdk, [{
		key: "isValidURI",
		value: function isValidURI(path) {
			try {
				if (path instanceof URL) return true;
				new (this._windowUrl(path))();
				return true;
			} catch (e) {
				return false;
			}
		}
	}, {
		key: "URL",
		value: function URL(source, base) {
			if (base) return new window.URL(source, base);else return new window.URL(source);
		}
	}]);

	return UrlSdk;
})();

module.exports = UrlSdk;
},{}],30:[function(require,module,exports){
/* global chrome */
/* global Promise */
'use strict';

var UDP = require('./UDPSocket');
var TCP = require('./TCPSocket');
var UrlSdk = require('./UrlSdk');
var SimpleTCP = require('../SimpleTCP');
var IPResolver = require('./IPResolver');
var MimeService = require('./MimeService');
var SocketSender = require('./SocketSender');
var FileUtilities = require('./FileUtilities');
var SimpleUDPSocket = require('./SimpleUDPSocket');
var SimpleTCPSocket = require('./SimpleTCPSocket');

module.exports.chrome = {};
module.exports.chrome.TCP = chrome.sockets.tcp;
module.exports.chrome.TCPServer = chrome.sockets.tcpServer;

module.exports.createBase64Utils = function () {
	return { encode: function encode(convertMe) {
			return window.btoa(convertMe);
		}, decode: function decode(decodeMe) {
			window.atob(decodeMe);
		} };
};
module.exports.createDomParser = function () {
	return new window.DOMParser();
};
module.exports.createFileUtilities = function () {
	return new FileUtilities(new MimeService(), chrome.app.window.get('omniscience').contentWindow.chrome.fileSystem);
};
module.exports.createIPResolver = function () {
	return new IPResolver();
};
module.exports.createSimpleTCP = function () {
	return new SimpleTCP(new SimpleTCPSocket(window, chrome.sockets.tcp, chrome.runtime.lastError));
};
module.exports.createSocketSender = function () {
	return new SocketSender(chrome.sockets.tcp);
};
module.exports.createStorageService = function () {
	return require('./StorageService');
}; // https://developer.chrome.com/extensions/storage
module.exports.createTCPSocketProvidere = function () {
	return { create: new TCP(chrome.sockets.tcp, chrome.sockets.tcpServer) };
}; // https://developer.chrome.com/apps/sockets_tcp  https://developer.chrome.com/apps/sockets_tcpServer
module.exports.createUDPSocket = function () {
	return new SimpleUDPSocket({ create: function create() {
			return new UDP(chrome.sockets.udp, chrome.runtime.lastError);
		} });
}; // https://developer.chrome.com/apps/sockets_udp
module.exports.notifications = function () {
	return require('./Notifications');
};
module.exports.timers = function () {
	return window;
};
module.exports.url = function () {
	return new UrlSdk(window.URL);
};
module.exports.XMLHttpRequest = function () {
	return window.XMLHttpRequest;
};

module.exports.isFirefox = false;
module.exports.isChrome = true;

// Production steps of ECMA-262, Edition 6, 22.1.2.1
// Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
if (!Array.from) {
	Array.from = (function () {
		var toStr = Object.prototype.toString;
		var isCallable = function isCallable(fn) {
			return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
		};
		var toInteger = function toInteger(value) {
			var number = Number(value);
			if (isNaN(number)) {
				return 0;
			}
			if (number === 0 || !isFinite(number)) {
				return number;
			}
			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};
		var maxSafeInteger = Math.pow(2, 53) - 1;
		var toLength = function toLength(value) {
			var len = toInteger(value);
			return Math.min(Math.max(len, 0), maxSafeInteger);
		};

		// The length property of the from method is 1.
		return function from(arrayLike /*, mapFn, thisArg */) {
			// 1. Let C be the this value.
			var C = this;

			// 2. Let items be ToObject(arrayLike).
			var items = Object(arrayLike);

			// 3. ReturnIfAbrupt(items).
			if (arrayLike == null) {
				throw new TypeError('Array.from requires an array-like object - not null or undefined');
			}

			// 4. If mapfn is undefined, then let mapping be false.
			var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
			var T;
			if (typeof mapFn !== 'undefined') {
				// 5. else
				// 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
				if (!isCallable(mapFn)) {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				}

				// 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
				if (arguments.length > 2) {
					T = arguments[2];
				}
			}

			// 10. Let lenValue be Get(items, "length").
			// 11. Let len be ToLength(lenValue).
			var len = toLength(items.length);

			// 13. If IsConstructor(C) is true, then
			// 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
			// 14. a. Else, Let A be ArrayCreate(len).
			var A = isCallable(C) ? Object(new C(len)) : new Array(len);

			// 16. Let k be 0.
			var k = 0;
			// 17. Repeat, while k < len… (also steps a - h)
			var kValue;
			while (k < len) {
				kValue = items[k];
				if (mapFn) {
					A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
				} else {
					A[k] = kValue;
				}
				k += 1;
			}
			// 18. Let putStatus be Put(A, "length", len, true).
			A.length = len;
			// 20. Return A.
			return A;
		};
	})();
}
},{"../SimpleTCP":41,"./FileUtilities":19,"./IPResolver":20,"./MimeService":21,"./Notifications":22,"./SimpleTCPSocket":23,"./SimpleUDPSocket":24,"./SocketSender":25,"./StorageService":26,"./TCPSocket":27,"./UDPSocket":28,"./UrlSdk":29}],31:[function(require,module,exports){
"use strict";

module.exports = {
	ipv4Regex: /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/,
	IPResolverMulticast: "239.255.255.255",
	defaultMimeType: "application/octet-stream",
	addonSdk: {
		filePicker: {
			filterAll: 1, //Corresponds to the *.* filter for file extensions. All files will pass through the filter.
			filterImages: 8, //Corresponds to the *.jpe, *.jpg, *.jpeg, *.gif, *.png, *.bmp, *.ico, *.svg, *.svgz, *.tif, *.tiff, *.ai, *.drw, *.pct, *.psp, *.xcf, *.psd and *.raw filters for file extensions.
			filterAudio: 256, //Corresponds to the *.aac, *.aif, *.flac, *.iff, *.m4a, *.m4b, *.mid, *.midi, *.mp3, *.mpa, *.mpc, *.oga, *.ogg, *.ra, *.ram, *.snd, *.wav and *.wma filters for file extensions.
			filterVideo: 512, //Corresponds to the *.avi, *.divx, *.flv, *.m4v, *.mkv, *.mov, *.mp4, *.mpeg, *.mpg, *.ogm, *.ogv, *.ogx, *.rm, *.rmvb, *.smil, *.webm, *.wmv and *.xvid filters for file extensions.
			returnOK: 0, //The file picker dialog was closed by the user hitting 'Ok'
			returnCancel: 1, //The file picker dialog was closed by the user hitting 'Cancel'
			modeOpenMultiple: 3, //Load multiple files.
			windowTitle: "Choose File(s)",
			noFilesChosen: "file browser was closed without choosing any files"
		}
	},
	chromeSdk: {
		filePicker: {
			open: "openFile",
			openWritable: "openWritableFile",
			openDirectory: "openDirectory",
			save: "saveFile",
			filterAll: "*",
			filterAudio: "audio/*",
			filterVideo: "video/*",
			filterImages: "images/*"
		}
	},
	forceGetIPMessage: new Uint8Array([].map.call("get my ipaddresses", function (i) {
		return i.charCodeAt(0);
	})),
	socketBufferSize: 64*1024,
	mimetypes: {
		"123": "application/vnd.lotus-1-2-3",
		"3dml": "text/vnd.in3d.3dml",
		"3ds": "image/x-3ds",
		"3g2": "video/3gpp2",
		"3gp": "video/3gpp",
		"7z": "application/x-7z-compressed",
		"aab": "application/x-authorware-bin",
		"aac": "audio/x-aac",
		"aam": "application/x-authorware-map",
		"aas": "application/x-authorware-seg",
		"abw": "application/x-abiword",
		"ac": "application/pkix-attr-cert",
		"acc": "application/vnd.americandynamics.acc",
		"ace": "application/x-ace-compressed",
		"acu": "application/vnd.acucobol",
		"acutc": "application/vnd.acucorp",
		"adp": "audio/adpcm",
		"aep": "application/vnd.audiograph",
		"afm": "application/x-font-type1",
		"afp": "application/vnd.ibm.modcap",
		"ahead": "application/vnd.ahead.space",
		"ai": "application/postscript",
		"aif": "audio/x-aiff",
		"aifc": "audio/x-aiff",
		"aiff": "audio/x-aiff",
		"air": "application/vnd.adobe.air-application-installer-package+zip",
		"ait": "application/vnd.dvb.ait",
		"ami": "application/vnd.amiga.ami",
		"apk": "application/vnd.android.package-archive",
		"appcache": "text/cache-manifest",
		"application": "application/x-ms-application",
		"apr": "application/vnd.lotus-approach",
		"arc": "application/x-freearc",
		"asc": "application/pgp-signature",
		"asf": "video/x-ms-asf",
		"asm": "text/x-asm",
		"aso": "application/vnd.accpac.simply.aso",
		"asx": "video/x-ms-asf",
		"atc": "application/vnd.acucorp",
		"atom": "application/atom+xml",
		"atomcat": "application/atomcat+xml",
		"atomsvc": "application/atomsvc+xml",
		"atx": "application/vnd.antix.game-component",
		"au": "audio/basic",
		"avi": "video/x-msvideo",
		"aw": "application/applixware",
		"azf": "application/vnd.airzip.filesecure.azf",
		"azs": "application/vnd.airzip.filesecure.azs",
		"azw": "application/vnd.amazon.ebook",
		"bat": "application/x-msdownload",
		"bcpio": "application/x-bcpio",
		"bdf": "application/x-font-bdf",
		"bdm": "application/vnd.syncml.dm+wbxml",
		"bed": "application/vnd.realvnc.bed",
		"bh2": "application/vnd.fujitsu.oasysprs",
		"bin": "application/octet-stream",
		"blb": "application/x-blorb",
		"blorb": "application/x-blorb",
		"bmi": "application/vnd.bmi",
		"bmp": "image/bmp",
		"book": "application/vnd.framemaker",
		"box": "application/vnd.previewsystems.box",
		"boz": "application/x-bzip2",
		"bpk": "application/octet-stream",
		"btif": "image/prs.btif",
		"bz": "application/x-bzip",
		"bz2": "application/x-bzip2",
		"c": "text/x-c",
		"c11amc": "application/vnd.cluetrust.cartomobile-config",
		"c11amz": "application/vnd.cluetrust.cartomobile-config-pkg",
		"c4d": "application/vnd.clonk.c4group",
		"c4f": "application/vnd.clonk.c4group",
		"c4g": "application/vnd.clonk.c4group",
		"c4p": "application/vnd.clonk.c4group",
		"c4u": "application/vnd.clonk.c4group",
		"cab": "application/vnd.ms-cab-compressed",
		"caf": "audio/x-caf",
		"cap": "application/vnd.tcpdump.pcap",
		"car": "application/vnd.curl.car",
		"cat": "application/vnd.ms-pki.seccat",
		"cb7": "application/x-cbr",
		"cba": "application/x-cbr",
		"cbr": "application/x-cbr",
		"cbt": "application/x-cbr",
		"cbz": "application/x-cbr",
		"cc": "text/x-c",
		"cct": "application/x-director",
		"ccxml": "application/ccxml+xml",
		"cdbcmsg": "application/vnd.contact.cmsg",
		"cdf": "application/x-netcdf",
		"cdkey": "application/vnd.mediastation.cdkey",
		"cdmia": "application/cdmi-capability",
		"cdmic": "application/cdmi-container",
		"cdmid": "application/cdmi-domain",
		"cdmio": "application/cdmi-object",
		"cdmiq": "application/cdmi-queue",
		"cdx": "chemical/x-cdx",
		"cdxml": "application/vnd.chemdraw+xml",
		"cdy": "application/vnd.cinderella",
		"cer": "application/pkix-cert",
		"cfs": "application/x-cfs-compressed",
		"cgm": "image/cgm",
		"chat": "application/x-chat",
		"chm": "application/vnd.ms-htmlhelp",
		"chrt": "application/vnd.kde.kchart",
		"cif": "chemical/x-cif",
		"cii": "application/vnd.anser-web-certificate-issue-initiation",
		"cil": "application/vnd.ms-artgalry",
		"cla": "application/vnd.claymore",
		"class": "application/java-vm",
		"clkk": "application/vnd.crick.clicker.keyboard",
		"clkp": "application/vnd.crick.clicker.palette",
		"clkt": "application/vnd.crick.clicker.template",
		"clkw": "application/vnd.crick.clicker.wordbank",
		"clkx": "application/vnd.crick.clicker",
		"clp": "application/x-msclip",
		"cmc": "application/vnd.cosmocaller",
		"cmdf": "chemical/x-cmdf",
		"cml": "chemical/x-cml",
		"cmp": "application/vnd.yellowriver-custom-menu",
		"cmx": "image/x-cmx",
		"cod": "application/vnd.rim.cod",
		"com": "application/x-msdownload",
		"conf": "text/plain",
		"cpio": "application/x-cpio",
		"cpp": "text/x-c",
		"cpt": "application/mac-compactpro",
		"crd": "application/x-mscardfile",
		"crl": "application/pkix-crl",
		"crt": "application/x-x509-ca-cert",
		"cryptonote": "application/vnd.rig.cryptonote",
		"csh": "application/x-csh",
		"csml": "chemical/x-csml",
		"csp": "application/vnd.commonspace",
		"css": "text/css",
		"cst": "application/x-director",
		"csv": "text/csv",
		"cu": "application/cu-seeme",
		"curl": "text/vnd.curl",
		"cww": "application/prs.cww",
		"cxt": "application/x-director",
		"cxx": "text/x-c",
		"dae": "model/vnd.collada+xml",
		"daf": "application/vnd.mobius.daf",
		"dart": "application/vnd.dart",
		"dataless": "application/vnd.fdsn.seed",
		"davmount": "application/davmount+xml",
		"dbk": "application/docbook+xml",
		"dcr": "application/x-director",
		"dcurl": "text/vnd.curl.dcurl",
		"dd2": "application/vnd.oma.dd2+xml",
		"ddd": "application/vnd.fujixerox.ddd",
		"deb": "application/x-debian-package",
		"def": "text/plain",
		"deploy": "application/octet-stream",
		"der": "application/x-x509-ca-cert",
		"dfac": "application/vnd.dreamfactory",
		"dgc": "application/x-dgc-compressed",
		"dic": "text/x-c",
		"dir": "application/x-director",
		"dis": "application/vnd.mobius.dis",
		"dist": "application/octet-stream",
		"distz": "application/octet-stream",
		"djv": "image/vnd.djvu",
		"djvu": "image/vnd.djvu",
		"dll": "application/x-msdownload",
		"dmg": "application/x-apple-diskimage",
		"dmp": "application/vnd.tcpdump.pcap",
		"dms": "application/octet-stream",
		"dna": "application/vnd.dna",
		"doc": "application/msword",
		"docm": "application/vnd.ms-word.document.macroenabled.12",
		"docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"dot": "application/msword",
		"dotm": "application/vnd.ms-word.template.macroenabled.12",
		"dotx": "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
		"dp": "application/vnd.osgi.dp",
		"dpg": "application/vnd.dpgraph",
		"dra": "audio/vnd.dra",
		"dsc": "text/prs.lines.tag",
		"dssc": "application/dssc+der",
		"dtb": "application/x-dtbook+xml",
		"dtd": "application/xml-dtd",
		"dts": "audio/vnd.dts",
		"dtshd": "audio/vnd.dts.hd",
		"dump": "application/octet-stream",
		"dvb": "video/vnd.dvb.file",
		"dvi": "application/x-dvi",
		"dwf": "model/vnd.dwf",
		"dwg": "image/vnd.dwg",
		"dxf": "image/vnd.dxf",
		"dxp": "application/vnd.spotfire.dxp",
		"dxr": "application/x-director",
		"ecelp4800": "audio/vnd.nuera.ecelp4800",
		"ecelp7470": "audio/vnd.nuera.ecelp7470",
		"ecelp9600": "audio/vnd.nuera.ecelp9600",
		"ecma": "application/ecmascript",
		"edm": "application/vnd.novadigm.edm",
		"edx": "application/vnd.novadigm.edx",
		"efif": "application/vnd.picsel",
		"ei6": "application/vnd.pg.osasli",
		"elc": "application/octet-stream",
		"emf": "application/x-msmetafile",
		"eml": "message/rfc822",
		"emma": "application/emma+xml",
		"emz": "application/x-msmetafile",
		"eol": "audio/vnd.digital-winds",
		"eot": "application/vnd.ms-fontobject",
		"eps": "application/postscript",
		"epub": "application/epub+zip",
		"es3": "application/vnd.eszigno3+xml",
		"esa": "application/vnd.osgi.subsystem",
		"esf": "application/vnd.epson.esf",
		"et3": "application/vnd.eszigno3+xml",
		"etx": "text/x-setext",
		"eva": "application/x-eva",
		"evy": "application/x-envoy",
		"exe": "application/x-msdownload",
		"exi": "application/exi",
		"ext": "application/vnd.novadigm.ext",
		"ez": "application/andrew-inset",
		"ez2": "application/vnd.ezpix-album",
		"ez3": "application/vnd.ezpix-package",
		"f": "text/x-fortran",
		"f4v": "video/x-f4v",
		"f77": "text/x-fortran",
		"f90": "text/x-fortran",
		"fbs": "image/vnd.fastbidsheet",
		"fcdt": "application/vnd.adobe.formscentral.fcdt",
		"fcs": "application/vnd.isac.fcs",
		"fdf": "application/vnd.fdf",
		"fe_launch": "application/vnd.denovo.fcselayout-link",
		"fg5": "application/vnd.fujitsu.oasysgp",
		"fgd": "application/x-director",
		"fh": "image/x-freehand",
		"fh4": "image/x-freehand",
		"fh5": "image/x-freehand",
		"fh7": "image/x-freehand",
		"fhc": "image/x-freehand",
		"fig": "application/x-xfig",
		"flac": "audio/x-flac",
		"fli": "video/x-fli",
		"flo": "application/vnd.micrografx.flo",
		"flv": "video/x-flv",
		"flw": "application/vnd.kde.kivio",
		"flx": "text/vnd.fmi.flexstor",
		"fly": "text/vnd.fly",
		"fm": "application/vnd.framemaker",
		"fnc": "application/vnd.frogans.fnc",
		"for": "text/x-fortran",
		"fpx": "image/vnd.fpx",
		"frame": "application/vnd.framemaker",
		"fsc": "application/vnd.fsc.weblaunch",
		"fst": "image/vnd.fst",
		"ftc": "application/vnd.fluxtime.clip",
		"fti": "application/vnd.anser-web-funds-transfer-initiation",
		"fvt": "video/vnd.fvt",
		"fxp": "application/vnd.adobe.fxp",
		"fxpl": "application/vnd.adobe.fxp",
		"fzs": "application/vnd.fuzzysheet",
		"g2w": "application/vnd.geoplan",
		"g3": "image/g3fax",
		"g3w": "application/vnd.geospace",
		"gac": "application/vnd.groove-account",
		"gam": "application/x-tads",
		"gbr": "application/rpki-ghostbusters",
		"gca": "application/x-gca-compressed",
		"gdl": "model/vnd.gdl",
		"geo": "application/vnd.dynageo",
		"gex": "application/vnd.geometry-explorer",
		"ggb": "application/vnd.geogebra.file",
		"ggt": "application/vnd.geogebra.tool",
		"ghf": "application/vnd.groove-help",
		"gif": "image/gif",
		"gim": "application/vnd.groove-identity-message",
		"gml": "application/gml+xml",
		"gmx": "application/vnd.gmx",
		"gnumeric": "application/x-gnumeric",
		"gph": "application/vnd.flographit",
		"gpx": "application/gpx+xml",
		"gqf": "application/vnd.grafeq",
		"gqs": "application/vnd.grafeq",
		"gram": "application/srgs",
		"gramps": "application/x-gramps-xml",
		"gre": "application/vnd.geometry-explorer",
		"grv": "application/vnd.groove-injector",
		"grxml": "application/srgs+xml",
		"gsf": "application/x-font-ghostscript",
		"gtar": "application/x-gtar",
		"gtm": "application/vnd.groove-tool-message",
		"gtw": "model/vnd.gtw",
		"gv": "text/vnd.graphviz",
		"gxf": "application/gxf",
		"gxt": "application/vnd.geonext",
		"h": "text/x-c",
		"h261": "video/h261",
		"h263": "video/h263",
		"h264": "video/h264",
		"hal": "application/vnd.hal+xml",
		"hbci": "application/vnd.hbci",
		"hdf": "application/x-hdf",
		"hh": "text/x-c",
		"hlp": "application/winhlp",
		"hpgl": "application/vnd.hp-hpgl",
		"hpid": "application/vnd.hp-hpid",
		"hps": "application/vnd.hp-hps",
		"hqx": "application/mac-binhex40",
		"htke": "application/vnd.kenameaapp",
		"htm": "text/html",
		"html": "text/html",
		"hvd": "application/vnd.yamaha.hv-dic",
		"hvp": "application/vnd.yamaha.hv-voice",
		"hvs": "application/vnd.yamaha.hv-script",
		"i2g": "application/vnd.intergeo",
		"icc": "application/vnd.iccprofile",
		"ice": "x-conference/x-cooltalk",
		"icm": "application/vnd.iccprofile",
		"ico": "image/x-icon",
		"ics": "text/calendar",
		"ief": "image/ief",
		"ifb": "text/calendar",
		"ifm": "application/vnd.shana.informed.formdata",
		"iges": "model/iges",
		"igl": "application/vnd.igloader",
		"igm": "application/vnd.insors.igm",
		"igs": "model/iges",
		"igx": "application/vnd.micrografx.igx",
		"iif": "application/vnd.shana.informed.interchange",
		"imp": "application/vnd.accpac.simply.imp",
		"ims": "application/vnd.ms-ims",
		"in": "text/plain",
		"ink": "application/inkml+xml",
		"inkml": "application/inkml+xml",
		"install": "application/x-install-instructions",
		"iota": "application/vnd.astraea-software.iota",
		"ipfix": "application/ipfix",
		"ipk": "application/vnd.shana.informed.package",
		"irm": "application/vnd.ibm.rights-management",
		"irp": "application/vnd.irepository.package+xml",
		"iso": "application/x-iso9660-image",
		"itp": "application/vnd.shana.informed.formtemplate",
		"ivp": "application/vnd.immervision-ivp",
		"ivu": "application/vnd.immervision-ivu",
		"jad": "text/vnd.sun.j2me.app-descriptor",
		"jam": "application/vnd.jam",
		"jar": "application/java-archive",
		"java": "text/x-java-source",
		"jisp": "application/vnd.jisp",
		"jlt": "application/vnd.hp-jlyt",
		"jnlp": "application/x-java-jnlp-file",
		"joda": "application/vnd.joost.joda-archive",
		"jpe": "image/jpeg",
		"jpeg": "image/jpeg",
		"jpg": "image/jpeg",
		"jpgm": "video/jpm",
		"jpgv": "video/jpeg",
		"jpm": "video/jpm",
		"js": "application/javascript",
		"json": "application/json",
		"jsonml": "application/jsonml+json",
		"kar": "audio/midi",
		"karbon": "application/vnd.kde.karbon",
		"kfo": "application/vnd.kde.kformula",
		"kia": "application/vnd.kidspiration",
		"kml": "application/vnd.google-earth.kml+xml",
		"kmz": "application/vnd.google-earth.kmz",
		"kne": "application/vnd.kinar",
		"knp": "application/vnd.kinar",
		"kon": "application/vnd.kde.kontour",
		"kpr": "application/vnd.kde.kpresenter",
		"kpt": "application/vnd.kde.kpresenter",
		"kpxx": "application/vnd.ds-keypoint",
		"ksp": "application/vnd.kde.kspread",
		"ktr": "application/vnd.kahootz",
		"ktx": "image/ktx",
		"ktz": "application/vnd.kahootz",
		"kwd": "application/vnd.kde.kword",
		"kwt": "application/vnd.kde.kword",
		"lasxml": "application/vnd.las.las+xml",
		"latex": "application/x-latex",
		"lbd": "application/vnd.llamagraphics.life-balance.desktop",
		"lbe": "application/vnd.llamagraphics.life-balance.exchange+xml",
		"les": "application/vnd.hhe.lesson-player",
		"lha": "application/x-lzh-compressed",
		"link66": "application/vnd.route66.link66+xml",
		"list": "text/plain",
		"list3820": "application/vnd.ibm.modcap",
		"listafp": "application/vnd.ibm.modcap",
		"lnk": "application/x-ms-shortcut",
		"log": "text/plain",
		"lostxml": "application/lost+xml",
		"lrf": "application/octet-stream",
		"lrm": "application/vnd.ms-lrm",
		"ltf": "application/vnd.frogans.ltf",
		"lvp": "audio/vnd.lucent.voice",
		"lwp": "application/vnd.lotus-wordpro",
		"lzh": "application/x-lzh-compressed",
		"m13": "application/x-msmediaview",
		"m14": "application/x-msmediaview",
		"m1v": "video/mpeg",
		"m21": "application/mp21",
		"m2a": "audio/mpeg",
		"m2v": "video/mpeg",
		"m3a": "audio/mpeg",
		"m3u": "audio/x-mpegurl",
		"m3u8": "application/vnd.apple.mpegurl",
		"m4u": "video/vnd.mpegurl",
		"m4v": "video/x-m4v",
		"ma": "application/mathematica",
		"mads": "application/mads+xml",
		"mag": "application/vnd.ecowin.chart",
		"maker": "application/vnd.framemaker",
		"man": "text/troff",
		"mar": "application/octet-stream",
		"mathml": "application/mathml+xml",
		"mb": "application/mathematica",
		"mbk": "application/vnd.mobius.mbk",
		"mbox": "application/mbox",
		"mc1": "application/vnd.medcalcdata",
		"mcd": "application/vnd.mcd",
		"mcurl": "text/vnd.curl.mcurl",
		"mdb": "application/x-msaccess",
		"mdi": "image/vnd.ms-modi",
		"me": "text/troff",
		"mesh": "model/mesh",
		"meta4": "application/metalink4+xml",
		"metalink": "application/metalink+xml",
		"mets": "application/mets+xml",
		"mfm": "application/vnd.mfmp",
		"mft": "application/rpki-manifest",
		"mgp": "application/vnd.osgeo.mapguide.package",
		"mgz": "application/vnd.proteus.magazine",
		"mid": "audio/midi",
		"midi": "audio/midi",
		"mie": "application/x-mie",
		"mif": "application/vnd.mif",
		"mime": "message/rfc822",
		"mj2": "video/mj2",
		"mjp2": "video/mj2",
		"mk3d": "video/x-matroska",
		"mka": "audio/x-matroska",
		"mks": "video/x-matroska",
		"mkv": "video/x-matroska",
		"mlp": "application/vnd.dolby.mlp",
		"mmd": "application/vnd.chipnuts.karaoke-mmd",
		"mmf": "application/vnd.smaf",
		"mmr": "image/vnd.fujixerox.edmics-mmr",
		"mng": "video/x-mng",
		"mny": "application/x-msmoney",
		"mobi": "application/x-mobipocket-ebook",
		"mods": "application/mods+xml",
		"mov": "video/quicktime",
		"movie": "video/x-sgi-movie",
		"mp2": "audio/mpeg",
		"mp21": "application/mp21",
		"mp2a": "audio/mpeg",
		"mp3": "audio/mpeg",
		"mp4": "video/mp4",
		"mp4a": "audio/mp4",
		"mp4s": "application/mp4",
		"mp4v": "video/mp4",
		"mpc": "application/vnd.mophun.certificate",
		"mpe": "video/mpeg",
		"mpeg": "video/mpeg",
		"mpg": "video/mpeg",
		"mpg4": "video/mp4",
		"mpga": "audio/mpeg",
		"mpkg": "application/vnd.apple.installer+xml",
		"mpm": "application/vnd.blueice.multipass",
		"mpn": "application/vnd.mophun.application",
		"mpp": "application/vnd.ms-project",
		"mpt": "application/vnd.ms-project",
		"mpy": "application/vnd.ibm.minipay",
		"mqy": "application/vnd.mobius.mqy",
		"mrc": "application/marc",
		"mrcx": "application/marcxml+xml",
		"ms": "text/troff",
		"mscml": "application/mediaservercontrol+xml",
		"mseed": "application/vnd.fdsn.mseed",
		"mseq": "application/vnd.mseq",
		"msf": "application/vnd.epson.msf",
		"msh": "model/mesh",
		"msi": "application/x-msdownload",
		"msl": "application/vnd.mobius.msl",
		"msty": "application/vnd.muvee.style",
		"mts": "model/vnd.mts",
		"mus": "application/vnd.musician",
		"musicxml": "application/vnd.recordare.musicxml+xml",
		"mvb": "application/x-msmediaview",
		"mwf": "application/vnd.mfer",
		"mxf": "application/mxf",
		"mxl": "application/vnd.recordare.musicxml",
		"mxml": "application/xv+xml",
		"mxs": "application/vnd.triscape.mxs",
		"mxu": "video/vnd.mpegurl",
		"n-gage": "application/vnd.nokia.n-gage.symbian.install",
		"n3": "text/n3",
		"nb": "application/mathematica",
		"nbp": "application/vnd.wolfram.player",
		"nc": "application/x-netcdf",
		"ncx": "application/x-dtbncx+xml",
		"nfo": "text/x-nfo",
		"ngdat": "application/vnd.nokia.n-gage.data",
		"nitf": "application/vnd.nitf",
		"nlu": "application/vnd.neurolanguage.nlu",
		"nml": "application/vnd.enliven",
		"nnd": "application/vnd.noblenet-directory",
		"nns": "application/vnd.noblenet-sealer",
		"nnw": "application/vnd.noblenet-web",
		"npx": "image/vnd.net-fpx",
		"nsc": "application/x-conference",
		"nsf": "application/vnd.lotus-notes",
		"ntf": "application/vnd.nitf",
		"nzb": "application/x-nzb",
		"oa2": "application/vnd.fujitsu.oasys2",
		"oa3": "application/vnd.fujitsu.oasys3",
		"oas": "application/vnd.fujitsu.oasys",
		"obd": "application/x-msbinder",
		"obj": "application/x-tgif",
		"oda": "application/oda",
		"odb": "application/vnd.oasis.opendocument.database",
		"odc": "application/vnd.oasis.opendocument.chart",
		"odf": "application/vnd.oasis.opendocument.formula",
		"odft": "application/vnd.oasis.opendocument.formula-template",
		"odg": "application/vnd.oasis.opendocument.graphics",
		"odi": "application/vnd.oasis.opendocument.image",
		"odm": "application/vnd.oasis.opendocument.text-master",
		"odp": "application/vnd.oasis.opendocument.presentation",
		"ods": "application/vnd.oasis.opendocument.spreadsheet",
		"odt": "application/vnd.oasis.opendocument.text",
		"oga": "audio/ogg",
		"ogg": "audio/ogg",
		"ogv": "video/ogg",
		"ogx": "application/ogg",
		"omdoc": "application/omdoc+xml",
		"onepkg": "application/onenote",
		"onetmp": "application/onenote",
		"onetoc": "application/onenote",
		"onetoc2": "application/onenote",
		"opf": "application/oebps-package+xml",
		"opml": "text/x-opml",
		"oprc": "application/vnd.palm",
		"org": "application/vnd.lotus-organizer",
		"osf": "application/vnd.yamaha.openscoreformat",
		"osfpvg": "application/vnd.yamaha.openscoreformat.osfpvg+xml",
		"otc": "application/vnd.oasis.opendocument.chart-template",
		"otf": "application/x-font-otf",
		"otg": "application/vnd.oasis.opendocument.graphics-template",
		"oth": "application/vnd.oasis.opendocument.text-web",
		"oti": "application/vnd.oasis.opendocument.image-template",
		"otp": "application/vnd.oasis.opendocument.presentation-template",
		"ots": "application/vnd.oasis.opendocument.spreadsheet-template",
		"ott": "application/vnd.oasis.opendocument.text-template",
		"oxps": "application/oxps",
		"oxt": "application/vnd.openofficeorg.extension",
		"p": "text/x-pascal",
		"p10": "application/pkcs10",
		"p12": "application/x-pkcs12",
		"p7b": "application/x-pkcs7-certificates",
		"p7c": "application/pkcs7-mime",
		"p7m": "application/pkcs7-mime",
		"p7r": "application/x-pkcs7-certreqresp",
		"p7s": "application/pkcs7-signature",
		"p8": "application/pkcs8",
		"pas": "text/x-pascal",
		"paw": "application/vnd.pawaafile",
		"pbd": "application/vnd.powerbuilder6",
		"pbm": "image/x-portable-bitmap",
		"pcap": "application/vnd.tcpdump.pcap",
		"pcf": "application/x-font-pcf",
		"pcl": "application/vnd.hp-pcl",
		"pclxl": "application/vnd.hp-pclxl",
		"pct": "image/x-pict",
		"pcurl": "application/vnd.curl.pcurl",
		"pcx": "image/x-pcx",
		"pdb": "application/vnd.palm",
		"pdf": "application/pdf",
		"pfa": "application/x-font-type1",
		"pfb": "application/x-font-type1",
		"pfm": "application/x-font-type1",
		"pfr": "application/font-tdpfr",
		"pfx": "application/x-pkcs12",
		"pgm": "image/x-portable-graymap",
		"pgn": "application/x-chess-pgn",
		"pgp": "application/pgp-encrypted",
		"pic": "image/x-pict",
		"pkg": "application/octet-stream",
		"pki": "application/pkixcmp",
		"pkipath": "application/pkix-pkipath",
		"plb": "application/vnd.3gpp.pic-bw-large",
		"plc": "application/vnd.mobius.plc",
		"plf": "application/vnd.pocketlearn",
		"pls": "application/pls+xml",
		"pml": "application/vnd.ctc-posml",
		"png": "image/png",
		"pnm": "image/x-portable-anymap",
		"portpkg": "application/vnd.macports.portpkg",
		"pot": "application/vnd.ms-powerpoint",
		"potm": "application/vnd.ms-powerpoint.template.macroenabled.12",
		"potx": "application/vnd.openxmlformats-officedocument.presentationml.template",
		"ppam": "application/vnd.ms-powerpoint.addin.macroenabled.12",
		"ppd": "application/vnd.cups-ppd",
		"ppm": "image/x-portable-pixmap",
		"pps": "application/vnd.ms-powerpoint",
		"ppsm": "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
		"ppsx": "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
		"ppt": "application/vnd.ms-powerpoint",
		"pptm": "application/vnd.ms-powerpoint.presentation.macroenabled.12",
		"pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
		"pqa": "application/vnd.palm",
		"prc": "application/x-mobipocket-ebook",
		"pre": "application/vnd.lotus-freelance",
		"prf": "application/pics-rules",
		"ps": "application/postscript",
		"psb": "application/vnd.3gpp.pic-bw-small",
		"psd": "image/vnd.adobe.photoshop",
		"psf": "application/x-font-linux-psf",
		"pskcxml": "application/pskc+xml",
		"ptid": "application/vnd.pvi.ptid1",
		"pub": "application/x-mspublisher",
		"pvb": "application/vnd.3gpp.pic-bw-var",
		"pwn": "application/vnd.3m.post-it-notes",
		"pya": "audio/vnd.ms-playready.media.pya",
		"pyv": "video/vnd.ms-playready.media.pyv",
		"qam": "application/vnd.epson.quickanime",
		"qbo": "application/vnd.intu.qbo",
		"qfx": "application/vnd.intu.qfx",
		"qps": "application/vnd.publishare-delta-tree",
		"qt": "video/quicktime",
		"qwd": "application/vnd.quark.quarkxpress",
		"qwt": "application/vnd.quark.quarkxpress",
		"qxb": "application/vnd.quark.quarkxpress",
		"qxd": "application/vnd.quark.quarkxpress",
		"qxl": "application/vnd.quark.quarkxpress",
		"qxt": "application/vnd.quark.quarkxpress",
		"ra": "audio/x-pn-realaudio",
		"ram": "audio/x-pn-realaudio",
		"rar": "application/x-rar-compressed",
		"ras": "image/x-cmu-raster",
		"rcprofile": "application/vnd.ipunplugged.rcprofile",
		"rdf": "application/rdf+xml",
		"rdz": "application/vnd.data-vision.rdz",
		"rep": "application/vnd.businessobjects",
		"res": "application/x-dtbresource+xml",
		"rgb": "image/x-rgb",
		"rif": "application/reginfo+xml",
		"rip": "audio/vnd.rip",
		"ris": "application/x-research-info-systems",
		"rl": "application/resource-lists+xml",
		"rlc": "image/vnd.fujixerox.edmics-rlc",
		"rld": "application/resource-lists-diff+xml",
		"rm": "application/vnd.rn-realmedia",
		"rmi": "audio/midi",
		"rmp": "audio/x-pn-realaudio-plugin",
		"rms": "application/vnd.jcp.javame.midlet-rms",
		"rmvb": "application/vnd.rn-realmedia-vbr",
		"rnc": "application/relax-ng-compact-syntax",
		"roa": "application/rpki-roa",
		"roff": "text/troff",
		"rp9": "application/vnd.cloanto.rp9",
		"rpss": "application/vnd.nokia.radio-presets",
		"rpst": "application/vnd.nokia.radio-preset",
		"rq": "application/sparql-query",
		"rs": "application/rls-services+xml",
		"rsd": "application/rsd+xml",
		"rss": "application/rss+xml",
		"rtf": "application/rtf",
		"rtx": "text/richtext",
		"s": "text/x-asm",
		"s3m": "audio/s3m",
		"saf": "application/vnd.yamaha.smaf-audio",
		"sbml": "application/sbml+xml",
		"sc": "application/vnd.ibm.secure-container",
		"scd": "application/x-msschedule",
		"scm": "application/vnd.lotus-screencam",
		"scq": "application/scvp-cv-request",
		"scs": "application/scvp-cv-response",
		"scurl": "text/vnd.curl.scurl",
		"sda": "application/vnd.stardivision.draw",
		"sdc": "application/vnd.stardivision.calc",
		"sdd": "application/vnd.stardivision.impress",
		"sdkd": "application/vnd.solent.sdkm+xml",
		"sdkm": "application/vnd.solent.sdkm+xml",
		"sdp": "application/sdp",
		"sdw": "application/vnd.stardivision.writer",
		"see": "application/vnd.seemail",
		"seed": "application/vnd.fdsn.seed",
		"sema": "application/vnd.sema",
		"semd": "application/vnd.semd",
		"semf": "application/vnd.semf",
		"ser": "application/java-serialized-object",
		"setpay": "application/set-payment-initiation",
		"setreg": "application/set-registration-initiation",
		"sfd-hdstx": "application/vnd.hydrostatix.sof-data",
		"sfs": "application/vnd.spotfire.sfs",
		"sfv": "text/x-sfv",
		"sgi": "image/sgi",
		"sgl": "application/vnd.stardivision.writer-global",
		"sgm": "text/sgml",
		"sgml": "text/sgml",
		"sh": "application/x-sh",
		"shar": "application/x-shar",
		"shf": "application/shf+xml",
		"sid": "image/x-mrsid-image",
		"sig": "application/pgp-signature",
		"sil": "audio/silk",
		"silo": "model/mesh",
		"sis": "application/vnd.symbian.install",
		"sisx": "application/vnd.symbian.install",
		"sit": "application/x-stuffit",
		"sitx": "application/x-stuffitx",
		"skd": "application/vnd.koan",
		"skm": "application/vnd.koan",
		"skp": "application/vnd.koan",
		"skt": "application/vnd.koan",
		"sldm": "application/vnd.ms-powerpoint.slide.macroenabled.12",
		"sldx": "application/vnd.openxmlformats-officedocument.presentationml.slide",
		"slt": "application/vnd.epson.salt",
		"sm": "application/vnd.stepmania.stepchart",
		"smf": "application/vnd.stardivision.math",
		"smi": "application/smil+xml",
		"smil": "application/smil+xml",
		"smv": "video/x-smv",
		"smzip": "application/vnd.stepmania.package",
		"snd": "audio/basic",
		"snf": "application/x-font-snf",
		"so": "application/octet-stream",
		"spc": "application/x-pkcs7-certificates",
		"spf": "application/vnd.yamaha.smaf-phrase",
		"spl": "application/x-futuresplash",
		"spot": "text/vnd.in3d.spot",
		"spp": "application/scvp-vp-response",
		"spq": "application/scvp-vp-request",
		"spx": "audio/ogg",
		"sql": "application/x-sql",
		"src": "application/x-wais-source",
		"srt": "application/x-subrip",
		"sru": "application/sru+xml",
		"srx": "application/sparql-results+xml",
		"ssdl": "application/ssdl+xml",
		"sse": "application/vnd.kodak-descriptor",
		"ssf": "application/vnd.epson.ssf",
		"ssml": "application/ssml+xml",
		"st": "application/vnd.sailingtracker.track",
		"stc": "application/vnd.sun.xml.calc.template",
		"std": "application/vnd.sun.xml.draw.template",
		"stf": "application/vnd.wt.stf",
		"sti": "application/vnd.sun.xml.impress.template",
		"stk": "application/hyperstudio",
		"stl": "application/vnd.ms-pki.stl",
		"str": "application/vnd.pg.format",
		"stw": "application/vnd.sun.xml.writer.template",
		"sub": "text/vnd.dvb.subtitle",
		"sus": "application/vnd.sus-calendar",
		"susp": "application/vnd.sus-calendar",
		"sv4cpio": "application/x-sv4cpio",
		"sv4crc": "application/x-sv4crc",
		"svc": "application/vnd.dvb.service",
		"svd": "application/vnd.svd",
		"svg": "image/svg+xml",
		"svgz": "image/svg+xml",
		"swa": "application/x-director",
		"swf": "application/x-shockwave-flash",
		"swi": "application/vnd.aristanetworks.swi",
		"sxc": "application/vnd.sun.xml.calc",
		"sxd": "application/vnd.sun.xml.draw",
		"sxg": "application/vnd.sun.xml.writer.global",
		"sxi": "application/vnd.sun.xml.impress",
		"sxm": "application/vnd.sun.xml.math",
		"sxw": "application/vnd.sun.xml.writer",
		"t": "text/troff",
		"t3": "application/x-t3vm-image",
		"taglet": "application/vnd.mynfc",
		"tao": "application/vnd.tao.intent-module-archive",
		"tar": "application/x-tar",
		"tcap": "application/vnd.3gpp2.tcap",
		"tcl": "application/x-tcl",
		"teacher": "application/vnd.smart.teacher",
		"tei": "application/tei+xml",
		"teicorpus": "application/tei+xml",
		"tex": "application/x-tex",
		"texi": "application/x-texinfo",
		"texinfo": "application/x-texinfo",
		"text": "text/plain",
		"tfi": "application/thraud+xml",
		"tfm": "application/x-tex-tfm",
		"tga": "image/x-tga",
		"thmx": "application/vnd.ms-officetheme",
		"tif": "image/tiff",
		"tiff": "image/tiff",
		"tmo": "application/vnd.tmobile-livetv",
		"torrent": "application/x-bittorrent",
		"tpl": "application/vnd.groove-tool-template",
		"tpt": "application/vnd.trid.tpt",
		"tr": "text/troff",
		"tra": "application/vnd.trueapp",
		"trm": "application/x-msterminal",
		"tsd": "application/timestamped-data",
		"tsv": "text/tab-separated-values",
		"ttc": "application/x-font-ttf",
		"ttf": "application/x-font-ttf",
		"ttl": "text/turtle",
		"twd": "application/vnd.simtech-mindmapper",
		"twds": "application/vnd.simtech-mindmapper",
		"txd": "application/vnd.genomatix.tuxedo",
		"txf": "application/vnd.mobius.txf",
		"txt": "text/plain",
		"u32": "application/x-authorware-bin",
		"udeb": "application/x-debian-package",
		"ufd": "application/vnd.ufdl",
		"ufdl": "application/vnd.ufdl",
		"ulx": "application/x-glulx",
		"umj": "application/vnd.umajin",
		"unityweb": "application/vnd.unity",
		"uoml": "application/vnd.uoml+xml",
		"uri": "text/uri-list",
		"uris": "text/uri-list",
		"urls": "text/uri-list",
		"ustar": "application/x-ustar",
		"utz": "application/vnd.uiq.theme",
		"uu": "text/x-uuencode",
		"uva": "audio/vnd.dece.audio",
		"uvd": "application/vnd.dece.data",
		"uvf": "application/vnd.dece.data",
		"uvg": "image/vnd.dece.graphic",
		"uvh": "video/vnd.dece.hd",
		"uvi": "image/vnd.dece.graphic",
		"uvm": "video/vnd.dece.mobile",
		"uvp": "video/vnd.dece.pd",
		"uvs": "video/vnd.dece.sd",
		"uvt": "application/vnd.dece.ttml+xml",
		"uvu": "video/vnd.uvvu.mp4",
		"uvv": "video/vnd.dece.video",
		"uvva": "audio/vnd.dece.audio",
		"uvvd": "application/vnd.dece.data",
		"uvvf": "application/vnd.dece.data",
		"uvvg": "image/vnd.dece.graphic",
		"uvvh": "video/vnd.dece.hd",
		"uvvi": "image/vnd.dece.graphic",
		"uvvm": "video/vnd.dece.mobile",
		"uvvp": "video/vnd.dece.pd",
		"uvvs": "video/vnd.dece.sd",
		"uvvt": "application/vnd.dece.ttml+xml",
		"uvvu": "video/vnd.uvvu.mp4",
		"uvvv": "video/vnd.dece.video",
		"uvvx": "application/vnd.dece.unspecified",
		"uvvz": "application/vnd.dece.zip",
		"uvx": "application/vnd.dece.unspecified",
		"uvz": "application/vnd.dece.zip",
		"vcard": "text/vcard",
		"vcd": "application/x-cdlink",
		"vcf": "text/x-vcard",
		"vcg": "application/vnd.groove-vcard",
		"vcs": "text/x-vcalendar",
		"vcx": "application/vnd.vcx",
		"vis": "application/vnd.visionary",
		"viv": "video/vnd.vivo",
		"vob": "video/x-ms-vob",
		"vor": "application/vnd.stardivision.writer",
		"vox": "application/x-authorware-bin",
		"vrml": "model/vrml",
		"vsd": "application/vnd.visio",
		"vsf": "application/vnd.vsf",
		"vss": "application/vnd.visio",
		"vst": "application/vnd.visio",
		"vsw": "application/vnd.visio",
		"vtu": "model/vnd.vtu",
		"vxml": "application/voicexml+xml",
		"w3d": "application/x-director",
		"wad": "application/x-doom",
		"wav": "audio/x-wav",
		"wax": "audio/x-ms-wax",
		"wbmp": "image/vnd.wap.wbmp",
		"wbs": "application/vnd.criticaltools.wbs+xml",
		"wbxml": "application/vnd.wap.wbxml",
		"wcm": "application/vnd.ms-works",
		"wdb": "application/vnd.ms-works",
		"wdp": "image/vnd.ms-photo",
		"weba": "audio/webm",
		"webm": "video/webm",
		"webp": "image/webp",
		"wg": "application/vnd.pmi.widget",
		"wgt": "application/widget",
		"wks": "application/vnd.ms-works",
		"wm": "video/x-ms-wm",
		"wma": "audio/x-ms-wma",
		"wmd": "application/x-ms-wmd",
		"wmf": "application/x-msmetafile",
		"wml": "text/vnd.wap.wml",
		"wmlc": "application/vnd.wap.wmlc",
		"wmls": "text/vnd.wap.wmlscript",
		"wmlsc": "application/vnd.wap.wmlscriptc",
		"wmv": "video/x-ms-wmv",
		"wmx": "video/x-ms-wmx",
		"wmz": "application/x-msmetafile",
		"woff": "application/x-font-woff",
		"wpd": "application/vnd.wordperfect",
		"wpl": "application/vnd.ms-wpl",
		"wps": "application/vnd.ms-works",
		"wqd": "application/vnd.wqd",
		"wri": "application/x-mswrite",
		"wrl": "model/vrml",
		"wsdl": "application/wsdl+xml",
		"wspolicy": "application/wspolicy+xml",
		"wtb": "application/vnd.webturbo",
		"wvx": "video/x-ms-wvx",
		"x32": "application/x-authorware-bin",
		"x3d": "model/x3d+xml",
		"x3db": "model/x3d+binary",
		"x3dbz": "model/x3d+binary",
		"x3dv": "model/x3d+vrml",
		"x3dvz": "model/x3d+vrml",
		"x3dz": "model/x3d+xml",
		"xaml": "application/xaml+xml",
		"xap": "application/x-silverlight-app",
		"xar": "application/vnd.xara",
		"xbap": "application/x-ms-xbap",
		"xbd": "application/vnd.fujixerox.docuworks.binder",
		"xbm": "image/x-xbitmap",
		"xdf": "application/xcap-diff+xml",
		"xdm": "application/vnd.syncml.dm+xml",
		"xdp": "application/vnd.adobe.xdp+xml",
		"xdssc": "application/dssc+xml",
		"xdw": "application/vnd.fujixerox.docuworks",
		"xenc": "application/xenc+xml",
		"xer": "application/patch-ops-error+xml",
		"xfdf": "application/vnd.adobe.xfdf",
		"xfdl": "application/vnd.xfdl",
		"xht": "application/xhtml+xml",
		"xhtml": "application/xhtml+xml",
		"xhvml": "application/xv+xml",
		"xif": "image/vnd.xiff",
		"xla": "application/vnd.ms-excel",
		"xlam": "application/vnd.ms-excel.addin.macroenabled.12",
		"xlc": "application/vnd.ms-excel",
		"xlf": "application/x-xliff+xml",
		"xlm": "application/vnd.ms-excel",
		"xls": "application/vnd.ms-excel",
		"xlsb": "application/vnd.ms-excel.sheet.binary.macroenabled.12",
		"xlsm": "application/vnd.ms-excel.sheet.macroenabled.12",
		"xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"xlt": "application/vnd.ms-excel",
		"xltm": "application/vnd.ms-excel.template.macroenabled.12",
		"xltx": "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
		"xlw": "application/vnd.ms-excel",
		"xm": "audio/xm",
		"xml": "application/xml",
		"xo": "application/vnd.olpc-sugar",
		"xop": "application/xop+xml",
		"xpi": "application/x-xpinstall",
		"xpl": "application/xproc+xml",
		"xpm": "image/x-xpixmap",
		"xpr": "application/vnd.is-xpr",
		"xps": "application/vnd.ms-xpsdocument",
		"xpw": "application/vnd.intercon.formnet",
		"xpx": "application/vnd.intercon.formnet",
		"xsl": "application/xml",
		"xslt": "application/xslt+xml",
		"xsm": "application/vnd.syncml+xml",
		"xspf": "application/xspf+xml",
		"xul": "application/vnd.mozilla.xul+xml",
		"xvm": "application/xv+xml",
		"xvml": "application/xv+xml",
		"xwd": "image/x-xwindowdump",
		"xyz": "chemical/x-xyz",
		"xz": "application/x-xz",
		"yang": "application/yang",
		"yin": "application/yin+xml",
		"z1": "application/x-zmachine",
		"z2": "application/x-zmachine",
		"z3": "application/x-zmachine",
		"z4": "application/x-zmachine",
		"z5": "application/x-zmachine",
		"z6": "application/x-zmachine",
		"z7": "application/x-zmachine",
		"z8": "application/x-zmachine",
		"zaz": "application/vnd.zzazz.deck+xml",
		"zip": "application/zip",
		"zir": "application/vnd.zul",
		"zirz": "application/vnd.zul",
		"zmm": "application/vnd.handheld-entertainment+xml"
	}
};
},{}],32:[function(require,module,exports){
/* global Promise */
"use strict";

var _require = require("chrome");

var Cc = _require.Cc;
var Ci = _require.Ci;
var Cu = _require.Cu;
// https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/chrome.html

var _Cu$import = Cu["import"]("resource://gre/modules/Services.jsm");

var Services = _Cu$import.Services;
// https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Services.jsm

var _Cu$import2 = Cu["import"]("resource://gre/modules/osfile.jsm");

var OS = _Cu$import2.OS;
// https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/OSFile.jsm

var UDPSocket = require("./UDPSocket");
var TCPSocket = require("./TCPSocket");
var SimpleTCP = require("../SimpleTCP");
var IPResolver = require("./IPResolver");
var MimeService = require("./MimeService");
var SocketSender = require("./SocketSender");
var FileUtilities = require("./FileUtilities");
var StorageService = require("./StorageService");
var SimpleTCPSocket = require("./SimpleTCPSocket");

var nativeStorage = require("sdk/simple-storage").storage;
var windowUtils = require("sdk/window/utils"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/window_utils
var fileSystem = {
	createLocalFile: function createLocalFile() {
		return Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
	}, // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsILocalFile
	filePicker: function filePicker() {
		return Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
	}, // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIFilePicker
	getTypeFromFile: Cc["@mozilla.org/uriloader/external-helper-app-service;1"].getService(Ci.nsIMIMEService).getTypeFromFile,
	read: OS.File.read
};

module.exports.firefox = {};
module.exports.firefox.tabs = function () {
	return require("sdk/tabs");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/tabs
module.exports.firefox.button = function () {
	return require("sdk/ui/button/action");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/ui_button_toggle
module.exports.firefox.getNativeWindowMenu = function () {
	return Services.wm.getMostRecentWindow("navigator:browser").NativeWindow.menu;
}; //for firefox for android

module.exports.createBase64Utils = function () {
	return require("sdk/base64");
}; //https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/base64
module.exports.createDomParser = function () {
	return Cc["@mozilla.org/xmlextras/domparser;1"].createInstance(Ci.nsIDOMParser);
}; // https://developer.mozilla.org/en-US/docs/nsIDOMParser https://dxr.mozilla.org/mozilla-central/source/dom/base/nsIDOMParser.idl
module.exports.createFileUtilities = function () {
	return new FileUtilities(fileSystem, windowUtils, new MimeService(Cc["@mozilla.org/uriloader/external-helper-app-service;1"].getService(Ci.nsIMIMEService)));
};
module.exports.createIPResolver = function () {
	return new IPResolver(Cc["@mozilla.org/network/dns-service;1"].getService(Ci.nsIDNSService), { create: function create() {
			return module.exports.createUDPSocket();
		} });
}; // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIDNSService
module.exports.createSimpleTCP = function () {
	return new SimpleTCP(new SimpleTCPSocket(module.exports.timers(), module.exports.createTCPSocketProvider(), new SocketSender()));
};
module.exports.createSocketSender = function () {
	return new SocketSender();
};
module.exports.createStorageService = function () {
	return new StorageService(nativeStorage);
};
module.exports.createTCPSocketProvider = function () {
	return { create: function create() {
			return new TCPSocket(Cc["@mozilla.org/tcp-socket;1"].createInstance(Ci.nsIDOMTCPSocket));
		} };
};
module.exports.createUDPSocket = function () {
	return new UDPSocket(Cc["@mozilla.org/network/udp-socket;1"].createInstance(Ci.nsIUDPSocket), Services.scriptSecurityManager.getSystemPrincipal());
};
module.exports.notifications = function () {
	return require("sdk/notifications");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications
module.exports.timers = function () {
	return require("sdk/timers");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers
module.exports.url = function () {
	return require("sdk/url");
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url
module.exports.XMLHttpRequest = function () {
	return require("sdk/net/xhr").XMLHttpRequest;
}; // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/net_xhr

module.exports.isFirefox = true;
module.exports.isChrome = false;
},{"../SimpleTCP":41,"./FileUtilities":33,"./IPResolver":34,"./MimeService":35,"./SimpleTCPSocket":36,"./SocketSender":37,"./StorageService":38,"./TCPSocket":39,"./UDPSocket":40,"chrome":undefined,"sdk/base64":undefined,"sdk/net/xhr":undefined,"sdk/notifications":undefined,"sdk/simple-storage":undefined,"sdk/tabs":undefined,"sdk/timers":undefined,"sdk/ui/button/action":undefined,"sdk/url":undefined,"sdk/window/utils":undefined}],33:[function(require,module,exports){
/* global Promise */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var FileUtilities = (function () {
    function FileUtilities(fileSystem, windowUtilities, mimeService) {
        _classCallCheck(this, FileUtilities);

        this._fileSystem = fileSystem;
        this._windowUtilities = windowUtilities;
        this._mimeService = mimeService;
    }

    _createClass(FileUtilities, [{
        key: "create",
        value: function create(fileInfo) {
            var file = this._fileSystem.createLocalFile();
            if (typeof fileInfo === "string") file.initWithPath(fileInfo);
            if (typeof fileInfo === "object") file.initWithFile(fileInfo);
            return file;
        }
    }, {
        key: "readBytes",
        value: function readBytes(filePath) {
            var _this = this;

            var file = this.create(filePath);
            return this._fileSystem.read(file.path).then(function (fileBytes) {
                var mimetype = _this._mimeService.getMimeType(file);
                return { fileBytes: fileBytes, mimetype: mimetype };
            });
        }
    }, {
        key: "openFileBrowser",
        value: function openFileBrowser() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                var filePicker = _this2._fileSystem.filePicker();
                filePicker.init(_this2._windowUtilities.getMostRecentBrowserWindow(), Constants.addonSdk.filePicker.windowTitle, Constants.addonSdk.filePicker.modeOpenMultiple);
                filePicker.appendFilters(Constants.addonSdk.filePicker.filterAll);

                filePicker.open(function (result) {
                    if (result === Constants.addonSdk.filePicker.returnOK) {
                        var filePickerFiles = filePicker.files;
                        var files = [];
                        while (filePickerFiles.hasMoreElements()) {
                            var file = _this2.create(filePickerFiles.getNext());
                            var fileInfo = {
                                path: file.path,
                                name: file.leafName,
                                type: _this2._mimeService.getMimeType(file)
                            };

                            files.push(fileInfo);
                        }
                        resolve(files);
                    } else reject(Constants.addonSdk.filePicker.noFilesChosen);
                });
            });
        }
    }]);

    return FileUtilities;
})();

module.exports = FileUtilities;
},{"../Constants":31}],34:[function(require,module,exports){
/* global Promise */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var IPResolver = (function () {
    function IPResolver(dnsService, udpProvider) {
        _classCallCheck(this, IPResolver);

        this._dnsService = dnsService;
        this._udpProvider = udpProvider;
    }

    _createClass(IPResolver, [{
        key: "resolveIPs",
        value: function resolveIPs() {
            var _this = this;

            var myName = this._dnsService.myHostName;
            var record = this._dnsService.resolve(myName, 0);
            var addresses = [];
            while (record.hasMore()) addresses.push(record.getNextAddrAsString());

            if (!addresses.some(function (address) {
                return address === "127.0.0.1";
            })) addresses.push("127.0.0.1");

            return new Promise(function (resolve, reject) {
                if (addresses.length > 1) resolve(addresses.filter(function (address) {
                    return Constants.ipv4Regex.test(address);
                }));else _this._forceGetIPs(resolve);
            });
        }
    }, {
        key: "_forceGetIPs",
        value: function _forceGetIPs(resolve) {
            var udpSocket = this._udpProvider.create();

            udpSocket.init(-1, "0.0.0.0", Constants.IPResolverMulticast);
            udpSocket.onPacketReceivedEvent(function (message) {
                // See: https://bugzilla.mozilla.org/show_bug.cgi?id=952927
                udpSocket.close();
                resolve([message.fromAddr.address, "127.0.0.1"]);
            });

            udpSocket.send(Constants.IPResolverMulticast, udpSocket.localPort, Constants.forceGetIPMessage);
        }
    }]);

    return IPResolver;
})();

module.exports = IPResolver;
},{"../Constants":31}],35:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Constants = require('../Constants');

var MimeService = (function () {
				function MimeService(nativeMimeService) {
								_classCallCheck(this, MimeService);

								this._nativeMimeService = nativeMimeService;
				}

				_createClass(MimeService, [{
								key: 'getMimeType',
								value: function getMimeType(file) {
												/*
             * From Mozilla
            * Gets a content-type for the given file, by
            * asking the global MIME service for a content-type, and finally by failing
            * over to application/octet-stream.
            *
            * @param file : nsIFile
            * the nsIFile for which to get a file type
            * @returns string
            * the best content-type which can be determined for the file
            */
												try {
																return this._nativeMimeService.getTypeFromFile(file);
												} catch (e) {
																return Constants.defaultMimeType;
												}
								}
				}]);

				return MimeService;
})();

module.exports = MimeService;
},{"../Constants":31}],36:[function(require,module,exports){
/* global Promise */
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SimpleTCPSocket = (function () {
	function SimpleTCPSocket(timers, tcpSocketProvider, socketSender) {
		_classCallCheck(this, SimpleTCPSocket);

		this._timers = timers;
		this._tcpSocketProvider = tcpSocketProvider;
		this._socketSender = socketSender;

		this.responseTimeout = 60000;
	}

	_createClass(SimpleTCPSocket, [{
		key: 'send',
		value: function send(ip, port, data, waitForResponse) {
			var _this = this;

			return new Promise(function (resolve, reject) {
				var socket = _this._tcpSocketProvider.create().open(ip, port);
				socket.onopen(function () {
					return _this._onopen(socket, data, waitForResponse, reject);
				});
				socket.onerror(function (err) {
					return reject(err);
				});
				socket.ondata(function (dataReceived) {
					return _this._ondata(dataReceived, socket, resolve);
				});
			});
		}
	}, {
		key: 'ping',
		value: function ping(ip, port) {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				/*todo: maybe add a timeout?*/
				var resolved = false;
				var socket = _this2._tcpSocketProvider.create().open(ip, port);
				socket.onopen(function () {
					resolved = true;
					resolve(true);
					socket.close();
				});
				socket.onerror(function (err) {
					if (!resolved) resolve(false);
				});
			});
		}
	}, {
		key: '_onopen',
		value: function _onopen(socket, data, waitForResponse, reject) {
			var _this3 = this;

			this._socketSender.send(socket, data, waitForResponse);
			this._timers.setTimeout(function () {
				try {
					socket.close();
					reject('Device did not respond within ' + _this3.responseTimeout / 1000 + ' seconds.');
				} catch (e) {}
			}, this.responseTimeout);
		}
	}, {
		key: '_ondata',
		value: function _ondata(dataReceived, socket, resolve) {
			/*todo: this will only work when the entire response fits into a single packet, need to loop over this and parse it like in the HttpRequestParser, only different*/
			socket.close();
			resolve(dataReceived);
		}
	}]);

	return SimpleTCPSocket;
})();

module.exports = SimpleTCPSocket;

/* todo: if the error is anything other than the socket is already closed, throw
 * already closed, meaning we already got the response
 * nothing to see here, move along
 */
},{}],37:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("../Constants");

var SocketSender = (function () {
	function SocketSender() {
		_classCallCheck(this, SocketSender);
	}

	_createClass(SocketSender, [{
		key: "send",
		value: function send(socket, message, keepAlive) {
			return new Promise(function (resolve, reject) {
				var offset = 0;
				var remainingBytes = socket.binaryType !== "string" ? message.byteLength : message.length;
				//bytelength is for files, length (binaryType string) is for matchstick commands
				//todo: see if matchstick commands can be sent using arraybuffer
				var sendNextPart = function sendNextPart() {
					var amountToSend = Math.min(remainingBytes, Constants.socketBufferSize);
					var bufferFull = false;
					if (amountToSend !== 0) {
						bufferFull = socket.send(message, offset, amountToSend);
						offset += amountToSend;
						remainingBytes -= amountToSend;

						if (remainingBytes > 0 && !bufferFull) sendNextPart();
					}

					if (remainingBytes === 0) {
						resolve();
						if (!keepAlive) socket.close(); //todo: make timer and add params to keep alive so we can time it out, once keep alive is over x
					}
				};

				socket.ondrain(sendNextPart);
				sendNextPart();
			});
		}
	}]);

	return SocketSender;
})();

module.exports = SocketSender;
},{"../Constants":31}],38:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StorageService = (function () {
	function StorageService(nativeStorage) {
		_classCallCheck(this, StorageService);

		this._nativeStorage = nativeStorage;
	}

	_createClass(StorageService, [{
		key: "get",
		value: function get(key) {
			var _this = this;

			return new Promise(function (resolve, reject) {
				resolve(_this._nativeStorage[key]);
			});
		}
	}, {
		key: "set",
		value: function set(key, value) {
			this._nativeStorage[key] = value;
		}
	}, {
		key: "remove",
		value: function remove(key) {
			delete this._nativeStorage[key];
		}
	}]);

	return StorageService;
})();

module.exports = StorageService;
},{}],39:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//https://dxr.mozilla.org/mozilla-central/source/dom/network/interfaces/nsIDOMTCPSocket.idl

var TCPSocket = (function () {
	function TCPSocket(nativeTCPSocket) {
		_classCallCheck(this, TCPSocket);

		this._nativeTCPSocket = nativeTCPSocket;
	}

	_createClass(TCPSocket, [{
		key: "open",
		value: function open(host, port, options) {
			this.host = host;
			this.port = port;

			if (options && options.hasOwnProperty("binaryType")) this.binaryType = options.binaryType;else this.binaryType = "string";

			this.socket = this._nativeTCPSocket.open(host, port, options);

			return this;
		}
	}, {
		key: "listen",
		value: function listen(localPort, options, backlog) {
			this.port = localPort;

			if (options && options.hasOwnProperty("binaryType")) this.binaryType = options.binaryType;else this.binaryType = "string";

			this.socket = this._nativeTCPSocket.listen(localPort, options, backlog);

			return this;
		}
	}, {
		key: "close",
		value: function close() {
			this.socket.close();
		}
	}, {
		key: "isOpen",
		value: function isOpen() {
			return this.socket.readyState === "open";
		}
	}, {
		key: "send",
		value: function send(data, byteOffset, byteLength) {
			if (this.socket != null) {
				return this.socket.send(data, byteOffset, byteLength);
			} else new Error("Underlying socket is null.  Create a socket then try again.");
		}
	}, {
		key: "onerror",
		value: function onerror(callback) {
			if (this.socket != null) this.socket.onerror = callback;else new Error("Underlying socket is null.  Create a socket then try again.");
		}
	}, {
		key: "ondata",
		value: function ondata(callback) {
			if (this.socket != null) this.socket.ondata = function (event) {
				return callback(event.data);
			};else new Error("Underlying socket is null.  Create a socket then try again.");
		}
	}, {
		key: "onopen",
		value: function onopen(callback) {
			if (this.socket != null) this.socket.onopen = callback;else new Error("Underlying socket is null.  Create a socket then try again.");
		}
	}, {
		key: "onclose",
		value: function onclose(callback) {
			if (this.socket != null) this.socket.onclose = callback;else new Error("Underlying socket is null.  Create a socket then try again.");
		}
	}, {
		key: "ondrain",
		value: function ondrain(callback) {
			if (this.socket != null) this.socket.ondrain = callback;else new Error("Underlying socket is null.  Create a socket then try again.");
		}
	}, {
		key: "onconnect",
		value: function onconnect(callback) {
			if (this.socket != null) {
				this.socket.onconnect = function (incomingSocket) {
					var wrappedSocket = new TCPSocket();
					wrappedSocket.socket = incomingSocket;
					callback(wrappedSocket);
				};
			} else new Error("Underlying socket is null.  Create a socket then try again.");
		}
	}]);

	return TCPSocket;
})();

module.exports = TCPSocket;
},{}],40:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UDPSocket = (function () {
	function UDPSocket(nativeSocket, scriptSecurityManager) {
		_classCallCheck(this, UDPSocket);

		this._nativeSocket = nativeSocket; // https://dxr.mozilla.org/comm-central/source/mozilla/netwerk/base/nsIUDPSocket.idl
		this._scriptSecurityManager = scriptSecurityManager;
	}

	_createClass(UDPSocket, [{
		key: "init",
		value: function init(localPort, localIP, multicastIP) {
			this.localIP = localIP;
			this.multicastIP = multicastIP;

			this._nativeSocket.init(localPort || -1, false, this._scriptSecurityManager, true);
			this._nativeSocket.multicastInterface = localIP;
			this._nativeSocket.joinMulticast(multicastIP, localIP);
			this._nativeSocket.asyncListen(this);

			this.localPort = this._nativeSocket.port;
		}
	}, {
		key: "send",
		value: function send(destinationIP, destinationPort, message) {
			this._nativeSocket.send(destinationIP, destinationPort, message, message.length);
		}
	}, {
		key: "close",
		value: function close() {
			this._nativeSocket.close();
		}
	}, {
		key: "leaveMulticast",
		value: function leaveMulticast(multicastIP, myIP) {
			this._nativeSocket.leaveMulticast(multicastIP, myIP);
		}
	}, {
		key: "onStopListening",
		value: function onStopListening(socket, status) {
			if (typeof this._stopListeningEventHandler === "function") this._stopListeningEventHandler(status);
		}
	}, {
		key: "onPacketReceived",
		value: function onPacketReceived(socket, message) {
			// See: https://bugzilla.mozilla.org/show_bug.cgi?id=952927
			if (typeof this._packetReceivedEventHandler === "function") this._packetReceivedEventHandler(message);
		}
	}, {
		key: "onStopListeningEvent",
		value: function onStopListeningEvent(callback) {
			this._stopListeningEventHandler = callback;
		}
	}, {
		key: "onPacketReceivedEvent",
		value: function onPacketReceivedEvent(callback) {
			this._packetReceivedEventHandler = callback;
		}
	}]);

	return UDPSocket;
})();

module.exports = UDPSocket;
},{}],41:[function(require,module,exports){
/* global Promise */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SimpleTCP = (function () {
	function SimpleTCP(simpleTCPSocket) {
		_classCallCheck(this, SimpleTCP);

		this._simpleTCPSocket = simpleTCPSocket;
	}

	_createClass(SimpleTCP, [{
		key: "send",
		value: function send(ip, port, data, waitForResponse) {
			return this._simpleTCPSocket.send(ip, port, data, waitForResponse);
		}
	}, {
		key: "ping",
		value: function ping(ip, port) {
			return this._simpleTCPSocket.ping(ip, port);
		}
	}]);

	return SimpleTCP;
})();

module.exports = SimpleTCP;
},{}],42:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SdkResolver = (function () {
	function SdkResolver() {
		_classCallCheck(this, SdkResolver);
	}

	_createClass(SdkResolver, [{
		key: 'resolve',
		value: function resolve() {
			var sdk = undefined;
			if (typeof window === 'undefined') sdk = require('./Firefox/AddonSdk');else sdk = require('./Chrome/sdk');
			return sdk;
		}
	}]);

	return SdkResolver;
})();

module.exports = SdkResolver;
},{"./Chrome/sdk":30,"./Firefox/AddonSdk":32}],43:[function(require,module,exports){
"use strict";

module.exports.notFound = "/ssdp/notfound"; //for matchstick devices and maybe chromecast
module.exports.argumentNullError = "Argument Null Error.  Argument Name: ";
module.exports.argumentTypeError = "Argument Type Error.  Argument Name: ";
},{}],44:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("./Constants");

var Eventable = (function () {
    function Eventable() {
        _classCallCheck(this, Eventable);

        this._subscriptions = {};
    }

    _createClass(Eventable, [{
        key: "on",
        value: function on(eventType, callback) {
            if (!eventType) throw new Error(Constants.argumentNullError + "eventType");
            if (typeof callback !== "function") throw new Error(Constants.argumentTypeError + "callback must be a function.");

            this._subscriptions[eventType] = this._subscriptions[eventType] || [];
            this._subscriptions[eventType].push(callback);
        }
    }, {
        key: "emit",
        value: function emit(eventType) {
            for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                data[_key - 1] = arguments[_key];
            }

            if (!eventType) throw new Error(Constants.argumentNullError + "eventType");
            if (!Array.isArray(this._subscriptions[eventType])) return; //nobody has subscribed yet, just return
            this._subscriptions[eventType].forEach(function (subscriptionCallback) {
                return subscriptionCallback.apply(undefined, data);
            });
        }
    }]);

    return Eventable;
})();

module.exports = Eventable;
},{"./Constants":43}],45:[function(require,module,exports){
'use strict';

function md5cycle(x, k) {
	var a = x[0],
	    b = x[1],
	    c = x[2],
	    d = x[3];

	a = ff(a, b, c, d, k[0], 7, -680876936);
	d = ff(d, a, b, c, k[1], 12, -389564586);
	c = ff(c, d, a, b, k[2], 17, 606105819);
	b = ff(b, c, d, a, k[3], 22, -1044525330);
	a = ff(a, b, c, d, k[4], 7, -176418897);
	d = ff(d, a, b, c, k[5], 12, 1200080426);
	c = ff(c, d, a, b, k[6], 17, -1473231341);
	b = ff(b, c, d, a, k[7], 22, -45705983);
	a = ff(a, b, c, d, k[8], 7, 1770035416);
	d = ff(d, a, b, c, k[9], 12, -1958414417);
	c = ff(c, d, a, b, k[10], 17, -42063);
	b = ff(b, c, d, a, k[11], 22, -1990404162);
	a = ff(a, b, c, d, k[12], 7, 1804603682);
	d = ff(d, a, b, c, k[13], 12, -40341101);
	c = ff(c, d, a, b, k[14], 17, -1502002290);
	b = ff(b, c, d, a, k[15], 22, 1236535329);

	a = gg(a, b, c, d, k[1], 5, -165796510);
	d = gg(d, a, b, c, k[6], 9, -1069501632);
	c = gg(c, d, a, b, k[11], 14, 643717713);
	b = gg(b, c, d, a, k[0], 20, -373897302);
	a = gg(a, b, c, d, k[5], 5, -701558691);
	d = gg(d, a, b, c, k[10], 9, 38016083);
	c = gg(c, d, a, b, k[15], 14, -660478335);
	b = gg(b, c, d, a, k[4], 20, -405537848);
	a = gg(a, b, c, d, k[9], 5, 568446438);
	d = gg(d, a, b, c, k[14], 9, -1019803690);
	c = gg(c, d, a, b, k[3], 14, -187363961);
	b = gg(b, c, d, a, k[8], 20, 1163531501);
	a = gg(a, b, c, d, k[13], 5, -1444681467);
	d = gg(d, a, b, c, k[2], 9, -51403784);
	c = gg(c, d, a, b, k[7], 14, 1735328473);
	b = gg(b, c, d, a, k[12], 20, -1926607734);

	a = hh(a, b, c, d, k[5], 4, -378558);
	d = hh(d, a, b, c, k[8], 11, -2022574463);
	c = hh(c, d, a, b, k[11], 16, 1839030562);
	b = hh(b, c, d, a, k[14], 23, -35309556);
	a = hh(a, b, c, d, k[1], 4, -1530992060);
	d = hh(d, a, b, c, k[4], 11, 1272893353);
	c = hh(c, d, a, b, k[7], 16, -155497632);
	b = hh(b, c, d, a, k[10], 23, -1094730640);
	a = hh(a, b, c, d, k[13], 4, 681279174);
	d = hh(d, a, b, c, k[0], 11, -358537222);
	c = hh(c, d, a, b, k[3], 16, -722521979);
	b = hh(b, c, d, a, k[6], 23, 76029189);
	a = hh(a, b, c, d, k[9], 4, -640364487);
	d = hh(d, a, b, c, k[12], 11, -421815835);
	c = hh(c, d, a, b, k[15], 16, 530742520);
	b = hh(b, c, d, a, k[2], 23, -995338651);

	a = ii(a, b, c, d, k[0], 6, -198630844);
	d = ii(d, a, b, c, k[7], 10, 1126891415);
	c = ii(c, d, a, b, k[14], 15, -1416354905);
	b = ii(b, c, d, a, k[5], 21, -57434055);
	a = ii(a, b, c, d, k[12], 6, 1700485571);
	d = ii(d, a, b, c, k[3], 10, -1894986606);
	c = ii(c, d, a, b, k[10], 15, -1051523);
	b = ii(b, c, d, a, k[1], 21, -2054922799);
	a = ii(a, b, c, d, k[8], 6, 1873313359);
	d = ii(d, a, b, c, k[15], 10, -30611744);
	c = ii(c, d, a, b, k[6], 15, -1560198380);
	b = ii(b, c, d, a, k[13], 21, 1309151649);
	a = ii(a, b, c, d, k[4], 6, -145523070);
	d = ii(d, a, b, c, k[11], 10, -1120210379);
	c = ii(c, d, a, b, k[2], 15, 718787259);
	b = ii(b, c, d, a, k[9], 21, -343485551);

	x[0] = add32(a, x[0]);
	x[1] = add32(b, x[1]);
	x[2] = add32(c, x[2]);
	x[3] = add32(d, x[3]);
}

function cmn(q, a, b, x, s, t) {
	a = add32(add32(a, q), add32(x, t));
	return add32(a << s | a >>> 32 - s, b);
}

function ff(a, b, c, d, x, s, t) {
	return cmn(b & c | ~b & d, a, b, x, s, t);
}

function gg(a, b, c, d, x, s, t) {
	return cmn(b & d | c & ~d, a, b, x, s, t);
}

function hh(a, b, c, d, x, s, t) {
	return cmn(b ^ c ^ d, a, b, x, s, t);
}

function ii(a, b, c, d, x, s, t) {
	return cmn(c ^ (b | ~d), a, b, x, s, t);
}

function md51(s) {
	var n = s.length,
	    state = [1732584193, -271733879, -1732584194, 271733878],
	    i;
	for (i = 64; i <= s.length; i += 64) {
		md5cycle(state, md5blk(s.substring(i - 64, i)));
	}
	s = s.substring(i - 64);
	var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
	tail[i >> 2] |= 128 << (i % 4 << 3);
	if (i > 55) {
		md5cycle(state, tail);
		for (i = 0; i < 16; i++) tail[i] = 0;
	}
	tail[14] = n * 8;
	md5cycle(state, tail);
	return state;
}

/* there needs to be support for Unicode here,
 * unless we pretend that we can redefine the MD-5
 * algorithm for multi-byte characters (perhaps
 * by adding every four 16-bit characters and
 * shortening the sum to 32 bits). Otherwise
 * I suggest performing MD-5 as if every character
 * was two bytes--e.g., 0040 0025 = @%--but then
 * how will an ordinary MD-5 sum be matched?
 * There is no way to standardize text to something
 * like UTF-8 before transformation; speed cost is
 * utterly prohibitive. The JavaScript standard
 * itself needs to look at this: it should start
 * providing access to strings as preformed UTF-8
 * 8-bit unsigned value arrays.
 */
function md5blk(s) {
	/* I figured global was faster.   */
	var md5blks = [],
	    i; /* Andy King said do it this way. */
	for (i = 0; i < 64; i += 4) {
		md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
	}
	return md5blks;
}

var hex_chr = '0123456789abcdef'.split('');

function rhex(n) {
	var s = '',
	    j = 0;
	for (; j < 4; j++) s += hex_chr[n >> j * 8 + 4 & 15] + hex_chr[n >> j * 8 & 15];
	return s;
}

function hex(x) {
	for (var i = 0; i < x.length; i++) x[i] = rhex(x[i]);
	return x.join('');
}

function md5(s) {
	return hex(md51(s));
}

/* this function is much faster,
so if possible we use it. Some IEs
are the only ones I know of that
need the idiotic second function,
generated by an if clause.  */

function add32(a, b) {
	return a + b & 4294967295;
}

if (md5('hello') != '5d41402abc4b2a76b9719d911017c592') {
	var _add32 = function (x, y) {
		var lsw = (x & 65535) + (y & 65535),
		    msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return msw << 16 | lsw & 65535;
	};
}

module.exports = md5;
},{}],46:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require("./Constants");

var UrlProvider = (function () {
	function UrlProvider(urlSdk) {
		_classCallCheck(this, UrlProvider);

		this._urlSdk = urlSdk;
	}

	_createClass(UrlProvider, [{
		key: "toUrl",
		value: function toUrl(path, currentUrl, baseUrl) {
			if (!path || path.length === 0 || path === Constants.notFound) return null;
			if (this.isValidUri(path)) return this.createUrl(path);
			try {
				return this.createUrl(path, baseUrl);
			} catch (e) {}
			try {
				return this.createUrl(path, currentUrl);
			} catch (e) {}

			return null;
		}
	}, {
		key: "createUrl",
		value: function createUrl(source, base) {
			return new this._urlSdk.URL(source, base);
		}
	}, {
		key: "isValidUri",
		value: function isValidUri(path) {
			return this._urlSdk.isValidURI(path);
		}
	}]);

	return UrlProvider;
})();

module.exports = UrlProvider;
/* */ /* */
},{"./Constants":43}],47:[function(require,module,exports){
/* global Promise */
'use strict';

var self = {};
var XMLHttpRequest;

(function () {
	'use strict';

	if (self.fetch) {
		return;
	}

	function normalizeName(name) {
		if (typeof name !== 'string') {
			name = name.toString();
		}
		if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
			throw new TypeError('Invalid character in header field name');
		}
		return name.toLowerCase();
	}

	function normalizeValue(value) {
		if (typeof value !== 'string') {
			value = value.toString();
		}
		return value;
	}

	function Headers(headers) {
		this.map = {};

		var self = this;
		if (headers instanceof Headers) {
			headers.forEach(function (name, values) {
				values.forEach(function (value) {
					self.append(name, value);
				});
			});
		} else if (headers) {
			Object.getOwnPropertyNames(headers).forEach(function (name) {
				self.append(name, headers[name]);
			});
		}
	}

	Headers.prototype.append = function (name, value) {
		name = normalizeName(name);
		value = normalizeValue(value);
		var list = this.map[name];
		if (!list) {
			list = [];
			this.map[name] = list;
		}
		list.push(value);
	};

	Headers.prototype['delete'] = function (name) {
		delete this.map[normalizeName(name)];
	};

	Headers.prototype.get = function (name) {
		var values = this.map[normalizeName(name)];
		return values ? values[0] : null;
	};

	Headers.prototype.getAll = function (name) {
		return this.map[normalizeName(name)] || [];
	};

	Headers.prototype.has = function (name) {
		return this.map.hasOwnProperty(normalizeName(name));
	};

	Headers.prototype.set = function (name, value) {
		this.map[normalizeName(name)] = [normalizeValue(value)];
	};

	// Instead of iterable for now.
	Headers.prototype.forEach = function (callback) {
		var self = this;
		Object.getOwnPropertyNames(this.map).forEach(function (name) {
			callback(name, self.map[name]);
		});
	};

	function consumed(body) {
		if (body.bodyUsed) {
			return Promise.reject(new TypeError('Already read'));
		}
		body.bodyUsed = true;
	}

	function fileReaderReady(reader) {
		return new Promise(function (resolve, reject) {
			reader.onload = function () {
				resolve(reader.result);
			};
			reader.onerror = function () {
				reject(reader.error);
			};
		});
	}

	function readBlobAsArrayBuffer(blob) {
		var reader = new FileReader();
		reader.readAsArrayBuffer(blob);
		return fileReaderReady(reader);
	}

	function readBlobAsText(blob) {
		var reader = new FileReader();
		reader.readAsText(blob);
		return fileReaderReady(reader);
	}

	var support = {
		blob: 'FileReader' in self && 'Blob' in self && (function () {
			try {
				new Blob();
				return true;
			} catch (e) {
				return false;
			}
		})(),
		formData: 'FormData' in self
	};

	function Body() {
		this.bodyUsed = false;

		if (support.blob) {
			this._initBody = function (body) {
				this._bodyInit = body;
				if (typeof body === 'string') {
					this._bodyText = body;
				} else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
					this._bodyBlob = body;
				} else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
					this._bodyFormData = body;
				} else if (!body) {
					this._bodyText = '';
				} else {
					throw new Error('unsupported BodyInit type');
				}
			};

			this.blob = function () {
				var rejected = consumed(this);
				if (rejected) {
					return rejected;
				}

				if (this._bodyBlob) {
					return Promise.resolve(this._bodyBlob);
				} else if (this._bodyFormData) {
					throw new Error('could not read FormData body as blob');
				} else {
					return Promise.resolve(new Blob([this._bodyText]));
				}
			};

			this.arrayBuffer = function () {
				return this.blob().then(readBlobAsArrayBuffer);
			};

			this.text = function () {
				var rejected = consumed(this);
				if (rejected) {
					return rejected;
				}

				if (this._bodyBlob) {
					return readBlobAsText(this._bodyBlob);
				} else if (this._bodyFormData) {
					throw new Error('could not read FormData body as text');
				} else {
					return Promise.resolve(this._bodyText);
				}
			};
		} else {
			this._initBody = function (body) {
				this._bodyInit = body;
				if (typeof body === 'string') {
					this._bodyText = body;
				} else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
					this._bodyFormData = body;
				} else if (!body) {
					this._bodyText = '';
				} else {
					throw new Error('unsupported BodyInit type');
				}
			};

			this.text = function () {
				var rejected = consumed(this);
				return rejected ? rejected : Promise.resolve(this._bodyText);
			};
		}

		if (support.formData) {
			this.formData = function () {
				return this.text().then(decode);
			};
		}

		this.json = function () {
			return this.text().then(JSON.parse);
		};

		return this;
	}

	// HTTP methods whose capitalization should be normalized
	var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

	function normalizeMethod(method) {
		var upcased = method.toUpperCase();
		return methods.indexOf(upcased) > -1 ? upcased : method;
	}

	function Request(url, options) {
		options = options || {};
		this.url = url;

		this.credentials = options.credentials || 'omit';
		this.headers = new Headers(options.headers);
		this.method = normalizeMethod(options.method || 'GET');
		this.mode = options.mode || null;
		this.referrer = null;

		if ((this.method === 'GET' || this.method === 'HEAD') && options.body) {
			throw new TypeError('Body not allowed for GET or HEAD requests');
		}
		this._initBody(options.body);
	}

	function decode(body) {
		var form = new FormData();
		body.trim().split('&').forEach(function (bytes) {
			if (bytes) {
				var split = bytes.split('=');
				var name = split.shift().replace(/\+/g, ' ');
				var value = split.join('=').replace(/\+/g, ' ');
				form.append(decodeURIComponent(name), decodeURIComponent(value));
			}
		});
		return form;
	}

	function headers(xhr) {
		var head = new Headers();
		var pairs = xhr.getAllResponseHeaders().trim().split('\n');
		pairs.forEach(function (header) {
			var split = header.trim().split(':');
			var key = split.shift().trim();
			var value = split.join(':').trim();
			head.append(key, value);
		});
		return head;
	}

	Request.prototype.fetch = function () {
		var self = this;

		return new Promise(function (resolve, reject) {
			var xhr = new XMLHttpRequest();
			if (self.credentials === 'cors') {
				xhr.withCredentials = true;
			}

			function responseURL() {
				if ('responseURL' in xhr) {
					return xhr.responseURL;
				}

				// Avoid security warnings on getResponseHeader when not allowed by CORS
				if (/^X-Request-URL:/m.test(xhr.getAllResponseHeaders())) {
					return xhr.getResponseHeader('X-Request-URL');
				}

				return;
			}

			xhr.onload = function () {
				var status = xhr.status === 1223 ? 204 : xhr.status;
				if (status < 100 || status > 599) {
					reject(new TypeError('Network request failed'));
					return;
				}
				var options = {
					status: status,
					statusText: xhr.statusText,
					headers: headers(xhr),
					url: responseURL()
				};
				var body = 'response' in xhr ? xhr.response : xhr.responseText;
				resolve(new Response(body, options));
			};

			xhr.onerror = function () {
				reject(new TypeError('Network request failed'));
			};

			xhr.open(self.method, self.url, true);

			if ('responseType' in xhr && support.blob) {
				xhr.responseType = 'blob';
			}

			self.headers.forEach(function (name, values) {
				values.forEach(function (value) {
					xhr.setRequestHeader(name, value);
				});
			});

			xhr.send(typeof self._bodyInit === 'undefined' ? null : self._bodyInit);
		});
	};

	Body.call(Request.prototype);

	function Response(bodyInit, options) {
		if (!options) {
			options = {};
		}

		this._initBody(bodyInit);
		this.type = 'default';
		this.url = null;
		this.status = options.status;
		this.ok = this.status >= 200 && this.status < 300;
		this.statusText = options.statusText;
		this.headers = options.headers instanceof Headers ? options.headers : new Headers(options.headers);
		this.url = options.url || '';
	}

	Body.call(Response.prototype);

	self.Headers = Headers;
	self.Request = Request;
	self.Response = Response;

	self.fetch = function (url, options) {
		return new Request(url, options).fetch();
	};
	self.fetch.polyfill = true;
})();

function fetchInitialize(xmlHttpRequest) {
	XMLHttpRequest = xmlHttpRequest;
	return self.fetch;
}

module.exports = fetchInitialize;
},{}],48:[function(require,module,exports){
/*eslint new-cap:0*/
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SdkResolver = require("omniscience-sdk-resolver");
var EventableClass = require("./Eventable");
var UrlProvider = require("./UrlProvider");
var _fetch = require("./fetch");
var _MD5 = require("./MD5");

var UtilitiesClass = (function () {
	function UtilitiesClass() {
		_classCallCheck(this, UtilitiesClass);

		this._sdk = new SdkResolver().resolve();
	}

	_createClass(UtilitiesClass, [{
		key: "createUrlProvider",
		value: function createUrlProvider() {
			return new UrlProvider(this._sdk.url());
		}
	}, {
		key: "fetch",
		value: function fetch() {
			return _fetch(this._sdk.XMLHttpRequest());
		}
	}, {
		key: "MD5",
		value: function MD5() {
			return _MD5;
		}
	}]);

	return UtilitiesClass;
})();

module.exports.Utilities = UtilitiesClass;
module.exports.Eventable = EventableClass;
},{"./Eventable":44,"./MD5":45,"./UrlProvider":46,"./fetch":47,"omniscience-sdk-resolver":72}],49:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"../Constants":61,"dup":19}],50:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"../Constants":61,"dup":20}],51:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"../Constants":61,"dup":21}],52:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],53:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],54:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"../Constants":61,"dup":24}],55:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"../Constants":61,"dup":25}],56:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],57:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"../Constants":61,"dup":27}],58:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"../Constants":61,"dup":28}],59:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],60:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"../SimpleTCP":71,"./FileUtilities":49,"./IPResolver":50,"./MimeService":51,"./Notifications":52,"./SimpleTCPSocket":53,"./SimpleUDPSocket":54,"./SocketSender":55,"./StorageService":56,"./TCPSocket":57,"./UDPSocket":58,"./UrlSdk":59,"dup":30}],61:[function(require,module,exports){
"use strict";

module.exports = {
	ipv4Regex: /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/,
	IPResolverMulticast: "239.255.255.255",
	defaultMimeType: "application/octet-stream",
	addonSdk: {
		filePicker: {
			filterAll: 1, //Corresponds to the *.* filter for file extensions. All files will pass through the filter.
			filterImages: 8, //Corresponds to the *.jpe, *.jpg, *.jpeg, *.gif, *.png, *.bmp, *.ico, *.svg, *.svgz, *.tif, *.tiff, *.ai, *.drw, *.pct, *.psp, *.xcf, *.psd and *.raw filters for file extensions.
			filterAudio: 256, //Corresponds to the *.aac, *.aif, *.flac, *.iff, *.m4a, *.m4b, *.mid, *.midi, *.mp3, *.mpa, *.mpc, *.oga, *.ogg, *.ra, *.ram, *.snd, *.wav and *.wma filters for file extensions.
			filterVideo: 512, //Corresponds to the *.avi, *.divx, *.flv, *.m4v, *.mkv, *.mov, *.mp4, *.mpeg, *.mpg, *.ogm, *.ogv, *.ogx, *.rm, *.rmvb, *.smil, *.webm, *.wmv and *.xvid filters for file extensions.
			returnOK: 0, //The file picker dialog was closed by the user hitting 'Ok'
			returnCancel: 1, //The file picker dialog was closed by the user hitting 'Cancel'
			modeOpenMultiple: 3, //Load multiple files.
			windowTitle: "Choose File(s)",
			noFilesChosen: "file browser was closed without choosing any files"
		}
	},
	chromeSdk: {
		filePicker: {
			open: "openFile",
			openWritable: "openWritableFile",
			openDirectory: "openDirectory",
			save: "saveFile",
			filterAll: "*",
			filterAudio: "audio/*",
			filterVideo: "video/*",
			filterImages: "images/*"
		}
	},
	forceGetIPMessage: new Uint8Array([].map.call("get my ipaddresses", function (i) {
		return i.charCodeAt(0);
	})),
	socketBufferSize: 65535,
	mimetypes: {
		"123": "application/vnd.lotus-1-2-3",
		"3dml": "text/vnd.in3d.3dml",
		"3ds": "image/x-3ds",
		"3g2": "video/3gpp2",
		"3gp": "video/3gpp",
		"7z": "application/x-7z-compressed",
		"aab": "application/x-authorware-bin",
		"aac": "audio/x-aac",
		"aam": "application/x-authorware-map",
		"aas": "application/x-authorware-seg",
		"abw": "application/x-abiword",
		"ac": "application/pkix-attr-cert",
		"acc": "application/vnd.americandynamics.acc",
		"ace": "application/x-ace-compressed",
		"acu": "application/vnd.acucobol",
		"acutc": "application/vnd.acucorp",
		"adp": "audio/adpcm",
		"aep": "application/vnd.audiograph",
		"afm": "application/x-font-type1",
		"afp": "application/vnd.ibm.modcap",
		"ahead": "application/vnd.ahead.space",
		"ai": "application/postscript",
		"aif": "audio/x-aiff",
		"aifc": "audio/x-aiff",
		"aiff": "audio/x-aiff",
		"air": "application/vnd.adobe.air-application-installer-package+zip",
		"ait": "application/vnd.dvb.ait",
		"ami": "application/vnd.amiga.ami",
		"apk": "application/vnd.android.package-archive",
		"appcache": "text/cache-manifest",
		"application": "application/x-ms-application",
		"apr": "application/vnd.lotus-approach",
		"arc": "application/x-freearc",
		"asc": "application/pgp-signature",
		"asf": "video/x-ms-asf",
		"asm": "text/x-asm",
		"aso": "application/vnd.accpac.simply.aso",
		"asx": "video/x-ms-asf",
		"atc": "application/vnd.acucorp",
		"atom": "application/atom+xml",
		"atomcat": "application/atomcat+xml",
		"atomsvc": "application/atomsvc+xml",
		"atx": "application/vnd.antix.game-component",
		"au": "audio/basic",
		"avi": "video/x-msvideo",
		"aw": "application/applixware",
		"azf": "application/vnd.airzip.filesecure.azf",
		"azs": "application/vnd.airzip.filesecure.azs",
		"azw": "application/vnd.amazon.ebook",
		"bat": "application/x-msdownload",
		"bcpio": "application/x-bcpio",
		"bdf": "application/x-font-bdf",
		"bdm": "application/vnd.syncml.dm+wbxml",
		"bed": "application/vnd.realvnc.bed",
		"bh2": "application/vnd.fujitsu.oasysprs",
		"bin": "application/octet-stream",
		"blb": "application/x-blorb",
		"blorb": "application/x-blorb",
		"bmi": "application/vnd.bmi",
		"bmp": "image/bmp",
		"book": "application/vnd.framemaker",
		"box": "application/vnd.previewsystems.box",
		"boz": "application/x-bzip2",
		"bpk": "application/octet-stream",
		"btif": "image/prs.btif",
		"bz": "application/x-bzip",
		"bz2": "application/x-bzip2",
		"c": "text/x-c",
		"c11amc": "application/vnd.cluetrust.cartomobile-config",
		"c11amz": "application/vnd.cluetrust.cartomobile-config-pkg",
		"c4d": "application/vnd.clonk.c4group",
		"c4f": "application/vnd.clonk.c4group",
		"c4g": "application/vnd.clonk.c4group",
		"c4p": "application/vnd.clonk.c4group",
		"c4u": "application/vnd.clonk.c4group",
		"cab": "application/vnd.ms-cab-compressed",
		"caf": "audio/x-caf",
		"cap": "application/vnd.tcpdump.pcap",
		"car": "application/vnd.curl.car",
		"cat": "application/vnd.ms-pki.seccat",
		"cb7": "application/x-cbr",
		"cba": "application/x-cbr",
		"cbr": "application/x-cbr",
		"cbt": "application/x-cbr",
		"cbz": "application/x-cbr",
		"cc": "text/x-c",
		"cct": "application/x-director",
		"ccxml": "application/ccxml+xml",
		"cdbcmsg": "application/vnd.contact.cmsg",
		"cdf": "application/x-netcdf",
		"cdkey": "application/vnd.mediastation.cdkey",
		"cdmia": "application/cdmi-capability",
		"cdmic": "application/cdmi-container",
		"cdmid": "application/cdmi-domain",
		"cdmio": "application/cdmi-object",
		"cdmiq": "application/cdmi-queue",
		"cdx": "chemical/x-cdx",
		"cdxml": "application/vnd.chemdraw+xml",
		"cdy": "application/vnd.cinderella",
		"cer": "application/pkix-cert",
		"cfs": "application/x-cfs-compressed",
		"cgm": "image/cgm",
		"chat": "application/x-chat",
		"chm": "application/vnd.ms-htmlhelp",
		"chrt": "application/vnd.kde.kchart",
		"cif": "chemical/x-cif",
		"cii": "application/vnd.anser-web-certificate-issue-initiation",
		"cil": "application/vnd.ms-artgalry",
		"cla": "application/vnd.claymore",
		"class": "application/java-vm",
		"clkk": "application/vnd.crick.clicker.keyboard",
		"clkp": "application/vnd.crick.clicker.palette",
		"clkt": "application/vnd.crick.clicker.template",
		"clkw": "application/vnd.crick.clicker.wordbank",
		"clkx": "application/vnd.crick.clicker",
		"clp": "application/x-msclip",
		"cmc": "application/vnd.cosmocaller",
		"cmdf": "chemical/x-cmdf",
		"cml": "chemical/x-cml",
		"cmp": "application/vnd.yellowriver-custom-menu",
		"cmx": "image/x-cmx",
		"cod": "application/vnd.rim.cod",
		"com": "application/x-msdownload",
		"conf": "text/plain",
		"cpio": "application/x-cpio",
		"cpp": "text/x-c",
		"cpt": "application/mac-compactpro",
		"crd": "application/x-mscardfile",
		"crl": "application/pkix-crl",
		"crt": "application/x-x509-ca-cert",
		"cryptonote": "application/vnd.rig.cryptonote",
		"csh": "application/x-csh",
		"csml": "chemical/x-csml",
		"csp": "application/vnd.commonspace",
		"css": "text/css",
		"cst": "application/x-director",
		"csv": "text/csv",
		"cu": "application/cu-seeme",
		"curl": "text/vnd.curl",
		"cww": "application/prs.cww",
		"cxt": "application/x-director",
		"cxx": "text/x-c",
		"dae": "model/vnd.collada+xml",
		"daf": "application/vnd.mobius.daf",
		"dart": "application/vnd.dart",
		"dataless": "application/vnd.fdsn.seed",
		"davmount": "application/davmount+xml",
		"dbk": "application/docbook+xml",
		"dcr": "application/x-director",
		"dcurl": "text/vnd.curl.dcurl",
		"dd2": "application/vnd.oma.dd2+xml",
		"ddd": "application/vnd.fujixerox.ddd",
		"deb": "application/x-debian-package",
		"def": "text/plain",
		"deploy": "application/octet-stream",
		"der": "application/x-x509-ca-cert",
		"dfac": "application/vnd.dreamfactory",
		"dgc": "application/x-dgc-compressed",
		"dic": "text/x-c",
		"dir": "application/x-director",
		"dis": "application/vnd.mobius.dis",
		"dist": "application/octet-stream",
		"distz": "application/octet-stream",
		"djv": "image/vnd.djvu",
		"djvu": "image/vnd.djvu",
		"dll": "application/x-msdownload",
		"dmg": "application/x-apple-diskimage",
		"dmp": "application/vnd.tcpdump.pcap",
		"dms": "application/octet-stream",
		"dna": "application/vnd.dna",
		"doc": "application/msword",
		"docm": "application/vnd.ms-word.document.macroenabled.12",
		"docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"dot": "application/msword",
		"dotm": "application/vnd.ms-word.template.macroenabled.12",
		"dotx": "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
		"dp": "application/vnd.osgi.dp",
		"dpg": "application/vnd.dpgraph",
		"dra": "audio/vnd.dra",
		"dsc": "text/prs.lines.tag",
		"dssc": "application/dssc+der",
		"dtb": "application/x-dtbook+xml",
		"dtd": "application/xml-dtd",
		"dts": "audio/vnd.dts",
		"dtshd": "audio/vnd.dts.hd",
		"dump": "application/octet-stream",
		"dvb": "video/vnd.dvb.file",
		"dvi": "application/x-dvi",
		"dwf": "model/vnd.dwf",
		"dwg": "image/vnd.dwg",
		"dxf": "image/vnd.dxf",
		"dxp": "application/vnd.spotfire.dxp",
		"dxr": "application/x-director",
		"ecelp4800": "audio/vnd.nuera.ecelp4800",
		"ecelp7470": "audio/vnd.nuera.ecelp7470",
		"ecelp9600": "audio/vnd.nuera.ecelp9600",
		"ecma": "application/ecmascript",
		"edm": "application/vnd.novadigm.edm",
		"edx": "application/vnd.novadigm.edx",
		"efif": "application/vnd.picsel",
		"ei6": "application/vnd.pg.osasli",
		"elc": "application/octet-stream",
		"emf": "application/x-msmetafile",
		"eml": "message/rfc822",
		"emma": "application/emma+xml",
		"emz": "application/x-msmetafile",
		"eol": "audio/vnd.digital-winds",
		"eot": "application/vnd.ms-fontobject",
		"eps": "application/postscript",
		"epub": "application/epub+zip",
		"es3": "application/vnd.eszigno3+xml",
		"esa": "application/vnd.osgi.subsystem",
		"esf": "application/vnd.epson.esf",
		"et3": "application/vnd.eszigno3+xml",
		"etx": "text/x-setext",
		"eva": "application/x-eva",
		"evy": "application/x-envoy",
		"exe": "application/x-msdownload",
		"exi": "application/exi",
		"ext": "application/vnd.novadigm.ext",
		"ez": "application/andrew-inset",
		"ez2": "application/vnd.ezpix-album",
		"ez3": "application/vnd.ezpix-package",
		"f": "text/x-fortran",
		"f4v": "video/x-f4v",
		"f77": "text/x-fortran",
		"f90": "text/x-fortran",
		"fbs": "image/vnd.fastbidsheet",
		"fcdt": "application/vnd.adobe.formscentral.fcdt",
		"fcs": "application/vnd.isac.fcs",
		"fdf": "application/vnd.fdf",
		"fe_launch": "application/vnd.denovo.fcselayout-link",
		"fg5": "application/vnd.fujitsu.oasysgp",
		"fgd": "application/x-director",
		"fh": "image/x-freehand",
		"fh4": "image/x-freehand",
		"fh5": "image/x-freehand",
		"fh7": "image/x-freehand",
		"fhc": "image/x-freehand",
		"fig": "application/x-xfig",
		"flac": "audio/x-flac",
		"fli": "video/x-fli",
		"flo": "application/vnd.micrografx.flo",
		"flv": "video/x-flv",
		"flw": "application/vnd.kde.kivio",
		"flx": "text/vnd.fmi.flexstor",
		"fly": "text/vnd.fly",
		"fm": "application/vnd.framemaker",
		"fnc": "application/vnd.frogans.fnc",
		"for": "text/x-fortran",
		"fpx": "image/vnd.fpx",
		"frame": "application/vnd.framemaker",
		"fsc": "application/vnd.fsc.weblaunch",
		"fst": "image/vnd.fst",
		"ftc": "application/vnd.fluxtime.clip",
		"fti": "application/vnd.anser-web-funds-transfer-initiation",
		"fvt": "video/vnd.fvt",
		"fxp": "application/vnd.adobe.fxp",
		"fxpl": "application/vnd.adobe.fxp",
		"fzs": "application/vnd.fuzzysheet",
		"g2w": "application/vnd.geoplan",
		"g3": "image/g3fax",
		"g3w": "application/vnd.geospace",
		"gac": "application/vnd.groove-account",
		"gam": "application/x-tads",
		"gbr": "application/rpki-ghostbusters",
		"gca": "application/x-gca-compressed",
		"gdl": "model/vnd.gdl",
		"geo": "application/vnd.dynageo",
		"gex": "application/vnd.geometry-explorer",
		"ggb": "application/vnd.geogebra.file",
		"ggt": "application/vnd.geogebra.tool",
		"ghf": "application/vnd.groove-help",
		"gif": "image/gif",
		"gim": "application/vnd.groove-identity-message",
		"gml": "application/gml+xml",
		"gmx": "application/vnd.gmx",
		"gnumeric": "application/x-gnumeric",
		"gph": "application/vnd.flographit",
		"gpx": "application/gpx+xml",
		"gqf": "application/vnd.grafeq",
		"gqs": "application/vnd.grafeq",
		"gram": "application/srgs",
		"gramps": "application/x-gramps-xml",
		"gre": "application/vnd.geometry-explorer",
		"grv": "application/vnd.groove-injector",
		"grxml": "application/srgs+xml",
		"gsf": "application/x-font-ghostscript",
		"gtar": "application/x-gtar",
		"gtm": "application/vnd.groove-tool-message",
		"gtw": "model/vnd.gtw",
		"gv": "text/vnd.graphviz",
		"gxf": "application/gxf",
		"gxt": "application/vnd.geonext",
		"h": "text/x-c",
		"h261": "video/h261",
		"h263": "video/h263",
		"h264": "video/h264",
		"hal": "application/vnd.hal+xml",
		"hbci": "application/vnd.hbci",
		"hdf": "application/x-hdf",
		"hh": "text/x-c",
		"hlp": "application/winhlp",
		"hpgl": "application/vnd.hp-hpgl",
		"hpid": "application/vnd.hp-hpid",
		"hps": "application/vnd.hp-hps",
		"hqx": "application/mac-binhex40",
		"htke": "application/vnd.kenameaapp",
		"htm": "text/html",
		"html": "text/html",
		"hvd": "application/vnd.yamaha.hv-dic",
		"hvp": "application/vnd.yamaha.hv-voice",
		"hvs": "application/vnd.yamaha.hv-script",
		"i2g": "application/vnd.intergeo",
		"icc": "application/vnd.iccprofile",
		"ice": "x-conference/x-cooltalk",
		"icm": "application/vnd.iccprofile",
		"ico": "image/x-icon",
		"ics": "text/calendar",
		"ief": "image/ief",
		"ifb": "text/calendar",
		"ifm": "application/vnd.shana.informed.formdata",
		"iges": "model/iges",
		"igl": "application/vnd.igloader",
		"igm": "application/vnd.insors.igm",
		"igs": "model/iges",
		"igx": "application/vnd.micrografx.igx",
		"iif": "application/vnd.shana.informed.interchange",
		"imp": "application/vnd.accpac.simply.imp",
		"ims": "application/vnd.ms-ims",
		"in": "text/plain",
		"ink": "application/inkml+xml",
		"inkml": "application/inkml+xml",
		"install": "application/x-install-instructions",
		"iota": "application/vnd.astraea-software.iota",
		"ipfix": "application/ipfix",
		"ipk": "application/vnd.shana.informed.package",
		"irm": "application/vnd.ibm.rights-management",
		"irp": "application/vnd.irepository.package+xml",
		"iso": "application/x-iso9660-image",
		"itp": "application/vnd.shana.informed.formtemplate",
		"ivp": "application/vnd.immervision-ivp",
		"ivu": "application/vnd.immervision-ivu",
		"jad": "text/vnd.sun.j2me.app-descriptor",
		"jam": "application/vnd.jam",
		"jar": "application/java-archive",
		"java": "text/x-java-source",
		"jisp": "application/vnd.jisp",
		"jlt": "application/vnd.hp-jlyt",
		"jnlp": "application/x-java-jnlp-file",
		"joda": "application/vnd.joost.joda-archive",
		"jpe": "image/jpeg",
		"jpeg": "image/jpeg",
		"jpg": "image/jpeg",
		"jpgm": "video/jpm",
		"jpgv": "video/jpeg",
		"jpm": "video/jpm",
		"js": "application/javascript",
		"json": "application/json",
		"jsonml": "application/jsonml+json",
		"kar": "audio/midi",
		"karbon": "application/vnd.kde.karbon",
		"kfo": "application/vnd.kde.kformula",
		"kia": "application/vnd.kidspiration",
		"kml": "application/vnd.google-earth.kml+xml",
		"kmz": "application/vnd.google-earth.kmz",
		"kne": "application/vnd.kinar",
		"knp": "application/vnd.kinar",
		"kon": "application/vnd.kde.kontour",
		"kpr": "application/vnd.kde.kpresenter",
		"kpt": "application/vnd.kde.kpresenter",
		"kpxx": "application/vnd.ds-keypoint",
		"ksp": "application/vnd.kde.kspread",
		"ktr": "application/vnd.kahootz",
		"ktx": "image/ktx",
		"ktz": "application/vnd.kahootz",
		"kwd": "application/vnd.kde.kword",
		"kwt": "application/vnd.kde.kword",
		"lasxml": "application/vnd.las.las+xml",
		"latex": "application/x-latex",
		"lbd": "application/vnd.llamagraphics.life-balance.desktop",
		"lbe": "application/vnd.llamagraphics.life-balance.exchange+xml",
		"les": "application/vnd.hhe.lesson-player",
		"lha": "application/x-lzh-compressed",
		"link66": "application/vnd.route66.link66+xml",
		"list": "text/plain",
		"list3820": "application/vnd.ibm.modcap",
		"listafp": "application/vnd.ibm.modcap",
		"lnk": "application/x-ms-shortcut",
		"log": "text/plain",
		"lostxml": "application/lost+xml",
		"lrf": "application/octet-stream",
		"lrm": "application/vnd.ms-lrm",
		"ltf": "application/vnd.frogans.ltf",
		"lvp": "audio/vnd.lucent.voice",
		"lwp": "application/vnd.lotus-wordpro",
		"lzh": "application/x-lzh-compressed",
		"m13": "application/x-msmediaview",
		"m14": "application/x-msmediaview",
		"m1v": "video/mpeg",
		"m21": "application/mp21",
		"m2a": "audio/mpeg",
		"m2v": "video/mpeg",
		"m3a": "audio/mpeg",
		"m3u": "audio/x-mpegurl",
		"m3u8": "application/vnd.apple.mpegurl",
		"m4u": "video/vnd.mpegurl",
		"m4v": "video/x-m4v",
		"ma": "application/mathematica",
		"mads": "application/mads+xml",
		"mag": "application/vnd.ecowin.chart",
		"maker": "application/vnd.framemaker",
		"man": "text/troff",
		"mar": "application/octet-stream",
		"mathml": "application/mathml+xml",
		"mb": "application/mathematica",
		"mbk": "application/vnd.mobius.mbk",
		"mbox": "application/mbox",
		"mc1": "application/vnd.medcalcdata",
		"mcd": "application/vnd.mcd",
		"mcurl": "text/vnd.curl.mcurl",
		"mdb": "application/x-msaccess",
		"mdi": "image/vnd.ms-modi",
		"me": "text/troff",
		"mesh": "model/mesh",
		"meta4": "application/metalink4+xml",
		"metalink": "application/metalink+xml",
		"mets": "application/mets+xml",
		"mfm": "application/vnd.mfmp",
		"mft": "application/rpki-manifest",
		"mgp": "application/vnd.osgeo.mapguide.package",
		"mgz": "application/vnd.proteus.magazine",
		"mid": "audio/midi",
		"midi": "audio/midi",
		"mie": "application/x-mie",
		"mif": "application/vnd.mif",
		"mime": "message/rfc822",
		"mj2": "video/mj2",
		"mjp2": "video/mj2",
		"mk3d": "video/x-matroska",
		"mka": "audio/x-matroska",
		"mks": "video/x-matroska",
		"mkv": "video/x-matroska",
		"mlp": "application/vnd.dolby.mlp",
		"mmd": "application/vnd.chipnuts.karaoke-mmd",
		"mmf": "application/vnd.smaf",
		"mmr": "image/vnd.fujixerox.edmics-mmr",
		"mng": "video/x-mng",
		"mny": "application/x-msmoney",
		"mobi": "application/x-mobipocket-ebook",
		"mods": "application/mods+xml",
		"mov": "video/quicktime",
		"movie": "video/x-sgi-movie",
		"mp2": "audio/mpeg",
		"mp21": "application/mp21",
		"mp2a": "audio/mpeg",
		"mp3": "audio/mpeg",
		"mp4": "video/mp4",
		"mp4a": "audio/mp4",
		"mp4s": "application/mp4",
		"mp4v": "video/mp4",
		"mpc": "application/vnd.mophun.certificate",
		"mpe": "video/mpeg",
		"mpeg": "video/mpeg",
		"mpg": "video/mpeg",
		"mpg4": "video/mp4",
		"mpga": "audio/mpeg",
		"mpkg": "application/vnd.apple.installer+xml",
		"mpm": "application/vnd.blueice.multipass",
		"mpn": "application/vnd.mophun.application",
		"mpp": "application/vnd.ms-project",
		"mpt": "application/vnd.ms-project",
		"mpy": "application/vnd.ibm.minipay",
		"mqy": "application/vnd.mobius.mqy",
		"mrc": "application/marc",
		"mrcx": "application/marcxml+xml",
		"ms": "text/troff",
		"mscml": "application/mediaservercontrol+xml",
		"mseed": "application/vnd.fdsn.mseed",
		"mseq": "application/vnd.mseq",
		"msf": "application/vnd.epson.msf",
		"msh": "model/mesh",
		"msi": "application/x-msdownload",
		"msl": "application/vnd.mobius.msl",
		"msty": "application/vnd.muvee.style",
		"mts": "model/vnd.mts",
		"mus": "application/vnd.musician",
		"musicxml": "application/vnd.recordare.musicxml+xml",
		"mvb": "application/x-msmediaview",
		"mwf": "application/vnd.mfer",
		"mxf": "application/mxf",
		"mxl": "application/vnd.recordare.musicxml",
		"mxml": "application/xv+xml",
		"mxs": "application/vnd.triscape.mxs",
		"mxu": "video/vnd.mpegurl",
		"n-gage": "application/vnd.nokia.n-gage.symbian.install",
		"n3": "text/n3",
		"nb": "application/mathematica",
		"nbp": "application/vnd.wolfram.player",
		"nc": "application/x-netcdf",
		"ncx": "application/x-dtbncx+xml",
		"nfo": "text/x-nfo",
		"ngdat": "application/vnd.nokia.n-gage.data",
		"nitf": "application/vnd.nitf",
		"nlu": "application/vnd.neurolanguage.nlu",
		"nml": "application/vnd.enliven",
		"nnd": "application/vnd.noblenet-directory",
		"nns": "application/vnd.noblenet-sealer",
		"nnw": "application/vnd.noblenet-web",
		"npx": "image/vnd.net-fpx",
		"nsc": "application/x-conference",
		"nsf": "application/vnd.lotus-notes",
		"ntf": "application/vnd.nitf",
		"nzb": "application/x-nzb",
		"oa2": "application/vnd.fujitsu.oasys2",
		"oa3": "application/vnd.fujitsu.oasys3",
		"oas": "application/vnd.fujitsu.oasys",
		"obd": "application/x-msbinder",
		"obj": "application/x-tgif",
		"oda": "application/oda",
		"odb": "application/vnd.oasis.opendocument.database",
		"odc": "application/vnd.oasis.opendocument.chart",
		"odf": "application/vnd.oasis.opendocument.formula",
		"odft": "application/vnd.oasis.opendocument.formula-template",
		"odg": "application/vnd.oasis.opendocument.graphics",
		"odi": "application/vnd.oasis.opendocument.image",
		"odm": "application/vnd.oasis.opendocument.text-master",
		"odp": "application/vnd.oasis.opendocument.presentation",
		"ods": "application/vnd.oasis.opendocument.spreadsheet",
		"odt": "application/vnd.oasis.opendocument.text",
		"oga": "audio/ogg",
		"ogg": "audio/ogg",
		"ogv": "video/ogg",
		"ogx": "application/ogg",
		"omdoc": "application/omdoc+xml",
		"onepkg": "application/onenote",
		"onetmp": "application/onenote",
		"onetoc": "application/onenote",
		"onetoc2": "application/onenote",
		"opf": "application/oebps-package+xml",
		"opml": "text/x-opml",
		"oprc": "application/vnd.palm",
		"org": "application/vnd.lotus-organizer",
		"osf": "application/vnd.yamaha.openscoreformat",
		"osfpvg": "application/vnd.yamaha.openscoreformat.osfpvg+xml",
		"otc": "application/vnd.oasis.opendocument.chart-template",
		"otf": "application/x-font-otf",
		"otg": "application/vnd.oasis.opendocument.graphics-template",
		"oth": "application/vnd.oasis.opendocument.text-web",
		"oti": "application/vnd.oasis.opendocument.image-template",
		"otp": "application/vnd.oasis.opendocument.presentation-template",
		"ots": "application/vnd.oasis.opendocument.spreadsheet-template",
		"ott": "application/vnd.oasis.opendocument.text-template",
		"oxps": "application/oxps",
		"oxt": "application/vnd.openofficeorg.extension",
		"p": "text/x-pascal",
		"p10": "application/pkcs10",
		"p12": "application/x-pkcs12",
		"p7b": "application/x-pkcs7-certificates",
		"p7c": "application/pkcs7-mime",
		"p7m": "application/pkcs7-mime",
		"p7r": "application/x-pkcs7-certreqresp",
		"p7s": "application/pkcs7-signature",
		"p8": "application/pkcs8",
		"pas": "text/x-pascal",
		"paw": "application/vnd.pawaafile",
		"pbd": "application/vnd.powerbuilder6",
		"pbm": "image/x-portable-bitmap",
		"pcap": "application/vnd.tcpdump.pcap",
		"pcf": "application/x-font-pcf",
		"pcl": "application/vnd.hp-pcl",
		"pclxl": "application/vnd.hp-pclxl",
		"pct": "image/x-pict",
		"pcurl": "application/vnd.curl.pcurl",
		"pcx": "image/x-pcx",
		"pdb": "application/vnd.palm",
		"pdf": "application/pdf",
		"pfa": "application/x-font-type1",
		"pfb": "application/x-font-type1",
		"pfm": "application/x-font-type1",
		"pfr": "application/font-tdpfr",
		"pfx": "application/x-pkcs12",
		"pgm": "image/x-portable-graymap",
		"pgn": "application/x-chess-pgn",
		"pgp": "application/pgp-encrypted",
		"pic": "image/x-pict",
		"pkg": "application/octet-stream",
		"pki": "application/pkixcmp",
		"pkipath": "application/pkix-pkipath",
		"plb": "application/vnd.3gpp.pic-bw-large",
		"plc": "application/vnd.mobius.plc",
		"plf": "application/vnd.pocketlearn",
		"pls": "application/pls+xml",
		"pml": "application/vnd.ctc-posml",
		"png": "image/png",
		"pnm": "image/x-portable-anymap",
		"portpkg": "application/vnd.macports.portpkg",
		"pot": "application/vnd.ms-powerpoint",
		"potm": "application/vnd.ms-powerpoint.template.macroenabled.12",
		"potx": "application/vnd.openxmlformats-officedocument.presentationml.template",
		"ppam": "application/vnd.ms-powerpoint.addin.macroenabled.12",
		"ppd": "application/vnd.cups-ppd",
		"ppm": "image/x-portable-pixmap",
		"pps": "application/vnd.ms-powerpoint",
		"ppsm": "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
		"ppsx": "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
		"ppt": "application/vnd.ms-powerpoint",
		"pptm": "application/vnd.ms-powerpoint.presentation.macroenabled.12",
		"pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
		"pqa": "application/vnd.palm",
		"prc": "application/x-mobipocket-ebook",
		"pre": "application/vnd.lotus-freelance",
		"prf": "application/pics-rules",
		"ps": "application/postscript",
		"psb": "application/vnd.3gpp.pic-bw-small",
		"psd": "image/vnd.adobe.photoshop",
		"psf": "application/x-font-linux-psf",
		"pskcxml": "application/pskc+xml",
		"ptid": "application/vnd.pvi.ptid1",
		"pub": "application/x-mspublisher",
		"pvb": "application/vnd.3gpp.pic-bw-var",
		"pwn": "application/vnd.3m.post-it-notes",
		"pya": "audio/vnd.ms-playready.media.pya",
		"pyv": "video/vnd.ms-playready.media.pyv",
		"qam": "application/vnd.epson.quickanime",
		"qbo": "application/vnd.intu.qbo",
		"qfx": "application/vnd.intu.qfx",
		"qps": "application/vnd.publishare-delta-tree",
		"qt": "video/quicktime",
		"qwd": "application/vnd.quark.quarkxpress",
		"qwt": "application/vnd.quark.quarkxpress",
		"qxb": "application/vnd.quark.quarkxpress",
		"qxd": "application/vnd.quark.quarkxpress",
		"qxl": "application/vnd.quark.quarkxpress",
		"qxt": "application/vnd.quark.quarkxpress",
		"ra": "audio/x-pn-realaudio",
		"ram": "audio/x-pn-realaudio",
		"rar": "application/x-rar-compressed",
		"ras": "image/x-cmu-raster",
		"rcprofile": "application/vnd.ipunplugged.rcprofile",
		"rdf": "application/rdf+xml",
		"rdz": "application/vnd.data-vision.rdz",
		"rep": "application/vnd.businessobjects",
		"res": "application/x-dtbresource+xml",
		"rgb": "image/x-rgb",
		"rif": "application/reginfo+xml",
		"rip": "audio/vnd.rip",
		"ris": "application/x-research-info-systems",
		"rl": "application/resource-lists+xml",
		"rlc": "image/vnd.fujixerox.edmics-rlc",
		"rld": "application/resource-lists-diff+xml",
		"rm": "application/vnd.rn-realmedia",
		"rmi": "audio/midi",
		"rmp": "audio/x-pn-realaudio-plugin",
		"rms": "application/vnd.jcp.javame.midlet-rms",
		"rmvb": "application/vnd.rn-realmedia-vbr",
		"rnc": "application/relax-ng-compact-syntax",
		"roa": "application/rpki-roa",
		"roff": "text/troff",
		"rp9": "application/vnd.cloanto.rp9",
		"rpss": "application/vnd.nokia.radio-presets",
		"rpst": "application/vnd.nokia.radio-preset",
		"rq": "application/sparql-query",
		"rs": "application/rls-services+xml",
		"rsd": "application/rsd+xml",
		"rss": "application/rss+xml",
		"rtf": "application/rtf",
		"rtx": "text/richtext",
		"s": "text/x-asm",
		"s3m": "audio/s3m",
		"saf": "application/vnd.yamaha.smaf-audio",
		"sbml": "application/sbml+xml",
		"sc": "application/vnd.ibm.secure-container",
		"scd": "application/x-msschedule",
		"scm": "application/vnd.lotus-screencam",
		"scq": "application/scvp-cv-request",
		"scs": "application/scvp-cv-response",
		"scurl": "text/vnd.curl.scurl",
		"sda": "application/vnd.stardivision.draw",
		"sdc": "application/vnd.stardivision.calc",
		"sdd": "application/vnd.stardivision.impress",
		"sdkd": "application/vnd.solent.sdkm+xml",
		"sdkm": "application/vnd.solent.sdkm+xml",
		"sdp": "application/sdp",
		"sdw": "application/vnd.stardivision.writer",
		"see": "application/vnd.seemail",
		"seed": "application/vnd.fdsn.seed",
		"sema": "application/vnd.sema",
		"semd": "application/vnd.semd",
		"semf": "application/vnd.semf",
		"ser": "application/java-serialized-object",
		"setpay": "application/set-payment-initiation",
		"setreg": "application/set-registration-initiation",
		"sfd-hdstx": "application/vnd.hydrostatix.sof-data",
		"sfs": "application/vnd.spotfire.sfs",
		"sfv": "text/x-sfv",
		"sgi": "image/sgi",
		"sgl": "application/vnd.stardivision.writer-global",
		"sgm": "text/sgml",
		"sgml": "text/sgml",
		"sh": "application/x-sh",
		"shar": "application/x-shar",
		"shf": "application/shf+xml",
		"sid": "image/x-mrsid-image",
		"sig": "application/pgp-signature",
		"sil": "audio/silk",
		"silo": "model/mesh",
		"sis": "application/vnd.symbian.install",
		"sisx": "application/vnd.symbian.install",
		"sit": "application/x-stuffit",
		"sitx": "application/x-stuffitx",
		"skd": "application/vnd.koan",
		"skm": "application/vnd.koan",
		"skp": "application/vnd.koan",
		"skt": "application/vnd.koan",
		"sldm": "application/vnd.ms-powerpoint.slide.macroenabled.12",
		"sldx": "application/vnd.openxmlformats-officedocument.presentationml.slide",
		"slt": "application/vnd.epson.salt",
		"sm": "application/vnd.stepmania.stepchart",
		"smf": "application/vnd.stardivision.math",
		"smi": "application/smil+xml",
		"smil": "application/smil+xml",
		"smv": "video/x-smv",
		"smzip": "application/vnd.stepmania.package",
		"snd": "audio/basic",
		"snf": "application/x-font-snf",
		"so": "application/octet-stream",
		"spc": "application/x-pkcs7-certificates",
		"spf": "application/vnd.yamaha.smaf-phrase",
		"spl": "application/x-futuresplash",
		"spot": "text/vnd.in3d.spot",
		"spp": "application/scvp-vp-response",
		"spq": "application/scvp-vp-request",
		"spx": "audio/ogg",
		"sql": "application/x-sql",
		"src": "application/x-wais-source",
		"srt": "application/x-subrip",
		"sru": "application/sru+xml",
		"srx": "application/sparql-results+xml",
		"ssdl": "application/ssdl+xml",
		"sse": "application/vnd.kodak-descriptor",
		"ssf": "application/vnd.epson.ssf",
		"ssml": "application/ssml+xml",
		"st": "application/vnd.sailingtracker.track",
		"stc": "application/vnd.sun.xml.calc.template",
		"std": "application/vnd.sun.xml.draw.template",
		"stf": "application/vnd.wt.stf",
		"sti": "application/vnd.sun.xml.impress.template",
		"stk": "application/hyperstudio",
		"stl": "application/vnd.ms-pki.stl",
		"str": "application/vnd.pg.format",
		"stw": "application/vnd.sun.xml.writer.template",
		"sub": "text/vnd.dvb.subtitle",
		"sus": "application/vnd.sus-calendar",
		"susp": "application/vnd.sus-calendar",
		"sv4cpio": "application/x-sv4cpio",
		"sv4crc": "application/x-sv4crc",
		"svc": "application/vnd.dvb.service",
		"svd": "application/vnd.svd",
		"svg": "image/svg+xml",
		"svgz": "image/svg+xml",
		"swa": "application/x-director",
		"swf": "application/x-shockwave-flash",
		"swi": "application/vnd.aristanetworks.swi",
		"sxc": "application/vnd.sun.xml.calc",
		"sxd": "application/vnd.sun.xml.draw",
		"sxg": "application/vnd.sun.xml.writer.global",
		"sxi": "application/vnd.sun.xml.impress",
		"sxm": "application/vnd.sun.xml.math",
		"sxw": "application/vnd.sun.xml.writer",
		"t": "text/troff",
		"t3": "application/x-t3vm-image",
		"taglet": "application/vnd.mynfc",
		"tao": "application/vnd.tao.intent-module-archive",
		"tar": "application/x-tar",
		"tcap": "application/vnd.3gpp2.tcap",
		"tcl": "application/x-tcl",
		"teacher": "application/vnd.smart.teacher",
		"tei": "application/tei+xml",
		"teicorpus": "application/tei+xml",
		"tex": "application/x-tex",
		"texi": "application/x-texinfo",
		"texinfo": "application/x-texinfo",
		"text": "text/plain",
		"tfi": "application/thraud+xml",
		"tfm": "application/x-tex-tfm",
		"tga": "image/x-tga",
		"thmx": "application/vnd.ms-officetheme",
		"tif": "image/tiff",
		"tiff": "image/tiff",
		"tmo": "application/vnd.tmobile-livetv",
		"torrent": "application/x-bittorrent",
		"tpl": "application/vnd.groove-tool-template",
		"tpt": "application/vnd.trid.tpt",
		"tr": "text/troff",
		"tra": "application/vnd.trueapp",
		"trm": "application/x-msterminal",
		"tsd": "application/timestamped-data",
		"tsv": "text/tab-separated-values",
		"ttc": "application/x-font-ttf",
		"ttf": "application/x-font-ttf",
		"ttl": "text/turtle",
		"twd": "application/vnd.simtech-mindmapper",
		"twds": "application/vnd.simtech-mindmapper",
		"txd": "application/vnd.genomatix.tuxedo",
		"txf": "application/vnd.mobius.txf",
		"txt": "text/plain",
		"u32": "application/x-authorware-bin",
		"udeb": "application/x-debian-package",
		"ufd": "application/vnd.ufdl",
		"ufdl": "application/vnd.ufdl",
		"ulx": "application/x-glulx",
		"umj": "application/vnd.umajin",
		"unityweb": "application/vnd.unity",
		"uoml": "application/vnd.uoml+xml",
		"uri": "text/uri-list",
		"uris": "text/uri-list",
		"urls": "text/uri-list",
		"ustar": "application/x-ustar",
		"utz": "application/vnd.uiq.theme",
		"uu": "text/x-uuencode",
		"uva": "audio/vnd.dece.audio",
		"uvd": "application/vnd.dece.data",
		"uvf": "application/vnd.dece.data",
		"uvg": "image/vnd.dece.graphic",
		"uvh": "video/vnd.dece.hd",
		"uvi": "image/vnd.dece.graphic",
		"uvm": "video/vnd.dece.mobile",
		"uvp": "video/vnd.dece.pd",
		"uvs": "video/vnd.dece.sd",
		"uvt": "application/vnd.dece.ttml+xml",
		"uvu": "video/vnd.uvvu.mp4",
		"uvv": "video/vnd.dece.video",
		"uvva": "audio/vnd.dece.audio",
		"uvvd": "application/vnd.dece.data",
		"uvvf": "application/vnd.dece.data",
		"uvvg": "image/vnd.dece.graphic",
		"uvvh": "video/vnd.dece.hd",
		"uvvi": "image/vnd.dece.graphic",
		"uvvm": "video/vnd.dece.mobile",
		"uvvp": "video/vnd.dece.pd",
		"uvvs": "video/vnd.dece.sd",
		"uvvt": "application/vnd.dece.ttml+xml",
		"uvvu": "video/vnd.uvvu.mp4",
		"uvvv": "video/vnd.dece.video",
		"uvvx": "application/vnd.dece.unspecified",
		"uvvz": "application/vnd.dece.zip",
		"uvx": "application/vnd.dece.unspecified",
		"uvz": "application/vnd.dece.zip",
		"vcard": "text/vcard",
		"vcd": "application/x-cdlink",
		"vcf": "text/x-vcard",
		"vcg": "application/vnd.groove-vcard",
		"vcs": "text/x-vcalendar",
		"vcx": "application/vnd.vcx",
		"vis": "application/vnd.visionary",
		"viv": "video/vnd.vivo",
		"vob": "video/x-ms-vob",
		"vor": "application/vnd.stardivision.writer",
		"vox": "application/x-authorware-bin",
		"vrml": "model/vrml",
		"vsd": "application/vnd.visio",
		"vsf": "application/vnd.vsf",
		"vss": "application/vnd.visio",
		"vst": "application/vnd.visio",
		"vsw": "application/vnd.visio",
		"vtu": "model/vnd.vtu",
		"vxml": "application/voicexml+xml",
		"w3d": "application/x-director",
		"wad": "application/x-doom",
		"wav": "audio/x-wav",
		"wax": "audio/x-ms-wax",
		"wbmp": "image/vnd.wap.wbmp",
		"wbs": "application/vnd.criticaltools.wbs+xml",
		"wbxml": "application/vnd.wap.wbxml",
		"wcm": "application/vnd.ms-works",
		"wdb": "application/vnd.ms-works",
		"wdp": "image/vnd.ms-photo",
		"weba": "audio/webm",
		"webm": "video/webm",
		"webp": "image/webp",
		"wg": "application/vnd.pmi.widget",
		"wgt": "application/widget",
		"wks": "application/vnd.ms-works",
		"wm": "video/x-ms-wm",
		"wma": "audio/x-ms-wma",
		"wmd": "application/x-ms-wmd",
		"wmf": "application/x-msmetafile",
		"wml": "text/vnd.wap.wml",
		"wmlc": "application/vnd.wap.wmlc",
		"wmls": "text/vnd.wap.wmlscript",
		"wmlsc": "application/vnd.wap.wmlscriptc",
		"wmv": "video/x-ms-wmv",
		"wmx": "video/x-ms-wmx",
		"wmz": "application/x-msmetafile",
		"woff": "application/x-font-woff",
		"wpd": "application/vnd.wordperfect",
		"wpl": "application/vnd.ms-wpl",
		"wps": "application/vnd.ms-works",
		"wqd": "application/vnd.wqd",
		"wri": "application/x-mswrite",
		"wrl": "model/vrml",
		"wsdl": "application/wsdl+xml",
		"wspolicy": "application/wspolicy+xml",
		"wtb": "application/vnd.webturbo",
		"wvx": "video/x-ms-wvx",
		"x32": "application/x-authorware-bin",
		"x3d": "model/x3d+xml",
		"x3db": "model/x3d+binary",
		"x3dbz": "model/x3d+binary",
		"x3dv": "model/x3d+vrml",
		"x3dvz": "model/x3d+vrml",
		"x3dz": "model/x3d+xml",
		"xaml": "application/xaml+xml",
		"xap": "application/x-silverlight-app",
		"xar": "application/vnd.xara",
		"xbap": "application/x-ms-xbap",
		"xbd": "application/vnd.fujixerox.docuworks.binder",
		"xbm": "image/x-xbitmap",
		"xdf": "application/xcap-diff+xml",
		"xdm": "application/vnd.syncml.dm+xml",
		"xdp": "application/vnd.adobe.xdp+xml",
		"xdssc": "application/dssc+xml",
		"xdw": "application/vnd.fujixerox.docuworks",
		"xenc": "application/xenc+xml",
		"xer": "application/patch-ops-error+xml",
		"xfdf": "application/vnd.adobe.xfdf",
		"xfdl": "application/vnd.xfdl",
		"xht": "application/xhtml+xml",
		"xhtml": "application/xhtml+xml",
		"xhvml": "application/xv+xml",
		"xif": "image/vnd.xiff",
		"xla": "application/vnd.ms-excel",
		"xlam": "application/vnd.ms-excel.addin.macroenabled.12",
		"xlc": "application/vnd.ms-excel",
		"xlf": "application/x-xliff+xml",
		"xlm": "application/vnd.ms-excel",
		"xls": "application/vnd.ms-excel",
		"xlsb": "application/vnd.ms-excel.sheet.binary.macroenabled.12",
		"xlsm": "application/vnd.ms-excel.sheet.macroenabled.12",
		"xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"xlt": "application/vnd.ms-excel",
		"xltm": "application/vnd.ms-excel.template.macroenabled.12",
		"xltx": "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
		"xlw": "application/vnd.ms-excel",
		"xm": "audio/xm",
		"xml": "application/xml",
		"xo": "application/vnd.olpc-sugar",
		"xop": "application/xop+xml",
		"xpi": "application/x-xpinstall",
		"xpl": "application/xproc+xml",
		"xpm": "image/x-xpixmap",
		"xpr": "application/vnd.is-xpr",
		"xps": "application/vnd.ms-xpsdocument",
		"xpw": "application/vnd.intercon.formnet",
		"xpx": "application/vnd.intercon.formnet",
		"xsl": "application/xml",
		"xslt": "application/xslt+xml",
		"xsm": "application/vnd.syncml+xml",
		"xspf": "application/xspf+xml",
		"xul": "application/vnd.mozilla.xul+xml",
		"xvm": "application/xv+xml",
		"xvml": "application/xv+xml",
		"xwd": "image/x-xwindowdump",
		"xyz": "chemical/x-xyz",
		"xz": "application/x-xz",
		"yang": "application/yang",
		"yin": "application/yin+xml",
		"z1": "application/x-zmachine",
		"z2": "application/x-zmachine",
		"z3": "application/x-zmachine",
		"z4": "application/x-zmachine",
		"z5": "application/x-zmachine",
		"z6": "application/x-zmachine",
		"z7": "application/x-zmachine",
		"z8": "application/x-zmachine",
		"zaz": "application/vnd.zzazz.deck+xml",
		"zip": "application/zip",
		"zir": "application/vnd.zul",
		"zirz": "application/vnd.zul",
		"zmm": "application/vnd.handheld-entertainment+xml"
	}
};
},{}],62:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"../SimpleTCP":71,"./FileUtilities":63,"./IPResolver":64,"./MimeService":65,"./SimpleTCPSocket":66,"./SocketSender":67,"./StorageService":68,"./TCPSocket":69,"./UDPSocket":70,"chrome":undefined,"dup":32,"sdk/base64":undefined,"sdk/net/xhr":undefined,"sdk/notifications":undefined,"sdk/simple-storage":undefined,"sdk/tabs":undefined,"sdk/timers":undefined,"sdk/ui/button/action":undefined,"sdk/url":undefined,"sdk/window/utils":undefined}],63:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"../Constants":61,"dup":33}],64:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"../Constants":61,"dup":34}],65:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"../Constants":61,"dup":35}],66:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],67:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"../Constants":61,"dup":37}],68:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"dup":38}],69:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],70:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"dup":40}],71:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"dup":41}],72:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./Chrome/sdk":60,"./Firefox/AddonSdk":62,"dup":42}],73:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"../Constants":85,"dup":19}],74:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"../Constants":85,"dup":20}],75:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"../Constants":85,"dup":21}],76:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],77:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],78:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"../Constants":85,"dup":24}],79:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"../Constants":85,"dup":25}],80:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],81:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"../Constants":85,"dup":27}],82:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"../Constants":85,"dup":28}],83:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],84:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"../SimpleTCP":95,"./FileUtilities":73,"./IPResolver":74,"./MimeService":75,"./Notifications":76,"./SimpleTCPSocket":77,"./SimpleUDPSocket":78,"./SocketSender":79,"./StorageService":80,"./TCPSocket":81,"./UDPSocket":82,"./UrlSdk":83,"dup":30}],85:[function(require,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"dup":61}],86:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"../SimpleTCP":95,"./FileUtilities":87,"./IPResolver":88,"./MimeService":89,"./SimpleTCPSocket":90,"./SocketSender":91,"./StorageService":92,"./TCPSocket":93,"./UDPSocket":94,"chrome":undefined,"dup":32,"sdk/base64":undefined,"sdk/net/xhr":undefined,"sdk/notifications":undefined,"sdk/simple-storage":undefined,"sdk/tabs":undefined,"sdk/timers":undefined,"sdk/ui/button/action":undefined,"sdk/url":undefined,"sdk/window/utils":undefined}],87:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"../Constants":85,"dup":33}],88:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"../Constants":85,"dup":34}],89:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"../Constants":85,"dup":35}],90:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],91:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"../Constants":85,"dup":37}],92:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"dup":38}],93:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],94:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"dup":40}],95:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"dup":41}],96:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./Chrome/sdk":84,"./Firefox/AddonSdk":86,"dup":42}],97:[function(require,module,exports){
"use strict";

module.exports = {
	standardDomainName: {
		type: "schemas-upnp-org",
		id: "upnp-org"
	},
	defaultDeviceTimeoutInSeconds: 900,
	defaultIcon: './data/icons/logo_64.png',
	MatchStickMacAddresses: ['98-3B-16', '02-1A-11'],
	ChromecastMacAddresses: [],
	FireTVStickMacAddresses: [],
	SSDPServiceType: 'upnp:rootdevice', //'ssdp:all'
	uuidRegex: /(?:uuid:)([^:]*)/i,
	MulticastIP: '239.255.255.250',
	MulticastPort: 1900,
	PeerNameResolutionProtocolST: 'urn:microsoft windows peer name resolution protocol: v4:ipv6:linklocal',
	MSearch: 'M-SEARCH * HTTP/1.1\r\n' + 'HOST: {0}:{1}\r\n' + 'ST: {2}\r\n' + 'MAN: "ssdp:discover"\r\n' + 'MX: 2\r\n\r\n',
	ssdp: {
		update: "ssdp:update",
		"new": "ssdp:alive",
		gone: "ssdp:byebye"
	},
	SOAP: {
		ContentType: 'text/xml; charset=utf-8',
		Body: '<?xml version="1.0" encoding="utf-8"?>\n' + '<SOAP-ENV:Envelope SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">' + '<SOAP-ENV:Body>' + '<m:{1} xmlns:m="{0}">' + '{2}' + '</m:{1}>' + '</SOAP-ENV:Body>' + '</SOAP-ENV:Envelope>'
	},
	PreconditionFailed: 412,
	ModelNames: {
		MatchStick: 'MatchStick',
		Chromecast: 'Eureka Dongle',
		Firestick: 'FireTV Stick'
	},
	ServiceTypes: {
		AddressBook: "urn:schemas-upnp-org:service:AddressBook:1",
		AVTransport: 'urn:schemas-upnp-org:service:AVTransport:1',
		AVTransportv2: 'urn:schemas-upnp-org:service:AVTransport:2',
		AVTransportv3: 'urn:schemas-upnp-org:service:AVTransport:3',
		BasicManagement: "urn:schemas-upnp-org:service:BasicManagement:1",
		BasicManagementv2: "urn:schemas-upnp-org:service:BasicManagement:2",
		Calendar: "urn:schemas-upnp-org:service:Calendar:1",
		CallManagement: "urn:schemas-upnp-org:service:CallManagement:1",
		CallManagementv2: "urn:schemas-upnp-org:service:CallManagement:2",
		ConfigurationManagement: "urn:schemas-upnp-org:service:ConfigurationManagement:1",
		ConfigurationManagementv2: "urn:schemas-upnp-org:service:ConfigurationManagement:2",
		ConnectionManager: 'urn:schemas-upnp-org:service:ConnectionManager:1',
		ConnectionManagerv2: 'urn:schemas-upnp-org:service:ConnectionManager:2',
		ConnectionManagerv3: 'urn:schemas-upnp-org:service:ConnectionManager:3',
		ContentDirectory: 'urn:schemas-upnp-org:service:ContentDirectory:1',
		ContentDirectoryv2: 'urn:schemas-upnp-org:service:ContentDirectory:2',
		ContentDirectoryv3: 'urn:schemas-upnp-org:service:ContentDirectory:3',
		ContentDirectoryv4: 'urn:schemas-upnp-org:service:ContentDirectory:4',
		ContentSync: "urn:schemas-upnp-org:service:ContentSync:1",
		Controlvalve: "urn:schemas-upnp-org:service:controlValve:1",
		DataStore: "urn:schemas-upnp-org:service:DataStore:1",
		DeviceProtection: "urn:schemas-upnp-org:service:DeviceProtection:1",
		DeviceSecurity: "urn:schemas-upnp-org:service:DeviceSecurity:1",
		DIALMultiscreen: 'urn:dial-multiscreen-org:service:dial:1',
		DigitalSecurityCameraSettings: "urn:schemas-upnp-org:service:DigitalSecurityCameraSettings:1",
		DigitalSecurityCameraStillImage: "urn:schemas-upnp-org:service:DigitalSecurityCameraStillImage:1",
		DigitalSecurityCameraMotionImage: "urn:schemas-upnp-org:service:DigitalSecurityCameraMotionImage:1",
		Dimming: "urn:schemas-upnp-org:service:DimmingService:1 ",
		EnergyManagement: "urn:schemas-upnp-org:service:EnergyManagement:1",
		ExternalActivity: "urn:schemas-upnp-org:service:ExternalActivity:1",
		FanSpeed: "urn:schemas-upnp-org:service:FanSpeed:1",
		Feeder: "urn:schemas-upnp-org:service:Feeder:1",
		HVACUserOperatingMode: "urn:schemas-upnp-org:service:HVAC_UserOperatingMode:1",
		HVACFanOperatingMode: "urn:schemas-upnp-org:service:HVAC_FanOperatingMode:1",
		HVACSetpointSchedule: "urn:schemas-upnp-org:service:HVAC_SetpointSchedule:1",
		InboundConnectionConfig: "urn:schemas-upnp-org:service:InboundConnectionConfig:1",
		InputConfig: "urn:schemas-upnp-org:service:InputConfig:1",
		IRCC: 'urn:schemas-sony-com:service:IRCC:1',
		LinkAuthentication: "urn:schemas-upnp-org:service:LinkAuthentication:1",
		Layer3Forwarding: 'urn:schemas-upnp-org:service:Layer3Forwarding:1',
		LowPower: "urn:schemas-upnp-org:service:LowerPowerDevice:1",
		MediaManagement: "urn:schemas-upnp-org:service:MediaManagement:1",
		MediaManagementv2: "urn:schemas-upnp-org:service:MediaManagement:2",
		MediaReceiverRegistrar: 'urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1',
		Messaging: "urn:schemas-upnp-org:service:Messaging:1",
		Messagingv2: "urn:schemas-upnp-org:service:Messaging:2",
		MicrosoftWindowsPeerNameResolutionProtocol: 'urn:Microsoft Windows Peer Name Resolution Protocol:v4:IPV6:LinkLocal',
		Party: 'urn:schemas-sony-com:service:Party:1',
		Presence: "urn:schemas-upnp-org:service:Presence:1",
		PrintBasic: "urn:schemas-upnp-org:service:PrintBasic:1",
		PrintEnhancedLayout: "urn:schemas-upnp-org:service:PrintEnhancedLayout:1",
		QoSDevice: "urn:schemas-upnp-org:service:QosDevice:1",
		QoSDevicev2: "urn:schemas-upnp-org:service:QosDevice:2",
		QoSDevicev3: "urn:schemas-upnp-org:service:QosDevice:3",
		QoSManager: "urn:schemas-upnp-org:service:QosManager:1",
		QoSManagerv2: "urn:schemas-upnp-org:service:QosManager:2",
		QoSManagerv3: "urn:schemas-upnp-org:service:QosManager:3",
		QoSPolicyHolder: "urn:schemas-upnp-org:service:QosPolicyHolder:1",
		QoSPolicyHolderv2: "urn:schemas-upnp-org:service:QosPolicyHolder:2",
		QoSPolicyHolderv3: "urn:schemas-upnp-org:service:QosPolicyHolder:3",
		RadiusClient: "urn:schemas-upnp-org:service:RadiusClient:1",
		RemoteAccessDiscoveryAgentSync: "urn:schemas-upnp-org:service:RADASync:1",
		RemoteAccessDiscoveryAgentSyncv2: "urn:schemas-upnp-org:service:RADASync:2",
		RemoteAccessDiscoveryAgentConfig: "urn:schemas-upnp-org:service:RADAConfig:1",
		RemoteAccessDiscoveryAgentConfigv2: "urn:schemas-upnp-org:service:RADAConfig:2",
		RemoteAccessTransportAgentConfig: "urn:schemas-upnp-org:service:RATAConfig:1",
		RemoteUIClient: "urn:schemas-upnp-org:service:RemoteUIClient:1",
		RemoteUIServer: "urn:schemas-upnp-org:service:RemoteUIServer:1",
		RenderingControl: 'urn:schemas-upnp-org:service:RenderingControl:1',
		SamsungMultiscreen: "urn:samsung.com:service:MultiScreenService:1",
		Scan: "urn:schemas-upnp-org:service:Scan:1",
		ScheduledRecording: "urn:schemas-upnp-org:service:ScheduledRecording:1",
		ScheduledRecordingv2: "urn:schemas-upnp-org:service:ScheduledRecording:2",
		SecurityConsole: "urn:schemas-upnp-org:service:SecurityConsole:1",
		SensorTransportGeneic: "urn:schemas-upnp-org:service:SensorTransportGeneric:1",
		SoftwareManagement: "urn:schemas-upnp-org:service:SoftwareManagement:1",
		SoftwareManagementv2: "urn:schemas-upnp-org:service:SoftwareManagement:2",
		SwitchPower: "urn:schemas-upnp-org:service:SwitchPower:1 ",
		TemperatureSensor: "urn:schemas-upnp-org:service:TemperatureSensor:1",
		TemperatureSetpoint: "urn:schmeas-upnp-org:service:TemperatureSetpoint:1",
		TwoWayMotionMotor: "urn:schemas-upnp-org:service:TwoWayMotionMotor:1",
		WANCommonInterfaceConfig: 'urn:schemas-upnp-org:service:WANCommonInterfaceConfig:1',
		WANIPConnection: 'urn:schemas-upnp-org:service:WANIPConnection:1',
		WANPPPConnection: 'urn:schemas-upnp-org:service:WANPPPConnection:1',
		WLANConfiguration: "urn:schemas-upnp-org:service:WLANConfiguration:1",
		WFAWLANConfig: 'urn:schemas-wifialliance-org:service:WFAWLANConfig:1',
		XCIS: 'urn:schemas-sony-com:service:X_CIS:1'
	},
	DeviceTypes: {
		Basic: "urn:schemas-upnp-org:device:Basic:1",
		BinaryLight: "urn:schemas-upnp-org:device:BinaryLight:1",
		DIALMultiscreen: 'urn:dial-multiscreen-org:device:dial:1',
		DigitalSecurityCamera: "urn:schemas-upnp-org:device:DigitalSecurityCamera:1",
		HVAC: "urn:schemas-upnp-org:device:HVAC_System:1",
		HVACZoneThermostat: "urn:schemas-upnp-org:device:HVAC_ZoneThermostat:1",
		InternetGateway: "urn:schemas-upnp-org:device:InternetGatewayDevice:1",
		InternetGatewayv2: "urn:schemas-upnp-org:device:InternetGatewayDevice:2",
		Light: "urn:schemas-upnp-org:device:Light:1",
		ManageableDevice: "urn:schemas-upnp-org:device:ManageableDevice:1",
		ManageableDevicev2: "urn:schemas-upnp-org:device:ManageableDevice:2",
		MediaRenderer: "urn:schemas-upnp-org:device:MediaRenderer:1",
		MediaRendererv2: "urn:schemas-upnp-org:device:MediaRenderer:2",
		MediaRendererv3: "urn:schemas-upnp-org:device:MediaRenderer:3",
		MediaServer: "urn:schemas-upnp-org:device:MediaServer:1",
		MediaServerv2: "urn:schemas-upnp-org:device:MediaServer:2",
		MediaServerv3: "urn:schemas-upnp-org:device:MediaServer:3",
		MediaServerv4: "urn:schemas-upnp-org:device:MediaServer:4",
		Printer: "urn:schemas-upnp-org:device:printer:1",
		RemoteAccessClient: "urn:schemas-upnp-org:device:RAClient:1",
		RemoteAccessDiscoveryAgent: "urn:schemas-upnp-org:device:RADiscoveryAgent:2",
		RemoteAccessServer: "urn:schemas-upnp-org:device:RAServer:1",
		RemoteAccessServerv2: "urn:schemas-upnp-org:device:RAServer:2",
		RemoteUIClient: "urn:schemas-upnp-org:device:RemoteUIClientDevice:1",
		RemoteUIServer: "urn:schemas-upnp-org:device:RemoteUIServerDevice:1",
		Root: 'upnp:rootdevice',
		Scanner: "urn:schemas-upnp-org:device:Scanner:1",
		SensorManagement: "urn:schemas-upnp-org:device:SensorManagement:1",
		SolarProtectionBlind: "urn:schemas-upnp-org:device:SolarProtectionBlind:1",
		TelephonyClient: "urn:schemas-upnp-org:device:TelephonyClient:1",
		TelephonyClientv2: "urn:schemas-upnp-org:device:TelephonyClient:2",
		TelephonyServer: "urn:schemas-upnp-org:device:TelephonyServer:1",
		TelephonyServerv2: "urn:schemas-upnp-org:device:TelephonyServer:2",
		WAN: 'urn:schemas-upnp-org:device:WANDevice:1',
		WANConnection: 'urn:schemas-upnp-org:device:WANConnectionDevice:1',
		WLANAccessPoint: "urn:schemas-upnp-org:device:WLANAccessPointDevice:1",
		WFA: 'urn:schemas-wifialliance-org:device:WFADevice:1'
	}
};
},{}],98:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AllowedValueRange = function AllowedValueRange() {
    _classCallCheck(this, AllowedValueRange);

    this.minimum = null;
    this.maximum = null;
    this.step = null;
};

module.exports = AllowedValueRange;
},{}],99:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Device = function Device() {
      _classCallCheck(this, Device);

      this.address = null; //URL
      this.childDevices = [];
      this.icons = [];
      this.id = null; //device uuid
      this.language = null; //{name:'', code: ''}
      this.macAddress = null;
      this.manufacturer = null; //DeviceManufacturer
      this.model = null; //DeviceModel
      this.name = "";
      //this.playlist = [];
      this.responseHash = null; //md5 of the response.text
      this.serialNumber = "";
      this.services = [];
      this.softwareVersion = null;
      this.ssdpDescription = ""; //URL to xml
      this.state = {};
      this.timezone = null;
      this.type = null; //UPnPExtensionInfo
      this.upc = "";
      this.upnpVersion = null; //UPnPVersion
      this.webPage = ""; //URL to presentationURL
};

module.exports = Device;
},{}],100:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DeviceManufacturer = function DeviceManufacturer() {
    _classCallCheck(this, DeviceManufacturer);

    this.url = null;
    this.name = null;
};

module.exports = DeviceManufacturer;
},{}],101:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DeviceModel = function DeviceModel() {
    _classCallCheck(this, DeviceModel);

    this.url = null;
    this.name = null;
    this.number = null;
    this.description = null;
};

module.exports = DeviceModel;
},{}],102:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Icon = function Icon() {
    _classCallCheck(this, Icon);

    this.mimetype = null;
    this.width = null;
    this.height = null;
    this.depth = null;
    this.url = null;
};

module.exports = Icon;
},{}],103:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServiceArgument = function ServiceArgument() {
    _classCallCheck(this, ServiceArgument);

    this.name = null;
    this.backingProperty = null;
    this.datatype = null;
    this.allowedValues = [];
    this.allowedValueRange = null;
};

module.exports = ServiceArgument;
},{}],104:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServiceMethod = function ServiceMethod() {
    _classCallCheck(this, ServiceMethod);

    this.name = null;
    this.parameters = [];
    this.returnValues = [];
};

module.exports = ServiceMethod;
},{}],105:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ServiceProperty = function ServiceProperty() {
    _classCallCheck(this, ServiceProperty);

    this.datatype = null;
    this.name = null;
    this.defaultValue = null;
    this.evented = false;
    this.allowedValues = [];
    this.allowedValueRange = null;
};

module.exports = ServiceProperty;
},{}],106:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UPnPExtensionInfo = function UPnPExtensionInfo() {
    _classCallCheck(this, UPnPExtensionInfo);

    this.raw = null;
    this.parts = null;
    this.domainName = null;
    this.isStandard = null;
    this.name = null;
    this.type = null;
    this.version = null;
};

module.exports = UPnPExtensionInfo;
},{}],107:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UPnPService = function UPnPService() {
    _classCallCheck(this, UPnPService);

    this.controlUrl = null; //URL
    this.eventSubUrl = null; //URL
    this.scpdUrl = null; //URL
    this.type = null; //UPnPExtensionInfo
    this.upnpVersion = null; //UPnPVersion
    this.responseHash = null; //md5 of the scpd response.text
    this.id = null;
    this.properties = [];
    this.methods = [];
    this.uuid = null;
    this.subscriptionId = null; //id used to unsubscribe and renew subscriptions.  Is returned from the subscribe call.
};

module.exports = UPnPService;
},{}],108:[function(require,module,exports){
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UPnPVersion = function UPnPVersion() {
    _classCallCheck(this, UPnPVersion);

    this.major = null;
    this.minor = null;
};

module.exports = UPnPVersion;
},{}],109:[function(require,module,exports){
/* global Promise */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var UPnPVersion = require('../Entities/UPnPVersion');
var DeviceManufacturer = require('../Entities/DeviceManufacturer');
var DeviceModel = require('../Entities/DeviceModel');
var Icon = require('../Entities/Icon');

var DeviceFactory = (function () {
	function DeviceFactory(xmlParser, urlProvider, md5, upnpServiceFactory, upnpExtensionInfoFactory, xhr, base64Utils) {
		_classCallCheck(this, DeviceFactory);

		this._xmlParser = xmlParser;
		this._urlProvider = urlProvider;
		this._md5 = md5;
		this._upnpServiceFactory = upnpServiceFactory;
		this._upnpExtensionInfoFactory = upnpExtensionInfoFactory;
		this._xhr = xhr;
		this._base64Utils = base64Utils;
	}

	_createClass(DeviceFactory, [{
		key: 'create',
		value: function create(device, responseText, location, fromAddress, serverIP) {
			var _this = this;

			var responseXml = this._xmlParser.parseFromString(responseText);

			var root = this._xmlParser.getElement(responseXml, "root");

			if (!root) throw new Error("Required element 'root' was not found in responseXml");

			var base = this._xmlParser.getText(root, "baseUrl");
			var deviceXml = this._xmlParser.getElement(root, "device");

			if (!deviceXml) throw new Error("Required element 'device' was not found inside 'root' node");

			this._parseDeviceAttributes(device, deviceXml);
			return this._parseDeviceIcons(device, deviceXml, location, base).then(function () {
				var servicesXml = _this._xmlParser.getElements(deviceXml, "serviceList service");

				servicesXml.forEach(function (serviceXml) {
					var serviceInfo = _this._upnpServiceFactory.create(serviceXml, location, base, serverIP);
					device.services.push(serviceInfo);
				});

				device.upnpVersion = new UPnPVersion();
				device.upnpVersion.major = _this._xmlParser.getText(root, "specVersion major");
				device.upnpVersion.minor = _this._xmlParser.getText(root, "specVersion minor");

				device.address = _this._urlProvider.createUrl(base || _this._urlProvider.createUrl(location).origin);
				device.ssdpDescription = _this._urlProvider.createUrl(location);
				device.responseHash = _this._md5(responseText);
				device.fromAddress = fromAddress;
				device.serverIP = serverIP;
			});
		}
	}, {
		key: '_parseDeviceAttributes',
		value: function _parseDeviceAttributes(device, deviceXml) {
			device.serialNumber = this._xmlParser.getText(deviceXml, "serialNumber");
			device.webPage = this._xmlParser.getText(deviceXml, "presentationURL");
			device.name = this._xmlParser.getText(deviceXml, "friendlyName");
			device.id = this._xmlParser.getText(deviceXml, "UDN").replace(/uuid\:/, "");

			device.type = this._upnpExtensionInfoFactory.create(this._xmlParser.getText(deviceXml, "deviceType"));
			device.manufacturer = new DeviceManufacturer();
			device.manufacturer.name = this._xmlParser.getText(deviceXml, "manufacturer");
			device.manufacturer.url = this._xmlParser.getText(deviceXml, "manufacturerURL");
			device.model = new DeviceModel();
			device.model.number = this._xmlParser.getText(deviceXml, "modelNumber");
			device.model.description = this._xmlParser.getText(deviceXml, "modelDescription");
			device.model.name = this._xmlParser.getText(deviceXml, "modelName");
			device.model.url = this._xmlParser.getText(deviceXml, "modelUrl");
			device.upc = this._xmlParser.getText(deviceXml, "UPC");
		}
	}, {
		key: '_parseDeviceIcons',
		value: function _parseDeviceIcons(device, deviceXml, location, base) {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				var iconsXml = _this2._xmlParser.getElements(deviceXml, "iconList icon");
				if (!iconsXml.length) {
					resolve();
				}
				iconsXml.forEach(function (iconXml) {
					var icon = new Icon();
					icon.mimeType = _this2._xmlParser.getText(iconXml, "mimetype");
					icon.width = _this2._xmlParser.getText(iconXml, "width");
					icon.height = _this2._xmlParser.getText(iconXml, "height");
					icon.depth = _this2._xmlParser.getText(iconXml, "depth");
					icon.url = _this2._urlProvider.toUrl(_this2._xmlParser.getText(iconXml, "url"), location, base);
					if (icon.url && icon.url.href) {
						_this2._getImage(icon.url.href, icon.mimeType).then(function (response) {
							icon.base64Image = response;
							device.icons.push(icon);
							resolve();
						});
					} else {
						icon.base64Image = "";
						device.icons.push(icon);
						resolve();
					}
				});
			});
		}

		/*_base64EncodeImage(binaryImage) {
  	let uInt8Array = new Uint8Array(binaryImage);
      let arrayLength = uInt8Array.length;
      let binaryString = new Array(arrayLength);
      while (arrayLength--) {
        binaryString[arrayLength] = String.fromCharCode(uInt8Array[arrayLength]);
      }
      let data = binaryString.join('');
  
      let base64 = window.btoa(data);
      return "data:image/jpeg;base64," + base64;
  }*/
	}, {
		key: '_getImage',
		value: function _getImage(url, mimeType) {
			var _this3 = this;

			return new Promise(function (resolve, reject) {
				var xhr = new _this3._xhr();
				xhr.open('GET', url, true);
				xhr.responseType = 'arraybuffer';
				xhr.onload = function (e) {
					if (e.target.status == 200) {
						var uInt8Array = new Uint8Array(e.target.response);
						var i = uInt8Array.length;
						var binaryString = new Array(i);
						while (i--) {
							binaryString[i] = String.fromCharCode(uInt8Array[i]);
						}
						var base64 = _this3._base64Utils.encode(binaryString.join(''));
						resolve("data:" + mimeType + ";base64," + base64);
					} else {
						reject();
					}
				};
				xhr.send();
			});
		}
	}]);

	return DeviceFactory;
})();

module.exports = DeviceFactory;
},{"../Entities/DeviceManufacturer":100,"../Entities/DeviceModel":101,"../Entities/Icon":102,"../Entities/UPnPVersion":108}],110:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ExecutableServiceMethodFactory = (function () {
    function ExecutableServiceMethodFactory(xmlParser, soapService, parameterValidator) {
        _classCallCheck(this, ExecutableServiceMethodFactory);

        this._xmlParser = xmlParser;
        this._soapService = soapService;
        this._parameterValidator = parameterValidator;
    }

    _createClass(ExecutableServiceMethodFactory, [{
        key: "create",
        value: function create(method, urn) {
            var _this = this;

            if (!method) throw new Error("Argument 'method' cannot be null.");
            if (!urn) throw new Error("Argument 'urn' cannot be null.");

            return function (controlUrl, params) {
                method.parameters.forEach(function (parameter) {
                    return _this._parameterValidator.validate(parameter, params[parameter.name]);
                });

                return _this._soapService.post(controlUrl, urn, method.name, params).then(function (response) {
                    //todo: try to coerce the type using returnValue.datatype
                    var result = {};

                    method.returnValues.forEach(function (returnValue) {
                        if (typeof returnValue.name === "string" && returnValue.name.length > 0) result[returnValue.name] = _this._xmlParser.getText(response.xml, returnValue.name);
                    });

                    result._raw = response.text;
                    return result;
                });
            };
        }
    }]);

    return ExecutableServiceMethodFactory;
})();

module.exports = ExecutableServiceMethodFactory;
},{}],111:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ServiceMethod = require('../Entities/ServiceMethod');
var ServiceArgument = require('../Entities/ServiceArgument');

var ServiceMethodFactory = (function () {
    function ServiceMethodFactory(xmlParser) {
        _classCallCheck(this, ServiceMethodFactory);

        this._xmlParser = xmlParser;
    }

    _createClass(ServiceMethodFactory, [{
        key: 'create',
        value: function create(methodXml, backingProperties) {
            var _this = this;

            var method = new ServiceMethod();
            method.name = this._xmlParser.getText(methodXml, "name");

            var args = this._xmlParser.getElements(methodXml, "argument").map(function (argumentXml) {
                return {
                    name: _this._xmlParser.getText(argumentXml, "name"),
                    direction: _this._xmlParser.getText(argumentXml, "direction"),
                    relatedStateVariable: _this._xmlParser.getText(argumentXml, "relatedStateVariable")
                };
            });
            args.forEach(function (argument) {
                var backingProperty = backingProperties.filter(function (serviceProperty) {
                    return serviceProperty.name === argument.relatedStateVariable;
                })[0];
                var arg = new ServiceArgument();
                arg.name = argument.name;
                arg.backingProperty = backingProperty;
                arg.datatype = backingProperty.datatype;
                arg.allowedValues = backingProperty.allowedValues;
                arg.allowedValueRange = backingProperty.allowedValueRange;

                argument.direction === 'in' ? method.parameters.push(arg) : method.returnValues.push(arg);
            });

            return method;
        }
    }]);

    return ServiceMethodFactory;
})();

module.exports = ServiceMethodFactory;
},{"../Entities/ServiceArgument":103,"../Entities/ServiceMethod":104}],112:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ServiceProperty = require('../Entities/ServiceProperty');
var AllowedValueRange = require('../Entities/AllowedValueRange');

var ServicePropertyFactory = (function () {
    function ServicePropertyFactory(xmlParser) {
        _classCallCheck(this, ServicePropertyFactory);

        this._xmlParser = xmlParser;
    }

    _createClass(ServicePropertyFactory, [{
        key: 'create',
        value: function create(propertyXml) {
            var property = new ServiceProperty();
            property.name = this._xmlParser.getText(propertyXml, "name");
            property.datatype = this._xmlParser.getText(propertyXml, "dataType"); //todo: use the table containing allowed datatypes to better parse this
            property.defaultValue = this._xmlParser.getText(propertyXml, "defaultValue");
            property.evented = this._xmlParser.getAttribute(propertyXml, "sendEvents") === "yes";

            property.allowedValues = this._xmlParser.getElements(propertyXml, "allowedValue").map(function (value) {
                return value.innerHTML;
            });
            property.allowedValueRange = new AllowedValueRange();

            if (this._xmlParser.hasNode(propertyXml, "allowedValueRange")) {
                property.allowedValueRange.minimum = this._xmlParser.getText(propertyXml, "allowedValueRange minimum");
                property.allowedValueRange.maximum = this._xmlParser.getText(propertyXml, "allowedValueRange maximum");
                property.allowedValueRange.step = this._xmlParser.getText(propertyXml, "allowedValueRange step");
            }
            return property;
        }
    }]);

    return ServicePropertyFactory;
})();

module.exports = ServicePropertyFactory;
},{"../Entities/AllowedValueRange":98,"../Entities/ServiceProperty":105}],113:[function(require,module,exports){
"use strict";
var UPnPExtensionInfo = require('../Entities/UPnPExtensionInfo');
var Constants = require('../Constants');

module.exports = {
        create: function create(typeString) {
                /*
                Type of Extension	Standard												Non-Standard
                device type			urn:schemas-upnp-org:device:[deviceType]:[version]		urn:[domain-name]:device:[deviceType]:[version]
                service type 		urn:schemas-upnp-org:service:[serviceType]:[version]	urn:[domain-name]:service:[serviceType]:[version]
                service id 			urn:upnp-org:serviceId:[serviceID]						urn:[domain-name]:serviceId:[serviceID]
                */
                if (!typeString) throw new Error("Argument 'typeString' cannot be null.");

                var parts = typeString.split(":");
                if (parts.length !== 5 && parts.length !== 4) throw new Error("Invalid number of parts.  Must contain either 4 or 5, but had " + parts.length);

                var info = new UPnPExtensionInfo();
                info.parts = parts;
                info.raw = typeString;
                info.domainName = info.parts[1];
                info.type = info.parts[2];
                info.name = info.parts[3];

                if (info.parts.length === 5) {
                        //device type and service type have 5 parts
                        info.isStandard = info.domainName === Constants.standardDomainName.type;
                        info.version = info.parts[4];
                } else if (info.parts.length === 4) {
                        //service id has 4 parts
                        info.isStandard = info.domainName === Constants.standardDomainName.id;
                }

                return info;
        }
};
},{"../Constants":97,"../Entities/UPnPExtensionInfo":106}],114:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var UPnPVersion = require('../Entities/UPnPVersion');
var UPnPService = require('../Entities/UPnPService');

var UPnPServiceFactory = (function () {
				function UPnPServiceFactory(fetch, xmlParser, urlProvider, upnpExtensionInfoFactory, serviceProperyFactory, serviceMethodFactory, serviceExecutor, executableServiceMethodFactory) {
								_classCallCheck(this, UPnPServiceFactory);

								this._fetch = fetch;
								this._xmlParser = xmlParser;
								this._urlProvider = urlProvider;
								this._upnpExtensionInfoFactory = upnpExtensionInfoFactory;
								this._serviceProperyFactory = serviceProperyFactory;
								this._serviceMethodFactory = serviceMethodFactory;
								this._serviceExecutor = serviceExecutor;
								this._executableServiceMethodFactory = executableServiceMethodFactory;
				}

				_createClass(UPnPServiceFactory, [{
								key: 'create',
								value: function create(serviceXml, location, base, serverIP) {
												var _this = this;

												var upnpService = new UPnPService();
												upnpService.controlUrl = this._urlProvider.toUrl(this._xmlParser.getText(serviceXml, "controlURL"), location, base);
												upnpService.eventSubUrl = this._urlProvider.toUrl(this._xmlParser.getText(serviceXml, "eventSubURL"), location, base);
												upnpService.scpdUrl = this._urlProvider.toUrl(this._xmlParser.getText(serviceXml, "SCPDURL"), location, base);
												upnpService.uuid = this._xmlParser.getText(serviceXml, "serviceId").split(":")[3];
												upnpService.id = this._upnpExtensionInfoFactory.create(this._xmlParser.getText(serviceXml, "serviceId"));
												upnpService.type = this._upnpExtensionInfoFactory.create(this._xmlParser.getText(serviceXml, "serviceType"));
												upnpService.serverIP = serverIP;

												if (this._urlProvider.isValidUri(upnpService.scpdUrl)) this._fetch(upnpService.scpdUrl).then(function (response) {
																//todo: take in the current upnpService object as a parameter, and add a hash of the response to said object so I can lazy rebuild it like I do the device
																var responseXml = _this._xmlParser.parseFromString(response._bodyText);
																upnpService.upnpVersion = new UPnPVersion();
																upnpService.upnpVersion.major = _this._xmlParser.getText(responseXml, "specVersion major");
																upnpService.upnpVersion.minor = _this._xmlParser.getText(responseXml, "specVersion minor");

																var propertiesXml = _this._xmlParser.getElements(responseXml, "stateVariable");
																propertiesXml.forEach(function (propertyXml) {
																				return upnpService.properties.push(_this._serviceProperyFactory.create(propertyXml));
																});

																var methodsXml = _this._xmlParser.getElements(responseXml, "action");
																methodsXml.forEach(function (methodXml) {
																				return upnpService.methods.push(_this._serviceMethodFactory.create(methodXml, upnpService.properties));
																});

																var executableService = {};
																upnpService.methods.forEach(function (method) {
																				return executableService[method.name] = _this._executableServiceMethodFactory.create(method, upnpService.type.raw);
																});
																_this._serviceExecutor.executableServices[upnpService.uuid] = executableService;

																return upnpService;
												});

												return upnpService;
								}
				}]);

				return UPnPServiceFactory;
})();

module.exports = UPnPServiceFactory;
},{"../Entities/UPnPService":107,"../Entities/UPnPVersion":108}],115:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Constants = require('../Constants');

var _require = require('omniscience-utilities');

var Eventable = _require.Eventable;

var ActiveSearcher = (function (_Eventable) {
	_inherits(ActiveSearcher, _Eventable);

	function ActiveSearcher(ssdpClients) {
		_classCallCheck(this, ActiveSearcher);

		_get(Object.getPrototypeOf(ActiveSearcher.prototype), 'constructor', this).call(this);
		this._ssdpClients = ssdpClients;
		this._isInitialized = false;
	}

	//todo: I think there is a way to merge the active and passive searchers. Have them simply take in a list of active ssdpclients and passive ssdpclients
	//the messageReceived function is different - don't forget
	//I could then move the bulk of the initializessdpclients somewhere else, the bigger problem is that if I move it back to ssdpclient it will be harder to test

	_createClass(ActiveSearcher, [{
		key: 'search',
		value: function search() {
			if (!this._isInitialized) this._initializeSSDPClients();

			this._ssdpClients.forEach(function (ssdpClient) {
				return ssdpClient.search(Constants.SSDPServiceType);
			});
		}
	}, {
		key: 'stop',
		value: function stop() {
			this._ssdpClients.forEach(function (ssdpClient) {
				return ssdpClient.stop();
			});
		}
	}, {
		key: '_initializeSSDPClients',
		value: function _initializeSSDPClients() {
			var _this = this;

			this._ssdpClients.forEach(function (ssdpClient) {
				ssdpClient.initialize();
				ssdpClient.on('error', function (error) {
					return _this._error(error);
				});
				ssdpClient.on('messageReceived', function (headers) {
					if (headers["st"] === Constants.PeerNameResolutionProtocolST) return; //this is a Microsoft thing to resolve names on ipv6 networks and in this case just causes problems

					_this.emit("found", headers);
				});
			});
			this._isInitialized = true;
		}
	}, {
		key: '_error',
		value: function _error(error) {
			console.error(error);
		}
	}]);

	return ActiveSearcher;
})(Eventable);

module.exports = ActiveSearcher;
},{"../Constants":97,"omniscience-utilities":156}],116:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Constants = require('../Constants');

var _require = require('omniscience-utilities');

var Eventable = _require.Eventable;

var DeviceLocator = (function (_Eventable) {
	_inherits(DeviceLocator, _Eventable);

	function DeviceLocator(timer, fetch, activeSearcher, passiveSearcher, xmlParser, simpleTCP, urlProvider) {
		_classCallCheck(this, DeviceLocator);

		_get(Object.getPrototypeOf(DeviceLocator.prototype), 'constructor', this).call(this);
		this._timer = timer;
		this._fetch = fetch;
		this._activeSearcher = activeSearcher;
		this._passiveSearcher = passiveSearcher;
		this._xmlParser = xmlParser;
		this._simpleTCP = simpleTCP;
		this._urlProvider = urlProvider;

		this.debounceTimeout = 15000;
		this._deviceTimeouts = {};
		this._deviceLastResponses = {};

		this._isInitialized = false;
	}

	_createClass(DeviceLocator, [{
		key: '_initializeSearchers',
		value: function _initializeSearchers() {
			var _this = this;

			this._activeSearcher.on("found", function (headers, ignoreDebounce) {
				return _this._deviceFound(headers, ignoreDebounce);
			});
			this._passiveSearcher.on("found", function (headers, ignoreDebounce) {
				return _this._deviceFound(headers, ignoreDebounce);
			});
			this._passiveSearcher.on("lost", function (headers) {
				return _this.emit("deviceLost", headers.usn.split("::")[0]);
			});
			this._passiveSearcher.listen();

			this._isInitialized = true;
		}
	}, {
		key: 'search',
		value: function search(devices) {
			var _this2 = this;

			if (!this._isInitialized) this._initializeSearchers();

			devices.forEach(function (device) {
				_this2._checkForLostDevice(device.ssdpDescription, device.id, false).then(function (found) {
					if (!found) {
						delete _this2._deviceLastResponses[device.id];
						_this2.emit("deviceLost", device.id);
					}
				});
			});

			this._activeSearcher.search();
		}
	}, {
		key: 'stop',
		value: function stop() {
			this._activeSearcher.stop();
			this._passiveSearcher.stop();
		}
	}, {
		key: '_deviceFound',
		value: function _deviceFound(headers, ignoreDebounce) {
			var _this3 = this;

			var id = Constants.uuidRegex.exec(headers.usn)[1];

			if (this._deviceTimeouts.hasOwnProperty(id)) this._timer.clearTimeout(this._deviceTimeouts[id]);

			var waitTimeInSeconds = Constants.defaultDeviceTimeoutInSeconds;

			if (headers.hasOwnProperty("cache-control")) waitTimeInSeconds = headers["cache-control"].split("=")[1];

			this._deviceTimeouts[id] = this._timer.setTimeout(function () {
				_this3._checkForLostDevice(_this3._urlProvider.toUrl(headers.location), id).then(function (found) {
					if (!found) {
						delete _this3._deviceLastResponses[id];
						_this3.emit("deviceLost", id);
					} else {
						_this3._deviceFound(headers, true);
					}
				});
			}, waitTimeInSeconds * 1000);

			var lastResponse = this._deviceLastResponses[id];
			var currentTime = Date.now();
			if (lastResponse && lastResponse + this.debounceTimeout < currentTime || ignoreDebounce || !lastResponse) {
				this._deviceLastResponses[id] = currentTime;
				this.emit('deviceFound', id, headers.location, headers.fromAddress, headers.serverIP);
			}
		}
	}, {
		key: '_checkForLostDevice',
		value: function _checkForLostDevice(location, id) {
			var _this4 = this;

			return this._simpleTCP.ping(location.hostname, location.port).then(function (deviceFound) {
				if (!deviceFound) return false;

				return _this4._fetch(location).then(function (response) {
					if (!response.ok) return false;else {
						var responseXml = _this4._xmlParser.parseFromString(response._bodyText);
						var deviceIdElements = _this4._xmlParser.getElements(responseXml, "UDN");
						return deviceIdElements.some(function (deviceIdElement) {
							return id === deviceIdElement.innerHTML.replace("uuid:", "");
						});
						//check the xml to make sure what we got back has the same id as what we were looking for --my matchstick gets a new ip on each boot
						//also make sure to check against all UDN elements as sub devices will have their own and we don't know what we are looking for
					}
				}, function (err) {
					return false;
				}); /*error occured while trying to ping device, consider lost.*/
			});
		}
	}]);

	return DeviceLocator;
})(Eventable);

module.exports = DeviceLocator;
},{"../Constants":97,"omniscience-utilities":156}],117:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Constants = require('../Constants');

var _require = require('omniscience-utilities');

var Eventable = _require.Eventable;

var PassiveSearcher = (function (_Eventable) {
	_inherits(PassiveSearcher, _Eventable);

	function PassiveSearcher(ssdpClients) {
		_classCallCheck(this, PassiveSearcher);

		_get(Object.getPrototypeOf(PassiveSearcher.prototype), 'constructor', this).call(this);
		this._ssdpClients = ssdpClients;
		this._isInitialized = false;
	}

	_createClass(PassiveSearcher, [{
		key: 'listen',
		value: function listen() {
			if (!this._isInitialized) this._initializeSSDPClients();
		}
	}, {
		key: 'stop',
		value: function stop() {
			this._ssdpClients.forEach(function (ssdpClient) {
				return ssdpClient.stop();
			});
		}
	}, {
		key: '_initializeSSDPClients',
		value: function _initializeSSDPClients() {
			var _this = this;

			this._ssdpClients.forEach(function (ssdpClient) {
				ssdpClient.initialize();
				ssdpClient.on('error', function (error) {
					return _this._error(error);
				});
				ssdpClient.on('messageReceived', function (headers) {
					if (headers.st === Constants.PeerNameResolutionProtocolST) return; //this is a Microsoft thing to resolve names on ipv6 networks and in this case just causes problems

					var nts = (headers.nts || "").toLowerCase();

					if (nts === Constants.ssdp.update || nts === Constants.ssdp['new']) _this.emit("found", headers, nts === Constants.ssdp.update);else if (nts === Constants.ssdp.gone) _this.emit("lost", headers);
				});
			});
			this._isInitialized = true;
		}
	}, {
		key: '_error',
		value: function _error(error) {
			console.log(error);
		}
	}]);

	return PassiveSearcher;
})(Eventable);

module.exports = PassiveSearcher;
},{"../Constants":97,"omniscience-utilities":156}],118:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Constants = require('../Constants');

var _require = require('omniscience-utilities');

var Eventable = _require.Eventable;

var SSDPClient = (function (_Eventable) {
	_inherits(SSDPClient, _Eventable);

	function SSDPClient(stringUtils, udpSocket) {
		_classCallCheck(this, SSDPClient);

		_get(Object.getPrototypeOf(SSDPClient.prototype), 'constructor', this).call(this);
		this._socket = udpSocket;
		this._stringUtils = stringUtils;
	}

	/**
  * Simple Service Discovery Protocol
  * DLNA, and DIAL are built on top of this
  */

	_createClass(SSDPClient, [{
		key: 'initialize',
		value: function initialize() {
			var _this = this;

			this._socket.onStopListeningEvent(function (status) {
				return _this.emit('close', status);
			});
			this._socket.onPacketReceivedEvent(function (message) {
				var messageData = typeof message.data === "string" ? message.data : _this._toString(message.data);
				var headers = _this._parseHeaders(messageData);
				headers.fromAddress = message.fromAddr.address + ":" + message.fromAddr.port;
				headers.serverIP = _this._socket.localIP;
				_this.emit('messageReceived', headers);
			});
		}
	}, {
		key: 'search',
		value: function search(service) {
			var searchText = this._stringUtils.format(Constants.MSearch, Constants.MulticastIP, Constants.MulticastPort, service);
			var message = new Uint8Array([].map.call(searchText, function (i) {
				return i.charCodeAt(0);
			}));
			this._socket.send(Constants.MulticastIP, Constants.MulticastPort, message);
		}
	}, {
		key: 'stop',
		value: function stop() {
			this._socket.close();
		}
	}, {
		key: '_parseHeaders',
		value: function _parseHeaders(headerString) {
			//todo: move this to another file, it doesnt belong here
			var headers = {};
			headerString.split("\r\n").forEach(function (x) {
				if (!x || x.indexOf(":") === -1) return;
				var colon = x.indexOf(":");
				headers[x.substring(0, colon).toLowerCase()] = x.substring(colon + 1).trim();
			});
			return headers;
		}
	}, {
		key: '_toString',
		value: function _toString(arrayBuffer) {
			var results = [];
			var uint8Array = new Uint8Array(arrayBuffer);

			for (var i = 0, _length = uint8Array.length; i < _length; i += 200000) {
				//todo: figure out what this 200000 means, then move to constants
				results.push(String.fromCharCode.apply(String, _toConsumableArray(uint8Array.subarray(i, i + 200000))));
			}return results.join('');
		}
	}]);

	return SSDPClient;
})(Eventable);

module.exports = SSDPClient;
},{"../Constants":97,"omniscience-utilities":156}],119:[function(require,module,exports){
/* global Promise */
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Constants = require('../Constants');

var _require = require('omniscience-utilities');

var Eventable = _require.Eventable;

var Device = require('../Entities/Device');

var DeviceService = (function (_Eventable) {
	_inherits(DeviceService, _Eventable);

	function DeviceService(deviceFactory, deviceLocator, storageService, notifications, fetch, md5) {
		_classCallCheck(this, DeviceService);

		_get(Object.getPrototypeOf(DeviceService.prototype), 'constructor', this).call(this);
		this._deviceFactory = deviceFactory;
		this._storageService = storageService;
		this._deviceLocator = deviceLocator;
		this._notifications = notifications;
		this._fetch = fetch;
		this._md5 = md5;
		this._isInitialized = false;

		this.devices = [];
		/* todo: this is now a race condition full of problems
   * what if we execute a search before we resolve the promise?
   */
		this._storageService.get("devices").then(function (devices) {
			/*this.devices = devices || [];*/
		});
	}

	_createClass(DeviceService, [{
		key: 'loadDevices',
		value: function loadDevices() {
			var _this = this;

			this.devices.forEach(function (device) {
				return _this.emit('deviceFound', device);
			});
		}
	}, {
		key: 'stop',
		value: function stop() {
			this._deviceLocator.stop();
		}
	}, {
		key: 'search',
		value: function search() {
			var _this2 = this;

			if (!this._isInitialized) {
				this._deviceLocator.on("deviceFound", function (id, location, fromAddress, serverIP) {
					if (location.toLowerCase().indexOf("http") !== 0) location = "http://" + location; //Microsoft special
					_this2._fetch(location).then(function (response) {
						var deviceXml = response._bodyText;
						var deviceResponseHash = _this2._md5(deviceXml);
						var device = _this2.devices.filter(function (device) {
							return device.id === id;
						})[0];

						if (!device || deviceResponseHash !== device.responseHash && device.fromAddress === fromAddress) {
							/* for devices that show up on multiple network interfaces, their response hashes will be different, and their fromAddresses will also be different
        * don't rebuild if it is simply the same device on a different network interface
        */
							device = device || new Device();

							try {
								_this2._deviceFactory.create(device, deviceXml, location, fromAddress, serverIP).then(function () {
									_this2._addDevice(device);
								});
							} catch (err) {
								console.log(err);
							}
							/*todo: either root node or device node were missing.  probably log a warning/error to the console.*/
						}
					});
				});
				this._deviceLocator.on("deviceLost", function (id) {
					return _this2._removeDevice(id);
				});
				this._isInitialized = true;
			}

			this._deviceLocator.search(this.devices);
		}
	}, {
		key: '_removeDevice',
		value: function _removeDevice(id) {
			for (var i = 0; i < this.devices.length; i++) {
				if (this.devices[i].id === id) {
					var lostDevice = this.devices.splice(i, 1)[0];
					this.emit("deviceLost", lostDevice);
					this._saveDeviceList();
					return;
				}
			}
		}
	}, {
		key: '_addDevice',
		value: function _addDevice(device) {
			var isNew = this.devices.every(function (existingDevice) {
				return existingDevice.id !== device.id;
			});
			if (isNew) {
				this.devices.push(device);
				this._notifications.notify({
					title: 'Found ' + device.name,
					text: "a " + device.model.name + " by " + device.manufacturer.name,
					iconURL: device.icons.length > 0 && device.icons[0].base64Image ? device.icons[0].base64Image : Constants.defaultIcon
				});
			}
			this._saveDeviceList();
			this.emit('deviceFound', device);
		}
	}, {
		key: '_saveDeviceList',
		value: function _saveDeviceList() {
			this._storageService.set("devices", this.devices);
		}
	}]);

	return DeviceService;
})(Eventable);

module.exports = DeviceService;
},{"../Constants":97,"../Entities/Device":99,"omniscience-utilities":156}],120:[function(require,module,exports){
"use strict";
module.exports = {
	validate: function validate(validationInfo, parameter) {
		//todo: validate datatype as well
		//todo: make a test that checks for false and 0 should work
		if (parameter == null) throw new Error("Missing required argument: " + validationInfo.name);

		if (validationInfo.allowedValues.length > 0 && validationInfo.allowedValues.every(function (allowedValue) {
			return allowedValue != parameter;
		})) throw new Error("Value '" + parameter + "' for argument '" + validationInfo.name + "' is not an allowed value");
		if (validationInfo.allowedValueRange.maximum != null && validationInfo.allowedValueRange.minimum != null && validationInfo.allowedValueRange.step != null) {
			var paramNum = Number(parameter);
			if (isNaN(paramNum)) throw new Error("Argument '" + validationInfo.name + "' is required to be a type of number but was instead a type of " + typeof parameter);
			if (paramNum < Number(validationInfo.allowedValueRange.minimum)) throw new Error("Argument '" + validationInfo.name + "' is '" + parameter + "', which is less than the minimum allowed value of '" + validationInfo.allowedValueRange.minimum + "'");
			if (paramNum > Number(validationInfo.allowedValueRange.maximum)) throw new Error("Argument '" + validationInfo.name + "' is '" + parameter + "', which is greater than the maximum allowed value of '" + validationInfo.allowedValueRange.maximum + "'");
			if ((paramNum - Number(validationInfo.allowedValueRange.minimum)) % Number(validationInfo.allowedValueRange.step) !== 0) throw new Error("Argument '" + validationInfo.name + "' is '" + parameter + "', but must be a multiple of '" + validationInfo.allowedValueRange.step + "' starting at " + validationInfo.allowedValueRange.minimum);
		}
	}
};
},{}],121:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Constants = require('../Constants');

var SOAPService = (function () {
    function SOAPService(fetch, xmlParser, stringUtilities) {
        _classCallCheck(this, SOAPService);

        this._fetch = fetch;
        this._xmlParser = xmlParser;
        this._stringUtilities = stringUtilities;
    }

    _createClass(SOAPService, [{
        key: 'post',
        value: function post(url, serviceName, methodName, parameters) {
            var _this = this;

            return this._fetch(url, {
                headers: {
                    SOAPAction: '"' + serviceName + '#' + methodName + '"',
                    'content-Type': Constants.SOAP.ContentType
                },
                method: 'post',
                body: this._stringUtilities.format(Constants.SOAP.Body, serviceName, methodName, this.parametersToXml(parameters))
            }).then(function (response) {
                var responseText = response._bodyText;
                var responseXML = _this._xmlParser.parseFromString(responseText);
                return { xml: responseXML, text: responseText };
            });
        }
    }, {
        key: 'parametersToXml',
        value: function parametersToXml(parameters) {
            var xml = '';
            for (var parameterKey in parameters) {
                if (parameters.hasOwnProperty(parameterKey)) xml += '<' + parameterKey + '>' + parameters[parameterKey] + '</' + parameterKey + '>';
            }return xml;
        }
    }]);

    return SOAPService;
})();

module.exports = SOAPService;
},{"../Constants":97}],122:[function(require,module,exports){
"use strict";
var ServiceExecutor = {
        executableServices: {},
        callService: function callService(serviceControlUrl, serviceUUID, serviceMethod, data) {
                if (!serviceControlUrl) throw new Error("Argument 'serviceControlUrl' cannot be null.");
                if (!serviceUUID) throw new Error("Argument 'serviceUUID' cannot be null.");
                if (!serviceMethod) throw new Error("Argument 'serviceMethod' cannot be null.");

                var serviceClass = ServiceExecutor.executableServices[serviceUUID];
                if (!serviceClass) throw new Error("Executable Service has not yet been created.");

                var serviceFunc = serviceClass[serviceMethod];
                if (typeof serviceFunc !== "function") throw new Error("Executable Service has been created, but method has not.");

                return serviceFunc(serviceControlUrl, data);
        }
};

module.exports = ServiceExecutor;
},{}],123:[function(require,module,exports){
"use strict";
/* global Promise */

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Constants = require('../Constants');

var SubscriptionService = (function () {
	function SubscriptionService(fetch) {
		_classCallCheck(this, SubscriptionService);

		this._fetch = fetch;
	}

	_createClass(SubscriptionService, [{
		key: "subscribe",
		value: function subscribe(directResponsesTo, subscriptionUrl, timeoutInSeconds, subscriptionId) {
			var _this = this;

			if (!directResponsesTo) return Promise.reject("Argument 'directResponsesTo' cannot be null.");
			if (!subscriptionUrl) return Promise.reject("Argument 'subscriptionUrl' cannot be null.");
			if (!timeoutInSeconds) return Promise.reject("Argument 'timeoutInSeconds' cannot be null.");

			var headers = undefined;
			if (subscriptionId) {
				headers = {
					TIMEOUT: "Second-" + timeoutInSeconds,
					SID: subscriptionId
				};
			} else {
				headers = {
					CALLBACK: "<" + directResponsesTo + ">",
					TIMEOUT: "Second-" + timeoutInSeconds,
					NT: "upnp:event"
				};
			}
			return this._fetch(subscriptionUrl, {
				method: 'SUBSCRIBE',
				headers: headers
			}).then(function (response) {
				subscriptionId = (response.headers.get('sid') || "").replace("uuid:", "");
				if (!response.ok) {
					//handle 405 method not allowed
					if (response.status == Constants.PreconditionFailed) {
						//we didn't respond within the timeout so we need to send again
						//todo: add a max number of retries
						subscriptionId = null;
						console.log("subscription timed out, trying again.");
						return _this.subscribe(directResponsesTo, subscriptionUrl, timeoutInSeconds, subscriptionId);
					} else return Promise.reject("Subscription at address: " + subscriptionUrl + " failed. Status code " + response.status);
				}
				return subscriptionId;
			}, function (err) {
				console.log("error the output was not parsable");
				console.log(err);
			});
		}
	}, {
		key: "unsubscribe",
		value: function unsubscribe(subscriptionUrl, subscriptionId) {
			if (!subscriptionUrl) return Promise.reject("Argument 'subscriptionUrl' cannot be null.");
			if (!subscriptionId) return Promise.reject("Argument 'subscriptionId' cannot be null.");

			return this._fetch(subscriptionUrl, { method: 'UNSUBSCRIBE', headers: { SID: subscriptionId } });
		}
	}]);

	return SubscriptionService;
})();

module.exports = SubscriptionService;
},{"../Constants":97}],124:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var XmlParser = (function () {
	function XmlParser(domParser) {
		_classCallCheck(this, XmlParser);

		this._domParser = domParser;
	}

	//todo: make this into a singleton

	_createClass(XmlParser, [{
		key: "parseFromString",
		value: function parseFromString(stringOfXml) {
			return typeof stringOfXml === "string" ? this._domParser.parseFromString(stringOfXml, 'text/xml') : null;
		}
	}, {
		key: "getElements",
		value: function getElements(xml, selector) {
			return xml && typeof xml.querySelectorAll === "function" ? Array.prototype.slice.call(xml.querySelectorAll(selector)) : [];
		}
	}, {
		key: "getElement",
		value: function getElement(xml, selector) {
			return xml && typeof xml.querySelector === "function" ? xml.querySelector(selector) : null;
		}
	}, {
		key: "hasNode",
		value: function hasNode(xml, selector) {
			return xml && typeof xml.querySelector === "function" ? xml.querySelector(selector) != null : false;
		}
	}, {
		key: "getText",
		value: function getText(xml, selector) {
			return xml && typeof xml.querySelector === "function" ? (xml.querySelector(selector) || { innerHTML: null }).innerHTML : null;
		}
	}, {
		key: "getAttribute",
		value: function getAttribute(node, attributeName) {
			var attribute = node.attributes.getNamedItem(attributeName);
			return attribute ? attribute.value : null;
		}
	}]);

	return XmlParser;
})();

module.exports = XmlParser;
},{}],125:[function(require,module,exports){
"use strict";

module.exports.format = function format(stringToFormat) {
    //a string.format like function
    var args = Array.prototype.slice.call(arguments, 1);
    return stringToFormat.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] !== 'undefined' ? args[number] : match;
    });
};
},{}],126:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Constants = require('./Constants');
var XmlParser = require('./Services/XmlParser');
var SSDPClient = require('./Searcher/SSDPClient');
var StringUtils = require('./StringUtilities');
var SOAPService = require('./Services/SOAPService');
var DeviceService = require('./Services/DeviceService');
var DeviceLocator = require('./Searcher/DeviceLocator');
var DeviceFactory = require('./Factories/DeviceFactory');
var ActiveSearcher = require('./Searcher/ActiveSearcher');
var ServiceExecutor = require('./Services/ServiceExecutor');
var PassiveSearcher = require('./Searcher/PassiveSearcher');
var ParameterValidator = require('./Services/ParameterValidator');
var UPnPServiceFactory = require('./Factories/UPnPServiceFactory');
var SubscriptionService = require('./Services/SubscriptionService');
var ServiceMethodFactory = require('./Factories/ServiceMethodFactory');
var ServicePropertyFactory = require('./Factories/ServicePropertyFactory');
var UPnPExtensionInfoFactory = require('./Factories/UPnPExtensionInfoFactory');
var ExecutableServiceMethodFactory = require('./Factories/ExecutableServiceMethodFactory');
//const AccessPointSearcher = require('./Searcher/AccessPointSearcher'); //todo: add this back in

var _require = require('omniscience-utilities');

var Utilities = _require.Utilities;

var SdkResolver = require("omniscience-sdk-resolver");

var UPnP = (function () {
	function UPnP() {
		_classCallCheck(this, UPnP);

		this._sdk = new SdkResolver().resolve();
		this._utilities = new Utilities();
	}

	_createClass(UPnP, [{
		key: 'createDeviceService',
		value: function createDeviceService() {
			var _this = this;

			return this.createDeviceLocator().then(function (deviceLocator) {
				return new DeviceService(new DeviceFactory(new XmlParser(_this._sdk.createDomParser()), _this._utilities.createUrlProvider(), _this._utilities.MD5(), new UPnPServiceFactory(_this._utilities.fetch(), new XmlParser(_this._sdk.createDomParser()), _this._utilities.createUrlProvider(), UPnPExtensionInfoFactory, new ServicePropertyFactory(new XmlParser(_this._sdk.createDomParser())), new ServiceMethodFactory(new XmlParser(_this._sdk.createDomParser())), ServiceExecutor, new ExecutableServiceMethodFactory(new XmlParser(_this._sdk.createDomParser()), new SOAPService(_this._utilities.fetch(), new XmlParser(_this._sdk.createDomParser()), StringUtils), ParameterValidator)), UPnPExtensionInfoFactory, _this._sdk.XMLHttpRequest(), _this._sdk.createBase64Utils()), deviceLocator, _this._sdk.createStorageService(), _this._sdk.notifications(), _this._utilities.fetch(), _this._utilities.MD5());
			});
		}
	}, {
		key: 'createSubscriptionService',
		value: function createSubscriptionService() {
			return new SubscriptionService(this._utilities.fetch());
		}
	}, {
		key: 'getServiceExecutor',
		value: function getServiceExecutor() {
			return ServiceExecutor;
		}
	}, {
		key: 'createDeviceLocator',
		value: function createDeviceLocator() {
			var _this2 = this;

			return this._sdk.createIPResolver().resolveIPs().then(function (ipAddresses) {
				return new DeviceLocator(_this2._sdk.timers(), _this2._utilities.fetch(), new ActiveSearcher(_this2.createSSDPClients(ipAddresses)), new PassiveSearcher(_this2.createSSDPClients(ipAddresses, Constants.MulticastPort)), new XmlParser(_this2._sdk.createDomParser()), _this2._sdk.createSimpleTCP(), _this2._utilities.createUrlProvider());
			});
		}
	}, {
		key: 'createSSDPClients',
		value: function createSSDPClients(ipAddresses, sourcePort) {
			var _this3 = this;

			return ipAddresses.map(function (ipAddress) {
				try {
					var socket = _this3._sdk.createUDPSocket();
					socket.init(sourcePort, ipAddress, Constants.MulticastIP);
					var ssdpClient = new SSDPClient(StringUtils, socket);
					return ssdpClient;
				} catch (error) {
					console.log(error);
				}
			}).filter(function (ssdpClient) {
				return ssdpClient;
			});
		}
	}]);

	return UPnP;
})();

module.exports = UPnP;
},{"./Constants":97,"./Factories/DeviceFactory":109,"./Factories/ExecutableServiceMethodFactory":110,"./Factories/ServiceMethodFactory":111,"./Factories/ServicePropertyFactory":112,"./Factories/UPnPExtensionInfoFactory":113,"./Factories/UPnPServiceFactory":114,"./Searcher/ActiveSearcher":115,"./Searcher/DeviceLocator":116,"./Searcher/PassiveSearcher":117,"./Searcher/SSDPClient":118,"./Services/DeviceService":119,"./Services/ParameterValidator":120,"./Services/SOAPService":121,"./Services/ServiceExecutor":122,"./Services/SubscriptionService":123,"./Services/XmlParser":124,"./StringUtilities":125,"omniscience-sdk-resolver":150,"omniscience-utilities":156}],127:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"../Constants":139,"dup":19}],128:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"../Constants":139,"dup":20}],129:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"../Constants":139,"dup":21}],130:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],131:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],132:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"../Constants":139,"dup":24}],133:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"../Constants":139,"dup":25}],134:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],135:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"../Constants":139,"dup":27}],136:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"../Constants":139,"dup":28}],137:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],138:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"../SimpleTCP":149,"./FileUtilities":127,"./IPResolver":128,"./MimeService":129,"./Notifications":130,"./SimpleTCPSocket":131,"./SimpleUDPSocket":132,"./SocketSender":133,"./StorageService":134,"./TCPSocket":135,"./UDPSocket":136,"./UrlSdk":137,"dup":30}],139:[function(require,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"dup":61}],140:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"../SimpleTCP":149,"./FileUtilities":141,"./IPResolver":142,"./MimeService":143,"./SimpleTCPSocket":144,"./SocketSender":145,"./StorageService":146,"./TCPSocket":147,"./UDPSocket":148,"chrome":undefined,"dup":32,"sdk/base64":undefined,"sdk/net/xhr":undefined,"sdk/notifications":undefined,"sdk/simple-storage":undefined,"sdk/tabs":undefined,"sdk/timers":undefined,"sdk/ui/button/action":undefined,"sdk/url":undefined,"sdk/window/utils":undefined}],141:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"../Constants":139,"dup":33}],142:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"../Constants":139,"dup":34}],143:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"../Constants":139,"dup":35}],144:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],145:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"../Constants":139,"dup":37}],146:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"dup":38}],147:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],148:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"dup":40}],149:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"dup":41}],150:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./Chrome/sdk":138,"./Firefox/AddonSdk":140,"dup":42}],151:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43}],152:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"./Constants":151,"dup":44}],153:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"dup":45}],154:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"./Constants":151,"dup":46}],155:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47}],156:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"./Eventable":152,"./MD5":153,"./UrlProvider":154,"./fetch":155,"dup":48,"omniscience-sdk-resolver":180}],157:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"../Constants":169,"dup":19}],158:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"../Constants":169,"dup":20}],159:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"../Constants":169,"dup":21}],160:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],161:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],162:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"../Constants":169,"dup":24}],163:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"../Constants":169,"dup":25}],164:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],165:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"../Constants":169,"dup":27}],166:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"../Constants":169,"dup":28}],167:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],168:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"../SimpleTCP":179,"./FileUtilities":157,"./IPResolver":158,"./MimeService":159,"./Notifications":160,"./SimpleTCPSocket":161,"./SimpleUDPSocket":162,"./SocketSender":163,"./StorageService":164,"./TCPSocket":165,"./UDPSocket":166,"./UrlSdk":167,"dup":30}],169:[function(require,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"dup":61}],170:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"../SimpleTCP":179,"./FileUtilities":171,"./IPResolver":172,"./MimeService":173,"./SimpleTCPSocket":174,"./SocketSender":175,"./StorageService":176,"./TCPSocket":177,"./UDPSocket":178,"chrome":undefined,"dup":32,"sdk/base64":undefined,"sdk/net/xhr":undefined,"sdk/notifications":undefined,"sdk/simple-storage":undefined,"sdk/tabs":undefined,"sdk/timers":undefined,"sdk/ui/button/action":undefined,"sdk/url":undefined,"sdk/window/utils":undefined}],171:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"../Constants":169,"dup":33}],172:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"../Constants":169,"dup":34}],173:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"../Constants":169,"dup":35}],174:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],175:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"../Constants":169,"dup":37}],176:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"dup":38}],177:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],178:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"dup":40}],179:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"dup":41}],180:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./Chrome/sdk":168,"./Firefox/AddonSdk":170,"dup":42}],181:[function(require,module,exports){
arguments[4][43][0].apply(exports,arguments)
},{"dup":43}],182:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"./Constants":181,"dup":44}],183:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"dup":45}],184:[function(require,module,exports){
arguments[4][46][0].apply(exports,arguments)
},{"./Constants":181,"dup":46}],185:[function(require,module,exports){
arguments[4][47][0].apply(exports,arguments)
},{"dup":47}],186:[function(require,module,exports){
arguments[4][48][0].apply(exports,arguments)
},{"./Eventable":182,"./MD5":183,"./UrlProvider":184,"./fetch":185,"dup":48,"omniscience-sdk-resolver":210}],187:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"../Constants":199,"dup":19}],188:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"../Constants":199,"dup":20}],189:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"../Constants":199,"dup":21}],190:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],191:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"dup":23}],192:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"../Constants":199,"dup":24}],193:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"../Constants":199,"dup":25}],194:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],195:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"../Constants":199,"dup":27}],196:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"../Constants":199,"dup":28}],197:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],198:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"../SimpleTCP":209,"./FileUtilities":187,"./IPResolver":188,"./MimeService":189,"./Notifications":190,"./SimpleTCPSocket":191,"./SimpleUDPSocket":192,"./SocketSender":193,"./StorageService":194,"./TCPSocket":195,"./UDPSocket":196,"./UrlSdk":197,"dup":30}],199:[function(require,module,exports){
arguments[4][61][0].apply(exports,arguments)
},{"dup":61}],200:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"../SimpleTCP":209,"./FileUtilities":201,"./IPResolver":202,"./MimeService":203,"./SimpleTCPSocket":204,"./SocketSender":205,"./StorageService":206,"./TCPSocket":207,"./UDPSocket":208,"chrome":undefined,"dup":32,"sdk/base64":undefined,"sdk/net/xhr":undefined,"sdk/notifications":undefined,"sdk/simple-storage":undefined,"sdk/tabs":undefined,"sdk/timers":undefined,"sdk/ui/button/action":undefined,"sdk/url":undefined,"sdk/window/utils":undefined}],201:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"../Constants":199,"dup":33}],202:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"../Constants":199,"dup":34}],203:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"../Constants":199,"dup":35}],204:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],205:[function(require,module,exports){
arguments[4][37][0].apply(exports,arguments)
},{"../Constants":199,"dup":37}],206:[function(require,module,exports){
arguments[4][38][0].apply(exports,arguments)
},{"dup":38}],207:[function(require,module,exports){
arguments[4][39][0].apply(exports,arguments)
},{"dup":39}],208:[function(require,module,exports){
arguments[4][40][0].apply(exports,arguments)
},{"dup":40}],209:[function(require,module,exports){
arguments[4][41][0].apply(exports,arguments)
},{"dup":41}],210:[function(require,module,exports){
arguments[4][42][0].apply(exports,arguments)
},{"./Chrome/sdk":198,"./Firefox/AddonSdk":200,"dup":42}]},{},[1]);
