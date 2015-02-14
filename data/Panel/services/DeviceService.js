'use strict';

rotaryApp.service('deviceService', function($window) {
	return {
        onDeviceLost: function onDeviceLost(callback){
            $window.self.port.on('deviceLost', callback);
        },
        onDeviceFound: function onDeviceFound(callback){
            $window.self.port.on('deviceFound', callback);
        },
        onFileChosen: function onFileChosen(callback){
            $window.self.port.on('pickedFile', callback);
        },
        sendCommand: function sendCommand(command, device){
            $window.self.port.emit('sendCommand', command, device);
        },
        launch: function launch(device){
            $window.self.port.emit("launch", device);
        },
        chooseFile: function chooseFile(device, fileType){
            $window.self.port.emit("chooseFile", device, fileType);
        },
        updateHeight: function updateHeight(){
            var newHeight = $window.document.body.parentNode.offsetHeight;
            $window.self.port.emit('updateHeight', newHeight);
        }
	};
});