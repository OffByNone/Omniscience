var app = angular.module('Rotary', []);
app.controller('PanelController', function($scope) {
  //var vm = this;
  $scope.title = 'Devices on your network:';
  $scope.devices = [];

    $scope.play = function(device){
        self.port.emit("play", device);
    };
    
  $scope.$watch('devices', function(){
    //todo add min and max heights
    //Something in here isn't working right
    //I am thinking it is firing too soon,
    //before the addition/removal from the dom

    //updateHeight();

  }, true);

  var addDevice = function(device) {
    var found = false;
    for(var i=$scope.devices.length-1; i>=0; i--) {
      if($scope.devices[i].address.href === device.address.href) {
        $scope.devices.splice(i,1, device);
        found = true;
      }
    }
    if (!found) {
      $scope.devices.push(device);
    }
    $scope.$apply();
    updateHeight();
  };

  var removeDevice = function(device) {
    for(var i=$scope.devices.length-1; i>=0; i--) {
      if($scope.devices[i].address === device.address) {
        $scope.devices.splice(i,1);
      }
    }
    $scope.$apply();
    updateHeight();
  };

  var updateDevice = function(device) {
    var found = false;
    for(var i=$scope.devices.length-1; i>=0; i--) {
      if($scope.devices[i].address === device.address) {
        $scope.devices.splice(i,1, device);
        found = true;
      }
    }
    if (!found) {
      $scope.devices.push(device);
    }
    $scope.$apply();
    updateHeight();
  };

  self.port.on('removedevice', removeDevice);

  self.port.on('updatedevice', updateDevice);

  self.port.on('newdevice', addDevice);

  var updateHeight = function(){
    //I had this inside the $scope.$watch but it fired too soon
    //would often make it too small.  I added this function
    //and call it from the three mutators but this is ugly
    //It would be better if we could call it on an after $scope.devices mutates

    var newHeight = document.body.parentNode.offsetHeight;
    self.port.emit('heightChange', newHeight);
  };

});