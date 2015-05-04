class FileSharer {
    constructor(httpServer, urlProvider) {
        this._server = httpServer;
        this._urlProvider = urlProvider;
    }
    shareFile(file, serverIP){
        var fileUri;

        if (file.isLocal || !this._urlProvider.toUrl(file.path))
            return "http://" + serverIP +  ":" + this._server.port + this._server.shareFile(file);
        else
            return file.path;
    }
}

module.exports = FileSharer;