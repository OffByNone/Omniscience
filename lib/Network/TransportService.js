const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const TransportService = Class({
	extends: EventTarget,
	initialize: function intialize(transportService, scriptableInputStream, inputStreamPump, emitter) {
		this._transportService = transportService;
		this._scriptableInputStream = scriptableInputStream;
		this._inputStreamPump = inputStreamPump;
        this._emitter = emitter;

		this._transport = this._transportService.createTransport(null, 0, this.ip, this.port, null); // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsISocketTransport
		this._outputStream = this._transport.openOutputStream(0, 0, 0); // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIOutputStream
		this._inputStream = this._transport.openInputStream(0, 0, 0); // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIInputStream
		this._scriptableInputStream.init(this._inputStream); //the inputStream is not scriptable (accessible from js).  This wraps it so it can be called from js.
		this._inputStreamPump.init(this._inputStream, -1, -1, 0, 0, false);
		this._inputStreamPump.asyncRead(this, null); // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/NsIStreamListener
	},
	onStartRequest: function onStartRequest(request, context) {
	},
	onStopRequest: function onStopRequest(request, context, status) {
		this._scriptableInputStream.close();
		this._inputStream.close();
		this._outputStream.close();
	},
	onDataAvailable: function onDataAvailable(request, context, inputStream, offset, count) {
		this._emitter.emit(this, 'dataReceived', this._scriptableInputStream.read(count));
	},
	send: function send(data) {
		var message = JSON.stringify(data);
		message = message.length + ':' + message; //Magic Happens Here!
		this._outputStream.write(message, message.length);
	},
	close: function close() {
		this._scriptableInputStream.close();
		this._inputStream.close();
		this._outputStream.close();
	}
});

/**
 * Sends data over TCP, not entirely sure how it works
 */
exports.TransportService = TransportService;
