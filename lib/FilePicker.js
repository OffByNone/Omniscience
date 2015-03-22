const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { defer } = require('sdk/core/promise'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/core_promise
const windowUtils = require("sdk/window/utils");

const Constants = require("./Constants");
const ComponentFactory  = require("./Factories/ComponentFactory");

exports.FilePicker = {

	openFile: function openFile(){
		var deferred = defer();
		this._filePicker = ComponentFactory.createFilePicker();
		this._filePicker.init(windowUtils.getMostRecentBrowserWindow(), "Choose File(s)", Constants.FilePickerConstants.modeOpenMultiple);
		this._filePicker.appendFilters(Constants.FilePickerConstants.filterAll | Constants.FilePickerConstants.filterText);

		this._filePicker.open( (result ) => {
			if (result == Constants.FilePickerConstants.returnOK){
				var filePickerFiles = this._filePicker.files;
				var files = [];
				while (filePickerFiles.hasMoreElements()) 
				{
					var file = ComponentFactory.createLocalFile();
					file.initWithFile(filePickerFiles.getNext());

					files.push(file);
				}

				deferred.resolve(files);
			}
		});
		return deferred.promise;
	}
};