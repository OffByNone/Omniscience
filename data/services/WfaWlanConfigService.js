omniscience.factory('wfaWlanConfigService', function ($rootScope, eventService) {
	"use strict";
	return {
		getAdditionalInformation: function getAdditionalInformation(service) {
			this.getDeviceInfo(service);
		},
		delAPSettings: function delAPSettings(service, newAPSettings) {
			return eventService.callService(service, "DelAPSettings", { NewAPSettings: newAPSettings });
		},
		delSTASettings: function delSTASettings(service, newSTASettings) {
			return eventService.callService(service, "DelSTASettings", { NewAPSettings: newAPSettings });
		},
		getAPSettings: function getAPSettings(service, newMessage) {
			return eventService.callService(service, "GetAPSettings", { NewAPSettings: newAPSettings });
		},
		getDeviceInfo: function getDeviceInfo(service) {
			return eventService.callService(service, "GetserviceInfo", { NewAPSettings: newAPSettings });
		},
		getSTASettings: function (service, newMessage) {
			return eventService.callService(service, "GetSTASettings", { NewMessage: newMessage });
		},
		putMessage: function (service, newInMessage) {
			return eventService.callService(service, "PutMessage", { NewInMessage: newInMessage });
		},
		putWLANResponse: function putWLANResponse(service, newMessage, newWLANEventType, newWLANEventMAC) {
			return eventService.callService(service, "PutWLANResponse", { NewMessage: newMessage, NewWLANEventType: newWLANEventType, NewWLANEventMAC: newWLANEventMAC });
		},
		rebootAP: function rebootAP(service, newAPSettings) {
			return eventService.callService(service, "RebootAP", { NewAPSettings: newAPSettings });
		},
		rebootSTA: function rebootSTA(service, newSTASettings) {
			return eventService.callService(service, "RebootSTA", { NewSTASettings: newSTASettings });
		},
		resetAP: function resetAP(service, newMessage) {
			return eventService.callService(service, "ResetAP", { NewMessage: newMessage });
		},
		resetSTA: function resetSTA(service, newMessage) {
			return eventService.callService(service, "ResetSTA", { NewMessage: newMessage });
		},
		setAPSettings: function setAPSettings(service, newAPSettings) {
			return eventService.callService(service, "SetAPSettings", { NewAPSettings: newAPSettings });
		},
		setSelectedRegistrar: function setSelecctedRegistrar(service, newMessage) {
			return eventService.callService(service, "SetSelectedRegistrar", { NewMessage: newMessage });
		},
		setSTASettings: function setSTASettings(service) {
			return eventService.callService(service, "SetSTASettings");
		}
	};
});