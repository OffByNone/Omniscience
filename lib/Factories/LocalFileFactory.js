class LocalFileFactory {
    constructor(firefox) {
        this._firefox = firefox;
    }
    createLocalFile(fileInfo) {
        var file = this._firefox.createLocalFile();
        if (typeof fileInfo === "string")
            file.initWithPath(fileInfo);
        if (typeof fileInfo === "object")
            file.initWithFile(fileInfo);
        return file;
    }
}

module.exports = LocalFileFactory;