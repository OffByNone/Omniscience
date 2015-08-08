const Constants = require('../Constants');
const { Eventable } = require('omniscience-utilities');

class Button extends Eventable {
	constructor(buttons, menu) {
		super();
		this._menu = menu;
		var button;

		//todo: remove these out into their respective sdk files

		if (buttons) { //desktop firefox
			button = buttons.ActionButton({
				id: 'omniscience',
				label: 'Omniscience',
				icon: Constants.icon
			});
			button.on('click', () => this._onClick());
		}
		else if (this._menu) { //firefox for android
			this._buttonId = this._menu.add("Omniscience", Constants.icon['64'], () => this._onClick());
		}
		else throw new Error("Neither button nor menu were defined.  At least one must be defined.");
	}
	remove() {
		//on android the menu item needs to be removed manually when the extension is disabled or uninstalled
		//this does not need to be done for desktop
		if (this._buttonId)
			this._menu.remove(this._buttonId);
	}
	_onClick() {
		this.emit("click");
	}
}

module.exports = Button;