const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const windowUtils = require("sdk/window/utils");
const ComponentFactory  = require("./ComponentFactory");
const { FilePicker } = require("../FilePicker");


const FilePickerFactory = Class({
    initialize: function(){
    },
    createFilePicker: function createFilePicker(){
        return new FilePicker(ComponentFactory.createFilePicker(), windowUtils.getMostRecentBrowserWindow());
    }
});

/**
 *
 */
exports.FilePickerFactory = FilePickerFactory;
