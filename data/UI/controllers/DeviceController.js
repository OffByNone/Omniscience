"use strict";

rotaryApp.controller('DeviceController', function DeviceController($scope, $routeParams, eventService) {
    $scope.title = 'Devices on your network:';
    $scope.devices = [];
    $scope.deviceTypes = [];
    $scope.serviceTypes = [];
    $scope.deviceId = $routeParams.deviceId;
	$scope.playlist = [
		{name: "test1", currentTime:"2:35", currentTimeInSeconds: 155, duration: "3:15", durationInSeconds: 195, fileName: "test track 1" },
		{name: "test8", currentTime:"1:35", currentTimeInSeconds: 95, duration: "3:25", durationInSeconds: 205, fileName: "test track 8" },
		{name: "test3", currentTime:"2:03", currentTimeInSeconds: 123, duration: "2:35", durationInSeconds: 155, fileName: "test track 3" },
		{name: "test4", currentTime:"3:00", currentTimeInSeconds: 180, duration: "3:05", durationInSeconds: 185, fileName: "test track 4" },
		{name: "test6" , currentTime:"3:45", currentTimeInSeconds: 225, duration: "4:05", durationInSeconds: 245, fileName: "test track 6" },
		{name: "test7" , currentTime:"0:35", currentTimeInSeconds: 35, duration: "1:55", durationInSeconds: 175, fileName: "test track 7" },
		{name: "test2" , currentTime:"1:25", currentTimeInSeconds: 85, duration: "1:42", durationInSeconds: 162, fileName: "test track 2" },
		{name: "test9" , currentTime:"0:05", currentTimeInSeconds: 5, duration: "3:56", durationInSeconds: 234, fileName: "test track 9" }
    ];
    
    $scope.currentFilePercent = function currentFilePercent(){
        return ($scope.activeFile.currentTimeInSeconds / $scope.activeFile.durationInSeconds) * 100;
    };
	$scope.activeFile = $scope.playlist[0];    
    
    $scope.play = function(){
        eventService.emit('play', $scope.activeDevice);
    };
    $scope.pause = function(){
        eventService.emit('pause', $scope.activeDevice);
    };
    $scope.previous = function(){
        eventService.emit('previous', $scope.activeDevice);
    };
    $scope.next = function(){
        eventService.emit('next', $scope.activeDevice);
    };
    $scope.stop = function(){
        eventService.emit('stop', $scope.activeDevice);
    };
	$scope.setActiveFile = function(file){
		$scope.activeFile = file;
        $scope.activeDevice.file = file;
        eventService.emit('launch', $scope.activeDevice);
	};
    $scope.pickLocalFile = function pickLocalFile(){
        eventService.emit('chooseFile', $scope.activeDevice, $scope.activeDevice.fileType);
    };
    $scope.launch = function launch(){
        eventService.emit('launch', $scope.activeDevice);
        //todo: should close picker
        //todo: pull in the file info, and what to do if both url and file are present
        $scope.playlist = [$scope.activeDevice.file];
    };
    $scope.addToPlaylist = function addToPlaylist(){
        //should not close picker
        //todo: pull in the file info, and what to do if both url and file are present
        $scope.playlist.push($scope.activeDevice.file);
    };
    var setFile = function setFile(file){
        $scope.activeDevice.file = file;
    };
    
    $scope.openFocusTab = function openFocusTab(){
        eventService.emit('openFocusTab');
    };
    $scope.setName = function setName(name){
        eventService.emit('setName', $scope.activeDevice, name);
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
        
        if (!found){
            device.services.forEach( service => service.htmlId = service.id.replace(/[\:\.]/g,"") );
            $scope.devices.push(device);
        }
		device.id = md5(device.address);
		
		if(device.id === $routeParams.deviceId)
			$scope.activeDevice = device;

        addTypes(device);
    };
    var removeDevice = function removeDevice(device) {
        for(var i=$scope.devices.length-1; i>=0; i--)
          if($scope.devices[i].address === device.address)
            $scope.devices.splice(i, 1);
        
        removeTypes();
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
    
    eventService.on('deviceLost', removeDevice);
    eventService.on('deviceFound', addUpdateDevice);
    eventService.on('fileChosen', setFile);

	//window.loadTestDevices();
    eventService.emit("loadDevices");
});