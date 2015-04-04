omniscience.factory('renderingControlService', function ($rootScope, eventService) {
	"use strict";
	return {
		getAdditionalInformation: function getAdditionalInformation(service) {
			this.getMute(service);
			this.getVolume(service);
			this.listPresets(service);
		},
		getMute: function getMute(service, instanceId, channel) {
			return eventService.callService(service, "GetMute", { InstanceID: instanceId, Channel: channel });
		},
		getVolume: function getVolume(service, instanceId, channel) {
			return eventService.callService(service, "GetVolume", { InstanceID: instanceId, Channel: channel });
		},
		listPresets: function listPresets(service, instanceId) {
			return eventService.callService(service, "ListPresets", { InstanceID: instanceId });
		},
		selectPresets: function selectPresets(service, instanceId, presetName) {
			return eventService.callService(service, "ListPresets", { InstanceID: instanceId, PresetName: presetName });
		},
		setMute: function setMute(service, instanceId, channel, desiredMute) {
			return eventService.callService(service, "SetMute", { InstanceID: instanceId, Channel: channel, DesiredMute: desiredMute });
		},
		setVolume: function setVolume(service, instanceId, channel, desiredVolume) {
			return eventService.callService(service, "SetVolume", { InstanceID: instanceId, Channel: channel, DesiredVolume: desiredVolume });
		}
	};
});