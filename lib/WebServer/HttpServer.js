const Constants = require('../Utilities/Constants');

class HttpServer {

    constructor(tcpSocket, urlProvider, httpResponder, requestParser, timer, fileResponder) {
        this._tcpSocket = tcpSocket;
        this._urlProvider = urlProvider;
        this._httpResponder = httpResponder;
        this._requestParser = requestParser;
        this._timer = timer;
        this._fileResponder = fileResponder;

        this.isRunning = false;
        this._registeredPaths = [];
        this._registeredFiles = [];
    }

    start() {
        if (this.isRunning) return;

        this.port = this._getRandomPort();
        this.socket = this._tcpSocket.listen(this.port, { binaryType: "arraybuffer" });

        console.log('listening on port ' + this.port);

        this.socket.onconnect = (incomingSocket) => {
            this._requestParser.parseRequest(incomingSocket, (request) => {
                var timeout = this._timer.setTimeout(() => {
                    if(incomingSocket.readyState === 'open')
                        this._httpResponder.sendTimeoutResponse(incomingSocket);
                }, Constants.serverTimeoutInMilliseconds);

                new Promise((resolve, reject) => {
                    if (this._registeredPaths.hasOwnProperty(request.path)) {
                        this._registeredPaths[request.path](request, resolve);
                        return;
                    }

                    if (this._registeredFiles.hasOwnProperty(request.path)) {
                        this._fileResponder.sendResponse(request, this._registeredFiles[request.path], resolve);
                        return;
					}

                    this._httpResponder.sendFileNotFoundResponse(incomingSocket);
                }).then(() => this._timer.clearTimeout(timeout));

            },
			(error) => {
			    if (incomingSocket.readyState === 'open')
			        this._httpResponder.sendErrorResponse(incomingSocket);
			    console.warn('bad request received');
			});
        };

        this.isRunning = true;
    }
    stop() {
        if (!this.isRunning) return;
        this.socket.close();
        this.isRunning = false;
    }
    _getRandomPort() {
        return Math.floor(Math.random() * (65535 - 10000)) + 10000;
    }
    registerFile(serverPath, filepath) {
        var pathname = this._urlProvider.createUrl(serverPath.toLowerCase(), "http://localhost/").pathname;
        if (filepath) this._registeredFiles[pathname] = filepath;
        else delete this._registeredFiles[pathname];
        return pathname;
    }
    registerPath(serverPath, callback) {
        var pathname = this._urlProvider.createUrl(serverPath.toLowerCase(), "http://localhost/").pathname;
        if (callback) this._registeredPaths[pathname] = callback;
        else delete this._registeredPaths[pathname];
        return pathname;
    }
}
module.exports = HttpServer;