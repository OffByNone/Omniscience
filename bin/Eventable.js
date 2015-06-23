"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Eventable = (function () {
	function Eventable() {
		_classCallCheck(this, Eventable);

		this._subscriptions = {};
	}

	_createClass(Eventable, [{
		key: "on",
		value: function on(eventType, callback) {
			//todo: validate params
			this._subscriptions[eventType] = this._subscriptions[eventType] || [];
			this._subscriptions[eventType].push(callback);
		}
	}, {
		key: "emit",
		value: function emit(eventType) {
			for (var _len = arguments.length, data = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				data[_key - 1] = arguments[_key];
			}

			//todo: validate params
			if (!Array.isArray(this._subscriptions[eventType])) return; //nobody has subscribed yet, just return
			this._subscriptions[eventType].forEach(function (subscriptionCallback) {
				return subscriptionCallback.apply(undefined, data);
			});
		}
	}]);

	return Eventable;
})();

module.exports = Eventable;