omniscience.controller('PlaylistController', function PlaylistController($scope, $timeout, eventService, pubSub) {
	"use strict";

	$scope.playback = { state: "stopped" };
	$scope.availableActions = ["play","stop"];
	$scope.repeat = false;
	$scope.filePickerOpen = true;
	$scope.slideshow = {duration: 5000,timeout: null};
	$scope.filePicker = {};
	$scope.playlist = [];
	$scope.track = {};
	$scope.media = {};
	$scope.nextMedia = {};
	$scope.record = {};

	$scope.percentComplete = function percentComplete() {
		return ($scope.track.currentSeconds / $scope.track.totalSeconds) * 100;
	};
	$scope.canExecuteAction = function (action) {
		return $scope.availableActions.some(availableAction => availableAction == action);
	};
	$scope.togglePlayState = function togglePlayState(device) {
		if ($scope.playback.state === "playing") $scope.pause(device);
		else $scope.play(device);
	};
	$scope.play = function play(device, file) {
		pauseSlideshow();
		$scope.playback.state = "playing";
		eventService.emit('play', device, file);

		if(file) $scope.track.file = file;

		//set timeout for image slideshow
		if ($scope.track.file.type && $scope.track.file.type.indexOf("image/") == 0) startSlideshow(device);
	};
	$scope.pause = function pause(device) {
		$scope.playback.state = "paused";
		eventService.emit('pause', device);
		pauseSlideshow();
	};
	$scope.stop = function stop(device) {
		$scope.playback.state = "stopped";
		eventService.emit('stop', device);
		pauseSlideshow();
	};
	$scope.previous = function previous(device) {
		for (var i in $scope.playlist)
			if ($scope.playlist.hasOwnProperty(i) && $scope.playlist[i] === $scope.track.file)
				if (i == 0) return $scope.play(device, $scope.playlist[$scope.playlist.length - 1]); //we are the first file, so play the last file
				else return $scope.play(device, $scope.playlist[Number(i) - 1]); //we are not the first file so play the previous
	}
	$scope.next = function next(device, abideByRepeat) {
		for (var i in $scope.playlist)
			if ($scope.playlist.hasOwnProperty(i) && $scope.playlist[i] === $scope.track.file)
				if (i == $scope.playlist.length - 1)
					if (!abideByRepeat || $scope.repeat) return $scope.play(device, $scope.playlist[0]); //we are the last file and either pushed the next button, or repeat is enabled, so play the first file
					else {//we are the last file, didn't push the button and repeat is not enabled.  Stop playback, then load the first file
						$scope.stop(device);
						load(device, $scope.playlist[0]);
					}
				else return $scope.play(device, $scope.playlist[Number(i) + 1]); //we are not the last file so play the next
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
		device.setVolume(device, Number(device.volume) + 1);
	};
	$scope.decrementVolume = function decrementVolume(device) {
		device.setVolume(device, Number(device.volume) - 1);
	};
	$scope.add = function add(device, playImmediately) {
		//Adds files to playlist from file picker box and returns the added files
		var files = getChosenFiles();
		files.forEach(file => $scope.playlist.push(file));

		if (playImmediately) $scope.play(device, files[0]);

		return files;
	};
	$scope.remove = function remove(device, file) {
		for (var i =0; i<$scope.playlist.length; i++)
			if ($scope.playlist.hasOwnProperty(i) && $scope.playlist[i] === file) {
				if (file === $scope.track.file) {//TODO: fix this likely with a service call, maybe isCurrent(file) - media controls controller responds
					if ($scope.playlist.length > 1) $scope.next(device, true);
					else $scope.stop(device);
				}
				$scope.playlist.splice(i, 1);
				break;
			}
	};
	$scope.clear = function clear(device) {
		$scope.playlist = [];
		$scope.stop(device);
	};
	$scope.randomize = function randomize() {
		shuffle($scope.playlist);
	};
	$scope.pickLocalFile = function pickLocalFile(device) {
		eventService.emit('chooseFile', device);
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
	function load(device, file) {
		eventService.emit('load', device, file);
		$scope.track.file = file;
	};
	function startSlideshow(device) {
		$scope.slideshow.timeout = $timeout(() => {
			if ($scope.playback.state.toLowerCase() === 'playing')
				$scope.next(device, true);
		}, $scope.slideshow.duration);
	}
	function pauseSlideshow() {
		if ($scope.slideshow.timeout) $timeout.cancel($scope.slideshow.timeout);
	}
	function secondsToMinutes(duration){
		var minutesPart = parseInt(duration/60);
		var secondsPart = duration%60;

		if( secondsPart.toString().length === 1 ) secondsPart = "0" + secondsPart;

		return minutesPart + ":" + secondsPart;
	}
	function durationToSeconds(duration){
		//[+-]H+:MM:SS[.F+] or H+:MM:SS[.F0/F1]
		//H+ means one or more digits to indicate elapsed hours
		//MM means exactly 2 digits to indicate minutes (00 to 59)
		//SS means exactly 2 digits to indicate seconds (00 to 59)
		//[.F+] means optionally a dot followed by one or more digits to indicate fractions of seconds
		//[.F0/F1] means optionally a dot followed by a fraction, with F0 and F1 at least one digit long, and F0 < F1
		
		duration = duration.replace(/[\+\-]/g,""); //remove any + or -
		duration = duration.replace(/\..*/,""); //remove any fractional seconds

		var [ hours, minutes, seconds ] = duration.split(':');

		return parseInt(seconds) + (parseInt(minutes) * 60) + (parseInt(hours) * 3600);
	}
	function setPositionInfo(deviceId, response) {
		if (deviceId !== $scope.$parent.deviceId) return; //todo: it would be better if this function took in a device to apply it to instead of matching against the parent device

		var [ currentSeconds, CurrentMinutes ] = getTime(response.relTime);
		var [ totalSeconds, totalMinutes ] = getTime(response.trackDuration);

		$scope.track.currentTime = CurrentMinutes;
		$scope.track.totalTime = totalMinutes;
		$scope.track.currentSeconds = currentSeconds;
		$scope.track.totalSeconds = totalSeconds;
	}
	function getTime(duration){
		var timeInSeconds = durationToSeconds(duration);
		return [ timeInSeconds, secondsToMinutes(timeInSeconds) ];
	}
	function setfile(fileUri) {
		if (fileUri != null) {
			var file = getFile(fileUri);

			if (file == null) {
				file = { name: decodeURI(getNameFromUrl(fileUri)), path: fileUri };
				$scope.playlist.push(file);
			}
		}
		$scope.track.file = file;

		return $scope.track.file;
	}
	function setPlaybackInformation(device, event) {
		if (event.hasOwnProperty('CurrentTrackURI')) {
			$scope.track.uri = event.CurrentTrackURI;
			//setfile($scope.track.uri); TODO: don't have the uri of local files yet so I can't properly do this comparison.
		}

		if (event.hasOwnProperty('AVTransportURI')) $scope.media.uri = event.AVTransportURI;
		if (event.hasOwnProperty('CurrentTrackMetaData')) $scope.track.metadata = event.CurrentTrackMetaData;
		if (event.hasOwnProperty('AVTransportURIMetaData')) $scope.media.metadata = event.AVTransportURIMetaData;

		if (event.hasOwnProperty('CurrentTrackDuration')){
			var [ totalSeconds, totalMinutes ] = getTime(event.CurrentTrackDuration);
			$scope.track.totalTime = totalMinutes;
			$scope.track.totalSeconds = totalSeconds;	
		}
		if (event.hasOwnProperty("RelTime")) {
			var [ currentSeconds, CurrentMinutes  ] = getTime(event.RelTime);
			$scope.track.currentSeconds = currentSeconds;
			$scope.track.currentTime = CurrentMinutes;
		}
		if (event.hasOwnProperty('CurrentMediaDuration')){
			var [ totalSeconds, totalMinutes ] = getTime(event.CurrentMediaDuration);
			$scope.media.totalTime = totalMinutes;
			$scope.media.totalSeconds = totalSeconds;	
		}		
		if (event.hasOwnProperty("AbsTime") && event.AbsTime != "NOT_IMPLEMENTED") {
			var [ currentSeconds, CurrentMinutes  ] = getTime(event.AbsTime);
			$scope.media.currentSeconds = currentSeconds;
			$scope.media.currentTime = CurrentMinutes;
		}

		if (event.hasOwnProperty('CurrentTrack')) $scope.track.trackNumber = event.CurrentTrack;

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
			if (event.TransportState.toLowerCase() === 'stopped' && $scope.playback.state.toLowerCase() === 'playing') {
				//we are at the end of the song, play next song
				//todo: having two computers on the same network might be an issue here
				$scope.next(device, true);
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

		if(event.hasOwnProperty("NumberOfTracks"))
			$scope.media.numberOfTracks = event.NumberOfTracks;
		if(event.hasOwnProperty("NextAVTransportURI"))
			$scope.nextMedia.uri = event.NextAVTransportURI;
		if(event.hasOwnProperty("NextAVTransportURIMetaData"))
			$scope.nextMedia.metadata = event.NextAVTransportURIMetaData;
		if(event.hasOwnProperty("PossiblePlaybackStorageMedia"))
			$scope.playback.possibleStorageMedia = event.PossiblePlaybackStorageMedia;
		if(event.hasOwnProperty("PlaybackStorageMedium"))
			$scope.playback.storageMedium = event.PlaybackStorageMedium;

		if(event.hasOwnProperty("PossibleRecordStorageMedia"))
			$scope.record.possilbeStorageMedium = event.PossibleRecordStorageMedia;
		if(event.hasOwnProperty("PossibleRecordQualityModes"))
			$scope.record.possibleQualityModes = event.PossibleRecordQualityModes;
		if(event.hasOwnProperty("RecordStorageMedium"))
			$scope.record.storageMedium = event.RecordStorageMedium;
		if(event.hasOwnProperty("RecordMediumWriteStatus"))
			$scope.record.mediumWriteStatus = evnet.RecordMediumWriteStatus;
		if(event.hasOwnProperty("CurrentRecordQualityMode"))
			$scope.record.currentQualityMode = event.CurrentRecordQualityMode;


		if (event.hasOwnProperty('Mute'))
			$scope.isMuted = event.Mute === "1";
		if (event.hasOwnProperty('Volume'))
			$scope.volume = Number(event.Volume);

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


	eventService.on('filesChosen', setNewFiles);
	eventService.on('positionInfo', setPositionInfo);
	pubSub.sub("eventOccured", setPlaybackInformation);
});