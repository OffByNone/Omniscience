'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Tab = require('./UI/Tab');
var Button = require('./UI/Button');

var FrontEndBridge = require('./FrontEndBridge');

var Networking = require('omniscience-networking');
var UPnP = require('omniscience-upnp');
var SdkResolver = require('omniscience-sdk-resolver');

var CompositionRoot = (function () {
	function CompositionRoot() {
		_classCallCheck(this, CompositionRoot);

		this._sdk = new SdkResolver().resolve();
		this._upnp = new UPnP();
		this._networking = new Networking();
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
			return this._networking.createHttpServer();
		}
	}, {
		key: 'getServiceExecutor',
		value: function getServiceExecutor() {
			return this._upnp.getServiceExecutor();
		}
	}, {
		key: 'createDeviceService',
		value: function createDeviceService(serviceExecutor) {
			return this._upnp.createDeviceService();
		}
	}, {
		key: 'createFrontEndBridge',
		value: function createFrontEndBridge(deviceService, serviceExecutor, httpServer) {
			return new FrontEndBridge(this._upnp.createSubscriptionService(), serviceExecutor, this._sdk.FileUtilities, this._networking.createFileSharer(httpServer), deviceService, httpServer);
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