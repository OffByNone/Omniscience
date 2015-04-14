omniscience.factory('subscriptionService', function (eventService, lastChangeEventParser) {
	"use strict";

	var subscriptions = {}; //key is serviceHash, value is {genericCallback, lastChangeCallback}

	function addSubscription(serviceHash, genericEventCallback, lastChangeCallback) {
		subscriptions[serviceHash] = {
			genericEventCallback: genericEventCallback,
			lastChangeCallback: lastChangeCallback
		};
	}
	function removeSubscription(serviceHash) {
		delete subscriptions[serviceHash];
	}

	eventService.on("UPnPEvent", (serviceHash, eventXmlString) => {
		var callbacks = subscriptions[serviceHash];

		if(!callbacks){
			console.log("UPnPEvent received but no service callbacks were found for service with hash " + serviceHash);
			return;
		}

		var lastChangeObj = lastChangeEventParser.parseEvent(eventXmlString);

		if (lastChangeObj) {
			if (typeof callbacks.lastChangeCallback === 'function')
				return callbacks.lastChangeCallback(lastChangeObj);
			console.log("Last change event received for service with hash '" + serviceHash + "' but no lastChangeCallback was found.");
		}
		else {
			if (typeof callbacks.genericEventCallback === 'function')
				return callbacks.genericEventCallback(eventXmlString);
			console.log("Generic UPnP event received for service with hash '" + serviceHash + "' but no genericEventCallback was found.");
		}

	});

	return {
		subscribe: function subscribe(service, genericEventCallback, lastChangeCallback, timeoutInSeconds) {
			if (typeof genericEventCallback !== "function" && typeof lastChangeCallback !== "function") throw new Error("Invalid argument exception.  Both parameters 'genericCallback' and 'lastChangeCallback' are null or not functions.  At least one of them must be a function.");
			if (!service || typeof service !== "object") throw new Error("Invalid argument exception.  Parameter 'service' is either null or not an object.");
			if (!service.hash) throw new Error("Argument null exception service.hash cannot be null.");
			if (!service.eventSubUrl) throw new Error("Argument null exception service.eventSubUrl cannot be null.");

			addSubscription(service.hash, genericEventCallback, lastChangeCallback);
			timeoutInSeconds = timeoutInSeconds || 600;
			return eventService.emit("Subscribe", service.eventSubUrl, service.subscriptionId, service.hash, timeoutInSeconds).then((subscriptionId) => {
				return subscriptionId;
			});
		},
		unsubscribe: function unsubscribe(service) {
			if (!service || typeof service !== "object") throw new Error("Invalid argument exception.  Parameter 'service' is either null or not an object.");
			if (!service.hash) throw new Error("Argument null exception service.hash cannot be null.");
			if (!service.eventSubUrl) throw new Error("Argument null exception service.eventSubUrl cannot be null.");

			removeSubscription(service.hash);
			return eventService.emit("Unsubscribe", service.eventSubUrl, service.subscriptionId, service.hash);
		}
	}
});