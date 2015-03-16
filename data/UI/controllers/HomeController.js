"use strict";

rotaryApp.controller('HomeController', function HomeController($scope, eventService) {
    $scope.devices = [];
    $scope.deviceTypes = [];
    $scope.serviceTypes = [];

    var addUpdateDevice = function addUpdateDevice(device) {
        var found = false;
        $scope.devices.forEach(function (scopeDevice) {
            if (scopeDevice.address === device.address) {
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

        if (!found) {
            device.services.forEach( service => service.htmlId = service.id.replace(/[\:\.]/g,"") );
            $scope.devices.push(device);
        }

        addTypes(device);
    };
    var removeDevice = function removeDevice(device) {
        for(var i=$scope.devices.length-1; i>=0; i--)
          if($scope.devices[i].address === device.address)
            $scope.devices.splice(i, 1);

        removeTypes();
    };
    var addTypes = function addTypes(device) {
        if(!$scope.deviceTypes.some(x=> x.name === device.type.name && x.urn === device.type.urn))
            $scope.deviceTypes.push(device.type);
        device.services.forEach(service => {
            if(!$scope.serviceTypes.some(x=> x.name === service.type.name && x.urn === service.type.urn))
                $scope.serviceTypes.push(service.type);
        });
    };
    var removeTypes = function removeTypes() {
        $scope.deviceTypes = $scope.deviceTypes.filter(deviceType => $scope.devices.some(device => device.type.name === deviceType.name && device.type.urn === deviceType.urn));
        $scope.serviceTypes = $scope.serviceTypes.filter(serviceType => $scope.devices.some(device => device.services.some(service => service.type.name === serviceType.name && service.type.urn === serviceType.urn)));
    };

    var eventOccured = function eventOccured(device, event, request) {
    };

    eventService.on('deviceLost', removeDevice);
    eventService.on('deviceFound', addUpdateDevice);
    eventService.on('EventOccured', eventOccured);

    eventService.emit("loadDevices");
});