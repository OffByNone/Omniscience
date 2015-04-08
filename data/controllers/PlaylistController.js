omniscience.controller('PlaylistController', function PlaylistController($scope, playbackService, fileService) {
	"use strict";

	$scope.filePickerOpen = true;
	$scope.filePicker = {};
	$scope.playlist = playbackService.playlist;
	$scope.currentTrack = playbackService.currentTrack;

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
	$scope.addToPlaylist = function addToPlaylist(playImmediately) {
		//Adds files to playlist from file picker box and returns the added files
		var files = getChosenFiles();
		playbackService.addToPlaylist(files, playImmediately);
		return files;
	};
	$scope.canExecuteAction = function (action) {
		return playbackService.canExecuteAction(action);
	};
	$scope.clearPlaylist = function clearPlaylist() {
		playbackService.clearPlaylist();
	};
	$scope.randomizePlaylist = function randomizePlaylist() {
		playbackService.randomizePlaylist();
	};
	$scope.removeFromPlaylist = function removeFromPlaylist(file) {
		playbackService.removeFromPlaylist(file);
	};
	$scope.togglePlayState = function togglePlayState() {
		playbackService.togglePlayState();
	};



	$scope.browseLocalFiles = function () {
		fileService.chooseFiles().then(files => setNewFiles(files));
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
		if (Array.isArray(files))
			files.forEach(file => file.isLocal = true);

		$scope.filePicker.localFiles = files;

		if (files == null || files.length == 0) { // no files selected
			$scope.filePicker.localFileText = "";
			$scope.filePicker.paths = "";
		}
		else if (files.length == 1) { // one file selected
			$scope.filePicker.localFileText = files[0].path;
			$scope.filePicker.paths = "";
		}
		else {  // multiple files selected
			$scope.filePicker.localFileText = "Multiple Files Selected";
			$scope.filePicker.paths = files.map(file => file.path).join("\n");
		}
	}
});