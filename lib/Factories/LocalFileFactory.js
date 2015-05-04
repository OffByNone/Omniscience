class LocalFileFactory {
    constructor(componentFactory) {
        this._componentFactory = componentFactory;
    }
    createLocalFile(fileInfo) {
        var file = this._componentFactory.createLocalFile();
        if (typeof fileInfo === "string")
            file.initWithPath(fileInfo);
        if (typeof fileInfo === "object")
            file.initWithFile(fileInfo);
        return file;
    }
}

module.exports = LocalFileFactory;