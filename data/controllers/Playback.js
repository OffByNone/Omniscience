omniscience.controller('PlaybackController', function playbackController($scope, $interval, eventService, avTransportService, renderingControlService, pubSub) {
	"use strict";

	$scope.availableActions = ["play"];
	$scope.currentTransportActions = {};
	$scope.deviceCapabilities = {};
	$scope.transportSettings = {};
	$scope.transportInfo = {};
	$scope.record = {};
	$scope.presets = [];
	$scope.currentTrack = {};
	$scope.currentMedia = {};
	$scope.nextMedia = {};
	$scope.playback = {state: "stopped"};
	$scope.volume = 100;
	$scope.isMuted = false;

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

	function updatePlaybackState(newState) {
		$scope.playback.state = newState;
	}

	function setVolume (newVolume) {
		$scope.volume = newVolume;
		renderingControlService.setVolume(newVolume);
	}
	function setMute (mute) {
		$scope.isMuted = mute
		renderingControlService.setMute(mute);
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

	function getNameFromUrl(url) {
		try{
			if (!(url instanceof URL)) url = new URL(url);
		} catch(e)
		{
			return '';
		}

		return decodeURI(url.pathname.replace(/^.*(\\|\/|\:)/, ''));
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

		if(duration.toLowerCase() === "not_implemented") return 0;

		duration = duration.replace(/[\+\-]/g,""); //remove any + or -
		duration = duration.replace(/\.*/,""); //remove any fractional seconds

		var [ hours, minutes, seconds ] = duration.split(':');

		return parseInt(seconds) + (parseInt(minutes) * 60) + (parseInt(hours) * 3600);
	}
	function parseDLNATime(duration){
		var timeInSeconds = durationToSeconds(duration);
		return { seconds: timeInSeconds, minutes: secondsToMinutes(timeInSeconds) };
	}

	function parsePositionInfo(response) {
		var current = parseDLNATime(response.RelTime);
		var total = parseDLNATime(response.TrackDuration);

		$scope.currentTrack.currentSeconds = current.seconds;
		$scope.currentTrack.currentMinutes = current.minutes;
		$scope.currentTrack.totalSeconds = total.seconds;
		$scope.currentTrack.totalMinutes = total.minutes;
		$scope.currentTrack.uri = response.TrackURI;
		$scope.currentTrack.name = getNameFromUrl(response.TrackURI);
		$scope.currentTrack.metadata = response.TrackMetaData;
	}
	function parseRenderControlLastChangeEvent(lastChangeEvent){
		if(lastChangeEvent.hasOwnProperty("Mute")) $scope.isMuted = lastChangeEvent.Mute === "1" || lastChangeEvent.Mute === "true";
		if(lastChangeEvent.hasOwnProperty('Volume')) $scope.volume = parseInt(lastChangeEvent.Volume);
		if(lastChangeEvent.hasOwnProperty('PresetNameList')) $scope.presets = lastChangeEvent.PresetNameList.split(",");
	}
	function parseAVTransportLastChangeEvent(lastChangeEvent){
		//The first time a last change event returns it sends back all possible properties with their current values
		//after that it sends whichever properties changed since the last time.  Thus we cannot predict which properties
		//will exist and which will be null

		if(lastChangeEvent.hasOwnProperty("AVTransportURI")) $scope.currentMedia.uri = lastChangeEvent.AVTransportURI;
		if(lastChangeEvent.hasOwnProperty('AVTransportURIMetaData')) $scope.currentMedia.metadata = lastChangeEvent.AVTransportURIMetaData;
		if(lastChangeEvent.hasOwnProperty('CurrentPlayMode')) $scope.playback.mode = lastChangeEvent.CurrentPlayMode;
		if(lastChangeEvent.hasOwnProperty("CurrentRecordQualityMode")) $scope.record.currentQualityMode = lastChangeEvent.CurrentRecordQualityMode;
		if(lastChangeEvent.hasOwnProperty('CurrentTrack')) $scope.currentTrack.trackNumber = lastChangeEvent.CurrentTrack;
		if(lastChangeEvent.hasOwnProperty('CurrentTrackMetaData')) $scope.currentTrack.metadata = lastChangeEvent.CurrentTrackMetaData;
		if(lastChangeEvent.hasOwnProperty('CurrentTransportActions')) $scope.availableActions = lastChangeEvent.CurrentTransportActions.split(",");
		if(lastChangeEvent.hasOwnProperty("NumberOfTracks")) $scope.currentMedia.trackCount = lastChangeEvent.NumberOfTracks;
		if(lastChangeEvent.hasOwnProperty("PlaybackStorageMedium")) $scope.playback.storageMedium = lastChangeEvent.PlaybackStorageMedium;
		if(lastChangeEvent.hasOwnProperty("PossiblePlaybackStorageMedia")) $scope.playback.possibleStorageMedia = lastChangeEvent.PossiblePlaybackStorageMedia;
		if(lastChangeEvent.hasOwnProperty("PossibleRecordStorageMedia")) $scope.record.possilbeStorageMedium = lastChangeEvent.PossibleRecordStorageMedia;
		if(lastChangeEvent.hasOwnProperty("PossibleRecordQualityModes")) $scope.record.possibleQualityModes = lastChangeEvent.PossibleRecordQualityModes;
		if(lastChangeEvent.hasOwnProperty("NextAVTransportURI")) $scope.nextMedia.uri = lastChangeEvent.NextAVTransportURI;
		if(lastChangeEvent.hasOwnProperty("NextAVTransportURIMetaData")) $scope.nextMedia.metadata = lastChangeEvent.NextAVTransportURIMetaData;
		if(lastChangeEvent.hasOwnProperty("RecordMediumWriteStatus")) $scope.record.mediumWriteStatus = lastChangeEvent.RecordMediumWriteStatus;
		if(lastChangeEvent.hasOwnProperty("RecordStorageMedium")) $scope.record.storageMedium = lastChangeEvent.RecordStorageMedium;
		if(lastChangeEvent.hasOwnProperty('TransportStatus')) $scope.playback.status = lastChangeEvent.TransportStatus;
		// Supported speeds can be retrieved from the AllowedValueList of this state variable in the AVTransport service description.
		// 1 is required, 0 is not allowed.
		//Example values are '1', '1/2', '2', '-1', '1/10', etc
		if(lastChangeEvent.hasOwnProperty('TransportPlaySpeed')) $scope.playback.speed = fractionToFloat(lastChangeEvent.TransportPlaySpeed);

		if(lastChangeEvent.hasOwnProperty('CurrentTrackDuration')){
			var trackTotal = parseDLNATime(lastChangeEvent.CurrentTrackDuration);
			$scope.currentTrack.totalTime = trackTotal.minutes;
			$scope.currentTrack.totalSeconds = trackTotal.seconds;
		}
		if(lastChangeEvent.hasOwnProperty('CurrentMediaDuration')){
			var mediaTotal = parseDLNATime(lastChangeEvent.CurrentMediaDuration);
			$scope.currentMedia.totalTime = mediaTotal.minutes;
			$scope.currentMedia.totalSeconds = mediaTotal.seconds;
		}
        if(lastChangeEvent.hasOwnProperty('TransportState')) {
            if (lastChangeEvent.TransportState.toLowerCase() === 'stopped' && $scope.playback.state.toLowerCase() === 'playing') {
                //we are at the end of the song and currently playing. Play next song
                //todo: having two computers on the same network on the same device will be an issue here
                $scope.next(true);
            }
			updatePlaybackState(lastChangeEvent.TransportState);
		}
		if(lastChangeEvent.hasOwnProperty('CurrentTrackURI')) {
			$scope.currentTrack.uri = lastChangeEvent.CurrentTrackURI;
			$scope.currentTrack.name = getNameFromUrl(lastChangeEvent.CurrentTrackURI);
		}

	}

	$scope.$on('keydown', function (notSureWhatThisIs, event) {
		if (event.target.tagName.toLowerCase() === "input") return;

		switch (event.key.toLowerCase()) {
			case " ":
				if ($scope.playback.state === "playing") $scope.pause();
				else $scope.play();;
				break;
			case "arrowright":
				$scope.next(false);
				break;
			case "arrowleft":
				$scope.previous();
				break;
			case "delete":
				pubSub.pub('removeCurrent');
				break;
		}
	});



	avTransportService.subscribe(null, (response) => {
		response.forEach(parseAVTransportLastChangeEvent)
	});
	renderingControlService.subscribe(null, (response) => {
		response.forEach(parseRenderControlLastChangeEvent)
	});


	//var interval = $interval(() => avTransportService.getPositionInfo().then((response) => parsePositionInfo(response)), 1000);

	$scope.$on('$destroy', () => {
		renderingControlService.unsubscribe();
		avTransportService.unsubscribe();
		//$interval.cancel(interval);
	});

	pubSub.sub("updatePlaybackState", updatePlaybackState, $scope);
});