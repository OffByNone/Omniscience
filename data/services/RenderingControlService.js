omniscience.factory('renderingControlService', function (eventService, informationService, subscriptionService) {
	"use strict";

	var rawServiceType = 'urn:schemas-upnp-org:service:RenderingControl:1';
	var instanceId = 0;
	var channel = "Master";

	function getService() {
		return informationService.get(rawServiceType);
	}

	return {
		getMute: function getMute() {
			return eventService
				.callService(getService(), "GetMute", { InstanceID: instanceId, Channel: channel })
				.then((response) => {
					return response && response.hasOwnProperty("CurrentMute") ? response.CurrentMute == 1 : response;
				});
		},
		getVolume: function getVolume() {
			return eventService
				.callService(getService(), "GetVolume", { InstanceID: instanceId, Channel: channel })
				.then((response) => {
					return response && response.hasOwnProperty("CurrentVolume") ? response.CurrentVolume : response;
				});
		},
		listPresets: function listPresets() {
			return eventService.callService(getService(), "ListPresets", { InstanceID: instanceId });
		},
		selectPresets: function selectPresets(presetName) {
			return eventService.callService(getService(), "ListPresets", { InstanceID: instanceId, PresetName: presetName });
		},
		setMute: function setMute(desiredMute) {
			return eventService.callService(getService(), "SetMute", { InstanceID: instanceId, Channel: channel, DesiredMute: desiredMute });
		},
		setVolume: function setVolume(desiredVolume) {
			return eventService.callService(getService(), "SetVolume", { InstanceID: instanceId, Channel: channel, DesiredVolume: desiredVolume });
		},
		subscribe: function (genericEventCallback, lastChangeEventCallback) {
			return subscriptionService.subscribe(getService(), genericEventCallback, lastChangeEventCallback);
		},
		unsubscribe: function () {
			return subscriptionService.unsubscribe(getService());
		}
	};
});