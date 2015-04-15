omniscience.controller('PlaybackController', function playbackController($scope, eventService, avTransportService, renderingControlService, pubSub) {
	"use strict";

	$scope.availableActions = ["play"];
	$scope.currentTrack = {};
	$scope.currentTransportActions = {};
	$scope.isMuted = false;
	$scope.mediaInfo = {};
	$scope.positionInfo = {};
	$scope.presets = [];
	$scope.transportInfo = {};
	$scope.volume = 100;

	$scope.toggleMute = function toggleMute() {
		setMute(!$scope.isMuted);
	};
	$scope.incrementVolume = function incrementVolume() {
		setVolume( Number($scope.volume) + 1);
	};
	$scope.decrementVolume = function decrementVolume() {
		setVolume( Number($scope.volume) - 1);
	};
	$scope.percentComplete = function percentComplete() {
		return ($scope.currentTrack.currentSeconds / $scope.currentTrack.totalSeconds) * 100;
	};
	$scope.stop = function(){
		pubSub.pub("stop");
	};
	$scope.play = function(){
		pubSub.pub("play");
	};
	$scope.pause = function(){
		pubSub.pub("pause");
	};
	$scope.next = function(abideByRepeat){
		pubSub.pub("next", abideByRepeat);
	};
	$scope.previous = function(){
		pubSub.pub("previous");
	};

	function canExecuteAction(action) {
		return $scope.availableActions.some(availableAction => availableAction == action);
	}
	function setVolume (newVolume) {
		$scope.volume = newVolume;
		renderingControlService.setVolume(newVolume);
	}
	function setMute (mute) {
		$scope.isMuted = mute
		renderingControlService.setMute(mute);
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
		duration = duration.replace(/\.*/,""); //remove any fractional seconds

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


	function getFile(fileUri) {
		var file = state.playlist.filter(item => item.path === fileUri)[0];
		return file == null ? null : file;
	}
	function getNameFromUrl(url) {
		if (!(url instanceof URL)) url = new URL(url);
		return url.pathname.replace(/^.*(\\|\/|\:)/, '');
	}
	function setFile(fileUri) {
		if (fileUri != null) {
			var file = getFile(fileUri);

			if (file == null) {
				file = { name: decodeURI(getNameFromUrl(fileUri)), path: fileUri };
				state.playlist.push(file);
			}
		}
		state.currentTrack.file = file;

		return state.currentTrack.file;
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
		if (event.hasOwnProperty('state.currentTrackURI')) {
			$scope.track.uri = event.state.currentTrackURI;
			//setFile($scope.track.uri); TODO: don't have the uri of local files yet so I can't properly do this comparison.
		}

		if (event.hasOwnProperty('AVTransportURI')) $scope.media.uri = event.AVTransportURI;
		if (event.hasOwnProperty('state.currentTrackMetaData')) $scope.track.metadata = event.state.currentTrackMetaData;
		if (event.hasOwnProperty('AVTransportURIMetaData')) $scope.media.metadata = event.AVTransportURIMetaData;

		if (event.hasOwnProperty('state.currentTrackDuration')){
			var [ totalSeconds, totalMinutes ] = getTime(event.state.currentTrackDuration);
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

		if (event.hasOwnProperty('state.currentTrack')) $scope.track.trackNumber = event.state.currentTrack;

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
			$scope.playbackState.availableActions = event.CurrentTransportActions.split(",");
	}

	eventService.on('positionInfo', setPositionInfo);


	$scope.$on('keydown', function (notSureWhatThisIs, event) {
		if (event.target.tagName.toLowerCase() === "input") return;

		switch (event.key.toLowerCase()) {
			case " ":
				pubSub.pub('togglePlayState');
				break;
			case "arrowright":
				pubSub.pub('next');
				break;
			case "arrowleft":
				pubSub.pub('previous');
				break;
			case "delete":
				pubSub.pub('removeCurrent');
				break;
		}
	});

	renderingControlService.getMute().then(isMuted => $scope.isMuted = isMuted);
	renderingControlService.getVolume().then(volume => $scope.volume = volume);
	renderingControlService.listPresets().then(newPresets => $scope.presets = newPresets);
	avTransportService.getMediaInfo().then(mediaInfo => $scope.mediaInfo = mediaInfo);
	avTransportService.getTransportInfo().then(transportInfo => $scope.transportInfo = transportInfo);
	avTransportService.getPositionInfo().then(positionInfo => $scope.positionInfo = positionInfo);
	avTransportService.getCurrentTransportActions().then(currentTransportActions => $scope.currentTransportActions = currentTransportActions);

	avTransportService.subscribe(
		function GenericEventCallback(eventXmlAsString) {
			console.log("Generic Event Received for av transport");
			console.log(eventXmlAsString);
		}, function lastChangeEventCallback(lastChangeEventObj) {
			console.log("Last Change Event Received for av transport");
			console.log(lastChangeEventObj);
		}
	);
	renderingControlService.subscribe(
	function GenericEventCallback(eventXmlAsString) {
		console.log("Generic Event Received for rendering Control");
		console.log(eventXmlAsString);
	}, function lastChangeEventCallback(lastChangeEventObj) {
		console.log("Last Change Event Received for rendering Control");
		console.log(lastChangeEventObj);
	}
);
	$scope.$on('$destroy', () => renderingControlService.unsubscribe());
	$scope.$on('$destroy', () => avTransportService.unsubscribe());
});