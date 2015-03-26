const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const buttons = require('sdk/ui/button/toggle'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/ui_button_toggle    

const Button = Class({
    extends: EventTarget,
    initialize: function initialize(emitter){
        this._emitter = emitter;
        this._button = buttons.ToggleButton({
            id: 'rotary',
            label: 'Rotary',
            icon: {
                16: './icons/rotary-16.png',
                32: './icons/rotary-32.png',
                64: './icons/rotary-64.png'
            }        
        });
        this._button.on('change', (state) => this._onChange(state));
    },
    getButton: function getButton(){
        return this._button;
    },
    check: function check(boolean){
        this._button.state('window', { checked: boolean });
    },
    _onChange: function _onChange(state){
        this._emitter.emit(this, 'change', state);
    }
});

module.exports = Button;