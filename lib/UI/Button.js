const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const Constants = require('../Constants');

const Button = Class({
    extends: EventTarget,
    initialize: function initialize(emitter, buttons, menu){
        this._emitter = emitter;
        this._menu = menu;
        var button;

        if(buttons){ //desktop firefox
            button = buttons.ToggleButton({
                id: 'omniscience',
                label: 'Omniscience',
                icon: Constants.icon
            });
            button.on('change', (state) => this._onChange(state));
        }
        else if(this._menu){ //firefox for android
            this._buttonId = this._menu.add("Omniscience", Constants.icon['64'], () => this._onChange());
        }
        else throw new Error("Neither button nor menu were defined.  At least one must be defined.");
    },
    remove: function remove(){
        //on android the menu item needs to be removed manually when the extension is disabled or uninstalled
        //this does not need to be done for desktop
        if(this._buttonId)
            this._menu.remove(this._buttonId);
    },
    _onChange: function _onChange(state){
        this._emitter.emit(this, 'change', state);
    }
});

module.exports = Button;