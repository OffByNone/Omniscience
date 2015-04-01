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
    subscribe: function subscribe(device, serviceType, serviceName){
    	var deferred = this._defer();

    	var sid = device.services.filter(x=> x.type.urn === serviceType)[0].subscriptionId;
    	var subscriptionUrl = this._utilities.getEventSubUrl( device, serviceType );
    	var myIp = this._utilities.getAddressForDevice(device);
    	var directResponsesTo = `${myIp}:${this._fxosWebServer.port}/events/${serviceName}/${device.id}`;
    	
    	this._fxosWebServer.registerPath(directResponsesTo, (request, response) => {
    		this._emitter.emit(this, 'EventOccured', device, request);
    		response.send( 'ok', '200' );
    	});
		
    	var headers;

    	if(sid){
    		headers = {
    			TIMEOUT: "Second-60", //pull the number out into an instance variable
				SID: sid
    		};
    	}
    	else{
    		headers = {
    			CALLBACK: `<${directResponsesTo}>`,
    			TIMEOUT: "Second-60",
    			NT: "upnp:event"
    		};
    	}

    	this._fetch(subscriptionUrl, {
    		method: 'SUBSCRIBE',
    		headers: headers
    	}).then(response => {
    			device.services.filter(x=> x.type.urn === serviceType)[0].subscriptionId = response.headers.get('sid');
    		if(!response.ok) {
    			if(response.status == 412){
    				//we didn't respond within the timeout so we need to send again
    				device.services.filter(x=> x.type.urn === serviceType)[0].subscriptionId = null;
    				this.subscribe(device, serviceType, serviceName);
    				console.log("subscription timed out, trying again.");
    			}
				else
    				console.log(response);
    		}
    			
    		deferred.resolve(response);
    	});

        return deferred.promise;
    },
    unsubscribe: function unsubscribe (device, serviceType, serviceName){
		//todo: untested, not actually sure if the unsubscribe looks like this, guessing based on subscribe
        var deferred = this._defer();
        var subscriptionUrl = this._utilities.getEventSubUrl( device, serviceType );
        var sid = device.services.filter(x=> x.type.urn === serviceType)[0].subscriptionId;

    	this._fetch(subscriptionUrl, {
        	method: 'UNSUBSCRIBE',
        	headers: { SID: sid }
        }).then(response => deferred.resolve);

        this._fxosWebServer.registerPath( `/events/${serviceName}/${device.id}`, null );

        return deferred.promise;
    }
});

module.exports = SubscriptionService;