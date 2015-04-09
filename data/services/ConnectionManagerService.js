omniscience.factory('connectionManagerService', function (eventService, informationService){
	"use strict";

	var connectionId = 0;

	var constants = {
		serviceTypeUrn: 'urn:schemas-upnp-org:service:ConnectionManager:1',
		DLNA: {
			'DLNA.ORG_PN': 'mediaType', //"MediaType" Media file format profile, usually combination of container/video codec/audio codec/sometimes region
			'DLNA.ORG_OP': 'operations',
			'DLNA.ORG_PS': 'playSpeed',
			'DLNA.ORG_CI': 'conversionIndicator',
			'DLNA.ORG_FLAGS': 'flags',
			'DLNA.ORG_MAXSP': 'maxSP',

			mediaType: 'DLNA.ORG_PN',
			operations: 'DLNA.ORG_OP',
			playSpeed: 'DLNA.ORG_PS',
			conversionIndicator: 'DLNA.ORG_CI',
			flags: 'DLNA.ORG_FLAGS',
			maxSP: 'DLNA.ORG_MAXSP',

			flagValueMap: {
				senderPaced: 31, //0x80000000
				lsopTimeBasedSeekSupported: 30, //0x40000000
				lsopByteBasedSeekSupported: 29, //0x20000000
				playcontainerSupported: 28, //0x10000000
				s0IncreasingSupported: 27, //0x08000000
				sNIncreasingSupported: 26, //0x04000000
				rtspPauseSupported: 25, //0x02000000
				streamingTransferModeSupported: 24, //0x01000000
				interactiveTransferModeSupported: 23, //0x00800000
				backgroundTransferModeSupported: 22, //0x00400000
				connectionStallingSupported: 21, //0x00200000
				dlnaVersion15Supported: 20 //0x00100000
			}
		}
	};

	function _parseProtocolResponse(protocolResponse){
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
			newRow.contentFormat = _parseContentFormat(contentFormat);
			newRow.additionalInfo = _parseAdditionalinfo(additionalInfo);
			protocolInfo.push(newRow);
		});
		return protocolInfo;
	}
	function _parseContentFormat(contentFormat){
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
	}
	function _parseAdditionalinfo(additionalInfo){
		var dlnaInfo = {};
		if(additionalInfo === "*") return additionalInfo;
		var extraParams = additionalInfo.split(';');
		extraParams.forEach(extraParam => {
			var [key, value] = extraParam.split('=');
			[key, value ] = _parseDLNA(key, value);
			dlnaInfo[key] = value;
		});

		return dlnaInfo;
	}
	function _parseDLNA(key, value){
		var valueObject = {};
		var newKey = constants.DLNA[key];

		if(key === constants.DLNA.mediaType){
			return [newKey, value];
		}
		if(key === constants.DLNA.operations){
			valueObject.canTimeSeekRange = value.charAt(0) === 1;
			valueObject.canRange = value.charAt(1) === 1;
			return [newKey, valueObject];
		}
		if(key === constants.DLNA.playSpeed){
			value = value === 1;
			newKey = "isValidPlaySpeed";
			return [newKey, value];
		}
		if(key === constants.DLNA.conversionIndicator){
			value = value === 1;
			newKey = "isTranscoded";
			return [newKey, value];
		}
		if(key === constants.DLNA.flags){
			var flags = parseInt(value.substring(0, value.length-24), 16);//it is in hex and padded with 24 0s
			var arrayOfBools = _arrayFromMask(flags);
			var flagVals = constants.DLNA.flagValueMap;
			for (var prop in flagVals)
				if(flagVals.hasOwnProperty(prop))
					valueObject[prop] = arrayOfBools[flagVals[prop]];
			return [newKey, valueObject];
		}
		if(key === constants.maxSP){
			return [newKey, value];
		}

		return [key, value];
	}
	function _arrayFromMask (nMask) {
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
		for (var nShifted = nMask, aFromMask = []; nShifted;
			 aFromMask.push(Boolean(nShifted & 1)), nShifted >>>= 1);
		return aFromMask;
	}

	return {
		getCurrentConnectionInfo: function getCurrentConnectionInfo(){
			return eventService.callService(informationService.get(constants.serviceTypeUrn), "GetCurrentConnectionInfo", { ConnectionID: connectionId });
		},
		getProtocolInfo: function getProtocolInfo(){
			return eventService.callService(informationService.get(constants.serviceTypeUrn), "GetProtocolInfo").
				then(response => {
					return {
						sink: _parseProtocolResponse(response.Sink),
						source: _parseProtocolResponse(response.Source),
						_raw: response._raw
					};
				});
		},
		getCurrentConnectionIds: function getCurrentConnectionIds(){
			return eventService.callService(informationService.get(constants.serviceTypeUrn), "GetCurrentConnectionIDs");
		}
	}
});