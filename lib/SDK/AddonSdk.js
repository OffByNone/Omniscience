const { Cc, Ci, Cu } = require('chrome'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/chrome.html
const { Services } = Cu.import("resource://gre/modules/Services.jsm"); // https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Services.jsm
const { OS } = Cu.import("resource://gre/modules/osfile.jsm"); // https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/OSFile.jsm

exports.createDOMParser = function createDOMParser(){
	// https://developer.mozilla.org/en-US/docs/nsIDOMParser
	// https://dxr.mozilla.org/mozilla-central/source/dom/base/nsIDOMParser.idl
    return Cc['@mozilla.org/xmlextras/domparser;1'].createInstance(Ci.nsIDOMParser);
};
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


exports.storageSDK = () => require('sdk/simple-storage').storage; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/simple-storage
exports.timersSDK = () => require('sdk/timers'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers
exports.tabsSDK = () => require('sdk/tabs'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/tabs
exports.windowUtilsSDK = () => require('sdk/window/utils'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/window_utils
exports.urlSDK = () => require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url
exports.buttonsSDK = () => require('sdk/ui/button/action'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/ui_button_toggle
exports.panelSDK = () => require('sdk/panel'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/panel
exports.XMLHttpRequest = () => require('sdk/net/xhr').XMLHttpRequest; // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/net_xhr
exports.notificationsSDK = () => require('sdk/notifications'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications