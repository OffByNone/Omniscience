omniscience.factory('subscriptionService', function (eventService, lastChangeEventParser, $q, $timeout) {
	"use strict";

	var subscriptions = {}; //key is serviceHash value is {timeout, array of genericCallback, lastChangeCallback}

	function addSubscription(serviceHash, genericEventCallback, lastChangeCallback, timeout) {
		if (typeof subscriptions[serviceHash] === "object")
			subscriptions[serviceHash].callbacks.push({ genericEventCallback, lastChangeCallback });
		else
			subscriptions[serviceHash] = { timeout, callbacks: [{ genericEventCallback, lastChangeCallback }] };
	}
	function removeSubscription(serviceHash) {
		delete subscriptions[serviceHash];
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

			var previouslySubscribed = false;

			if (!!subscriptions[service.hash]) previouslySubscribed = true;

			timeoutInSeconds = Number(timeoutInSeconds || 600);
			var timeout;

			if (!previouslySubscribed) //set timer to resubscribe to the service 5 seconds before our subscription times out
				timeout = $timeout(() => this.subscribe(service, genericEventCallback, lastChangeCallback, timeoutInSeconds), timeoutInSeconds - 5);

			addSubscription(service.hash, genericEventCallback, lastChangeCallback, timeout);

			if (previouslySubscribed)
				return $q.reject("already subscribed, don't want to subscribe twice. Your callbacks will still get executed.");
				//todo: resolve with sub id.  While we have already subscribed, the first subscription response may not have returned yet, so we might not have the sub id

			return eventService.emit("Subscribe", service.eventSubUrl, service.subscriptionId, service.hash, service.serverIP, timeoutInSeconds).then((subscriptionId) => {
				service.subscriptionId = subscriptionId;
				return subscriptionId;
			});
		},
		unsubscribe: function unsubscribe(service) {
			if (!service || typeof service !== "object") throw new Error("Invalid argument exception.  Parameter 'service' is either null or not an object.");
			if (!service.hash) throw new Error("Argument null exception service.hash cannot be null.");
			if (!service.eventSubUrl) throw new Error("Argument null exception service.eventSubUrl cannot be null.");
			if (!service.subscriptionId) return; //means we never subscribed in the first place
			if (!subscriptions[service.hash]) return; //we shouldn't have made it this far but sometimes we do, todo: look into this

			if (subscriptions[service.hash].timeout) //if we have a resubscribe handler, remove it
				$timeout.cancel(subscriptions[service.hash].timeout);

			removeSubscription(service.hash);

			return eventService.emit("Unsubscribe", service.eventSubUrl, service.subscriptionId, service.hash)
							.then(() => service.subscriptionId = null);
		}
	}
});