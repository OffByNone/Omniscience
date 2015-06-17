exports.createDOMParser = () => window.DOMParser;
exports.XMLHttpRequest = () => window.XMLHttpRequest;
exports.timers = () => window;
exports.url = () => window.URL;

exports.tabs = () => require('./Chrome/Tabs'); // https://developer.chrome.com/extensions/tabs
exports.button = () =>  require('./Chrome/Buttons'); // https://developer.chrome.com/extensions/browserAction






/*
exports.createUDPSocket = function createUDPSocket(){
	// http://dxr.mozilla.org/mozilla-central/source/netwerk/base/public/nsIUDPSocket.idl
	return Cc['@mozilla.org/network/udp-socket;1'].createInstance(Ci.nsIUDPSocket);
};
exports.createTCPSocket = function createTCPSocket(){
	return Cc["@mozilla.org/tcp-socket;1"].createInstance(Ci.nsIDOMTCPSocket);
};
exports.createLocalFile = function createLocalFile(){
	return Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsILocalFile);
};
exports.createFilePicker = function createFilePicker(){
	return Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
};
exports.createFile = function createFile(){
	return OS.File;
};

exports.filePickerConstants = function filePickerConstants(){
	return Ci.nsIFilePicker;
};

exports.getScriptSecurityManager = function scriptSecurityManager(){
	return Services.scriptSecurityManager.getSystemPrincipal();
};
exports.getNativeWindowMenu = function nativeWindowMenu() {
	//for firefox for android
	return Services.wm.getMostRecentWindow("navigator:browser").NativeWindow.menu;
};
exports.getWifiMonitor = function wifiMonitor(){
	// https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIWifiMonitor
	// https://dxr.mozilla.org/mozilla-central/source/netwerk/wifi/nsIWifiMonitor.idl
	return Cc['@mozilla.org/wifi/monitor;1'].getService(Ci.nsIWifiMonitor);
};
exports.getMimeService = function mimeService(){
	return Cc["@mozilla.org/uriloader/external-helper-app-service;1"].getService(Ci.nsIMIMEService);
};
exports.getDNSService = function dnsService(){
	// https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIDNSService
	return Cc["@mozilla.org/network/dns-service;1"].getService(Ci.nsIDNSService);
};


exports.storage = () => require('sdk/simple-storage').storage; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/simple-storage
exports.windowUtils = () => require('sdk/window/utils'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/window_utils
exports.panel = () => require('sdk/panel'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/panel
exports.notifications = () => require('sdk/notifications'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications

*/