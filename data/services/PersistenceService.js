window.omniscience.factory('persistenceService', function persistenceService(eventService) {
	"use strict";

	var _device = { state: {} };

	return {
		load: function (serviceName) {
			if (!serviceName) throw new Error("argument 'serviceName' cannot be null");

			if (!_device.state[serviceName])
				_device.state[serviceName] = {};

			return _device.state[serviceName];
		},
		save: function (serviceName, state) {
			if (!serviceName) throw new Error("argument 'serviceName' cannot be null");

			eventService.emit("saveState", _device.id, serviceName, state);
		},
		initialize: function (device) {
			if (!device) throw new Error("argument 'device' cannot be null");
			_device = device;
		}
	};
});