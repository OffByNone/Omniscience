omniscience.controller('PlaybackController', function playbackController($scope, playbackService) {
	"use strict";

	$scope.state = playbackService.state;
	playbackService.getInfo();

	$scope.play = function play(file) {
		playbackService.play(file);
	};
	$scope.pause = function pause() {
		playbackService.pause();
	};
	$scope.stop = function stop() {
		playbackService.stop();
	};
	$scope.previous = function previous() {
		playbackService.previous();
	}
	$scope.next = function next(abideByRepeat) {
		playbackService.next(abideByRepeat);
	};
	$scope.toggleMute = function toggleMute() {
		playbackService.toggleMute();
	};
	$scope.incrementVolume = function incrementVolume() {
		playbackService.incrementVolume();
	};
	$scope.decrementVolume = function decrementVolume() {
		playbackService.decrementVolume();
	};
	$scope.percentComplete = function percentComplete() {
		return playbackService.percentComplete();
	};
	$scope.togglePlayState = function togglePlayState() {
		playbackService.togglePlayState();
	};

	$scope.$on('keydown', function (notSureWhatThisIs, event) {
		if (event.target.tagName.toLowerCase() === "input") return;

		switch (event.key.toLowerCase()) {
			case " ":
				$scope.togglePlayState();
				break;
			case "arrowright":
				$scope.next(false);
				break;
			case "arrowleft":
				$scope.previous();
				break;
			case "delete":
				if ($scope.state.currentTrack && $scope.state.currentTrack.file)
					playbackService.removeFromPlaylist($scope.state.currentTrack.file);
				break;
		}
	});

});