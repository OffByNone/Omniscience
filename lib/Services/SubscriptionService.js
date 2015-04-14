const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const SubscriptionService = Class({
	extends: EventTarget,
	initialize: function initialize(fetch) {
        this._fetch = fetch;
	},
	subscribe: function subscribe(subscriptionUrl, eventSubscriptionId, serviceHash, timeout, directResponsesTo){

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
    					this.subscribe(subscriptionUrl, eventSubscriptionId, serviceHash, timeout);
    					console.log("subscription timed out, trying again.");
    				}
    				else
    					throw new Error("Subscription failed. Status code " + response.status);
    			}
    			return eventSubscriptionId
    		});

    },
    unsubscribe: function unsubscribe (subscriptionUrl, eventSubscriptionId, serviceHash){
		//todo: untested
    	return this._fetch(subscriptionUrl, {method: 'UNSUBSCRIBE', headers: { SID: eventSubscriptionId } });
    }
});

module.exports = SubscriptionService;