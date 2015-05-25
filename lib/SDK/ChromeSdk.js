const UDPSocket = require('./Chrome/UDPSocket');
const IPResolver = require('./Chrome/IPResolver');

exports.createDOMParser = () => window.DOMParser;
exports.XMLHttpRequest = () => window.XMLHttpRequest;
exports.timers = () => window;
exports.url = () => window.URL;

exports.tabs = () => require('./Chrome/Tabs'); // https://developer.chrome.com/extensions/tabs
exports.button = () =>  require('./Chrome/Buttons'); // https://developer.chrome.com/extensions/browserAction
exports.storage = () => require('./Chrome/Storage'); // https://developer.chrome.com/extensions/storage
exports.notifications = () => require('./Chrome/Notifications'); // https://developer.chrome.com/extensions/notifications
exports.createIPResolver = () => new IPResolver();

exports.createUDPSocket = (sourcePort) => { // https://developer.chrome.com/apps/sockets_udp
	return new UDPSocket(chrome.sockets.udp, sourcePort);
};
exports.createTCPSocket = () => { // https://developer.chrome.com/apps/sockets_tcp
	return new TCPSocket();
}



/*

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

	Get filepath
	function displayPath(fileEntry) {
		chrome.fileSystem.getDisplayPath(fileEntry, function(path) {
		console.log(path)
	});
*/
/*
	Read File
	var chosenFileEntry = null;

	chooseFileButton.addEventListener('click', function(e) {
		chrome.fileSystem.chooseEntry({type: 'openFile'}, function(readOnlyEntry) {
			readOnlyEntry.file(function(file) {
				var reader = new FileReader();
				reader.onerror = errorHandler;
				reader.onloadend = function(e) {
					console.log(e.target.result);
				};

				reader.readAsText(file);
			});
		});
	});
 */

/*
exports.getWifiMonitor = function wifiMonitor(){
	// https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIWifiMonitor
	// https://dxr.mozilla.org/mozilla-central/source/netwerk/wifi/nsIWifiMonitor.idl
	return Cc['@mozilla.org/wifi/monitor;1'].getService(Ci.nsIWifiMonitor);
};
exports.getMimeService = function mimeService(){
	return Cc["@mozilla.org/uriloader/external-helper-app-service;1"].getService(Ci.nsIMIMEService);
};


exports.windowUtils = () => require('sdk/window/utils'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/window_utils
exports.panel = () => require('sdk/panel'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/panel
*/