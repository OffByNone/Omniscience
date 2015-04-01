const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { defer } = require('sdk/core/promise'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/core_promise
const windowUtils = require("sdk/window/utils");

const Constants = require("./Constants");
const ComponentFactory  = require("./Factories/ComponentFactory");
const Utilities = require('./Utilities');

module.exports = {
	openFile: function openFile(){
		var deferred = defer();
		var filePicker = ComponentFactory.createFilePicker();
		filePicker 
		filePicker.init(windowUtils.getMostRecentBrowserWindow(), "Choose File(s)", Constants.FilePickerConstants.modeOpenMultiple);
		filePicker.appendFilters(Constants.FilePickerConstants.filterAll | Constants.FilePickerConstants.filterText);

		filePicker.open( (result ) => {
			if (result == Constants.FilePickerConstants.returnOK){
				var filePickerFiles = filePicker.files;
				var files = [];
				while (filePickerFiles.hasMoreElements()) 
				{
					var file = ComponentFactory.createLocalFile();
					file.initWithFile(filePickerFiles.getNext());
					var fileInfo = {
						path: file.path,
						name: file.leafName,
						type: Utilities.getTypeForFile(file),
					};

					files.push(fileInfo);
				}

				deferred.resolve(files);
			}
		});
		return deferred.promise;
	}
};