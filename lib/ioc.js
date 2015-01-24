const { Cc, Ci } = require('chrome'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/chrome.html

/**
 * https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIWifiMonitor
 * https://dxr.mozilla.org/mozilla-central/source/netwerk/wifi/nsIWifiMonitor.idl
 * @return {*} nsIWifiMonitor
 */
exports.createWifiMonitor = function(){
  return Cc['@mozilla.org/wifi/monitor;1'].getService(Ci.nsIWifiMonitor);
};
/**
 * https://developer.mozilla.org/en-US/docs/nsIDOMParser
 * https://dxr.mozilla.org/mozilla-central/source/dom/base/nsIDOMParser.idl
 * @return {*} nsIDOMParser
 */
exports.createDOMParser = function(){
  return Cc['@mozilla.org/xmlextras/domparser;1'].createInstance(Ci.nsIDOMParser);
};
/**
 * http://dxr.mozilla.org/mozilla-central/source/netwerk/base/public/nsIUDPSocket.idl
 * @return {*} nsIUDPSocket
 */
exports.createUDPSocket = function(){
  return Cc['@mozilla.org/network/udp-socket;1'].createInstance(Ci.nsIUDPSocket);
};
/**
 * https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsISocketTransportService
 * @return {*} nsISocketTransportService
 */
exports.createTransportService = function(){
  return Cc['@mozilla.org/network/socket-transport-service;1'].getService(Ci.nsISocketTransportService);
};
/**
 * https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIScriptableInputStream
 * @return {*} nsIScriptableInputStream
 */
exports.createScriptableInputStream = function(){
  return Cc['@mozilla.org/scriptableinputstream;1'].createInstance(Ci.nsIScriptableInputStream);
};
/**
 * https://dxr.mozilla.org/mozilla-central/source/netwerk/base/public/nsIInputStreamPump.idl
 * @return {*} nsIInputStreamPump
 */
exports.createInputStreamPump = function(){
  return Cc['@mozilla.org/network/input-stream-pump;1'].createInstance(Ci.nsIInputStreamPump);
};
