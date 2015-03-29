const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../../Constants');

const ContentDirectoryService = Class({
	extends: EventTarget,
	initialize: function initialize(emitter, defer, soapService, subscriptionService, DOMParser, utilities) {
		this._utilities = utilities;
		this._emitter = emitter;
		this._soapService = soapService;
		this._defer = defer;
		this._subscriptionService = subscriptionService;
		this._serviceType = Constants.ServiceTypes.filter(y=> y[0] === "Content Directory").map(y=> y[1])[0];
		this._DOMParser = DOMParser;

		this._subscriptionService.on( 'EventOccured', ( device, request ) => {
			this._emitter.emit( this, 'EventOccured', device, request );
		});
	},
	getAdditionalInformation: function getAdditionalInformation(device){
	
		this.getSearchCapabilities(device);
		this.getSortCapabilities(device);
		this.x_GetRemoteSharingStatus(device);
		this.subscribe(device);
	},
	getSearchCapabilities: function getSearchCapabilities (device){},
	getSortCapabilities: function getSortCapabilities (device){},
	getSystemUpdateID: function getSystemUpdateID (device){},
	browse: function browse (device, objectId, browseFlag, filter, startingIndex, requestedCount, sortCriteria){},
	search: function search(device, containerId, searchCriteria, filter, startingIndex, requestedCount, sortCriteria){},
	x_GetRemoteSharingStatus: function x_GetRemoteSharingStatus (device){}, 
	subscribe: function subscribe(device){
		var deferred = this._defer();
		this._subscriptionService.subscribe(device, this._serviceType, 'mediaReceiverRegistrar').then( response => deferred.resolve( response ) );
		return deferred.promise;
	},
	unsubscribe: function unsubscribe(device){
		var deferred = this._defer();
		this._subscriptionService.subscribe( device, this._serviceType, 'mediaReceiverRegistrar' ).then( response => deferred.resolve( response ) );
		return deferred.promise;
	}
});

module.exports = ContentDirectoryService;