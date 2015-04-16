omniscience.controller('PlaylistController', function PlaylistController($scope, $timeout, avTransportService, fileService, pubSub) {
	"use strict";

	$scope.filePickerisOpen = true;
	$scope.filePicker = {};
	$scope.repeat = false;
	$scope.playlist = [];
	$scope.slideshow = { duration: 10000, timeout: null };
	$scope.currentFile = {};

	$scope.play = function play(file) {
		pauseSlideshow();
		$scope.state = "playing";
		if (file)
			load(file).then(() => avTransportService.play());
		else
			avTransportService.play();

		//set timeout for image $scope.slideshow
		if ($scope.currentFile.type && $scope.currentFile.type.indexOf("image/") == 0) startSlideshow();
	};
	$scope.pause = function pause() {
		$scope.state = "paused";
		avTransportService.pause();
		pauseSlideshow();
	};
	$scope.stop = function stop() {
		$scope.state = "stopped";
		pauseSlideshow();
		return avTransportService.stop();
	};
	$scope.previous = function previous() {
		var previousTrack = $scope.playlist[$scope.playlist.length - 1];
		for (var i = 0; i < $scope.playlist.length; i++) {
			if ($scope.playlist[i] === $scope.currentFile) return $scope.play(previousTrack);
			previousTrack = $scope.playlist[i];
		}
	}
	$scope.next = function next(abideByRepeat) {
		for (var i = 0; i < $scope.playlist.length; i++) {
			if ($scope.playlist[i] === $scope.currentFile)
				if (i == $scope.playlist.length - 1)
					if (!abideByRepeat || $scope.repeat) return $scope.play($scope.playlist[0]); //we are the last file and either pushed the next button, or repeat is enabled, so play the first file
					else {//we are the last file, didn't push the button and repeat is not enabled.  Stop playback, then load the first file
						$scope.stop().then(() => load($scope.playlist[0]));
					}
				else return $scope.play($scope.playlist[Number(i) + 1]); //we are not the last file so play the next
		}
	};
	$scope.add = function add(playImmediately) {
		//Adds files to playlist from file picker box and returns the added files
		var files = getChosenFiles();
		files.forEach(file => $scope.playlist.push(file));

		if (playImmediately) this.play(files[0]);

		return files;
	};
	$scope.clear = function clear() {
		$scope.playlist.length = 0; //setting to [] will not clear out other references to this array.
		this.stop();
	};
	$scope.randomize = function randomize() {
		shuffle($scope.playlist);
	};
	$scope.remove = function remove(file) {
		for (var i = 0; i < $scope.playlist.length; i++)
			if ($scope.playlist[i] === file) {
				if (file === $scope.currentFile) {
					if ($scope.playlist.length > 1) this.next(true); //more files in $scope.playlist, play next
					else this.stop(); //only file in $scope.playlist, stop playback
				}
				$scope.playlist.splice(i, 1);
				return;
			}
	};

	function togglePlayState() {
		if ($scope.state === "playing") $scope.pause();
		else $scope.play();
	}
	function removeCurrent() {
		if ($scope.currentFile) $scope.remove($scope.currentFile);
	}
	function shuffle(array) {
		///Fisher–Yates Shuffle
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle
		while (0 !== currentIndex) {
			// Pick a remaining element
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}
	function startSlideshow() {
		$scope.slideshow.timeout = $timeout(() => $scope.next(true), $scope.slideshow.duration);
	}
	function pauseSlideshow() {
		if ($scope.slideshow.timeout) $timeout.cancel($scope.slideshow.timeout);
	}

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
	function load(file) {
		$scope.currentFile = file
		return fileService.shareFile(file).then(fileUri => {
			return avTransportService.setAvTransportUri(fileUri, "");
		});
	}

	pubSub.sub("togglePlayState", $scope.togglePlayState, $scope);
	pubSub.sub("removeCurrent", $scope.removeCurrent, $scope);
	pubSub.sub("play", $scope.play, $scope);
	pubSub.sub("stop", $scope.stop, $scope);
	pubSub.sub("pause", $scope.pause, $scope);
	pubSub.sub("previous", $scope.previous, $scope);
	pubSub.sub("next", $scope.next, $scope);
});