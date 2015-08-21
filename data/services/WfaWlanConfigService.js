window.omniscience.factory('wfaWlanConfigService', function ($rootScope, eventService, subscriptionService, informationService) {
	"use strict";

	var rawServiceType = 'urn:schemas-wifialliance-org:service:WFAWLANConfig:1';

	function getService() {
		return informationService.get(rawServiceType);
	}

	return {
		getInfo: function getInfo() {
			this.getDeviceInfo();
		},
		delAPSettings: function delAPSettings(newAPSettings) {
			return eventService.callService(getService(), "DelAPSettings", { NewAPSettings: newAPSettings });
		},
		delSTASettings: function delSTASettings(newSTASettings) {
			return eventService.callService(getService(), "DelSTASettings", { NewAPSettings: newAPSettings });
		},
		getAPSettings: function getAPSettings(newMessage) {
			return eventService.callService(getService(), "GetAPSettings", { NewAPSettings: newAPSettings });
		},
		getDeviceInfo: function getDeviceInfo() {
			return eventService.callService(getService(), "GetserviceInfo", { NewAPSettings: newAPSettings });
		},
		getSTASettings: function (newMessage) {
			return eventService.callService(getService(), "GetSTASettings", { NewMessage: newMessage });
		},
		putMessage: function (newInMessage) {
			return eventService.callService(getService(), "PutMessage", { NewInMessage: newInMessage });
		},
		putWLANResponse: function putWLANResponse(newMessage, newWLANEventType, newWLANEventMAC) {
			return eventService.callService(getService(), "PutWLANResponse", { NewMessage: newMessage, NewWLANEventType: newWLANEventType, NewWLANEventMAC: newWLANEventMAC });
		},
		rebootAP: function rebootAP(newAPSettings) {
			return eventService.callService(getService(), "RebootAP", { NewAPSettings: newAPSettings });
		},
		rebootSTA: function rebootSTA(newSTASettings) {
			return eventService.callService(getService(), "RebootSTA", { NewSTASettings: newSTASettings });
		},
		resetAP: function resetAP(newMessage) {
			return eventService.callService(getService(), "ResetAP", { NewMessage: newMessage });
		},
		resetSTA: function resetSTA(newMessage) {
			return eventService.callService(getService(), "ResetSTA", { NewMessage: newMessage });
		},
		setAPSettings: function setAPSettings(newAPSettings) {
			return eventService.callService(getService(), "SetAPSettings", { NewAPSettings: newAPSettings });
		},
		setSelectedRegistrar: function setSelecctedRegistrar(newMessage) {
			return eventService.callService(getService(), "SetSelectedRegistrar", { NewMessage: newMessage });
		},
		setSTASettings: function setSTASettings() {
			return eventService.callService(getService(), "SetSTASettings");
		},
		subscribe: function (genericEventCallback, lastChangeEventCallback) {
			return subscriptionService.subscribe(getService(), genericEventCallback, lastChangeEventCallback);
		},
		unsubscribe: function () {
			var service = getService();
			return subscriptionService.unsubscribe(service.uuid, service.subscriptionId, service.eventSubUrl);
		}
	};
});