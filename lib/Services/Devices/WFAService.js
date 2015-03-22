const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../../Constants');

const WFAService = Class({
	extends: EventTarget,
	initialize: function initialize(emitter, defer, wfaWLANConfigService) {
		this._emitter = emitter;
		this._wfaWLANConfigService = wfaWLANConfigService;
		this._wfaWLANConfigService.on('EventOccured', ( device, event, request ) => {
			this._emitter.emit(this, 'EventOccured', device, event, request );
		});
		this._wfaWLANConfigService.on('additionalInformationFound', ( device) => {
			this._emitter.emit(this, 'additionalInformationFound', device);
		});

		this._defer = defer;
	},
	getAdditionalInformation: function getAdditionalInformation(device) {
		this._wfaWLANConfigService.getAdditionalInformation(device);
	},
	deleteAPSettings: function deleteAPSettings (device, newAPSettings){
		var deferred = this._defer();
		this._wfaWLANConfigService.delAPSettings(device, newAPSettings).then(response => deferred.resolve(response));

		return deferred.promise;
	},
	deleteSTASettings: function deleteSTASettings (device, newSTASettings){
		var deferred = this._defer();
		this._wfaWLANConfigService.delSTASettings(device, newSTASettings).then(response => deferred.resolve(response));

		return deferred.promise;	
	},
	getAPSettings: function getAPSettings (device, newMessage){
		var deferred = this._defer();
		this._wfaWLANConfigService.getAPSettings(device, newMessage).then(response => deferred.resolve(response));

		return deferred.promise;	
	},
	getDeviceInfo: function getDeviceInfo (device) {
		var deferred = this._defer();
		this._wfaWLANConfigService.getDeviceInfo(device).then(response => deferred.resolve(response));

		return deferred.promise;	
	},
	getSTASettings: function (device, newMessage) {
		var deferred = this._defer();
		this._wfaWLANConfigService.getSTASettings(device, newMessage).then(response => deferred.resolve(response));

		return deferred.promise;	
	},
	putMessage: function (device, newInMessage){
		var deferred = this._defer();
		this._wfaWLANConfigService.putMessage(device, newInMessage).then(response => deferred.resolve(response));

		return deferred.promise;	
	},
	putWLANResponse: function putWLANResponse (device, newMessage, newWLANEventType, newWLANEventMAC){
		var deferred = this._defer();
		this._wfaWLANConfigService.putWLANResponse(device, newMessage, newWLANEventType, newWLANEventMAC).then(response => deferred.resolve(response));

		return deferred.promise;	
	},
	rebootAP: function rebootAP(device, newAPSettings) {
		var deferred = this._defer();
		this._wfaWLANConfigService.rebootAP(device, newAPSettings).then(response => deferred.resolve(response));

		return deferred.promise;	
	},
	rebootSTA: function rebootSTA (device, newSTASettings){
		var deferred = this._defer();
		this._wfaWLANConfigService.rebootSTA(device, newSTASettings).then(response => deferred.resolve(response));

		return deferred.promise;	
	},
	resetAP: function resetAP (device, newMessage){
		var deferred = this._defer();
		this._wfaWLANConfigService.resetAP(device, newMessage).then(response => deferred.resolve(response));

		return deferred.promise;	
	},
	resetSTA: function resetSTA (device, newMessage){
		var deferred = this._defer();
		this._wfaWLANConfigService.resetSTA(device, newMessage).then(response => deferred.resolve(response));

		return deferred.promise;	
	},
	setAPSettings: function setAPSettings (device, newAPSettings){
		var deferred = this._defer();
		this._wfaWLANConfigService.setAPSettings(device, newAPSettings).then(response => deferred.resolve(response));

		return deferred.promise;	
	},
	setSelectedRegistrar: function setSelecctedRegistrar (device, newMessage){
		var deferred = this._defer();
		this._wfaWLANConfigService.setSelectedRegistrar(device, newMessage).then(response => deferred.resolve(response));

		return deferred.promise;	
	},
	setSTASettings: function setSTASettings(device){
		var deferred = this._defer();
		this._wfaWLANConfigService.setSTASettings(device).then(response => deferred.resolve(response));

		return deferred.promise;	
	},
	subscribe: function subscribe(device){
		var deferred = this._defer();
		this._subscriptionService.subscribe(device, this._serviceType, 'AVTransport' ).then( response => deferred.resolve( response ) );
		return deferred.promise;
	},
	unsubscribe: function unsubscribe(device){
		var deferred = this._defer();
		this._subscriptionService.subscribe( device, this._serviceType, 'AVTransport' ).then( response => deferred.resolve( response ) );
		device.services.filter(x=> x.type.urn === serviceType)[0].isSubscribed = false;
		return deferred.promise;
	}
});

exports.WFAService = WFAService;