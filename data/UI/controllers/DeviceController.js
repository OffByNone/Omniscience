"use strict";

rotaryApp.controller('DeviceController', function DeviceController($scope, $routeParams, eventService, $window) {
	$scope.title = 'Devices on your network:';
	$scope.devices = [];
	$scope.deviceTypes = [];
	$scope.serviceTypes = [];
	$scope.deviceId = $routeParams.deviceId;
	$scope.playlist = [];
	$scope.currentTrack = {};
	$scope.currentMedia = {};
	$scope.filePicker = {};
	$scope.filePickerOpen = true;
	$scope.playback = {};


	$scope.currentFilePercent = function currentFilePercent() {
		return $scope.currentTrack == null ? null : ($scope.currentTrack.currentTimeInSeconds / $scope.currentTrack.durationInSeconds) * 100;
	};
	$scope.canExecuteAction = function (action) {
		return $scope.availableActions == null ? true : $scope.availableActions.every(availableAction => availableAction != action);
	};
	$scope.play = function play() {
		setState('Play');
		eventService.emit('play', $scope.activeDevice);
	};
	$scope.pause = function pause() {
		setState('Pause');
		eventService.emit('pause', $scope.activeDevice);
	};
	$scope.stop = function stop() {
		setState('Stop');
		eventService.emit('stop', $scope.activeDevice);
	};
	$scope.previous = function previous() {
		for (var i in $scope.playlist)
			if ($scope.playlist.hasOwnProperty(i) && $scope.playlist[i] === $scope.currentTrack.activeFile)
				if (i == 0) return $scope.launch($scope.playlist[$scope.playlist.length - 1]); //we are the first file, so launch the last file
				else return $scope.launch($scope.playlist[Number(i) - 1]); //we are not the first file so launch the previous
	}
	$scope.next = function next(abideByRepeat) {
		for (var i in $scope.playlist)
			if ($scope.playlist.hasOwnProperty(i) && $scope.playlist[i] === $scope.currentTrack.activeFile)
				if (i == $scope.playlist.length - 1)
					if (!abideByRepeat || $scope.playback.repeat) return $scope.launch($scope.playlist[0]); //we are the last file and either pushed the next button, or repeat is enabled, so launch the first file
					else {//we are the last file, didn't push the button and repeat is not enabled.  Stop playback, then load the first file
						$scope.stop();
						$scope.load($scope.playlist[0]);
					}
				else return $scope.launch($scope.playlist[Number(i) + 1]); //we are not the last file so launch the next
	};
	$scope.toggleMute = function toggleMute(device) {
		eventService.emit('toggleMute', device);
		device.isMuted = !device.isMuted;
	};
	$scope.setVolume = function setVolume(device, newVolume) {
		device.volume = newVolume;
		eventService.emit('setVolume', device, newVolume);
	};
	$scope.incrementVolume = function incrementVolume(device) {
		$scope.setVolume(device, Number(device.volume) + 1);
	};
	$scope.decrementVolume = function decrementVolume(device) {
		$scope.setVolume(device, Number(device.volume) - 1);
	};
	$scope.togglePlayState = function togglePlayState(device) {
		if ($scope.playback.isPlaying) $scope.pause();
		else $scope.play();

		$scope.playback.isPlaying = !$scope.playback.isPlaying;
	};
	function setState(newState) {
		$scope.playback.state = newState;
		$scope.playback.isPlaying = newState.toLowerCase() == "playing";
	}


	function setActiveFile(fileUri) {
		if (fileUri != null) {
			var file = getFile(fileUri);

			if (file == null) {
				file = { name: decodeURI(getNameFromUrl(fileUri)), path: fileUri };
				$scope.playlist.push(file);
			}
		}
		$scope.currentTrack.activeFile = file;

		return $scope.currentTrack.activeFile;
	}
	function setFileInformation(event) {

		if (event.hasOwnProperty('CurrentTrackURI')) {
			$scope.currentTrack.uri = event.CurrentTrackURI;
			//setActiveFile($scope.currentTrack.uri); todo: dont have the uri of local files yet so I can't properly do this comparison.
		}

		if (event.hasOwnProperty('AVTransportURI')) $scope.currentMedia.uri = event.AVTransportURI;
		if (event.hasOwnProperty('CurrentTrackMetaData')) $scope.currentTrack.metadata = event.CurrentTrackMetaData;
		if (event.hasOwnProperty('AVTransportURIMetaData')) $scope.currentMedia.metadata = event.AVTransportURIMetaData;
		if (event.hasOwnProperty('CurrentTrackDuration')) $scope.currentTrack.duration = event.CurrentTrackDuration;
		if (event.hasOwnProperty('CurrentMediaDuration')) $scope.currentMedia.duration = event.CurrentMediaDuration;
		if (event.hasOwnProperty("RelTime")) $scope.currentTrack.currentTime = event.RelTime;
		if (event.hasOwnProperty('CurrentTrack')) $scope.currentTrack.trackNumber = event.CurrentTrack;
	}



	$scope.addToPlaylist = function addToPlaylist() {
		//Adds files to playlist from file picker box and returns the added files
		var files = getChosenFiles();
		files.forEach(file => $scope.playlist.push(file));

		return files;
	};
	$scope.removeFromPlaylist = function removeFromPlaylist(file) {
		for (var i in $scope.playlist)
			if ($scope.playlist.hasOwnProperty(i) && $scope.playlist[i] === file) {
				if (file === $scope.currentTrack.activeFile) {
					if ($scope.playlist.length > 1) $scope.next(true);
					else $scope.stop();
				}
				$scope.playlist.splice(i, 1);
				break;
			}
	};
	$scope.clearPlaylist = function clearPlaylist() {
		$scope.playlist = [];
		$scope.stop();
	};
	$scope.randomizePlaylist = function randomizePlaylist() {
		shuffle($scope.playlist);
	};
	$scope.launch = function launch(file) {
		//todo: eventually change this to call load -> play, to do that however we will need to get
		//events from the backend when load has succeeded so we know when it is safe to call play

		//if a file is passed in, use that. Otherwise pull from the file picker box
		var files = [];

		if (!file) // no file is passed in, try to get a file from the file picker box
		{
			files = $scope.addToPlaylist();
			if (files.length == 0) return null; //no file in the picker box either, return null.  todo: probably handle this better
		}
		else
			files.push(file);

		//todo: this is going to cause the same files to be mapped more than once
		//should make sure on the backend that if the file is already mapped we don't map it again
		//also should throw in something random into the path of the map in case someone wants to
		//play two files of the same name --maybe throw a folder with the name of a guid in the path
		eventService.emit('launch', $scope.activeDevice, files[0]);
		$scope.currentTrack.activeFile = files[0];
	};
	$scope.load = function load(file) {
		//if a file is passed in, use that. Otherwise pull from the file picker box
		var files = [];

		if (!file) // no file is passed in, try to get a file from the file picker box
		{
			files = $scope.addToPlaylist();
			if (files.length == 0) return null; //no file in the picker box either, return null.  todo: probably handle this better
		}
		else
			files.push(file);

		//todo: this is going to cause the same files to be mapped more than once
		//should make sure on the backend that if the file is already mapped we don't map it again
		//also should throw in something random into the path of the map in case someone wants to
		//play two files of the same name --maybe throw a folder with the name of a guid in the path
		eventService.emit('load', $scope.activeDevice, files[0]);
		$scope.currentTrack.activeFile = files[0];
	};
	$scope.pickLocalFile = function pickLocalFile() {
		eventService.emit('chooseFile', $scope.activeDevice, $scope.activeDevice.fileType);
	};
	function getFile(fileUri) {
		var file = $scope.playlist == null ? null : $scope.playlist.filter(item => item.path === fileUri);
		return file == null ? null : file[0];
	}
	function getChosenFiles() {
		//todo: pull in the file info - such as duration, artist, song/video name
		var files = [];

		if ($scope.filePicker.urlPath && $scope.filePicker.urlPath.length > 0) {
			try {
				new URL($scope.filePicker.urlPath);
			}
			catch (e) {
				//todo: invalid url should report that to user and abort
			}
			$scope.filePicker.url = {
				path: $scope.filePicker.urlPath,
				name: $scope.filePicker.urlPath.replace(/^.*(\\|\/|\:)/, '')//set file name from url
			};

			files.push($scope.filePicker.url);
		}
		else if ($scope.filePicker.localFiles && $scope.filePicker.localFiles.length > 0)
			files = $scope.filePicker.localFiles;
		else return []; //no files are selected and url isn't set so don't do anything, just return

		$scope.filePicker = {}; //clear out the url and local file fields

		return files;
	}
	function setNewFiles(files) {
		files.forEach(file => file.isLocal = true);

		$scope.filePicker.localFiles = files;

		if (files == null || files.length == 0) { // no files selected
			$scope.filePicker.localFile = "";
			$scope.filePicker.paths = "";
		}
		else if (files.length == 1) { // one file selected
			$scope.filePicker.localFile = files[0].path;
			$scope.filePicker.paths = "";
		}
		else {  // multiple files selected
			$scope.filePicker.localFile = "Multiple Files Selected";
			$scope.filePicker.paths = files.map(file => file.path).join("\n");
		}
	}
	function getNameFromUrl(url) {
		if (!(url instanceof URL)) url = new URL(url);
		return url.pathname.replace(/^.*(\\|\/|\:)/, '');
	}
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


	$scope.setName = function setName(name) {
		eventService.emit('setName', $scope.activeDevice, name);
	};


	$scope.refreshDevices = function refreshDevices() {
		eventService.emit('refreshDevices');
	};
	$scope.loadDevices = function loadDevices() {
		eventService.emit("loadDevices");
	};
	function addUpdateDevice(device) {
		var found = false;
		$scope.devices.forEach(function (scopeDevice) {
			if (scopeDevice.id === device.id) {
				scopeDevice.name = device.name;

				//many of the below properties are found on the getAdditionalInformation search and therefore not
				//defined when the device first appears.  This means that on a subsequent search if not for the null
				//checks the devices would for a short time have incorrect information shown
				if (device.hasOwnProperty(device.videoCapable)) scopeDevice.videoCapable = device.videoCapable;
				if (device.hasOwnProperty(device.imageCapable)) scopeDevice.imageCapable = device.imageCapable;
				if (device.hasOwnProperty(device.audioCapable)) scopeDevice.audioCapable = device.audioCapable;
				if (device.hasOwnProperty(device.mirrorCapable)) scopeDevice.mirrorCapable = device.mirrorCapable;

				if (device.hasOwnProperty(device.isMuted)) scopeDevice.isMuted = device.isMuted;
				if (device.hasOwnProperty(device.volume)) scopeDevice.volume = device.volume;
				if (device.hasOwnProperty(device.presets)) scopeDevice.presets = device.presets;
				if (device.hasOwnProperty(device.currentConnectionIds)) scopeDevice.currentConnectionIds = device.currentConnectionIds;

				if (device.hasOwnProperty(device.protocolInfo)) scopeDevice.protocolInfo = device.protocolInfo;
				if (device.hasOwnProperty(device.rawDiscoveryInfo)) scopeDevice.rawDiscoveryInfo = device.rawDiscoveryInfo;
				if (device.hasOwnProperty(device.currentConnectionInfo)) scopeDevice.currentConnectionInfo = device.currentConnectionInfo;
				if (device.hasOwnProperty(device.mediaInfo)) scopeDevice.mediaInfo = device.mediaInfo;
				if (device.hasOwnProperty(device.transportInfo)) scopeDevice.transportInfo = device.transportInfo;
				if (device.hasOwnProperty(device.positionInfo)) scopeDevice.positionInfo = device.positionInfo;
				if (device.hasOwnProperty(device.deviceCapabilities)) scopeDevice.deviceCapabilities = device.deviceCapabilities;
				if (device.hasOwnProperty(device.transportSettings)) scopeDevice.transportSettings = device.transportSettings;
				if (device.hasOwnProperty(device.currentTransportActions)) scopeDevice.currentTransportActions = device.currentTransportActions;

				found = true;
			}
		});

		if (!found) {
			device.services.forEach(service => service.htmlId = service.id.replace(/[\:\.]/g, ""));
			$scope.devices.push(device);

			if (device.id === $routeParams.deviceId) {
				$scope.activeDevice = device;

				if (!$scope.protocolInfoFilter) { //todo: I don't like this.  Find a better way to show the first available capability
					if (device.videoCapable)
						$scope.protocolInfoFilter = 'video';
					else if (device.audioCapable)
						$scope.protocolInfoFilter = 'audio';
					else if (device.imageCapable)
						$scope.protocolInfoFilter = 'image';
					else if (device.mirrorCapable)
						$scope.protocolInfoFilter = 'mirror';
				}
			}
		}

		addTypes(device);
	}
	function removeDevice(device) {
		for (var i = $scope.devices.length - 1; i >= 0; i--)
			if ($scope.devices[i].id === device.id)
				$scope.devices.splice(i, 1);

		removeTypes();
	}
	function addTypes(device) {
		if (!$scope.deviceTypes.some(x=> x.name === device.type.name && x.urn === device.type.urn))
			$scope.deviceTypes.push(device.type);
		device.services.forEach(service => {
			if (!$scope.serviceTypes.some(x=> x.name === service.type.name && x.urn === service.type.urn))
				$scope.serviceTypes.push(service.type);
		});
	}
	function removeTypes() {
		$scope.deviceTypes = $scope.deviceTypes.filter(deviceType => $scope.devices.some(device => device.type.name === deviceType.name && device.type.urn === deviceType.urn));
		$scope.serviceTypes = $scope.serviceTypes.filter(serviceType => $scope.devices.some(device => device.services.some(service => service.type.name === serviceType.name && service.type.urn === serviceType.urn)));
	}
	function setDeviceProperties(event) {
		if (event.hasOwnProperty('Mute'))
			$scope.activeDevice.isMuted = event.Mute === "1";
		if (event.hasOwnProperty('Volume'))
			$scope.activeDevice.volume = Number(event.Volume);

		var CurrentTransportActions = {
			0: 'Play',
			1: 'Stop',
			2: 'Pause',
			3: 'Seek',
			4: 'Next',
			5: 'Previous',
			6: 'Record'
		};

		if (event.hasOwnProperty('CurrentTransportActions'))
			$scope.availableActions = event.CurrentTransportActions.split(",");
	}


	function fractionToFloat(fraction) {
		var y = fraction.split(' ');
		if (y.length > 1) {
			var z = y[1].split('/');
			return (+y[0] + (z[0] / z[1]));
		}
		else {
			var z = y[0].split('/');
			if (z.length > 1) return (z[0] / z[1]);
			else return z[0];
		}
	}
	function eventOccured(device, events, request) {
		if (!events) { /*console.log("event is undefined");*/ return; }
		if (device.id != $scope.activeDevice.id) { /*console.log("event is not for active device. Ignoring.");*/ return; }

		events.forEach(event => {

			$window.toastr["info"](JSON.stringify(event));

			setDeviceProperties(event);
			setFileInformation(event);

			/*
			* Currently ignored event info
			*	event.NumberOfTracks
			*	event.NextAVTransportURI;
			*	event.NextAVTransportURIMetaData;
			*	event.PossiblePlaybackStorageMedia;
			*	event.PossibleRecordStorageMedia;
			*	event.PossibleRecordQualityModes;
			*	event.PlaybackStorageMedium;
			*	event.RecordStorageMedium;
			*	event.RecordMediumWriteStatus
			*	event.CurrentRecordQualityMode;
			*/

			$scope.playback = $scope.playback || {};

			var TransportState = {
				0: 'STOPPED',
				1: 'PLAYING',
				2: 'TRANSITIONING', //optional
				3: 'PAUSED_PLAYBACK', //optional
				4: 'PAUSED_RECORDING', //optional
				5: 'RECORDING', //optional
				6: 'NO_MEDIA_PRESENT' //optional
			};

			if (event.hasOwnProperty('TransportState')) {
				if (event.TransportState.toLowerCase() === 'stopped' && typeof $scope.playback.state === 'string' && $scope.playback.state.toLowerCase() === 'playing') {
					//we are at the end of the song, play next song
					//todo: having two computers on the same network might be an issue here
					$scope.next(true);
				}
				$scope.playback.state = event.TransportState;
			}

			var TransportStatus = {
				0: 'OK',
				1: 'STOPPED',
				2: 'ERROR_OCCURRED'
			};

			if (event.hasOwnProperty('TransportStatus'))
				$scope.playback.status = event.TransportStatus;

			var CurrentPlayMode = {
				0: 'NORMAL',
				1: 'SHUFFLE', //optional
				3: 'REPEAT_ONE', //optional
				4: 'REPEAT_ALL', //optional
				5: 'RANDOM', //optional
				6: 'DIRECT_1', //optional
				7: 'INTRO', //optional
				8: 'Vendor-defined', //optional
			};

			if (event.hasOwnProperty('CurrentPlayMode'))
				$scope.playback.mode = event.CurrentPlayMode;

			// Supported speeds can be retrieved from the AllowedValueList of this state variable in the AVTransport service description.
			// 1 is required, 0 is not allowed.
			//Example values are '1', '1/2', '2', '-1', '1/10', etc

			if (event.hasOwnProperty('TransportPlaySpeed'))
				$scope.playback.speed = fractionToFloat(event.TransportPlaySpeed);

		});
	}



	eventService.on('deviceLost', removeDevice);
	eventService.on('deviceFound', addUpdateDevice);
	eventService.on('filesChosen', setNewFiles);
	eventService.on('EventOccured', eventOccured);

	eventService.emit("loadDevices");

	
	$scope.clearToastr = function clearToastr() {
		$window.toastr.clear();
	};
	$window.toastr.options = {
		"newestOnTop": false,
		"positionClass": "toast-bottom-right",
		"preventDuplicates": false,
		"onclick": null,
		"showDuration": "300",
		"hideDuration": "1000",
		"timeOut": 0,
		"extendedTimeOut": 0,
		"showEasing": "swing",
		"hideEasing": "linear",
		"showMethod": "fadeIn",
		"hideMethod": "fadeOut",
		"tapToDismiss": true
	};
	

	$scope.$on('keydown', function (g, event) {
		if (event.target.tagName.toLowerCase() === "input") return;

		switch (event.key.toLowerCase()) {
			case " ":
				$scope.togglePlayState($scope.activeDevice);
				break;
			case "arrowright":
				$scope.next();
				break;
			case "arrowleft":
				$scope.previous();
				break;
			case "delete":
				if ($scope.currentTrack.activeFile) $scope.removeFromPlaylist($scope.currentTrack.activeFile);
				break;
		}
	});

	//window.loadTestDevices();
});