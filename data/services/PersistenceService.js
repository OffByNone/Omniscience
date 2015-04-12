omniscience.factory('persistenceService', function persistenceService(eventService) {
	"use strict";

	var _device = { state: {} };

	return {
		load: function (serviceName) {
			if (!serviceName) throw new Error("argument 'serviceName' cannot be null");

			return _device.state[serviceName] || {};
		},
		save: function (serviceName, state) {
			if (!serviceName) throw new Error("argument 'serviceName' cannot be null");

			//_device.state[serviceName] = state; //todo: pretty sure I don't need this line this is here in case I do
			eventService.emit("saveState", _device, serviceName, state);
		},
		initialize: function (device) {
			if (!device) throw new Error("argument 'device' cannot be null");
			_device = device;
		}
	};
});