"use strict";

rotaryApp.controller('DeviceController', function DeviceController($scope, $routeParams, eventService) {
    $scope.title = 'Devices on your network:';
    $scope.devices = [];
    $scope.deviceTypes = [];
    $scope.serviceTypes = [];
    $scope.deviceId = $routeParams.deviceId;
	$scope.playlist = [];
    $scope.activeFile = {};
    $scope.filePicker = {};
    $scope.filePickerOpen = true;

    //{name: "test1", currentTime:"2:35", currentTimeInSeconds: 155, duration: "3:15", durationInSeconds: 195, fileName: "test track 1", path= "file path here" }

    $scope.currentFilePercent = function currentFilePercent(){
        return $scope.activeFile == null ? null : ($scope.activeFile.currentTimeInSeconds / $scope.activeFile.durationInSeconds) * 100;
    };
    $scope.play = function play(){
        eventService.emit('play', $scope.activeDevice);
    };
    $scope.pause = function pause(){
        eventService.emit('pause', $scope.activeDevice);
    };
    $scope.stop = function stop(){
        eventService.emit('stop', $scope.activeDevice);
    };
    $scope.previous = function previous(){
        for(var i in $scope.playlist)
            if($scope.playlist.hasOwnProperty(i) && $scope.playlist[i] === $scope.activeFile)
                if(i == 0) return $scope.launch($scope.playlist[$scope.playlist.length-1]); //we are the first file, so launch the last file
                else return $scope.launch($scope.playlist[Number(i)-1]); //we are not the first file so launch the previous
    }
    $scope.next = function next(){
        for(var i in $scope.playlist)
            if($scope.playlist.hasOwnProperty(i) && $scope.playlist[i] === $scope.activeFile)
                if(i == $scope.playlist.length - 1) return $scope.launch($scope.playlist[0]); //we are the last file, so launch the first file
                else return $scope.launch($scope.playlist[Number(i)+1]); //we are not the last file so launch the next
    };
    $scope.pickLocalFile = function pickLocalFile(){
        eventService.emit('chooseFile', $scope.activeDevice, $scope.activeDevice.fileType);
    };
    function setNewFile(file){
        $scope.filePicker.localFile = file;
    }
    function getChosenFile(){
        //todo: pull in the file info - such as duration, artist, song/video name
        var file;

        if($scope.filePicker.url && $scope.filePicker.url.path && $scope.filePicker.url.path.length > 0){
            try{
                new URL($scope.filePicker.url.path);
            }
            catch (e){
                //todo: invalid url should report that to user and abort
            }

            //set file name from url
            $scope.filePicker.url.name = $scope.filePicker.url.path.replace(/^.*(\\|\/|\:)/, '');

            file = $scope.filePicker.url;
        }
        else if($scope.filePicker.localFile && $scope.filePicker.localFile.path && $scope.filePicker.localFile.path.length > 0)
            file = $scope.filePicker.localFile;

        $scope.filePicker = {};
            //clear out the url and local file fields
        $scope.playlist.push(file);

        return file;
    }
    $scope.launch = function launch(file){
        //if a file is passed in, use that. Otherwise pull from the file picker box
        if(!file) file = getChosenFile();

        //todo: this is going to cause the same files to be mapped more than once
        //should make sure on the backend that if the file is already mapped we dont map it again
        //also should throw in something random into the path of the map incase someone wants to
        //play two files of the same name --maybe throw a folder with the name of a guid in the path
        eventService.emit('launch', $scope.activeDevice, file);
        $scope.activeFile = file;
    };
    $scope.addToPlaylist = function addToPlaylist(){
        getChosenFile();
    };
    $scope.removeFromPlaylist = function removeFromPlaylist(file){
        for(var i in $scope.playlist)
            if($scope.playlist.hasOwnProperty(i) && $scope.playlist[i] === file){
                if(file === $scope.activeFile){
                    if($scope.playlist.length > 1) $scope.next();
                    else $scope.stop();
                }
                $scope.playlist.splice(i,1);
                break;
            }
    };
    $scope.clearPlaylist = function clearPlaylist(){
        $scope.playlist = [];
        $scope.stop();
    };
    $scope.randomizePlaylist = function randomizePlaylist(){
        shuffle($scope.playlist);
    };
    $scope.setName = function setName(name){
        eventService.emit('setName', $scope.activeDevice, name);
    };

    var addUpdateDevice = function addUpdateDevice(device) {
        var found = false;
        $scope.devices.forEach(function(scopeDevice){
            if(scopeDevice.address === device.address) {
                scopeDevice.name = device.name;

                //many of the below properties are found on the getAdditionalInformation search and therefore not
                //defined when the device first appears.  This means that on a subsquent search if not for the null
                //checks the devices would for a short time have incorrect information shown
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

        if (device.id === $routeParams.deviceId)
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

    var eventOccured = function eventOccured(device, event, request) {
    	if (!event) { console.log("event is undefined"); return; }
    	if (event.hasOwnProperty('Mute'))
    		device.isMuted = event.Mute === "1";
    	if (event.hasOwnProperty('Volume'))
    		device.Volume = Number(event.Volume);
    	if (event.hasOwnProperty('TransportState'))
    		device.TransportState = event.TransportState;
    	if (event.hasOwnProperty('CurrentTransportActions'))
    		device.CurrentTransportActions = event.CurrentTransportActions;
    	if (event.hasOwnProperty('AVTransportURI'))
    		device.AVTransportURI = event.AVTransportURI;
    	if (event.hasOwnProperty('AVTransportURIMetaData'))
    		device.AVTransportURIMetaData = event.AVTransportURIMetaData
    	if (event.hasOwnProperty('CurrentTrackURI'))
    		device.CurrentTrackURI = event.CurrentTrackURI;
    	if (event.hasOwnProperty('CurrentTrackMetaData'))
    		device.CurrentTrackMetaData = event.CurrentTrackMetaData;
    	if (event.hasOwnProperty('PossiblePlaybackStorageMedia'))
    		device.PossiblePlaybackStorageMedia = event.PossiblePlaybackStorageMedia;
    	if (event.hasOwnProperty('PossibleRecordStorageMedia'))
    		device.PossibleRecordStorageMedia = event.PossibleRecordStorageMedia;
    	if (event.hasOwnProperty('PossibleRecordQualityModes'))
    		device.PossibleRecordQualityModes = event.PossibleRecordQualityModes;
    	if (event.hasOwnProperty('NumberOfTracks'))
    		device.NumberOfTracks = event.NumberOfTracks
    	if (event.hasOwnProperty('CurrentMediaDuration'))
    		device.CurrentMediaDuration = event.CurrentMediaDuration;
    	if (event.hasOwnProperty('NextAVTransportURI'))
    		device.NextAVTransportURI = event.NextAVTransportURI;
    	if (event.hasOwnProperty('NextAVTransportURIMetaData'))
    		device.NextAVTransportURIMetaData = event.NextAVTransportURIMetaData;
    	if (event.hasOwnProperty('PlaybackStorageMedium'))
    		device.PlaybackStorageMedium = event.PlaybackStorageMedium;
    	if (event.hasOwnProperty('RecordStorageMedium'))
    		device.RecordStorageMedium = event.RecordStorageMedium;
    	if (event.hasOwnProperty('RecordMediumWriteStatus'))
    		device.RecordMediumWriteStatus = event.RecordMediumWriteStatus
    	if (event.hasOwnProperty('CurrentTrack'))
    		device.CurrentTrack = event.CurrentTrack;
    	if (event.hasOwnProperty('TransportStatus'))
    		device.TransportStatus = event.TransportStatus;
    	if (event.hasOwnProperty('TransportPlaySpeed'))
    		device.TransportPlaySpeed = event.TransportPlaySpeed
    	if (event.hasOwnProperty('CurrentPlayMode'))
    		device.CurrentPlayMode = event.CurrentPlayMode;
    	if (event.hasOwnProperty('CurrentRecordQualityMode'))
    		device.CurrentRecordQualityMode = event.CurrentRecordQualityMode;

    	console.log(JSON.stringify(event));
    };

    eventService.on( 'deviceLost', removeDevice );
    eventService.on( 'deviceFound', addUpdateDevice );
    eventService.on( 'fileChosen', setNewFile );
    eventService.on( 'EventOccured', eventOccured );

    eventService.emit("loadDevices");

    function shuffle(array) {
    	///Fisher–Yates Shuffle
    	var currentIndex = array.length, temporaryValue, randomIndex;

    	// While there remain elements to shuffle...
    	while (0 !== currentIndex) {
    		// Pick a remaining element...
    		randomIndex = Math.floor(Math.random() * currentIndex);
    		currentIndex -= 1;

    		// And swap it with the current element.
    		temporaryValue = array[currentIndex];
    		array[currentIndex] = array[randomIndex];
    		array[randomIndex] = temporaryValue;
    	}

    	return array;
    }

	//window.loadTestDevices();
});