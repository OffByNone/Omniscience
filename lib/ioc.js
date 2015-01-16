const { Cc, Ci } = require("chrome"); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/chrome.html

exports.createWifiMonitor =  function(){
  return Cc["@mozilla.org/wifi/monitor;1"].getService(Ci.nsIWifiMonitor);
};
exports.createDOMParser = function(){
  return Cc["@mozilla.org/xmlextras/domparser;1"].createInstance(Ci.nsIDOMParser);
};
exports.createUDPSocket = function(){
  return Cc['@mozilla.org/network/udp-socket;1'].createInstance(Ci.nsIUDPSocket); // http://dxr.mozilla.org/mozilla-central/source/netwerk/base/public/nsIUDPSocket.idl
};
exports.createTransportService = function (){
  return Cc["@mozilla.org/network/socket-transport-service;1"].getService(Ci.nsISocketTransportService); // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsISocketTransportService
};
exports.createScriptableInputStream = function(){
  return Cc["@mozilla.org/scriptableinputstream;1"].createInstance(Ci.nsIScriptableInputStream); // https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIScriptableInputStream
};
exports.createInputStreamPump = function(){
  return Cc["@mozilla.org/network/input-stream-pump;1"].createInstance(Ci.nsIInputStreamPump); // https://dxr.mozilla.org/mozilla-central/source/netwerk/base/public/nsIInputStreamPump.idl
};
