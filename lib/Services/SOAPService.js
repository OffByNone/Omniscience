const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { Request } = require('sdk/request'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/request

const utilities = require('../Utilities');
const Constants = require('../Constants');

const SOAPService = Class({
    initialize: function(){
        this._request = Request;
    },
    post: function post(url, service, methodName, parameters){
        this._buildRequest(url, service, methodName, parameters).post();
    }, 
    _buildRequest: function _buildRequest(url, service, methodName, parameters){
        var parametersXML = this._parametersToXML(parameters);
        return this._request({
            url: url,
            headers: { SOAPAction: ('"' + service + '#' + methodName + '"') },
            contentType: Constants.SOAP.ContentType,
            content: utilities.format(Constants.SOAP.Body, service, methodName, parametersXML),
            onComplete: function onComplete(response){
                console.log(response);
            }
        });
    },
    _parametersToXML: function _parametersToXML(parameters){
        var xml = '';
        for (var parameter in parameters)
            if(parameters.hasOwnProperty(parameter))
                xml += '<' + parameter + '>' + parameters[parameter] + '</' + parameter + '>';
        return xml;
    }
});

/**
 *
 */
exports.SOAPService = SOAPService;
