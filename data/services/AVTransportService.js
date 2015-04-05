omniscience.factory('avTransportService', function ($rootScope, eventService) {
	"use strict";

	function _parseEventRequest(request) {
		var requestXml = this._DOMParser.parseFromString(request.body, 'text/xml');
		var lastChanges = this._xmlParser.getElements(requestXml, "propertyset property LastChange");
		var instances = [];

		lastChanges.map(lastChange => {
			var eventString = lastChange.innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
			var eventXml = this._DOMParser.parseFromString(eventString, 'text/xml');

			var instancesXml = this._xmlParser.getElements(eventXml, "InstanceID");
			instancesXml.map(instanceXml => {
				instance = {};
				Array.prototype.slice.call(instanceXml.children).forEach(child => {
					instance[child.tagName] = child.attributes.getNamedItem('val').value;
				});
				instances.push(instance);
			});
		});

		return instances;
	}

	/*		loadMedia: function loadMedia(service, instanceId, file) {
			var deferred = this._defer();
			var fileUri = this._httpd.loadMedia(service, file);

			this._soapService.post(service.controlUrl,
								   this.serviceType,
								   "SetAVTransportURI",
								   { InstanceID: instanceId, CurrentURI: fileUri, CurrentURIMetaData: "" }
								  ).then(response => deferred.resolve(response));
			return deferred.promise;
		},*/

	return {
		getAdditionalInformation: function getAdditionalInformation(service) {
			getMediaInfo(service, instanceId);
			getTransportInfo(service, instanceId);
			getPositionInfo(service, instanceId);
			getDeviceCapabilities(service, instanceId);
			getTransportSettings(service, instanceId);
			getCurrentTransportActions(service, instanceId);
		},
		setAvTransportUri: function setAvTransportUri(service, instanceId, currentUri, currentUriMetadata) {
			return eventService.callService(service, "SetAVTransportURI", { InstanceID: instanceId, CurrentURI: currentUri, CurrentURIMetaData: currentUriMetadata });
		},
		setNextAvTransportUri: function setNextAvTransportUri(service, instanceId, nextUri, nextUriMetadata) {
			return eventService.callService(service, "SetNextAVTransportURI", { InstanceID: instanceId, NextURI: nextUri, NextURIMetaData: nextUriMetadata });
		},
		getMediaInfo: function getMediaInfo(service, instanceId) {
			return eventService.callService(service, "GetMediaInfo", { InstanceID: instanceId });
		},
		getTransportInfo: function getTransportInfo(service, instanceId) {
			return eventService.callService(service, "GetTransportInfo", { InstanceID: instanceId });
		},
		getPositionInfo: function getPositionInfo(service, instanceId) {
			return eventService.callService(service, "GetPositionInfo", { InstanceID: instanceId });
		},
		getDeviceCapabilities: function getDeviceCapabilities(service, instanceId) {
			return eventService.callService(service, "GetDeviceCapabilities", { InstanceID: instanceId });
		},
		getTransportSettings: function getTransportSettings(service, instanceId) {
			return eventService.callService(service, "GetTransportSettings", { InstanceID: instanceId });
		},
		stop: function stop(service, instanceId) {
			return eventService.callService(service, "Stop", { InstanceID: instanceId });
		},
		play: function play(service, instanceId, speed) {
			return eventService.callService(service, "Play", { InstanceID: instanceId, Speed: speed });
		},
		pause: function pause(service, instanceId) {
			return eventService.callService(service, "Pause", { InstanceID: instanceId });
		},
		seek: function seek(service, instanceId, unit, target) {
			return eventService.callService(service, "Seek", { InstanceID: instanceId, Unit: unit, Target: target });
		},
		next: function next(service, instanceId) {
			return eventService.callService(service, "Next", { InstanceID: instanceId });
		},
		previous: function previous(service, instanceId) {
			return eventService.callService(service, "Previous", { InstanceID: instanceId });
		},
		setPlayMode: function setPlayMode(service, instanceId, newPlayMode) {
			return eventService.callService(service, "SetPlayMode", { InstanceID: instanceId, NewPlayMode: newPlayMode });
		},
		getCurrentTransportActions: function getCurrentTransportActions(service, instanceId) {
			return eventService.callService(service, "GetCurrentTransportActions", { InstanceID: instanceId });
		},
		x_GetOperationList: function x_GetOperationList(service, avtInstanceID) {
			return eventService.callService(service, "X_GetOperationList", { AVTInstanceID: avtInstanceID });
		},
		x_ExecuteOperation: function x_ExecuteOperation(service, avtInstanceID, actionDirective) {
			return eventService.callService(service, "X_ExecuteOperation", { AVTInstanceID: avtInstanceID, ActionDirective: actionDirective });
		}
	};
});