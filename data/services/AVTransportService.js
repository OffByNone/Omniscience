omniscience.factory('avTransportService', function (eventService, subscriptionService, informationService) {
	"use strict";

	var rawServiceType = 'urn:schemas-upnp-org:service:AVTransport:1'; //todo: move this to a constants file
	var instanceId = 0; //todo: determine this dynamically
	var speed = 1; //todo: make this a setable default

	function getService() {
		return informationService.get(rawServiceType);
	}

	return {
		setAvTransportUri: function setAvTransportUri(currentUri, currentUriMetadata) {
			return eventService.callService(getService(), "SetAVTransportURI", { InstanceID: instanceId, CurrentURI: currentUri, CurrentURIMetaData: currentUriMetadata });
		},
		setNextAvTransportUri: function setNextAvTransportUri(nextUri, nextUriMetadata) {
			return eventService.callService(getService(), "SetNextAVTransportURI", { InstanceID: instanceId, NextURI: nextUri, NextURIMetaData: nextUriMetadata });
		},
		getMediaInfo: function getMediaInfo() {
			return eventService.callService(getService(), "GetMediaInfo", { InstanceID: instanceId });
		},
		getTransportInfo: function getTransportInfo() {
			return eventService.callService(getService(), "GetTransportInfo", { InstanceID: instanceId });
		},
		getPositionInfo: function getPositionInfo() {
			return eventService.callService(getService(), "GetPositionInfo", { InstanceID: instanceId });
		},
		getDeviceCapabilities: function getDeviceCapabilities() {
			return eventService.callService(getService(), "GetDeviceCapabilities", { InstanceID: instanceId });
		},
		getTransportSettings: function getTransportSettings() {
			return eventService.callService(getService(), "GetTransportSettings", { InstanceID: instanceId });
		},
		stop: function stop() {
			return eventService.callService(getService(), "Stop", { InstanceID: instanceId });
		},
		play: function play() {
			return eventService.callService(getService(), "Play", { InstanceID: instanceId, Speed: speed });
		},
		pause: function pause() {
			return eventService.callService(getService(), "Pause", { InstanceID: instanceId });
		},
		seek: function seek(unit, target) {
			return eventService.callService(getService(), "Seek", { InstanceID: instanceId, Unit: unit, Target: target });
		},
		next: function next() {
			return eventService.callService(getService(), "Next", { InstanceID: instanceId });
		},
		previous: function previous() {
			return eventService.callService(getService(), "Previous", { InstanceID: instanceId });
		},
		setPlayMode: function setPlayMode(newPlayMode) {
			return eventService.callService(getService(), "SetPlayMode", { InstanceID: instanceId, NewPlayMode: newPlayMode });
		},
		getCurrentTransportActions: function getCurrentTransportActions() {
			return eventService.callService(getService(), "GetCurrentTransportActions", { InstanceID: instanceId });
		},
		x_GetOperationList: function x_GetOperationList(avtInstanceID) {
			return eventService.callService(getService(), "X_GetOperationList", { AVTInstanceID: avtInstanceID });
		},
		x_ExecuteOperation: function x_ExecuteOperation(avtInstanceID, actionDirective) {
			return eventService.callService(getService(), "X_ExecuteOperation", { AVTInstanceID: avtInstanceID, ActionDirective: actionDirective });
		}
	};
});