const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../../Constants');

const MediaReceiverRegistrarService = Class({
	extends: EventTarget,
	initialize: function initialize(emitter, defer, soapService, subscriptionService, DOMParser, utilities, xmlParser) {
		this._emitter = emitter;
		this._soapService = soapService;
		this._defer = defer;
		this._subscriptionService = subscriptionService;
		this.serviceType = Constants.ServiceTypes.filter(y=> y[0] === "Media Receiver Registrar").map(y=> y[1])[0];
		this._DOMParser = DOMParser;
		this._utilities = utilities;
		this._xmlParser = xmlParser;

		this._subscriptionService.on( 'EventOccured', ( device, request ) => {
			this._emitter.emit( this, 'EventOccured', device, request );
		});
	},
	getAdditionalInformation: function getAdditionalInformation(device){
		this.subscribe(device);
	},
	isAuthorized: function getSearchCapabilities (device, deviceId){},
	registerDevice: function getSortCapabilities (device, registrationReqMsg){},
	isValidated: function getSystemUpdateID (device, deviceId){},
	subscribe: function subscribe(device){
		var deferred = this._defer();
		this._subscriptionService.subscribe(device, this.serviceType, 'MediaReceiverRegistrar').then( response => deferred.resolve( response ) );
		return deferred.promise;
	},
	unsubscribe: function unsubscribe(device){
		var deferred = this._defer();
		this._subscriptionService.subscribe( device, this.serviceType, 'mediaReceiverRegistrar' ).then( response => deferred.resolve( response ) );
		return deferred.promise;
	}
});

module.exports = MediaReceiverRegistrarService;
