omniscience.factory('fileService', function (eventService) {
	"use strict";

	return {
		openFilePicker: function openFilePicker() {
			return eventService.emit('chooseFiles');
		}
	};
});