const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const SubscriptionService = Class({
	extends: EventTarget,
	initialize: function initialize(defer, emitter, fxosWebServer, Utilities, fetch) {
        this._defer = defer;
        this._emitter = emitter;
        this._fxosWebServer = fxosWebServer;
        this._utilities = Utilities;
        this._fetch = fetch;
	},
    subscribe: function subscribe(service, timeout){
    	var deferred = this._defer();

    	timeout = timeout || 60;
    	var sid = service.subscriptionId;
    	var subscriptionUrl = service.eventSubUrl;
    	var myIp = this._utilities.getMyAddressInSameSubnet(service.eventSubUrl);
    	var serviceName = encodeURI(service.type.name);
    	var directResponsesTo = `${myIp}:${this._fxosWebServer.port}/events/${serviceName}/${service.hash}`;

    	this._fxosWebServer.registerPath(directResponsesTo, (request, response) => {
    		this._emitter.emit(this, 'EventOccured', service.hash, request);
    		response.send( 'ok', '200' );
    	});

    	var headers;

    	if(sid){
    		headers = {
    			TIMEOUT: `Second-${timeout}`, //pull the number out into an instance variable
    			SID: sid
    		};
    	}
    	else{
    		headers = {
    			CALLBACK: `<${directResponsesTo}>`,
    			TIMEOUT: `Second-${timeout}`,
    			NT: "upnp:event"
    		};
    	}

    	this._fetch(subscriptionUrl, {
    		method: 'SUBSCRIBE',
    		headers: headers
    	}).then(response => {
    			service.subscriptionId = response.headers.get('sid');
    		if(!response.ok) {
    			if(response.status == 412){
    				//we didn't respond within the timeout so we need to send again
    				service.subscriptionId = null;
    				this.subscribe(service, serviceName, timeout);
    				console.log("subscription timed out, trying again.");
    			}
				else
    				console.log(response);
    		}

    		deferred.resolve(response);
    	});

        return deferred.promise;
    },
    unsubscribe: function unsubscribe (service){
		//todo: untested, not actually sure if the unsubscribe looks like this, guessing based on subscribe
        var deferred = this._defer();
        var subscriptionUrl = service.eventSubUrl;
        var sid = service.subscriptionId;
        var serviceName = encodeURI(service.type.name);

    	this._fetch(subscriptionUrl, {
        	method: 'UNSUBSCRIBE',
        	headers: { SID: sid }
        }).then(response => deferred.resolve);

        this._fxosWebServer.registerPath( `/events/${serviceName}/${service.hash}`, null );

        return deferred.promise;
    }
});

module.exports = SubscriptionService;