omniscience.factory('mediaReceiverRegistrarService', function ($rootScope, eventService, subscriptionService) {
	"use strict";

	var rawServiceType = 'urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1';
	function getService() {
		return informationService.get(rawServiceType);
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
		},
		subscribe: function (genericEventCallback, lastChangeEventCallback) {
			return subscriptionService.subscribe(getService(), genericEventCallback, lastChangeEventCallback);
		},
		unsubscribe: function () {
			var service = getService();
			return subscriptionService.unsubscribe(service.hash, service.subscriptionId, service.eventSubUrl);
		}
	};
});