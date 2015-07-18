omniscience.factory('subscriptionService', function ($q, $timeout, eventService, lastChangeEventParser, jxon) {
	"use strict";

	var subscriptions = {};

	function addSubscription(service, timeoutInSeconds) {
		subscriptions[service.uuid].timeout = $timeout(() => addSubscription(service, timeoutInSeconds), timeoutInSeconds * 900);/// make it 90% of the period so we don't resubscribe too late and potentially miss something
		return eventService.emit("Subscribe", service.eventSubUrl, service.uuid, service.serverIP, timeoutInSeconds, service.subscriptionId).then((subscriptionId) => {
			if (!subscriptionId) $timeout.cancel(subscriptions[service.uuid].timeout);

			service.subscriptionId = subscriptionId;
			return subscriptionId;
		});
	}

	eventService.on("UPnPEvent", (serviceUUID, eventXmlString) => {
		var callbacks = subscriptions[serviceUUID].callbacks;
		if (!callbacks) return;

		var lastChangeObj = lastChangeEventParser.parseEvent(eventXmlString);

		if (lastChangeObj)
			callbacks.filter((callback) => typeof callback.lastChangeCallback === 'function')
					.forEach((callback) => callback.lastChangeCallback(lastChangeObj));
		else {
			var eventJson = jxon.build(eventXmlString);
			if (eventJson.propertyset && eventJson.propertyset.property) {
				var eventObj = {};

				if (!Array.isArray(eventJson.propertyset.property))
					eventJson.propertyset.property = [eventJson.propertyset.property];

				eventJson.propertyset.property.forEach(property => {
					for (var key in property) {
						if (eventObj.hasOwnProperty(key)) {
							if (!Array.isArray(eventObj[key]))
								eventObj[key] = [eventObj[key]];

							eventObj[key].push(property[key]);
						}
						eventObj[key] = property[key];
					}
				});

				callbacks.filter((callback) => typeof callback.genericEventCallback === 'function')
						.forEach((callback) => callback.genericEventCallback([eventObj]));
			}
		}
	});

	return {
		subscribe: function subscribe(service, genericEventCallback, lastChangeCallback, timeoutInSeconds) {
			if (typeof genericEventCallback !== "function" && typeof lastChangeCallback !== "function") throw new Error("Invalid argument exception.  Both parameters 'genericCallback' and 'lastChangeCallback' are null or not functions.  At least one of them must be a function.");
			if (!service || typeof service !== "object") throw new Error("Invalid argument exception.  Parameter 'service' is either null or not an object.");
			if (!service.uuid) throw new Error("Argument null exception service.uuid cannot be null.");
			if (!service.eventSubUrl) throw new Error("Argument null exception service.eventSubUrl cannot be null.");

			if (typeof subscriptions[service.uuid] === "object") {
				subscriptions[service.uuid].callbacks.push({ genericEventCallback, lastChangeCallback });
				return $q.reject("already subscribed, Your callbacks will still be executed.");
				//todo: resolve with sub id.  While we have already subscribed, the first subscription response may not have returned yet, so we might not have the sub id
			}

			subscriptions[service.uuid] = { callbacks: [{ genericEventCallback, lastChangeCallback }] };
			return addSubscription(service, timeoutInSeconds || 900);
		},
		unsubscribe: function unsubscribe(serviceUUID, subscriptionId, eventSubUrl) {
			if (!serviceUUID) throw new Error("Argument null exception service.uuid cannot be null.");
			if (!eventSubUrl) throw new Error("Argument null exception service.eventSubUrl cannot be null.");
			if (!subscriptionId) return; //means we never subscribed in the first place
			if (!subscriptions[serviceUUID]) return; //if we have already unsubscribed

			if (!!subscriptions[serviceUUID].timeout) $timeout.cancel(subscriptions[serviceUUID].timeout);
			delete subscriptions[serviceUUID];

			return eventService.emit("Unsubscribe", eventSubUrl, subscriptionId, serviceUUID)
							.then(() => subscriptionId = null);
		}
	}
});