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

	//{name: "test1", currentTime:"2:35", currentTimeInSeconds: 155, duration: "3:15", durationInSeconds: 195, name: "test track 1", path= "file path here" }

	$scope.currentFilePercent = function currentFilePercent() {
		return $scope.activeFile == null ? null : ($scope.activeFile.currentTimeInSeconds / $scope.activeFile.durationInSeconds) * 100;
	};
	$scope.canExecuteAction = function (action) {
		return $scope.availableActions == null ? true : $scope.availableActions.every(availableAction => availableAction != action);
	};
	function setState(newState) {
		$scope.playback = $scope.playback || {};
		$scope.playback.state = newState;
	}


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
			if ($scope.playlist.hasOwnProperty(i) && $scope.playlist[i] === $scope.activeFile)
				if (i == 0) return $scope.launch($scope.playlist[$scope.playlist.length - 1]); //we are the first file, so launch the last file
				else return $scope.launch($scope.playlist[Number(i) - 1]); //we are not the first file so launch the previous
	}
	$scope.next = function next(abideByRepeat) {
		for (var i in $scope.playlist)
			if ($scope.playlist.hasOwnProperty(i) && $scope.playlist[i] === $scope.activeFile)
				if (i == $scope.playlist.length - 1 && (!abideByRepeat || $scope.playback.repeat)) return $scope.launch($scope.playlist[0]); //we are the last file, so launch the first file
				else return $scope.launch($scope.playlist[Number(i) + 1]); //we are not the last file so launch the next
	};
	$scope.pickLocalFile = function pickLocalFile() {
		eventService.emit('chooseFile', $scope.activeDevice, $scope.activeDevice.fileType);
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
		$scope.setVolume(device, Number(device.volume)+1);
	};
	$scope.decrementVolume = function decrementVolume(device) {
		$scope.setVolume(device, Number(device.volume)-1);
	};






	function setNewFile(file) {
		$scope.filePicker.localFile = file;
	}
	function getChosenFile() {
		//todo: pull in the file info - such as duration, artist, song/video name
		var file;

		if ($scope.filePicker.url && $scope.filePicker.url.path && $scope.filePicker.url.path.length > 0) {
			try {
				new URL($scope.filePicker.url.path);
			}
			catch (e) {
				//todo: invalid url should report that to user and abort
			}

			//set file name from url
			$scope.filePicker.url.name = $scope.filePicker.url.path.replace(/^.*(\\|\/|\:)/, '');

			file = $scope.filePicker.url;
		}
		else if ($scope.filePicker.localFile && $scope.filePicker.localFile.path && $scope.filePicker.localFile.path.length > 0)
			file = $scope.filePicker.localFile;

		$scope.filePicker = {};
		//clear out the url and local file fields
		$scope.playlist.push(file);

		return file;
	}
	$scope.launch = function launch(file) {
		//if a file is passed in, use that. Otherwise pull from the file picker box
		if (!file) file = getChosenFile();

		//todo: this is going to cause the same files to be mapped more than once
		//should make sure on the backend that if the file is already mapped we dont map it again
		//also should throw in something random into the path of the map incase someone wants to
		//play two files of the same name --maybe throw a folder with the name of a guid in the path
		eventService.emit('launch', $scope.activeDevice, file);
		$scope.activeFile = file;
	};
	$scope.addToPlaylist = function addToPlaylist() {
		getChosenFile();
	};
	$scope.removeFromPlaylist = function removeFromPlaylist(file) {
		for (var i in $scope.playlist)
			if ($scope.playlist.hasOwnProperty(i) && $scope.playlist[i] === file) {
				if (file === $scope.activeFile) {
					if ($scope.playlist.length > 1) $scope.next();
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
	$scope.setName = function setName(name) {
		eventService.emit('setName', $scope.activeDevice, name);
	};

	function getNameFromUrl(url) {
		if (!(url instanceof URL)) url = new URL(url);
		return url.pathname.replace(/^.*(\\|\/|\:)/, '');
	}
	function addUpdateDevice(device) {
		var found = false;
		$scope.devices.forEach(function (scopeDevice) {
			if (scopeDevice.address === device.address) {
				scopeDevice.name = device.name;

				//many of the below properties are found on the getAdditionalInformation search and therefore not
				//defined when the device first appears.  This means that on a subsquent search if not for the null
				//checks the devices would for a short time have incorrect information shown
				if (typeof device.videoCapable !== 'undefined') scopeDevice.videoCapable = device.videoCapable;
				if (typeof device.imageCapable !== 'undefined') scopeDevice.imageCapable = device.imageCapable;
				if (typeof device.audioCapable !== 'undefined') scopeDevice.audioCapable = device.audioCapable;
				if (typeof device.mirrorCapable !== 'undefined') scopeDevice.mirrorCapable = device.mirrorCapable;

				if (typeof device.rawProtocolInfo !== 'undefined') scopeDevice.rawProtocolInfo = device.rawProtocolInfo;
				if (typeof device.rawDiscoveryInfo !== 'undefined') scopeDevice.rawDiscoveryInfo = device.rawDiscoveryInfo;

				found = true;
			}
		});

		if (!found) {
			device.services.forEach(service => service.htmlId = service.id.replace(/[\:\.]/g, ""));
			$scope.devices.push(device);
		}

		if (device.id === $routeParams.deviceId)
			$scope.activeDevice = device;

		addTypes(device);
	}
	function removeDevice(device) {
		for (var i = $scope.devices.length - 1; i >= 0; i--)
			if ($scope.devices[i].address === device.address)
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
	function setActiveFile(fileUri) {
		if (fileUri != null) {
			var file = getFile(fileUri);

			if (file == null) {
				file = { name: decodeURI(getNameFromUrl(fileUri)), path: fileUri };
				//$scope.playlist.push(file);
			}
		}
		//$scope.activeFile = file;

		return $scope.activeFile;
	}
	function getFile(fileUri) {
		var file = $scope.playlist == null ? null : $scope.playlist.filter(item => item.path === fileUri);
		return file == null ? null : file[0];
	}
	function setFileInformation(event) {
		var fileUri;

		if (event.hasOwnProperty('CurrentTrackURI'))
			fileUri = event.CurrentTrackURI;
		else if (event.hasOwnProperty('AVTransportURI'))
			fileUri = event.AVTransportURI;

		var file = getFile(fileUri);
		setActiveFile(fileUri);

		if (file == null) return;

		if (event.hasOwnProperty('CurrentTrackMetaData'))
			file.metadata = event.CurrentTrackMetaData;
		else if (event.hasOwnProperty('AVTransportURIMetaData'))
			file.metadata = event.AVTransportURIMetaData;

		if (event.hasOwnProperty('CurrentTrackDuration'))
			file.duration = event.CurrentTrackDuration;
		if (event.hasOwnProperty('CurrentMediaDuration'))
			file.duration = event.CurrentMediaDuration;
		if (event.hasOwnProperty('CurrentTrack'))
			file.trackNumber = event.CurrentTrack;
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
		if (!events) { console.log("event is undefined"); return; }
		if (device.id != $scope.activeDevice.id) { console.log("event is not for current device.  Ignoring."); return; }
		events.forEach(event => {

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

			console.log(JSON.stringify(event));
		});
	}

	eventService.on('deviceLost', removeDevice);
	eventService.on('deviceFound', addUpdateDevice);
	eventService.on('fileChosen', setNewFile);
	eventService.on('EventOccured', eventOccured);

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