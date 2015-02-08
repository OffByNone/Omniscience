const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const Constants = require("./Constants");

const FilePicker = Class({
    initialize: function initialize(filePicker, windowObj) {
        this._filePicker = filePicker;
        this._filePicker.init(windowObj, "Choose A File", Constants.FilePickerConstants.modeOpen);
        this._filePicker.appendFilters(Constants.FilePickerConstants.filterAll | Constants.FilePickerConstants.filterText);
    },
    openFile: function openFile(){
        var result = this._filePicker.show();
        if (result == Constants.FilePickerConstants.returnOK || result == Constants.FilePickerConstants.returnReplace)
            return this._filePicker.file;
    }
});

exports.FilePicker = FilePicker;