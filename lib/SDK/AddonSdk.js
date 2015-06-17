const { Cc, Ci, Cu } = require('chrome'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/chrome.html
const { Services } = Cu.import("resource://gre/modules/Services.jsm"); // https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Services.jsm
const { OS } = Cu.import("resource://gre/modules/osfile.jsm"); // https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/OSFile.jsm

exports.createDOMParser = function createDOMParser(){
	// https://developer.mozilla.org/en-US/docs/nsIDOMParser
	// https://dxr.mozilla.org/mozilla-central/source/dom/base/nsIDOMParser.idl
    return Cc['@mozilla.org/xmlextras/domparser;1'].createInstance(Ci.nsIDOMParser);
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



exports.storage = () => require('sdk/simple-storage').storage; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/simple-storage
exports.tabs = () => require('sdk/tabs'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/tabs
exports.url = () => require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url
exports.button = () => require('sdk/ui/button/action'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/ui_button_toggle
exports.panel = () => require('sdk/panel'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/panel
exports.XMLHttpRequest = () => require('sdk/net/xhr').XMLHttpRequest; // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/net_xhr
exports.notifications = () => require('sdk/notifications'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications