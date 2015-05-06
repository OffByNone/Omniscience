class TransportService {
    constructor (eventer, transportService, scriptableInputStream, inputStreamPump) {
        this._transportService = transportService;
        this._scriptableInputStream = scriptableInputStream;
        this._inputStreamPump = inputStreamPump;
        this._eventer = eventer;
    }
    onStopRequest(request, context, status) {
        this._scriptableInputStream.close();
        this._inputStream.close();
        this._outputStream.close();
    }
    onDataAvailable(request, context, inputStream, offset, count) {
        var data = this._scriptableInputStream.read(count);
        this._eventer.emit('transportService.dataReceived', data);
    }
    open(ip, port){
        var transport = this._transportService.createTransport(null, 0, ip, port, null); // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsISocketTransport
        this._outputStream = transport.openOutputStream(0, 0, 0); // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIOutputStream
        this._inputStream = transport.openInputStream(0, 0, 0); // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIInputStream
        this._scriptableInputStream.init(this._inputStream); //the inputStream is not scriptable (accessible from js).  This wraps it so it can be called from js.
        this._inputStreamPump.init(this._inputStream, -1, -1, 0, 0, false);
        this._inputStreamPump.asyncRead(this, null); // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/NsIStreamListener
    }
    send(data) {
        var message = JSON.stringify(data);
        message = message.length + ':' + message; //Magic Happens Here!
        this._outputStream.write(message, message.length);
    }
    close() {
        this._scriptableInputStream.close();
        this._inputStream.close();
        this._outputStream.close();
    }
}

/**
 * Sends data over TCP, not entirely sure how it works
 */
module.exports = TransportService;
