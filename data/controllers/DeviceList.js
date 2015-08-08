omniscience.controller('DeviceListController', function DeviceListController($scope, eventService, $q) {
	"use strict";
	var fetched = false;
	var encoded = "";
	eventService.emit("loadDevices");
	var getImage = function(url) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'arraybuffer';
		var deferred = $q.defer();
		xhr.onload = function(e) {
		  if (this.status == 200) {
		    var uInt8Array = new Uint8Array(this.response);
		    var i = uInt8Array.length;
		    var binaryString = new Array(i);
		    while (i--)
		    {
		      binaryString[i] = String.fromCharCode(uInt8Array[i]);
		    }
		    var data = binaryString.join('');
		
		    var base64 = window.btoa(data);
		    deferred.resolve("data:image/jpeg;base64,"+base64);
		  } else {
			  deferred.reject();
		  }
		};
		console.log(url);
		xhr.send();	
		return deferred.promise;
	};
	
	$scope.fetchImageDataUri = function (url) {
		if (!fetched) {
			return getImage(url).then(function(base64) {
				encoded = base64;
				fetched = true;
				return encoded;
			});
		}
		else {
			return encoded;
		}
	};
});