omniscience.factory('mediaReceiverRegistrarService', function ($rootScope, eventService) {
	"use strict";
	return {
		isAuthorized: function getSearchCapabilities(service, DeviceID) {
			return eventService.callService(service, "GetSearchCapabilities", { DeviceID: deviceID });
		},
		registerservice: function getSortCapabilities(service, DeviceID) {
			return eventService.callService(service, "GetSortCapabilities", { DeviceID: deviceID });
		},
		isValidated: function getSystemUpdateID(service, registrationReqMsg) {
			return eventService.callService(service, "GetSystemUpdateID", { RegistrationReqMsg: registrationReqMsg });
		}
	};
});