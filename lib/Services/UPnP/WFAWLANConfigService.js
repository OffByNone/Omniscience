const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../../Constants');

const WFAWLANConfigService = Class({
	extends: EventTarget,
	initialize: function initialize(emitter, defer, soapService, subscriptionService, DOMParser, utilities) {
		this._emitter = emitter;
		this._soapService = soapService;
		this.serviceType = Constants.ServiceTypes.filter(y=> y[0] === "WFA WLAN Config").map(y=> y[1])[0];
		this._subscriptionService = subscriptionService;
		this._defer = defer;
		this._DOMParser = DOMParser;
		this._utilities = utilities;

		this._subscriptionService.on( 'EventOccured', ( device, request ) => {
			var event = this._parseEventRequest(request);
			this._emitter.emit( this, 'EventOccured', device, event, request );
		});
	},
	getAdditionalInformation: function getAdditionalInformation(device) {
		var deferred = this._defer();
		this.getDeviceInfo(device).then( response =>{ deferred.resolve(response); } );
		return deferred.promise;
		this.subscribe(device);
	},
	delAPSettings: function delAPSettings (device, newAPSettings){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
                               this.serviceType,
                               "DelAPSettings",
                               { NewAPSettings: newAPSettings }
                              ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	delSTASettings: function delSTASettings (device, newSTASettings){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
                               this.serviceType,
                               "DelSTASettings",
                               { NewSTASettings: newSTASettings }
                              ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	getAPSettings: function getAPSettings (device, newMessage){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
                               this.serviceType,
                               "GetAPSettings",
                               { NewMessage: newMessage }
                              ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	getDeviceInfo: function getDeviceInfo (device) {
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
                               this.serviceType, "GetDeviceInfo", { }
                              ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	getSTASettings: function (device, newMessage) {
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
                               this.serviceType,
                               "GetSTASettings",
                               { NewMessage: newMessage }
                              ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	putMessage: function (device, newInMessage){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
                               this.serviceType,
                               "PutMessage",
                               { NewInMessage: newInMessage }
                              ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	putWLANResponse: function putWLANResponse (device, newMessage, newWLANEventType, newWLANEventMAC){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
                               this.serviceType,
                               "PutWLANResponse",
                               { NewMessage: newMessage, NewWLANEventType: newWLANEventType, NewWLANEventMAC: newWLANEventMAC }
                              ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	rebootAP: function rebootAP(device, newAPSettings) {
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
                               this.serviceType,
                               "RebootAP",
                               { NewAPSettings: newAPSettings }
                              ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	rebootSTA: function rebootSTA (device, newSTASettings){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
                               this.serviceType,
                               "RebootSTA",
                               { NewSTASettings: newSTASettings }
                              ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	resetAP: function resetAP (device, newMessage){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
                               this.serviceType,
                               "ResetAP",
                               { NewMessage: newMessage }
                              ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	resetSTA: function resetSTA (device, newMessage){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
                               this.serviceType,
                               "ResetSTA",
                               { NewMessage: newMessage }
                              ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	setAPSettings: function setAPSettings (device, newAPSettings){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
                               this.serviceType,
                               "SetAPSettings",
                               { NewAPSettings: newAPSettings }
                              ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	setSelectedRegistrar: function setSelecctedRegistrar (device, newMessage){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
                               this.serviceType,
                               "SetSelecctedRegistrar",
                               { NewMessage: newMessage }
                              ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	setSTASettings: function setSTASettings(device){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
                               this.serviceType, "SetSTASettings", {}
                              ).then(response => deferred.resolve(response));
		return deferred.promise;
	},
	subscribe: function subscribe(device){
		var deferred = this._defer();
		this._subscriptionService.subscribe(device, this.serviceType, 'WFAWLANConfig' ).then( response => deferred.resolve( response ) );
		return deferred.promise;
	},
	unsubscribe: function unsubscribe(device){
		var deferred = this._defer();
		this._subscriptionService.subscribe( device, this.serviceType, 'WFAWLANConfig' ).then( response => deferred.resolve( response ) );
		return deferred.promise;
	}
});

module.exports = WFAWLANConfigService;