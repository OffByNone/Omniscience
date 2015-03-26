const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../../Constants');

const MediaServerService = Class({
	extends: EventTarget,
	initialize: function initialize(emitter, defer, contentDirectoryService, connectionManagerService, mediaReceiverRegistrarService) {
		this._emitter = emitter;
		this._contentDirectory = contentDirectoryService;
		this._contentDirectory.on('additionalInformationFound', ( device) => {
			this._emitter.emit(this, 'additionalInformationFound', device);
		});
		this._connectionManager = connectionManagerService;
		this._connectionManager.on('EventOccured', ( device, event, request ) => {
			this._emitter.emit(this, 'EventOccured', device, event, request );
		});
		this._connectionManager.on('additionalInformationFound', ( device) => {
			this._emitter.emit(this, 'additionalInformationFound', device);
		});
		this._mediaReceiverRegistrarService = mediaReceiverRegistrarService;
		this._mediaReceiverRegistrarService.on('additionalInformationFound', ( device) => {
			this._emitter.emit(this, 'additionalInformationFound', device);
		});
		this._defer = defer;
	},
	getAdditionalInformation: function getAdditionalInformation(device) {
		this._connectionManager.getAdditionalInformation(device);
		this._contentDirectory.getAdditionalInformation(device);
		this._mediaReceiverRegistrarService.getAdditionalInformation(device);
	},
	getCurrentConnectionIds: function getCurrentConnectionIds(device){
		var deferred = this._defer();
		this._connectionManager.getCurrentConnectionIds(device).then(response => deferred.resolve(response));

		return deferred.promise;
	},
	getCurrentConnectionInfo: function getCurrentConnectionInfo(device){
		var deferred = this._defer();
		this._connectionManager.getCurrentConnectionInfo(device).then(response => deferred.resolve(response));

		return deferred.promise;
	},
	getProtocolInfo: function getProtocolInfo(device){
		var deferred = this._defer();
		this._connectionManager.getProtocolInfo(device).then(response => deferred.resolve(response));

		return deferred.promise;
	}
	
});

module.exports = MediaServerService;