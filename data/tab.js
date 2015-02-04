var app = angular.module('Rotary', []);
app.controller('TabController', function($scope) {
	//var vm = this;
	$scope.title = 'Devices found on your network:';
	$scope.devices = [];

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
	};

	var removeDevice = function(device) {
		for(var i=$scope.devices.length-1; i>=0; i--) {
			if($scope.devices[i].address.href === device.address.href) {
				$scope.devices.splice(i,1);
			}
		}
		$scope.$apply();
	};

	var updateDevice = function(device) {
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
	};

	self.port.on('removedevice', removeDevice);

	self.port.on('updatedevice', updateDevice);

	self.port.on('newdevice', addDevice);

});
