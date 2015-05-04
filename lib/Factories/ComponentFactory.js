const { Cc, Ci, Cu } = require('chrome'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/chrome.html
Cu.import("resource://gre/modules/Services.jsm"); // https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Services.jsm

/**
 * https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIWifiMonitor
 * https://dxr.mozilla.org/mozilla-central/source/netwerk/wifi/nsIWifiMonitor.idl
 * @return {*} nsIWifiMonitor
 */
exports.createWifiMonitor = function createWifiMonitor(){
    return Cc['@mozilla.org/wifi/monitor;1'].getService(Ci.nsIWifiMonitor);
};
/**
 * https://developer.mozilla.org/en-US/docs/nsIDOMParser
 * https://dxr.mozilla.org/mozilla-central/source/dom/base/nsIDOMParser.idl
 * @return {*} nsIDOMParser
 */
exports.createDOMParser = function createDOMParser(){
    return Cc['@mozilla.org/xmlextras/domparser;1'].createInstance(Ci.nsIDOMParser);
};
/**
 * http://dxr.mozilla.org/mozilla-central/source/netwerk/base/public/nsIUDPSocket.idl
 * @return {*} nsIUDPSocket
 */
exports.createUDPSocket = function createUDPSocket(){
    return Cc['@mozilla.org/network/udp-socket;1'].createInstance(Ci.nsIUDPSocket);
};
exports.createTCPSocket = function createTCPSocket(){
    return Cc["@mozilla.org/tcp-socket;1"].createInstance(Ci.nsIDOMTCPSocket);
};
/**
 * https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsISocketTransportService
 * @return {*} nsISocketTransportService
 */
exports.createTransportService = function createTransportService(){
    return Cc['@mozilla.org/network/socket-transport-service;1'].getService(Ci.nsISocketTransportService);
};
/**
 * https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIScriptableInputStream
 * @return {*} nsIScriptableInputStream
 */
exports.createScriptableInputStream = function createScriptableInputStream(){
    return Cc['@mozilla.org/scriptableinputstream;1'].createInstance(Ci.nsIScriptableInputStream);
};
/**
 * https://dxr.mozilla.org/mozilla-central/source/netwerk/base/public/nsIInputStreamPump.idl
 * @return {*} nsIInputStreamPump
 */
exports.createInputStreamPump = function createInputStreamPump(){
    return Cc['@mozilla.org/network/input-stream-pump;1'].createInstance(Ci.nsIInputStreamPump);
};
/**
* https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIDNSService
*/
exports.createDNSService = function createDNSService(){
    return Cc["@mozilla.org/network/dns-service;1"].getService(Ci.nsIDNSService);
};
exports.createLocalFile = function createLocalFile(){
    return Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
};
exports.createFilePicker = function createFilePicker(){
    return Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
};
exports.createFileStream = function createFileStream(){
    return Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream);
};
exports.createFile = function createFile(){
    var { OS } = Cu.import("resource://gre/modules/osfile.jsm", {});
    return OS.File;
};
exports.createBuffer = function createBuffer(string){
    return new Buffer(string);
};
exports.createMimeService = function createMimeService(){
    return Cc["@mozilla.org/uriloader/external-helper-app-service;1"].getService(Ci.nsIMIMEService);
};
exports.filePickerConstants = function getFilePickerConstants(){
    return Ci.nsIFilePicker;
};
exports.getScriptSecurityManager = function getScriptSecurityManager(){
    let { Services } = Cu.import("resource://gre/modules/Services.jsm", {});
    return Services.scriptSecurityManager.getSystemPrincipal();
};
exports.getNativeWindowMenu = function getNativeWindowMenu() {
    //for firefox for android
    return Services.wm.getMostRecentWindow("navigator:browser").NativeWindow.menu;
};