const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const { defer } = require('sdk/core/promise'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/core_promise

const Constants = require('../Constants');
const Utilities = require('../Utilities');

const ConnectionManagerService = Class({
	extends: EventTarget,
    initialize: function initialize(emitter, soapService) {
        this._defer = defer;
        this._emitter = emitter;
        this._soapService = soapService;
        this._serviceType = Constants.ServiceTypes.filter(y=> y[0] === "Connection Manager").map(y=> y[1])[0];
	},
    getCurrentConnectionIds: function getCurrentConnectionIds(device){
        return this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "GetCurrentConnectionIds");
    },
    getCurrentConnectionInfo: function getCurrentConnectionInfo(device){
        return this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "GetCurrentConnectionInfo", { ConnectionID: device.connectionId });
    },
    getProtocolInfo: function getProtocolInfo(device){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType), this._serviceType, "GetProtocolInfo").then( response => {
            //todo: modify JXON to remove the namespace: so I can use regular object notation here
            var sinkCSV = response["s:envelope"]["s:body"]["u:getprotocolinforesponse"].sink.split(',');// the sink element contains a csv
            //csv has the format <protocol>:<network>:<contentFormat>:<additionalInfo>
            //contentformat can have n properties delimited by ;
            deferred.resolve(this._parseProtocolResponse(sinkCSV));
        });
        return deferred.promise;
    },
    _parseProtocolResponse: function _parseProtocolResponse(protocolResponse){
        var protocolInfo = [];
        protocolResponse.map(row => {
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
        parsedContentFormat.containerType = containerTypeInfo.split(";")[0];
        if(typeof containerTypeInfo !== 'undefined' && containerTypeInfo.indexOf(';') >= 0){
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
            value = value.substring(0,value.length-29);
            Constants.DLNA.flagValues.forEach(flagValue => {
                if( value - flagValue >= 0 ){
                    value = value - flagValue;
                    valueObject[Constants.DLNA.flagValueMap[flagValue]] = true;
                }
            });
            return [newkey, valueObject];
        }
        if(key === Constants.maxSP){
            return [newKey, value];
        }
        
        return [key, value];
    }
});

exports.ConnectionManagerService = ConnectionManagerService;