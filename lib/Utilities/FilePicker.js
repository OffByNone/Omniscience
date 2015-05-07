class FilePicker {
    constructor(fileUtils, filePickerFactory, filePickerConstants, localFileFactory, windowUtils) {
        this._fileUtils = fileUtils;
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
                            type: this._fileUtils.getTypeForFile(file)
                        };

                        files.push(fileInfo);
                    }
                    resolve(files);
                }
            });
        });
    }
}

module.exports = FilePicker;