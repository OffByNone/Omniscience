﻿omniscience.service('playbackService', function ($timeout, eventService, fileService, avTransportService, renderingControlService, connectionManagerService) {
	"use strict";

	var currentTrack = {};
	var playlist = [];
	var availableActions = ["play","stop"];
	var slideshow = { duration: 10000, timeout: null };
	var settings = { //this exists for the primitive values, which if not for this will not get updated when their values change
		playbackState: "stopped",
		volume: 100,
		isMuted: false,
		repeat: false
	};
	var presets = [];
	var mediaInfo = {};
	var transportInfo = {};
	var positionInfo = {};
	var deviceCapabilities = {};
	var transportSettings = {};
	var currentTransportActions = {};
	var currentConnectionInfo = {};
	var currentConnectionIds = {};
	var protocolInfo = {};


	function load(file){
		currentTrack.file = file
		return fileService.shareFile(file).then(fileUri => {
			return avTransportService.setAvTransportUri(fileUri, "");
		});
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
	function getTime(duration){
		var timeInSeconds = durationToSeconds(duration);
		return [ timeInSeconds, secondsToMinutes(timeInSeconds) ];
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


	var media = {};
	var nextMedia = {};
	var record = {};
	var $scope = {};

	function getFile(fileUri) {
		var file = playlist.filter(item => item.path === fileUri)[0];
		return file == null ? null : file;
	}
	function getNameFromUrl(url) {
		if (!(url instanceof URL)) url = new URL(url);
		return url.pathname.replace(/^.*(\\|\/|\:)/, '');
	}
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


	function setPositionInfo(deviceId, response) {
		if (deviceId !== $scope.$parent.deviceId) return; //todo: it would be better if this function took in a device to apply it to instead of matching against the parent device

		var [ currentSeconds, CurrentMinutes ] = getTime(response.relTime);
		var [ totalSeconds, totalMinutes ] = getTime(response.trackDuration);

		$scope.track.currentTime = CurrentMinutes;
		$scope.track.totalTime = totalMinutes;
		$scope.track.currentSeconds = currentSeconds;
		$scope.track.totalSeconds = totalSeconds;
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

	eventService.on('positionInfo', setPositionInfo);


	return {
		settings: settings,
		playlist: playlist,
		currentTrack: currentTrack,
		availableActions: availableActions,
		presets: presets,
		mediaInfo: mediaInfo,
		transportInfo: transportInfo,
		positionInfo: positionInfo,
		deviceCapabilities: deviceCapabilities,
		transportSettings: transportSettings,
		currentTransportActions: currentTransportActions,
		currentConnectionInfo: currentConnectionInfo,
		currentConnectionIds: currentConnectionIds,
		protocolInfo: protocolInfo,

		play: function (file) {
			this.pauseSlideshow();
			this.settings.playbackState = "playing";
			if (file){
				currentTrack.file = file;
				load(file).then(() => avTransportService.play());
			} else
				avTransportService.play();

			//set timeout for image slideshow
			if (currentTrack.file.type && currentTrack.file.type.indexOf("image/") == 0) this.startSlideshow();
		},
		pause: function() {
			this.settings.playbackState = "paused";
			avTransportService.pause();
			this.pauseSlideshow();
		},
		stop: function() {
			this.settings.playbackState = "stopped";
			this.pauseSlideshow();
			return avTransportService.stop();
		},
		previous: function() {
			var previousTrack = playlist[playlist.length - 1];
			for (var i = 0; i < playlist.length; i++){
				if (playlist[i] === currentTrack.file) return this.play(previousTrack);
				previousTrack = playlist[i];
			}
		},
		next: function(abideByRepeat) {
			for (var i = 0; i < playlist.length; i++) {
				if (playlist[i] === currentTrack.file)
					if (i == playlist.length - 1)
						if (!abideByRepeat || this.settings.repeat) return this.play(playlist[0]); //we are the last file and either pushed the next button, or repeat is enabled, so play the first file
						else {//we are the last file, didn't push the button and repeat is not enabled.  Stop playback, then load the first file
							this.stop().then(() => load(playlist[0]));
						}
					else return this.play(playlist[Number(i) + 1]); //we are not the last file so play the next
			}
		},
		toggleMute: function () {
			this.settings.isMuted = !this.settings.isMuted;
			this.setMute(this.settings.isMuted);
		},
		incrementVolume: function() {
			this.setVolume( Number(this.settings.volume) + 1);
		},
		decrementVolume: function() {
			this.setVolume( Number(this.settings.volume) - 1);
		},
		randomizePlaylist: function () {
			shuffle(playlist);
		},
		removeFromPlaylist: function(file) {
			for (var i = 0; i < playlist.length; i++)
				if (playlist[i] === file) {
					if (file === currentTrack.file) {
						if (playlist.length > 1) this.next(true); //more files in playlist, play next
						else this.stop(); //only file in playlist, stop playback
					}
					playlist.splice(i, 1);
					return;
				}
		},
		clearPlaylist: function() {
			playlist.length = 0; //setting to [] will not clear out other references to this array.
			this.stop();
		},
		percentComplete: function () {
			return (currentTrack.currentSeconds / currentTrack.totalSeconds) * 100;
		},
		addToPlaylist: function (files, playImmediately) {
			//Adds files to playlist from file picker box and returns the added files
			files.forEach(file => playlist.push(file));

			if (playImmediately) this.play(files[0]);

			return files;
		},
		togglePlayState: function () {
			if (this.settings.playbackState === "playing") this.pause();
			else this.play();
		},
		startSlideshow: function () {
			slideshow.timeout = $timeout(() => {
				if (this.settings.playbackState.toLowerCase() === 'playing')
					this.next(true);
			}, slideshow.duration);
		},
		pauseSlideshow: function () {
			if (slideshow.timeout) $timeout.cancel(slideshow.timeout);
		},
		canExecuteAction: function (action) {
			return availableActions.some(availableAction => availableAction == action);
		},
		setVolume: function (newVolume) {
			this.settings.volume = newVolume;
			renderingControlService.setVolume(newVolume);
		},
		setMute: function (mute) {
			renderingControlService.setMute(mute);
		},
		getInfo: function(){
			avTransportService.getMediaInfo().then(mi => mediaInfo = mi);
			avTransportService.getTransportInfo().then(ti => transportInfo = ti);
			avTransportService.getPositionInfo().then(pi => positionInfo = pi);
			avTransportService.getDeviceCapabilities().then(dc => deviceCapabilities = dc);
			avTransportService.getTransportSettings().then(ts => transportSettings = ts);
			avTransportService.getCurrentTransportActions().then(ta => currentTransportActions = ta);
				
			renderingControlService.getMute().then(isMuted => settings.isMuted = isMuted);
			renderingControlService.getVolume().then(volume => settings.volume = volume);
			renderingControlService.listPresets().then(newPresets => presets = newPresets);
			
			connectionManagerService.getCurrentConnectionInfo().then(cci => currentConnectionInfo = cci);
			connectionManagerService.getCurrentConnectionIds().then(cci => currentConnectionIds = cci);
			connectionManagerService.getProtocolInfo().then(pi => protocolInfo = pi);
		}
	};
});