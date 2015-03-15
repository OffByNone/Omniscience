const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { Request } = require('sdk/request'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/request

const SubscriptionService = Class({
    initialize: function initialize(xhr, defer) {
        this._xhr = xhr;
        this._defer = defer;
	},
    subscribe: function subscribe(url, directResponsesTo){
        var deferred = this._defer();
        var request = new this._xhr.Request({
            url: url,
            method: "SUBSCRIBE",
            before: function before(xhr) {
                xhr.setRequestHeader("CALLBACK", '<' + directResponsesTo + '>');
                xhr.setRequestHeader("TIMEOUT", "Second-300");
                xhr.setRequestHeader("NT", "upnp:event");
            },
            complete: function(response){
                deferred.resolve(response.success, response.data, response.status);
            }
        });

        request.send();
        return deferred.promise;
    },
    unsubscribe: function unsubscribe (url, directResponsesTo){
        var deferred = this._defer();
        /*
        Request({
            url: url,
            headers: {
                method: 'UNSUBSCRIBE',
                CALLBACK: '<' + directResponsesTo + '>',
                TIMEOUT: 'Second-300',
                NT: 'upnp:event'
            },
            onComplete: function (response) {
                deferred.resolve(response.success, response.data, response.status);
            }
        }).post();
        */

        var request = new this._xhr.Request({
            url: url,
            method: "UNSUBSCRIBE",
            before: function(xhr) {
                xhr.setRequestHeader("CALLBACK", '<' + directResponsesTo + '>');
                xhr.setRequestHeader("TIMEOUT", "Second-300");
                xhr.setRequestHeader("NT", "upnp:event");
            },
            complete: function(response){
                deferred.resolve(response.success, response.data, response.status);
            }
        });

        request.send();

        return deferred.promise;        
    }
});

exports.SubscriptionService = SubscriptionService;