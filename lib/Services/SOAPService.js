const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const Constants = require('../Constants');

const SOAPService = Class({
    initialize: function(request, defer, domParser, utilities){
        this._request = request;
        this._defer = defer;
		this._DOMParser = domParser;
        this._utilities = utilities;
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
            headers: { SOAPAction: `"${service}#${methodName}"` },
            contentType: Constants.SOAP.ContentType,
            content: this._utilities.format(Constants.SOAP.Body, service, methodName, parametersXML),
            onComplete: (response) => {
                var responseXML = this._DOMParser.parseFromString(response.text, 'text/xml');
                deferred.resolve({xml: responseXML, text: response.text});
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

module.exports = SOAPService;
