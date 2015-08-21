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
//# sourceMappingURL=Tab.js.map