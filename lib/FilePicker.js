const {
    Class
} = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const {
    Ci
} = require('chrome'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/chrome.html
const nsIFilePicker = Ci.nsIFilePicker;

const IOC = require("./IOC");


const FilePicker = Class({
    initialize: function initialize() {
        this._filePicker = IOC.createFilePicker();
        this._filePicker.init(require("sdk/window/utils").getMostRecentBrowserWindow(), "Choose A File", nsIFilePicker.modeOpen);
        this._filePicker.appendFilters(nsIFilePicker.filterAll | nsIFilePicker.filterText);
    },
    openFile: function openFile(){
        var result = this._filePicker.show();
        if (result == nsIFilePicker.returnOK || result == nsIFilePicker.returnReplace)
            return this._filePicker.file;
    }
});







exports.FilePicker = FilePicker;