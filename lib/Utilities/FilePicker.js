class FilePicker {
    constructor(mimeService, filePickerFactory, filePickerConstants, localFileFactory, windowUtils) {
        this._mimeService = mimeService;
        this._filePickerFatory = filePickerFactory;
        this._filePickerConstants = filePickerConstants;
        this._windowUtils = windowUtils;
        this._localFileFactory = localFileFactory;
    }
    openFile() {
        return new Promise((resolve, reject) => {
            var filePicker = this._filePickerFatory.createFilePicker();
            filePicker.init(this._windowUtils.getMostRecentBrowserWindow(), "Choose File(s)", this._filePickerConstants.modeOpenMultiple);
            filePicker.appendFilters(this._filePickerConstants.filterAll | this._filePickerConstants.filterText);

            filePicker.open((result) => {
                if (result == this._filePickerConstants.returnOK) {
                    var filePickerFiles = filePicker.files;
                    var files = [];
                    while (filePickerFiles.hasMoreElements()) {
                        //todo: at least some of this should probably be in another file
                        var file = this._localFileFactory.createLocalFile(filePickerFiles.getNext());
                        var fileInfo = {
                            path: file.path,
                            name: file.leafName,
                            type: this._getTypeForFile(file)
                        };

                        files.push(fileInfo);
                    }
                    resolve(files);
                }
            });
        });
    }
    _getTypeForFile(file) {
        /*
         * From Mozilla
		 * Gets a content-type for the given file, by
		 * asking the global MIME service for a content-type, and finally by failing
		 * over to application/octet-stream.
		 *
		 * @param file : nsIFile
		 * the nsIFile for which to get a file type
		 * @returns string
		 * the best content-type which can be determined for the file
		 */
        try {
            var name = file.leafName;
            return this._mimeService.getTypeFromFile(file);
        }
        catch (e) {
            return "application/octet-stream";
        }
    }
}

module.exports = FilePicker;