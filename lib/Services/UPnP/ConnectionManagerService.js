const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../../Constants');

const ConnectionManagerService = Class({
	extends: EventTarget,
	initialize: function initialize(emitter, defer, soapService, subscriptionService, DOMParser, utilities) {
		this._defer = defer;
		this._emitter = emitter;
		this._soapService = soapService;
		this._subscriptionService = subscriptionService;
		this.serviceType = Constants.ServiceTypes.filter(y=> y[0] === "Connection Manager").map(y=> y[1])[0];
		this._DOMParser = DOMParser;
		this._utilities = utilities;

		this._subscriptionService.on( 'EventOccured', ( device, request ) => {
			this._emitter.emit( this, 'EventOccured', device, null, request );
		});
	},
	getAdditionalInformation: function getAdditionalInformation(device){
		this.getCurrentConnectionIds(device).then( currentConnectionIds => {
			device.currentConnectionIds = currentConnectionIds;
			this._emitter.emit(this, "additionalInformationFound", device);
		});
		this.getCurrentConnectionInfo(device).then( currentConnectionInfo => {
			device.currentConnectionInfo = currentConnectionInfo;
			this._emitter.emit(this, "additionalInformationFound", device);
		});
		this.getProtocolInfo(device).then( protocolInfo => {
			device.protocolInfo = protocolInfo;
			if(protocolInfo.sink){
				if(protocolInfo.sink.some(x => x.contentFormat.medium.indexOf("video") === 0)) device.videoCapable = true;
				if(protocolInfo.sink.some(x => x.contentFormat.medium.indexOf("audio") === 0)) device.audioCapable = true;
				if(protocolInfo.sink.some(x => x.contentFormat.medium.indexOf("image") === 0)) device.imageCapable = true;
			}
			if(protocolInfo.source){
				if(protocolInfo.source.some(x => x.contentFormat.medium.indexOf("video") === 0)) device.videoCapable = true;
				if(protocolInfo.source.some(x => x.contentFormat.medium.indexOf("audio") === 0)) device.audioCapable = true;
				if(protocolInfo.source.some(x => x.contentFormat.medium.indexOf("image") === 0)) device.imageCapable = true;
			}
			this._emitter.emit(this, "additionalInformationFound", device);
		});
		this.subscribe(device);
	},
	getCurrentConnectionIds: function getCurrentConnectionIds(device){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
							   this.serviceType, "GetCurrentConnectionIds"
							  ).then(response => {
								  var currentConnectionId = (response.xml.querySelector("Envelope Body GetCurrentConnectionIDsResponse ConnectionIDs") || {} ).innerHTML;
								  var currentConnectionIds = !currentConnectionId ? "" : currentConnectionId.split(",");
								  deferred.resolve(currentConnectionIds);
							  });
		return deferred.promise;
	},
	getCurrentConnectionInfo: function getCurrentConnectionInfo(device){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType),
							   this.serviceType, "GetCurrentConnectionInfo", { ConnectionID: device.connectionId }
							  ).then(response => {
								  var xml = response.xml.querySelector("Envelope Body GetCurrentConnectionInfoResponse");
								  if(xml)
									  var currentConnectionInfo = {
										  status: (xml.querySelector("Status") || {}).innerHTML,
										  direction: (xml.querySelector("Direction") || {}).innerHTML,
										  peerConnectionId: (xml.querySelector("PeerConnectionID") || {}).innerHTML,
										  peerConnectionManager: (xml.querySelector("PeerConnectionManager") || {}).innerHTML,
										  protocolInfo: this._parseProtocolResponse((xml.querySelector("ProtocolInfo") || {}).innerHTML),
										  avTransportId: (xml.querySelector("AVTransportID") || {}).innerHTML,
										  rcsID: (xml.querySelector("RcsID") || {}).innerHTML,
										  _raw: response.text
									  };
								  deferred.resolve(currentConnectionInfo);
							  });
		return deferred.promise;
	},
	getProtocolInfo: function getProtocolInfo(device){
		var deferred = this._defer();
		this._soapService.post(this._utilities.getControlUrl(device, this.serviceType), this.serviceType, "GetProtocolInfo").then( response => {

			var sinkEl = response.xml.querySelector("Envelope Body GetProtocolInfoResponse Sink");
			var sourceEl = response.xml.querySelector("Envelope Body GetProtocolInfoResponse Source");

			var sinkText = (sinkEl || {}).innerHTML;
			var sourceText = (sourceEl || {}).innerHTML;

			deferred.resolve({
				sink: this._parseProtocolResponse(sinkText),
				source: this._parseProtocolResponse(sourceText),
				_raw: response.text
			});
		});
		return deferred.promise;
	},
	_parseProtocolResponse: function _parseProtocolResponse(protocolResponse){
		var protocolInfo = [];

		if(!protocolResponse) return null;

		var protocolResponseCSV = protocolResponse.split(',');
		// the elements contain a csv
		//csv has the format <protocol>:<network>:<contentFormat>:<additionalInfo>
		//contentformat can have n properties delimited by ;

		protocolResponseCSV.map(row => {
			var newRow = {};
			var contentFormat, additionalInfo;
			[newRow.protocol, newRow.network, contentFormat, additionalInfo] = row.split(':');
			newRow.contentFormat = this._parseContentFormat(contentFormat);
			newRow.additionalInfo = this._parseAdditionalinfo(additionalInfo);
			protocolInfo.push(newRow);
		});
		return protocolInfo;
	},
	_parseContentFormat: function _parseContentFormat(contentFormat){
		var parsedContentFormat = {};
		var containerTypeInfo;
		var containerType;
		[parsedContentFormat.medium, containerTypeInfo] = contentFormat.split('/');
		containerTypeInfo = containerTypeInfo || "";
		parsedContentFormat.containerType = containerTypeInfo.split(";")[0];
		if(containerTypeInfo.indexOf(';') >= 0){
			parsedContentFormat.containerTypeInfo = {};
			var extraParams = containerTypeInfo.split(';');
			extraParams.shift();
			extraParams.forEach(extraParam => {
				var [key, value] = extraParam.split('=');
				parsedContentFormat.containerTypeInfo[key] = value;
			});
		}

		return parsedContentFormat;
	},
	_parseAdditionalinfo: function _parseAdditionalinfo(additionalInfo){
		var dlnaInfo = {};
		if(additionalInfo === "*") return additionalInfo;
		var extraParams = additionalInfo.split(';');
		extraParams.forEach(extraParam => {
			var [key, value] = extraParam.split('=');
			[key, value ] = this._parseDLNA(key, value);
			dlnaInfo[key] = value;
		});

		return dlnaInfo;
	},
	_parseDLNA: function _parseDLNA(key, value){
		var valueObject = {};
		var newKey = Constants.DLNA[key];

		if(key === Constants.DLNA.mediaType){
			return [newKey, value];
		}
		if(key === Constants.DLNA.operations){
			valueObject.canTimeSeekRange = value.charAt(0) === 1;
			valueObject.canRange = value.charAt(1) === 1;
			return [newKey, valueObject];
		}
		if(key === Constants.DLNA.playSpeed){
			value = value === 1;
			newKey = "isValidPlaySpeed";
			return [newKey, value];
		}
		if(key === Constants.DLNA.conversionIndicator){
			value = value === 1;
			newKey = "isTranscoded";
			return [newKey, value];
		}
		if(key === Constants.DLNA.flags){
			var flags = parseInt(value.substring(0, value.length-24), 16);//it is in hex and padded with 24 0s
			var arrayOfBools = this._utilities.arrayFromMask(flags);
			var flagVals = Constants.DLNA.flagValueMap;
			for (var prop in flagVals)
				if(flagVals.hasOwnProperty(prop))
					valueObject[prop] = arrayOfBools[flagVals[prop]];
			return [newKey, valueObject];
		}
		if(key === Constants.maxSP){
			return [newKey, value];
		}

		return [key, value];
	},
	subscribe: function subscribe(device){
		var deferred = this._defer();
		this._subscriptionService.subscribe(device, this.serviceType, 'ConnectionManager' ).then( response => deferred.resolve( response ) );
		return deferred.promise;
	},
	unsubscribe: function unsubscribe(device){
		var deferred = this._defer();
		this._subscriptionService.subscribe( device, this.serviceType, 'ConnectionManager' ).then( response => deferred.resolve( response ) );
		return deferred.promise;
	}
});

module.exports = ConnectionManagerService;
