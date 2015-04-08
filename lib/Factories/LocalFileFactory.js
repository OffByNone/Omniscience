const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const LocalFileFactory = Class({
	initialize: function initialize(componentFactory) {
		this._componentFactory = componentFactory;
	},
	createLocalFile: function(fileInfo){
		var file = this._componentFactory.createLocalFile();
		if(typeof fileInfo === "string")
			file.initWithPath(fileInfo);
		if(typeof fileInfo === "object")
			file.initWithFile(fileInfo);
		return file;
	}
});

module.exports = LocalFileFactory;