﻿omniscience.factory('fileService', function (eventService, informationService) {
	"use strict";
	var serviceTypeUrn = 'urn:schemas-upnp-org:service:AVTransport:1';

	return {
		chooseFiles: function chooseFiles() {
			return eventService.emit('chooseFiles');
		},
		shareFile: function shareFile(file) {
			return eventService.emit("shareFile", informationService.get(serviceTypeUrn), file);
		}
	};
});