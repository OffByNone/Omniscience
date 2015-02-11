'use strict';

rotaryApp.service('deviceService', function() {
	return {
        onDeviceLost: function onDeviceLost(callback){
            self.port.on('deviceLost', callback);
        },
        onDeviceFound: function onDeviceFound(callback){
            self.port.on('deviceFound', callback);
        },
        onFileChosen: function onFileChosen(callback){
            self.port.on('pickedFile', callback);
        },
        sendCommand: function sendCommand(command, device){
            self.port.emit('sendCommand', command, device);
        },
        launch: function launch(device){
            self.port.emit("launch", device);
        },
        chooseFile: function chooseFile(device, fileType){
            self.port.emit("chooseFile", device, fileType);
        },
        updateHeight: function updateHeight(){
            var newHeight = document.body.parentNode.offsetHeight;
            self.port.emit('updateHeight', newHeight);
        }
	};
});