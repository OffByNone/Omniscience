const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html


const FilePickerFactory = Class({
    initialize: function(componentFactory){
        this._componentFactory = componentFactory;
    },
    createFilePicker: function(){
        return this._componentFactory.createFilePicker();
    }
});


module.exports = FilePickerFactory;