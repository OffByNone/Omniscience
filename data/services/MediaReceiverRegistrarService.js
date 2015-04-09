omniscience.factory('mediaReceiverRegistrarService', function ($rootScope, eventService) {
	"use strict";

	var serviceTypeUrn = 'urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1';
	function getService() {
		return informationService.get(serviceTypeUrn);
	}

	return {
		isAuthorized: function getSearchCapabilities(DeviceId) {
			return eventService.callService(getService(), "GetSearchCapabilities", { DeviceID: deviceId });
		},
		registerservice: function getSortCapabilities(DeviceId) {
			return eventService.callService(getService(), "GetSortCapabilities", { DeviceID: deviceId });
		},
		isValidated: function getSystemUpdateID(registrationReqMsg) {
			return eventService.callService(getService(), "GetSystemUpdateID", { RegistrationReqMsg: registrationReqMsg });
		}
	};
});