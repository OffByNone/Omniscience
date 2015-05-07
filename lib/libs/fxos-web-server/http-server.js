const HTTPRequest = require('./http-request');
const Constants = require('../../Utilities/Constants');

class HTTPServer {
    constructor(tcpSocket, urlProvider, httpResponder, md5) {
        this._tcpSocket = tcpSocket;
        this._urlProvider = urlProvider;
        this._httpResponder = httpResponder;
        this._md5 = md5;

        this.HTTP_VERSION = Constants.HTTPServer.HTTP_VERSION;

        this.isRunning = false;
        this._registeredPaths = [];
        this._registeredPrefixes = [];
        this._registeredDirectories = [];
        this._registeredFiles = [];
    }

    start() {
        if (this.isRunning) return;

        this.port = this._getRandomPort();
        console.log('Starting HTTP server on port ' + this.port);
        this.socket = this._tcpSocket.listen(this.port, { binaryType: "arraybuffer" });

        this.socket.onconnect = (connectEvent) => {
            var request = new HTTPRequest(connectEvent);

            request.addEventListener('complete', () => {
                if (this._registeredPaths.hasOwnProperty(request.path)) {
                    this._registeredPaths[request.path](request);
                    this._httpResponder.send(connectEvent);
                    return;
                }
                if (this._registeredDirectories.hasOwnProperty(request.path)) {
                    this._httpResponder.sendFile(connectEvent, this._registeredDirectories[request.path]);
                    return;
                }

                if (this._registeredFiles.hasOwnProperty(request.path)) {
                    this._httpResponder.sendFile(connectEvent, this._registeredFiles[request.path]);
                    return;
                }

                for (var prefix in this._registeredPrefixes) {
                    if (request.path.startsWith(prefix)) {
                        this._registeredPrefixes[prefix](request);
                        this._httpResponder.send(connectEvent);
                        return;
                    }
                }

                this._httpResponder.send(connectEvent, 'Not Found', 404);
            });

            request.addEventListener('error', () => {
                console.warn('Invalid request received');
            });
        };

        this.isRunning = true;
    }

    stop() {
        if (!this.isRunning) return;

        console.log('Shutting down HTTP server on port: ' + this.port);

        this.socket.close();
        this.isRunning = false;
    }
    _getRandomPort() {
        return Math.floor(Math.random() * (65535 - 10000)) + 10000;
    }
    registerFile(serverPath, filepath) {
        //does not currently work but it is in the server itself not here that it doesn't work
        //var pathname = new URL(serverPath).pathname;
        if (filepath) this._registeredFiles[serverPath] = filepath;
        else delete this._registeredFiles[serverPath];
    }
    registerDirectory(serverPath, directorypath) {
        //does not currently work but it is in the server itself not here that it doesn't work
        var pathname = this._urlProvider.createUrl(serverPath, "http://localhost/").pathname;
        if (directorypath) this._registeredFiles[serverPath] = directorypath;
        else delete this._registeredFiles[serverPath];
    }
    registerPath(serverPath, callback) {
        var pathname = this._urlProvider.createUrl(serverPath, "http://localhost/").pathname;
        if (callback) this._registeredPaths[pathname] = callback;
        else delete this._registeredPaths[pathname];
    }
    registerPrefix(serverPathprefix, callback) {
        var prefixName = this._urlProvider.createUrl(serverPathprefix).pathname;
        if (callback) this._registeredPrefixes[prefixName] = callback;
        else delete this._registeredPrefixes[prefixName];
    }

    shareFile(file) {
        var filePathHash = this._md5(file.path);
        var filePath = `/${filePathHash}/${file.name}`;
    	var encodedFilePath = encodeURI(filePath);
    	this.registerFile(encodedFilePath, file.path);

    	return encodedFilePath;
    }

}
module.exports = HTTPServer;