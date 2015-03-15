const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const Constants = require("./Constants");
const windowUtils = require("sdk/window/utils");
const ComponentFactory  = require("./Factories/ComponentFactory");

exports.FilePicker = {
	openFile: function openFile(){
		this._filePicker = ComponentFactory.createFilePicker();
		this._filePicker.init(windowUtils.getMostRecentBrowserWindow(), "Choose A File", Constants.FilePickerConstants.modeOpen);
		this._filePicker.appendFilters(Constants.FilePickerConstants.filterAll | Constants.FilePickerConstants.filterText);

		var result = this._filePicker.show();
		if (result == Constants.FilePickerConstants.returnOK || result == Constants.FilePickerConstants.returnReplace)
			return this._filePicker.file;
	}
};