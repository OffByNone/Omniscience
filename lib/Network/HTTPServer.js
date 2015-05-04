class HTTPServer {
    constructor(httpServer, md5, localFileFactory) {
        this._server = httpServer;
        this._md5 = md5;
        this._localFileFactory = localFileFactory;
    }
    start(ipAddresses, port) {
        this.port = port || this._getRandomPort();
        this._server.start(this.port, ipAddresses);
    }
    registerDirectory(path, directoryPath) {
        var localFile = this._localFileFactory.createLocalFile(directoryPath);
        this._server.registerDirectory(path, localFile);
    }
    _getRandomPort() {
        return Math.floor(Math.random() * (65535 - 10000)) + 10000;
    }
    registerPathHandler(path, handler) {
        this._server.registerPathHandler(path, handler);
    }
    shareFile(file) {
        var filePathHash = this._md5(file.path);
        var filePath = `/${filePathHash}/${file.name}`;
    	var encodedFilePath = encodeURI(filePath);
    	var localFile = this._localFileFactory.createLocalFile(file.path);
    	this._server.registerFile(encodedFilePath, localFile);

    	return encodedFilePath;
    }
}

module.exports = HTTPServer;
