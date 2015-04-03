rotaryApp.factory('connectionManagerService', function ($rootScope, eventService){

	//this._subscriptionService.on( 'EventOccured', ( service, request ) => {
	//	this._emitter.emit( this, 'EventOccured', service, null, request );
	//})

	function getCurrentConnectionInfo(service){
		return eventService.callService(service, "GetCurrentConnectionInfo", { ConnectionID: service.connectionId });
	}
	function getProtocolInfo(service){
		return eventService.callService(service, "GetProtocolInfo").
			then(response => {
				return {
					sink: _parseProtocolResponse(response.sink),
					source: _parseProtocolResponse(response.source),
					_raw: response._raw
				};
			});
	}
	function getCurrentConnectionIds(service){
		return eventService.callService(service, "GetCurrentConnectionIDs");
	}

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
	}

	return {
		getCurrentConnectionInfo: getCurrentConnectionInfo,
		getCurrentConnectionIds: getCurrentConnectionIds,
		getProtocolInfo: getProtocolInfo
	}
});