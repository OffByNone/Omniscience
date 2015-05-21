class SubscriptionService {
	constructor(fetch, pubSub, httpServer, httpResponder) {
		this._fetch = fetch;
		this._pubSub = pubSub;
		this._httpServer = httpServer;
		this._httpResponder = httpResponder;

		this._pubSub.sub('Subscribe', (uniqueId, subscriptionUrl, subscriptionId, serviceHash, serverIP, timeout) =>
			this.subscribe(subscriptionUrl, subscriptionId, serviceHash, serverIP, timeout).
				then((eventSubscriptionId) => this._pubSub.pub("emitResponse", uniqueId, eventSubscriptionId)));

		this._pubSub.sub('Unsubscribe', (uniqueId, subscriptionUrl, subscriptionId, serviceHash) =>
			this.unsubscribe(subscriptionUrl, subscriptionId, serviceHash).
				then(() => this._pubSub.pub("emitResponse", uniqueId))
		);
	}
	subscribe(subscriptionUrl, eventSubscriptionId, serviceHash, serverIP, timeout) {
		var directResponsesTo = `http://${serverIP}:${this._httpServer.port}/events/${serviceHash}`;

        this._httpServer.registerPath(directResponsesTo, (request, resolve) => {
        	this._pubSub.pub("subscriptionService.UPnPEvent", serviceHash, request.body);
            this._httpResponder.sendOkResponse(request.socket);
		});

		var headers;
		if (eventSubscriptionId) {
			headers = {
				TIMEOUT: `Second-${timeout}`,
    			SID: eventSubscriptionId
    		};
    	}
    	else{
    		headers = {
    			CALLBACK: `<${directResponsesTo}>`,
    			TIMEOUT: `Second-${timeout}`,
    			NT: "upnp:event"
    		};
    	}

    	return this._fetch(subscriptionUrl, {
    			method: 'SUBSCRIBE',
    			headers: headers
    	}).then(response => {
			//todo: this function probably doesn't belong in here
    			eventSubscriptionId = response.headers.get('sid');
    			if (!response.ok) {
    				if(response.status == 412){
    					//we didn't respond within the timeout so we need to send again
    					//todo: add a max number of retries
    					eventSubscriptionId = null;
    					console.log("subscription timed out, trying again.");
    					return this.subscribe(subscriptionUrl, eventSubscriptionId, serviceHash, serverIP, timeout);
    				}
    				else
    					throw new Error("Subscription at address: " + subscriptionUrl + " failed. Status code " + response.status);
				}
    			return eventSubscriptionId
    		});

    }
	unsubscribe(subscriptionUrl, eventSubscriptionId, serviceHash) {
		this._httpServer.registerPath(`/events/${serviceHash}`, null );
    	if(!subscriptionUrl || !eventSubscriptionId) return Promise.reject("Either the subscriptionURL was null or the subscription id was, either way nothing to unsubscribe."); //todo: better validation, also validate some fields on subscribe too.
    	return this._fetch(subscriptionUrl, {method: 'UNSUBSCRIBE', headers: { SID: eventSubscriptionId } });
    }
}

module.exports = SubscriptionService;