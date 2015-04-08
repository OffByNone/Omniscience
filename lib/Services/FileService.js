const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { URL } = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url

//todo: there are really two separate services in here, a filepickerservice and a filesharerservice split apart

const FileService = Class({
	initialize: function initialize(httpServer, utilities, defer, mimeService, filePickerFactory, filePickerConstants, localFileFactory, windowUtils) {
		this._server = httpServer;
		this._utilities = utilities
		this._mimeService = mimeService;
		this._defer = defer;
		this._filePickerFatory = filePickerFactory;
		this._filePickerConstants = filePickerConstants;
		this._windowUtils = windowUtils;
		this._localFileFactory = localFileFactory;
	},
	shareFile: function shareFile(deviceService, file){
		var serverAddress = this._getServerIp(deviceService);
		var fileUri;

		if(file.isLocal || !this._utilities.toUrl(file.path))
			return serverAddress + this._server.shareFile(file);
		else
			return file.path;
	},
	openFile: function openFile(){
		var deferred = this._defer();
		var filePicker = this._filePickerFatory.createFilePicker();
		filePicker.init(this._windowUtils.getMostRecentBrowserWindow(), "Choose File(s)", this._filePickerConstants.modeOpenMultiple);
		filePicker.appendFilters(this._filePickerConstants.filterAll | this._filePickerConstants.filterText);

		filePicker.open( (result ) => {
			if (result == this._filePickerConstants.returnOK){
				var filePickerFiles = filePicker.files;
				var files = [];
				while (filePickerFiles.hasMoreElements())
				{
					//todo: at least some of this should probably be in a separate factory
					var file = this._localFileFactory.createLocalFile(filePickerFiles.getNext());
					var fileInfo = {
						path: file.path,
						name: file.leafName,
						type: this._getTypeForFile(file)
					};

					files.push(fileInfo);
				}

				deferred.resolve(files);
			}
		});
		return deferred.promise;
	},
	_getServerIp: function _getServerIp(deviceService){
		var deviceIp = new URL(deviceService.scpdUrl).host;
		//todo: pains me to hardcode http
		return "http://" + this._utilities.getMyIPAddresses().filter(x=> this._areIPsInSameSubnet(x, deviceIp))[0] + ":" + this._server.port;
	},
	_areIPsInSameSubnet: function _areIPsInSameSubnet(ip1, ip2){
		//todo: this only works for ipv4 addresses
		//meaning it wont work for ipv6 or hostnames

		//todo: if two adapters are on the same subnet it will grab whichever it finds first
		//which is probably not what you want as my laptop shows both ethernet and wifi even if one is disconnected
		//should probably ping the ip to validate it can be hit

		var ip3 = ip1.split(".");
		var ip4 = ip2.split(".");

		if((ip3.length > 2 && ip4.length > 2)
            && (ip3[0] === ip4[0] && ip3[1] === ip4[1] && ip3[2] === ip4[2]))
			return true;

		return false;
	},
	_getTypeForFile: function _getTypeForFile(file){
		/*
		 * Gets a content-type for the given file, by
		 * asking the global MIME service for a content-type, and finally by failing
		 * over to application/octet-stream.
		 *
		 * @param file : nsIFile
		 * the nsIFile for which to get a file type
		 * @returns string
		 * the best content-type which can be determined for the file
		 */
		try
		{
			var name = file.leafName;
			return this._mimeService.getTypeFromFile(file);
		}
		catch (e)
		{
			return "application/octet-stream";
		}
	}
});

module.exports = FileService;