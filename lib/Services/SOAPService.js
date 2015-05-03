const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const Constants = require('../Constants');

const SOAPService = Class({
    initialize: function(fetch, domParser, utilities){
        this._fetch = fetch;
        this._DOMParser = domParser;
        this._utilities = utilities;
    },
    post: function post(url, serviceName, methodName, parameters){
        return this._fetch(url, {
            headers: {
                SOAPAction: `"${serviceName}#${methodName}"`,
                'content-Type': Constants.SOAP.ContentType
            },
            method: 'post',
            body: this._utilities.format(Constants.SOAP.Body, serviceName, methodName, this._parametersToXML(parameters))
        }).then((response) => {
            var responseText = response._bodyText;
            var responseXML = this._DOMParser.parseFromString(responseText, 'text/xml');
            return { xml: responseXML, text: responseText };
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
