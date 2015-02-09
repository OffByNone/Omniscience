//assume I am on the same subnet as the device.
//activate
//cfx run -b "C:\program files\nightly\firefox.exe" 
//jpm run -b "C:\program files\nightly\firefox.exe" -p ExtensionDev --debug -v


var searcher;
/**
 * extension startup
 */
exports.main = function main() {
	const buttons = require('sdk/ui/button/toggle'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/ui_button_toggle
	const notifications = require('sdk/notifications'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications
	const panels = require('sdk/panel'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/panel
	const storage = require('sdk/simple-storage'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/simple-storage
    const tabs = require("sdk/tabs");
    const timers = require('sdk/timers'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers
    const { URL } = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url

    const { Factory } = require('./Factories/Factory');
	const { Searcher } = require('./Searcher');
    const { HTTPServer } = require("./Network/HTTPServer");
    const { FilePicker } = require("./FilePicker");
    const { Sender } = require("./SenderDaemon");

    var sender;
    var factory = new Factory();
    var httpServer = factory.createHttpServer();
    httpServer.start(7895);
    
    var panel = panels.Panel({
         contentURL: './panel.html',
         contentScriptFile: ['./libs/angular.js', './panel.js'],
         contentStyleFile: './panel.css',
         onHide: function(){
            button.state('window', {checked: false});
         }
	 });
    panel.show();
    panel.hide();    
	var button = buttons.ToggleButton({
		id: 'rotary',
		label: 'Rotary',
		icon: {
			16: './icons/rotary-16.png',
			32: './icons/rotary-32.png',
			64: './icons/rotary-64.png'
		},
		onChange: onButtonChange
	});
	function onButtonChange(state) {
		if (state.checked) {
            panel.show({position: button});
			searcher.search();
            //openFocusTab('./panel.html',['./libs/angular.js', './panel.js']);
		}
	}
	 
	searcher = factory.createSearcher();
	searcher.devices = storage.devices || [];
	searcher.search();
	var pageWorker = null;

	searcher.on('removedevice', (device) => {
		if (pageWorker) pageWorker.port.emit('removedevice', device);
        panel.port.emit('removedevice', device);
		storage.devices = searcher.devices;
	});
	searcher.on('updatedevice', (device) => {
		if (pageWorker) pageWorker.port.emit('updatedevice', device);
        panel.port.emit('updatedevice', device);
        storage.devices = searcher.devices;
	});
	searcher.on('devicefound', (device) => {
		notifications.notify({
			title: 'Found new ' + device.model,
			text: device.name + " at " + device.address,
			iconURL: device.icons.length > 0 && device.icons[0].url ? device.icons[0].url.href : ""
		});
		if (pageWorker) pageWorker.port.emit('newdevice', device);
        panel.port.emit('newdevice', device);
		storage.devices = searcher.devices;
	});
	
    panel.port.on('heightChange', function (newHeight) {
        panel.height = newHeight;
    });
    
    panel.port.on('pickLocalFile', function(device, fileType){
        filePicker = factory.createFilePicker();
        var file = filePicker.openFile();
        var pickedFile = file ? {
                path: file.path,
                name: file.leafName
            } : null;
        panel.port.emit('pickedFile', device, pickedFile);
    });
    
    panel.port.on('launch', function(device){
        var filePath = "/" + device.file.name;
        var deviceIp = new URL(device.address).host;
        httpServer.registerFile(filePath, device.file.path);
        httpServer.registerDirectory("/VideoPlayer/","Y:\\Projects\\Github\\My Stuff\\Rotary\\data\\VideoPlayer\\");
        var serverIp = httpServer.getServerIp(deviceIp);
        sender= new Sender(deviceIp, serverIp);
        sender.launch("/VideoPlayer/Receiver/Receiver.html", filePath);
    });
    
    panel.port.on('executeCommand', function(command, device){
        sender.executeCommand(command);
    });    
    
	function openFocusTab(url, contentScriptFiles) {
		if (pageWorker) return pageWorker.tab.activate();

		tabs.open({
			url: url,
			onLoad: function(tab){
                pageWorker = tab.attach({
                    contentScriptFile: contentScriptFiles
                });
            },
			onClose: function (tab) {
				pageWorker = null;
			}
		});
	}
};
/**
 * extension shutdown
 */
exports.onUnload = function onUnload() {
	searcher.stopSearch();
};
