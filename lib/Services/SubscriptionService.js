const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const { Request } = require('sdk/request'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/request

const SubscriptionService = Class({
	extends: EventTarget,
	initialize: function initialize(xhr, defer, emitter, fxosWebServer, Utilities) {
        this._xhr = xhr;
        this._defer = defer;
        this._emitter = emitter;
        this._fxosWebServer = fxosWebServer;
        this._utilities = Utilities;
	},
    subscribe: function subscribe(device, serviceType, serviceName){
    	var deferred = this._defer();

    	//todo: handle this better, rejecting the promise or returning something
    	//		that would better indicate we are already subscribed would be nice
    	if(device.services.filter(x=> x.type.urn === serviceType)[0].isSubscribed)
    		return deferred.promise;

    	var subscriptionUrl = this._utilities.getEventSubUrl( device, serviceType );
    	var directResponsesTo = `http://192.168.1.4:7895/events/${serviceName}/${device.id}`;
    	this._fxosWebServer.registerPath(directResponsesTo, (request, response) => {
    		this._emitter.emit(this, 'EventOccured', device, request);
    		response.send( 'ok', '200' );
    	});

        var request = new this._xhr.Request({
        	url: subscriptionUrl,
            method: "SUBSCRIBE",
            before: function before(xhr) {
                xhr.setRequestHeader("CALLBACK", '<' + directResponsesTo + '>');
                xhr.setRequestHeader("TIMEOUT", "Second-300");
                xhr.setRequestHeader("NT", "upnp:event");
            },
            complete: function(response){
                deferred.resolve(response);
            }
        });

        request.send();
        device.services.filter(x=> x.type.urn === serviceType)[0].isSubscribed = true;

        return deferred.promise;
    },
    unsubscribe: function unsubscribe (device, serviceType, serviceName){
		//todo: untested, not actually sure if the unsubscribe looks like this, guessing based on subscribe
        var deferred = this._defer();
        var subscriptionUrl = this._utilities.getEventSubUrl( device, serviceType );

        var request = new this._xhr.Request({
        	url: subscriptionUrl,
            method: "UNSUBSCRIBE",
            before: function(xhr) {
                xhr.setRequestHeader("TIMEOUT", "Second-300");
                xhr.setRequestHeader("NT", "upnp:event");
            },
            complete: function(response){
                deferred.resolve(response);
            }
        });

        request.send();
        this._fxosWebServer.registerPath( `/events/${serviceName}/${device.id}`, null );
        device.services.filter(x=> x.type.urn === serviceType)[0].isSubscribed = false;

        return deferred.promise;
    }
});

exports.SubscriptionService = SubscriptionService;