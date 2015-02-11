"use strict";

rotaryApp.controller('DeviceController', function($scope, deviceService) {
    //var vm = this;
    $scope.title = 'Devices on your network:';
    $scope.devices = [];

    $scope.pickLocalFile = function pickLocalFile(device){
        deviceService.chooseFile(device, device.fileType);
    };
    $scope.launch = function launch(device){
        deviceService.launch(device);
        hidePicker(device);
    };
    $scope.executeCommand = function executeCommand(device, command){
        deviceService.sendCommand(command, device);
    };

    var setFile = function setFile(device, file){
        var dev = $scope.devices.filter(function(x){
            return x.address == device.address;
        })[0];
        dev.file = file;
    };
    
    var hidePicker = function hidePicker(device){
        device.isRunning = true;
        device.showAudioPicker = false; 
        device.showVideoPicker = false;  
    };
    
    $scope.showHideAudioPicker = function showHideAudioPicker(device){
        device.showVideoPicker = false;
        device.showAudioPicker = !device.showAudioPicker;
        device.showMirrorPicker = false;
        device.fileType = 'audio';
    };
    $scope.showHideVideoPicker = function showHideVideoPicker(device){
        device.showVideoPicker = !device.showVideoPicker;
        device.showAudioPicker = false;
        device.showMirrorPicker = false;
        device.fileType = 'video';
    };
    $scope.showHideMirrorPicker = function showHideMirrorPicker(device){
        device.showVideoPicker = false;
        device.showAudioPicker = false;
        device.showMirrorPicker = !device.showMirrorPicker;
    };

    var addUpdateDevice = function(device) {
        var found = false;
        for(var i=$scope.devices.length-1; i>=0; i--) {
          if($scope.devices[i].address === device.address) {
            //$scope.devices.splice(i, 1, device);
            found = true;
          }
        }
        if (!found) {
          $scope.devices.push(device);
        }
        deviceService.updateHeight();
        $scope.$apply();
    };
    var removeDevice = function(device) {
        for(var i=$scope.devices.length-1; i>=0; i--) {
          if($scope.devices[i].address === device.address) {
            $scope.devices.splice(i, 1);
          }
        }
        deviceService.updateHeight();
        $scope.$apply();
    };

    deviceService.onDeviceLost(removeDevice);
    deviceService.onDeviceFound(addUpdateDevice);
    deviceService.onFileChosen(setFile);
});