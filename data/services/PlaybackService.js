omniscience.factory('playbackService', function ($timeout, eventService, avTransportService, fileService) {
	"use strict";

	var slideshow = { duration: 10000, timeout: null };
	var playbackState = "stopped";
	var playlist = [];
	var isMuted = false;
	var volume = 100;
	var repeat = false;
	var currentTrack = {};

	var media = {};
	var nextMedia = {};
	var record = {};

	function togglePlayState(deviceServiceService) {
		if (playbackState === "playing") pause(deviceServiceService);
		else play(deviceService);
	}
	function play(deviceService, file) {
		pauseSlideshow();
		playbackState = "playing";
		avTransportService.play(deviceService);
		if (file) currentTrack.file = file;

		//set timeout for image slideshow
		if (currentTrack.file.type && currentTrack.file.type.indexOf("image/") == 0) startSlideshow(deviceService);
	}
	function pause(deviceService) {
		playbackState = "paused";
		avTransportService.pause(deviceService);
		pauseSlideshow();
	}
	function stop(deviceService) {
		playbackState = "stopped";
		avTransportService.stop(deviceService);
		pauseSlideshow();
	}
	function previous(deviceService) {
		var previousTrack = playlist[playlist.length - 1];
		for (var i = 0; i < playlist.length; i++){
			if (playlist[i] === currentTrack.file) return play(deviceService, previousTrack);
			previousTrack = playlist[i];
		}
	}
	function next(deviceService, abideByRepeat) {
		for (var i = 0; i < playlist.length; i++) {
			if (playlist[i] === currentTrack.file)
				if (i == playlist.length - 1)
					if (!abideByRepeat || $scope.repeat) return play(deviceService, playlist[0]); //we are the last file and either pushed the next button, or repeat is enabled, so play the first file
					else {//we are the last file, didn't push the button and repeat is not enabled.  Stop playback, then load the first file
						stop(deviceService);
						load(deviceService, playlist[0]);
					}
				else return play(deviceService, playlist[Number(i) + 1]); //we are not the last file so play the next
		}
	}
	function startSlideshow(deviceService) {
		slideshow.timeout = $timeout(() => {
			if (playbackState.toLowerCase() === 'playing')
				next(deviceService, true);
		}, slideshow.duration);
	}
	function pauseSlideshow() {
		if (slideshow.timeout) $timeout.cancel(slideshow.timeout);
	}


	function setMute(deviceService, mute) {
		avTransportService.setMute(deviceService, mute);
	};
	function toggleMute(deviceService) {
		isMuted = !isMuted;
		setMute(isMuted);
	}
	function setVolume(deviceService, newVolume) {
		deviceService.volume = newVolume;
		avTransportService.setVolume(deviceService, newVolume);
	}
	function incrementVolume(deviceService) {
		setVolume(deviceService, Number(volume) + 1);
	}
	function decrementVolume(deviceService) {
		setVolume(deviceService, Number(volume) - 1);
	}

	function randomizePlaylist() {
		shuffle(playlist);
	};
	function removeFromPlaylist(deviceService, file) {
		for (var i = 0; i < playlist.length; i++)
			if (playlist[i] === file) {
				if (file === currentTrack.file) {
					if (playlist.length > 1) next(deviceService, true); //more files in playlist, play next
					else stop(deviceService); //only file in playlist, stop playback
				}
				playlist.splice(i, 1);
				return;
			}
	};
	function clearPlaylist(deviceService) {
		playlist = [];
		stop(deviceService);
	};




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


	function addToPlaylist(deviceService, playImmediately) {
		//Adds files to playlist from file picker box and returns the added files
		files.forEach(file => playlist.push(file));

		if (playImmediately) play(deviceService, files[0]);

		return files;
	};







	function getFile(fileUri) {
		var file = playlist.filter(item => item.path === fileUri)[0];
		return file == null ? null : file;
	}


	function getNameFromUrl(url) {
		if (!(url instanceof URL)) url = new URL(url);
		return url.pathname.replace(/^.*(\\|\/|\:)/, '');
	}

	function load(deviceService, file) {
		eventService.emit('load', deviceService, file);
		currentTrack.file = file;
	};

	function setfile(fileUri) {
		if (fileUri != null) {
			var file = getFile(fileUri);

			if (file == null) {
				file = { name: decodeURI(getNameFromUrl(fileUri)), path: fileUri };
				playlist.push(file);
			}
		}
		currentTrack.file = file;

		return currentTrack.file;
	}
















	var $scope = {};



	function percentComplete() {
		return (currentTrack.currentSeconds / currentTrack.totalSeconds) * 100;
	};
	$scope.canExecuteAction = function (action) {
		return $scope.availableActions.some(availableAction => availableAction == action);
	};




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


	eventService.on('positionInfo', setPositionInfo);




	/*		loadMedia: function loadMedia(service, instanceId, file) {
			var deferred = this._defer();
			var fileUri = this._httpd.loadMedia(service, file);

			this._soapService.post(service.controlUrl,
								   this.serviceType,
								   "SetAVTransportURI",
								   { InstanceID: instanceId, CurrentURI: fileUri, CurrentURIMetaData: "" }
								  ).then(response => deferred.resolve(response));
			return deferred.promise;
		},*/

	return {
		
	};
});