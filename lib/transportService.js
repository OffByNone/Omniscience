const { Cc, Ci } = require('chrome'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/chrome.html
const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { emit } = require('sdk/event/core'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/event/core.html
const { merge } = require("sdk/util/object"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/util_object
const { EventTarget } = require("sdk/event/target"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const TransportService = Class({
    extends: EventTarget,
    initialize: function intialize(options){
        EventTarget.prototype.initialize.call(this, options);
        merge(this, options);

        this.transportService = Cc["@mozilla.org/network/socket-transport-service;1"].getService(Ci.nsISocketTransportService), // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsISocketTransportService
        this.scriptableInputStream = Cc["@mozilla.org/scriptableinputstream;1"].createInstance(Ci.nsIScriptableInputStream), // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIScriptableInputStream
        this.inputStreamPump = Cc["@mozilla.org/network/input-stream-pump;1"].createInstance(Ci.nsIInputStreamPump), // https://dxr.mozilla.org/mozilla-central/source/netwerk/base/public/nsIInputStreamPump.idl

        this.transport = this.transportService.createTransport(null, 0, this.ip, this.port, null); // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsISocketTransport
        this.outputStream = this.transport.openOutputStream(0, 0, 0); // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIOutputStream
        this.inputStream = this.transport.openInputStream(0, 0, 0); // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIInputStream
        this.scriptableInputStream.init(this.inputStream); //the inputStream is not scriptable (accessible from js).  This wraps it so it can be called from js.
        this.inputStreamPump.init(this.inputStream, -1, -1, 0, 0, false);
        this.inputStreamPump.asyncRead(this, null); // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/NsIStreamListener
    },
    onStartRequest: function onStartRequest(request, context){},
    onStopRequest: function onStopRequest(request, context, status) {
        this.scriptableInputStream.close();
        this.inputStream.close();
        this.outputStream.close();
    },
    onDataAvailable: function onDataAvailable(request, context, inputStream, offset, count){
        emit(this,'dataReceived', this.scriptableInputStream.read(count));
    },
    send: function send(data){
        var message = JSON.stringify(data);
        message = message.length + ":" + message; //Magic Happens Here!
        this.outputStream.write(message, message.length);
    },
    close: function close(){
        this.scriptableInputStream.close();
        this.inputStream.close();
        this.outputStream.close();
    }
});

exports.TransportService = TransportService;
