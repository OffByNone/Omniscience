class SubscriptionService {
    constructor(fetch) {
        this._fetch = fetch;
    }
    subscribe(subscriptionUrl, eventSubscriptionId, serviceHash, timeout, directResponsesTo){
        var headers;
        if(eventSubscriptionId){
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
    			if(!response.ok) {
    				if(response.status == 412){
    					//we didn't respond within the timeout so we need to send again
    					eventSubscriptionId = null;
    					console.log("subscription timed out, trying again.");
    					return this.subscribe(subscriptionUrl, eventSubscriptionId, serviceHash, timeout, directResponsesTo);
    				}
    				else
    					throw new Error("Subscription at address: " + subscriptionUrl + " failed. Status code " + response.status);
    			}
    			return eventSubscriptionId
    		});

    }
	unsubscribe (subscriptionUrl, eventSubscriptionId){
    	if(!subscriptionUrl || !eventSubscriptionId) return Promise.reject("Either the subscriptionURL was null or the subscription id was, either way nothing to unsubscribe."); //todo: better validation, also validate some fields on subscribe too.
    	return this._fetch(subscriptionUrl, {method: 'UNSUBSCRIBE', headers: { SID: eventSubscriptionId } });
    }
}

module.exports = SubscriptionService;