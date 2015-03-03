const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { Request } = require('sdk/request'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/request
const { defer } = require('sdk/core/promise'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/core_promise

const { JXON } = require('../JXON');
const componentFactory = require('../Factories/ComponentFactory');

const utilities = require('../Utilities');
const Constants = require('../Constants');

const SOAPService = Class({
    initialize: function(){
        this._request = Request;
        this._defer = defer;
        this._jxon = JXON;
		this._DOMParser = componentFactory.createDOMParser();
    },
    post: function post(url, service, methodName, parameters){
        var deferred = this._defer();
        this._buildRequest(url, service, methodName, parameters, deferred).post();
        return deferred.promise;
    }, 
    _buildRequest: function _buildRequest(url, service, methodName, parameters, deferred){
        var parametersXML = this._parametersToXML(parameters);
        return this._request({
            url: url,
            headers: { SOAPAction: ('"' + service + '#' + methodName + '"') },
            contentType: Constants.SOAP.ContentType,
            content: utilities.format(Constants.SOAP.Body, service, methodName, parametersXML),
            onComplete: (response) => {
                var responseXML = this._DOMParser.parseFromString(response.text, 'text/xml');
                var responseObj = JXON.build(responseXML);
                deferred.resolve(responseObj);
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
