const Constants = require('../Utilities/Constants');

class Button {
    constructor(eventer, buttons, menu){
        this._eventer = eventer;
        this._menu = menu;
        var button;

        if(buttons){ //desktop firefox
            button = buttons.ToggleButton({
                id: 'omniscience',
                label: 'Omniscience',
                icon: Constants.icon
            });
            button.on('change', (state) => this._onClick(state));
        }
        else if(this._menu){ //firefox for android
            this._buttonId = this._menu.add("Omniscience", Constants.icon['64'], () => this._onClick());
        }
        else throw new Error("Neither button nor menu were defined.  At least one must be defined.");
    }
    remove(){
        //on android the menu item needs to be removed manually when the extension is disabled or uninstalled
        //this does not need to be done for desktop
        if(this._buttonId)
            this._menu.remove(this._buttonId);
    }
    _onClick(state){
        this._eventer.emit('button.click', state);
    }
}

module.exports = Button;