'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var Constants = require('../Constants');

var _require = require('omniscience-utilities');

var Eventable = _require.Eventable;

var Button = (function (_Eventable) {
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
			this._buttonId = this._menu.add('Omniscience', Constants.icon['64'], function () {
				return _this._onClick();
			});
		} else throw new Error('Neither button nor menu were defined.  At least one must be defined.');
	}

	_inherits(Button, _Eventable);

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
			this.emit('click');
		}
	}]);

	return Button;
})(Eventable);

module.exports = Button;