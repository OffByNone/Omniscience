omniscience.factory('subscriptionService', function (eventService, lastChangeEventParser, $q, $timeout) {
	"use strict";

	var subscriptions = {};

	function addSubscription(service, timeoutInSeconds) {
		subscriptions[service.hash].timeout = $timeout(() => { console.log("attempting to resubscribe");addSubscription(service, timeoutInSeconds) }, timeoutInSeconds * 900);/// make it 90% of the period so we don't resubscribe too late and potentially miss something

		return eventService.emit("Subscribe", service.eventSubUrl, service.subscriptionId, service.hash, service.serverIP, timeoutInSeconds).then((subscriptionId) => {
			service.subscriptionId = subscriptionId;
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
		else
			callbacks.filter((callback) => typeof callback.genericEventCallback === 'function');
					//.forEach((callback) => callback.genericEventCallback(eventXmlString))
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
			return addSubscription(service, timeoutInSeconds || 20);
		},
		unsubscribe: function unsubscribe(service) {
			if (!service || typeof service !== "object") throw new Error("Invalid argument exception.  Parameter 'service' is either null or not an object.");
			if (!service.hash) throw new Error("Argument null exception service.hash cannot be null.");
			if (!service.eventSubUrl) throw new Error("Argument null exception service.eventSubUrl cannot be null.");
			if (!service.subscriptionId) return; //means we never subscribed in the first place
			if (!subscriptions[service.hash]) return; //we shouldn't have made it this far but sometimes we do, todo: look into this

			if (!!subscriptions[serviceHash].timeout) $timeout.cancel(subscriptions[serviceHash].timeout);
			delete subscriptions[serviceHash];

			return eventService.emit("Unsubscribe", service.eventSubUrl, service.subscriptionId, service.hash)
							.then(() => service.subscriptionId = null);
		}
	}
});