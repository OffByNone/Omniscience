var app = angular.module('Rotary', []);
app.controller('PanelController', function($scope) {
    //var vm = this;
    $scope.title = 'Devices on your network:';
    $scope.devices = [];

    $scope.pickLocalFile = function pickLocalFile(device){
        self.port.emit("pickLocalFile", device, device.fileType);
    };
    $scope.launch = function launch(device){
        self.port.emit("launch", device);
        device.isRunning = true;
        device.showAudioPicker = false; 
        device.showVideoPicker = false;
    };
    $scope.executeCommand = function executeCommand(device, command){
        self.port.emit('executeCommand', command, device);
    };

    
    setFile = function setFile(device, file){
        var dev = $scope.devices.filter(function(x){
            return x.address == device.address;
        })[0];
        dev.file = file;
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

    var addDevice = function(device) {
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
        $scope.$apply();    
    };
    var removeDevice = function(device) {
        for(var i=$scope.devices.length-1; i>=0; i--) {
          if($scope.devices[i].address === device.address) {
            $scope.devices.splice(i, 1);
          }
        }
        $scope.$apply();
    };
    var updateDevice = function(device) {
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
        $scope.$apply();
    };

    self.port.on('removedevice', removeDevice);
    self.port.on('updatedevice', updateDevice);
    self.port.on('newdevice', addDevice);
    self.port.on('pickedFile', setFile);
    
});
app.directive('rotaryUpdateHeight',function () {
    //todo add min and max heights
    //Something in here isn't working right
    //I am thinking it is firing too soon,
    //before the addition/removal from the dom
    return {
        link: function ($scope) {
            $scope.$evalAsync(function(){
                var newHeight = document.body.parentNode.offsetHeight;
                self.port.emit('heightChange', newHeight);
            });
        }
    }
});