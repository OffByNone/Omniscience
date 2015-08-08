omniscience.factory('fileService', function (eventService) {
	"use strict";
	var rawServiceType = 'urn:schemas-upnp-org:service:AVTransport:1';

	return {
		chooseFiles: function chooseFiles() {
			return eventService.emit('chooseFiles');
		},
		shareFile: function shareFile(file, serverIP) {
			return eventService.emit("shareFile", file, serverIP).then(fileUri => {
				console.log(fileUri);
				return fileUri;
			});
		}
	};
});