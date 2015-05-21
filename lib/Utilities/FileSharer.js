class FileSharer {
    constructor(httpServer, urlProvider, md5, pubSub) {
        this._server = httpServer;
        this._urlProvider = urlProvider;
        this._md5 = md5;
        this._pubSub = pubSub;

        this._pubSub.sub('shareFile', (uniqueId, file, serverIP) => {
        	this._pubSub.pub('emitResponse', uniqueId, this.shareFile(file, serverIP));
        });
    }
    shareFile(file, serverIP){
        var filePathHash = this._md5(file.path);
        var filePath = `/${filePathHash}/${file.name}`;
    	var encodedFilePath = encodeURI(filePath);

        if (file.isLocal || !this._urlProvider.toUrl(file.path))
            return "http://" + serverIP + ":" + this._server.port + this._server.registerFile(encodedFilePath, file.path);
        else
            return file.path;
    }
}

module.exports = FileSharer;