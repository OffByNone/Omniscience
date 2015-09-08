window.omniscience.factory('subscriptionService', function ($q, $timeout, eventService, lastChangeEventParser, jxon) {
	"use strict";

	var subscriptions = {};

	function addSubscription(service, timeoutInSeconds) {
		subscriptions[service.hash].timeout = $timeout(() => addSubscription(service, timeoutInSeconds), timeoutInSeconds * 900);/// make it 90% of the period so we don't resubscribe too late and potentially miss something
		return eventService.emit("Subscribe", service.eventSubUrl, service.hash, service.serverIP, timeoutInSeconds, service.subscriptionId).then((subscriptionId) => {
			if (!subscriptionId) $timeout.cancel(subscriptions[service.hash].timeout);
			return subscriptionId;
		});
	}

	eventService.on("UPnPEvent", (serviceHash, eventXmlString) => {
		var callbacks = subscriptions[serviceHash].callbacks;
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
			if (!service.hash) throw new Error("Argument null exception service.hash cannot be null.");
			if (!service.eventSubUrl) throw new Error("Argument null exception service.eventSubUrl cannot be null.");

			if (typeof subscriptions[service.hash] === "object") {
				subscriptions[service.hash].callbacks.push({ genericEventCallback, lastChangeCallback });
				return $q.reject("already subscribed, Your callbacks will still be executed.");
				//todo: resolve with sub id.  While we have already subscribed, the first subscription response may not have returned yet, so we might not have the sub id
			}

			subscriptions[service.hash] = { callbacks: [{ genericEventCallback, lastChangeCallback }] };
			return addSubscription(service, timeoutInSeconds || 900);
		},
		unsubscribe: function unsubscribe(serviceHash, subscriptionId, eventSubUrl) {
			if (!serviceHash) throw new Error("Argument null exception service.hash cannot be null.");
			if (!eventSubUrl) throw new Error("Argument null exception service.eventSubUrl cannot be null.");
			if (!subscriptionId) return; //means we never subscribed in the first place
			if (!subscriptions[serviceHash]) return; //if we have already unsubscribed

			if (!!subscriptions[serviceHash].timeout) $timeout.cancel(subscriptions[serviceHash].timeout);
			delete subscriptions[serviceHash];

			return eventService.emit("Unsubscribe", eventSubUrl, subscriptionId, serviceHash)
							.then(() => subscriptionId = null);
		}
	}
});