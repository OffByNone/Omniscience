omniscience.controller('PlaylistController', function PlaylistController($scope, $timeout, $interval, playbackService, fileService) {
	"use strict";

	$scope.service = $scope.device.services.filter(service => service.type.urn === 'urn:schemas-upnp-org:service:AVTransport:1')[0];

	$scope.availableActions = ["play","stop"];
	$scope.filePickerOpen = true;
	$scope.filePicker = {};

	$scope.track = {};

	$scope.percentComplete = function percentComplete() {
		return ($scope.track.currentSeconds / $scope.track.totalSeconds) * 100;
	};
	$scope.canExecuteAction = function (action) {
		return $scope.availableActions.some(availableAction => availableAction == action);
	};
	$scope.togglePlayState = function togglePlayState(deviceServiceService) {
		playbackService.togglePlayState(deviceServiceService);
	};
	$scope.play = function play(deviceServiceService, file) {
		playbackService.play(deviceServiceService, file);
	};
	$scope.pause = function pause(deviceServiceService) {
		playbackService.pause(deviceServiceService);
	};
	$scope.stop = function stop(deviceServiceService) {
		playbackService.stop(deviceServiceService);
	};
	$scope.previous = function previous(deviceServiceService) {
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
	$scope.toggleMute = function toggleMute(deviceServiceService) {
		playbackService.toggleMute(deviceServiceService);
	};
	$scope.setVolume = function setVolume(deviceServiceService, newVolume) {
		device.volume = newVolume;
		eventService.emit('setVolume', device, newVolume);
	};
	$scope.incrementVolume = function incrementVolume(deviceServiceService) {
		device.setVolume(device, Number(device.volume) + 1);
	};
	$scope.decrementVolume = function decrementVolume(deviceServiceService) {
		device.setVolume(device, Number(device.volume) - 1);
	};
	$scope.add = function add(device, playImmediately) {
		//Adds files to playlist from file picker box and returns the added files
		var files = getChosenFiles();
		files.forEach(file => $scope.playlist.push(file));

		if (playImmediately) $scope.play(device, files[0]);

		return files;
	};
	$scope.remove = function remove(deviceServiceService, file) {
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
	$scope.clear = function clear(deviceServiceService) {
		$scope.playlist = [];
		$scope.stop(device);
	};
	$scope.randomize = function randomize() {
		shuffle($scope.playlist);
	};



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
	function addToPlaylist(deviceService, playImmediately) {
		//Adds files to playlist from file picker box and returns the added files
		var files = getChosenFiles();

		playbackService.addToPlaylist(deviceService, files, playImmediately);

		return files;
	};
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
	function browseLocalFiles(){
		fileService.openFilePicker().then(files => setNewFiles(files));
	}






});