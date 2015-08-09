'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SubscriptionService = (function () {
  function SubscriptionService(fetch, pubSub, httpServer, httpResponder) {
    var _this = this;

    _classCallCheck(this, SubscriptionService);

    this._fetch = fetch;
    this._pubSub = pubSub;
    this._httpServer = httpServer;
    this._httpResponder = httpResponder;

    this._pubSub.sub('Subscribe', function (uniqueId, subscriptionUrl, subscriptionId, serviceHash, serverIP, timeout) {
      return _this.subscribe(subscriptionUrl, subscriptionId, serviceHash, serverIP, timeout).then(function (eventSubscriptionId) {
        return _this._pubSub.pub('emitResponse', uniqueId, eventSubscriptionId);
      });
    });

    this._pubSub.sub('Unsubscribe', function (uniqueId, subscriptionUrl, subscriptionId, serviceHash) {
      return _this.unsubscribe(subscriptionUrl, subscriptionId, serviceHash).then(function () {
        return _this._pubSub.pub('emitResponse', uniqueId);
      });
    });
  }

  _createClass(SubscriptionService, [{
    key: 'subscribe',
    value: function subscribe(subscriptionUrl, eventSubscriptionId, serviceHash, serverIP, timeout) {
      var _this2 = this;

      var directResponsesTo = 'http://' + serverIP + ':' + this._httpServer.port + '/events/' + serviceHash;

      this._httpServer.registerPath(directResponsesTo, function (request, resolve) {
        _this2._pubSub.pub('subscriptionService.UPnPEvent', serviceHash, request.body);
        _this2._httpResponder.sendOkResponse(request.socket);
      });

      var headers;
      if (eventSubscriptionId) {
        headers = {
          TIMEOUT: 'Second-' + timeout,
          SID: eventSubscriptionId
        };
      } else {
        headers = {
          CALLBACK: '<' + directResponsesTo + '>',
          TIMEOUT: 'Second-' + timeout,
          NT: 'upnp:event'
        };
      }

      return this._fetch(subscriptionUrl, {
        method: 'SUBSCRIBE',
        headers: headers
      }).then(function (response) {
        //todo: this function probably doesn't belong in here
        eventSubscriptionId = response.headers.get('sid');
        if (!response.ok) {
          if (response.status == 412) {
            //we didn't respond within the timeout so we need to send again
            //todo: add a max number of retries
            eventSubscriptionId = null;
            console.log('subscription timed out, trying again.');
            return _this2.subscribe(subscriptionUrl, eventSubscriptionId, serviceHash, serverIP, timeout);
          } else throw new Error('Subscription at address: ' + subscriptionUrl + ' failed. Status code ' + response.status);
        }
        return eventSubscriptionId;
      });
    }
  }, {
    key: 'unsubscribe',
    value: function unsubscribe(subscriptionUrl, eventSubscriptionId, serviceHash) {
      this._httpServer.registerPath('/events/' + serviceHash, null);
      if (!subscriptionUrl || !eventSubscriptionId) return Promise.reject('Either the subscriptionURL was null or the subscription id was, either way nothing to unsubscribe.'); //todo: better validation, also validate some fields on subscribe too.
      return this._fetch(subscriptionUrl, { method: 'UNSUBSCRIBE', headers: { SID: eventSubscriptionId } });
    }
  }]);

  return SubscriptionService;
})();

module.exports = SubscriptionService;