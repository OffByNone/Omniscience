window.omniscience.factory('eventService', function ($rootScope, $window, $q) {
	"use strict";

	var emitPromises = {};
	var subscriptions = {};

	$window.self.on("message", (message) => {
		var messageObj;
		try {
			messageObj = JSON.parse(message);
		}
		catch (err) {
			console.log(message);
			console.log(err);
			return;
		}

		if (!Array.isArray(subscriptions[messageObj.eventType])) return; //nobody has subscribed yet, just return
		subscriptions[messageObj.eventType].forEach(subscriptionCallback => $rootScope.$apply(subscriptionCallback(...messageObj.data)));
	});


	function generateQuickGuidish() { //e7 from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
		var lut = []; for (var i = 0; i < 256; i++) { lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }
		var d0 = Math.random() * 0xffffffff | 0;
		var d1 = Math.random() * 0xffffffff | 0;
		var d2 = Math.random() * 0xffffffff | 0;
		var d3 = Math.random() * 0xffffffff | 0;
		return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
			lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
			lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
			lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
	}
	function on(eventType, callback) {
		subscriptions[eventType] = subscriptions[eventType] || [];
		subscriptions[eventType].push(callback);
	}
	function emit(eventType, ...args) {
		var uniqueId = generateQuickGuidish();
		var deferred = $q.defer();

		emitPromises[uniqueId] = deferred;

		var message = JSON.stringify({
			eventType: eventType,
			data: [uniqueId, ...args]
		});

		$window.self.postMessage(message);

		return deferred.promise;
	}
	function callService(service, serviceMethod, data) {
		return emit("CallService", service, serviceMethod, data);
	}
	on("emitResponse", function (uniqueId, ...args) {
		var deferred = emitPromises[uniqueId];
		if (deferred) {
			delete emitPromises[uniqueId];
			deferred.resolve(...args);
		}
		else {
			console.log("no deferred for the response");
		}
	});

	return {
		on: on,
		emit: emit,
		callService: callService
	};
});