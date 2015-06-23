'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Tab = require('./UI/Tab');
var Button = require('./UI/Button');

var Constants = require('./Utilities/Constants');
var TCPSocketProvider = require('./Utilities/TCPSocketProvider');
var FrontEndBridge = require('./Services/FrontEndBridge');
var DeviceService = require('./Services/DeviceService');

var HttpServer = require('omniscience-http-server');
var SSDPSearcher = require('omniscience-ssdp-searcher');
var Utilities = require('omniscience-utilities');
var UPnP = require('omniscience-upnp');

var CompositionRoot = (function () {
	function CompositionRoot(sdk) {
		_classCallCheck(this, CompositionRoot);

		this._sdk = sdk;
		//this._tcpSender = new TCPSender(this._sdk.timers(), new TCPSocketProvider(sdk), new SocketSender(), NetworkingUtils); //used by matchstick
	}

	_createClass(CompositionRoot, [{
		key: 'createButton',
		value: function createButton() {
			var button = null;
			var menu = null;
			try {
				//desktop sdk
				button = this._sdk.button();
			} catch (e) {
				//sdk for Android
				menu = this._sdk.getNativeWindowMenu();
			}

			return new Button(button, menu);
		}
	}, {
		key: 'createHttpServer',
		value: function createHttpServer() {
			return HttpServer.createHttpServer();
		}
	}, {
		key: 'createServiceExecutor',
		value: function createServiceExecutor() {
			return UPnP.createServiceExecutor();
		}
	}, {
		key: 'createDeviceService',
		value: function createDeviceService(serviceExecutor) {
			var _this = this;

			return SSDPSearcher.createDeviceLocator().then(function (deviceLocator) {
				return new DeviceService(UPnP.createDeviceFactory(), deviceLocator, _this._sdk.storage(), serviceExecutor, _this._sdk.notifications());
			});
		}
	}, {
		key: 'createFrontEndBridge',
		value: function createFrontEndBridge(deviceService, serviceExecutor, httpServer) {
			return new FrontEndBridge(UPnP.createSubscriptionService(), serviceExecutor, this._sdk.FileUtilities, HttpServer.createFileSharer(httpServer), deviceService, httpServer);
		}
	}, {
		key: 'createTab',
		value: function createTab(button, frontEndBridge) {
			return new Tab(this._sdk.tabs(), button, frontEndBridge);
		}
	}]);

	return CompositionRoot;
})();

module.exports = CompositionRoot;