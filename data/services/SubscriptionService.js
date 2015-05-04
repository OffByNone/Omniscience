omniscience.factory('subscriptionService', function (eventService, lastChangeEventParser, pubSub, $q, $timeout) {
	"use strict";

	var subscriptions = {}; //key is serviceHash, value is {genericCallback, lastChangeCallback}

	function addSubscription(serviceHash, genericEventCallback, lastChangeCallback, timeout) {
		subscriptions[serviceHash] = {
			genericEventCallback: genericEventCallback,
			lastChangeCallback: lastChangeCallback,
			timeout: timeout
		};
	}
	function removeSubscription(serviceHash) {
		delete subscriptions[serviceHash];
	}

	eventService.on("UPnPEvent", (serviceHash, eventXmlString) => {
		var callbacks = subscriptions[serviceHash];
		if(!callbacks){
			//pubSub.pub("UPnPEvent", { serviceHash: serviceHash, events: [eventXmlString] });
			console.log("UPnPEvent received but no service callbacks were found for service with hash " + serviceHash);
			return;
		}

		var lastChangeObj = lastChangeEventParser.parseEvent(eventXmlString);

		if (lastChangeObj) {
			pubSub.pub("UPnPEvent", { serviceHash: serviceHash, events: lastChangeObj });
			if (typeof callbacks.lastChangeCallback === 'function')
				return callbacks.lastChangeCallback(lastChangeObj);
			console.log("Last change event received for service with hash '" + serviceHash + "' but no lastChangeCallback was found.");
		}
		else {
			//pubSub.pub("UPnPEvent", { serviceHash: serviceHash, events: [eventXmlString] });
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

			var previouslySubscribed = false;

			if (subscriptions[service.hash]) previouslySubscribed = true;

			timeoutInSeconds = Number(timeoutInSeconds || 600);

			var timeout;

			if (!previouslySubscribed) //set timer to resubscribe to the service before our subscription times out
				 timeout = $timeout(() => subscribe(service, genericEventCallback, lastChangeCallback, timeoutInSeconds), timeoutInSeconds - 5);

			addSubscription(service.hash, genericEventCallback, lastChangeCallback, timeout);

			if (previouslySubscribed)
				return $q.reject("already subscribed, don't want to subscribe twice.  Your callbacks will still get executed.");

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
			if (!subscriptions[service.hash]) return; //we shouldn't have made it this far but sometimes we do

			if (subscriptions[service.hash].timeout) //if we have a resubscribe handler, remove it
			    timeout.cancel();

			removeSubscription(service.hash);

			return eventService.emit("Unsubscribe", service.eventSubUrl, service.subscriptionId, service.hash);
		}
	}
});