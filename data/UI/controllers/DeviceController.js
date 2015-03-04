"use strict";

rotaryApp.controller('DeviceController', function DeviceController($scope, $window, deviceService) {
    $scope.title = 'Devices on your network:';
    $scope.devices = [];
    $scope.deviceTypes = [];
    $scope.serviceTypes = [];
    
    $scope.setActiveDevice = function setActiveDevice(device){
        $scope.activeDevice = device;
    };
    $scope.pickLocalFile = function pickLocalFile(device){
        deviceService.chooseFile(device, device.fileType);
    };
    $scope.launch = function launch(device){
        deviceService.launch(device);
        hidePicker(device);
    };
    $scope.executeCommand = function executeCommand(device, command){
        deviceService.executeCommand(device, command);
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
    
    $scope.openFocusTab = function openFocusTab(){
        deviceService.openFocusTab();
    };
    
    $scope.setName = function setName(device, name){
        deviceService.setName(device, name);
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
    var addUpdateDevice = function addUpdateDevice(device) {
        var found = false;
        $scope.devices.forEach(function(scopeDevice){
            if(scopeDevice.address === device.address) {
                scopeDevice.name = device.name;
                if(typeof device.videoCapable !== 'undefined') scopeDevice.videoCapable = device.videoCapable;
                if(typeof device.imageCapable !== 'undefined') scopeDevice.imageCapable = device.imageCapable;
                if(typeof device.audioCapable !== 'undefined') scopeDevice.audioCapable = device.audioCapable;
                if(typeof device.mirrorCapable !== 'undefined') scopeDevice.mirrorCapable = device.mirrorCapable;
                
                if(typeof device.rawProtocolInfo !== 'undefined')scopeDevice.rawProtocolInfo = device.rawProtocolInfo;
                if(typeof device.rawDiscoveryInfo !== 'undefined')scopeDevice.rawDiscoveryInfo = device.rawDiscoveryInfo;
                
                found = true;
            }
        });
        
        if (!found) $scope.devices.push(device);
        
        addTypes(device);
        $scope.$apply();
    };
    var removeDevice = function removeDevice(device) {
        for(var i=$scope.devices.length-1; i>=0; i--)
          if($scope.devices[i].address === device.address)
            $scope.devices.splice(i, 1);
        
        removeTypes();
        $scope.$apply();
    };
    var addTypes = function addTypes(device){
        if(!$scope.deviceTypes.some(x=> x.name === device.type.name && x.urn === device.type.urn))
            $scope.deviceTypes.push(device.type);
        device.services.forEach(service => {
            if(!$scope.serviceTypes.some(x=> x.name === service.type.name && x.urn === service.type.urn))
                $scope.serviceTypes.push(service.type);
        });
    };
    var removeTypes = function removeTypes(){
        $scope.deviceTypes = $scope.deviceTypes.filter(deviceType => $scope.devices.some(device => device.type.name === deviceType.name && device.type.urn === deviceType.urn));
        $scope.serviceTypes = $scope.serviceTypes.filter(serviceType => $scope.devices.some(device => device.services.some(service => service.type.name === serviceType.name && service.type.urn === serviceType.urn)));
    };
    
    deviceService.onDeviceLost(removeDevice);
    deviceService.onDeviceFound(addUpdateDevice);
    deviceService.onFileChosen(setFile);    
});