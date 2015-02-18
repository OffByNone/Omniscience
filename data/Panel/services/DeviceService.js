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
        executeCommand: function executeCommand(device, command){
            $window.self.port.emit('executeCommand', device, command);
        },
        setProperty: function setProperty(device, property){
            $window.self.port.emit('setProperty', device, property);
        },        
        launch: function launch(device){
            $window.self.port.emit("launch", device);
        },
        chooseFile: function chooseFile(device, fileType){
            $window.self.port.emit("chooseFile", device, fileType);
        },
        updateHeight: function updateHeight(){
            //todo: add min and max height -- might not need min
            var newHeight = $window.document.body.parentNode.offsetHeight;
            $window.self.port.emit('updateHeight', newHeight);
        }
	};
});