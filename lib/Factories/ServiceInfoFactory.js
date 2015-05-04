const Constants = require('../Utilities/Constants');
const ServiceInfo = require("../Entities/ServiceInfo");
const UPnPExtensionInfo = require("../Entities/UPnPExtensionInfo");
const UPnPVersion = require("../Entities/UPnPVersion");
const ServiceProperty = require("../Entities/ServiceProperty");
const AllowedValueRange = require("../Entities/AllowedValueRange");
const ServiceMethod = require("../Entities/ServiceMethod");
const ServiceArgument = require("../Entities/ServiceArgument");

class ServiceInfoFactory {
    constructor(fetch, DOMParser, xmlParser, urlProvider, md5) {
        this._fetch = fetch;
        this._DOMParser = DOMParser; //todo: this should be moved into the xml parser, this class should never need to know about xml other than passing it to the xmlparser
        this._xmlParser = xmlParser;
        this._md5 = md5;
        this._urlProvider = urlProvider;
    }
    createServiceProperty (propertyXml){
        var property = new ServiceProperty();
        property.name = this._xmlParser.getText(propertyXml, "name");
        property.datatype = this._xmlParser.getText(propertyXml, "dataType"); //todo: use the table containing allowed datatypes to better parse this
        property.defaultValue = this._xmlParser.getText(propertyXml, "defaultValue");
        property.evented = this._xmlParser.getAttribute(propertyXml, "sendEvents") == "yes";

        property.allowedValues = this._xmlParser.getElements(propertyXml,"allowedValue").map(value => value.innerHTML);
        property.allowedValueRange = new AllowedValueRange();

        if(this._xmlParser.hasNode(propertyXml, "allowedValueRange")){
            property.allowedValueRange.minimum = this._xmlParser.getText(propertyXml, "allowedValueRange minimum");
            property.allowedValueRange.maximum = this._xmlParser.getText(propertyXml, "allowedValueRange maximum");
            property.allowedValueRange.step = this._xmlParser.getText(propertyXml, "allowedValueRange step");
        }
        return property;
    }
    createServiceMethod (methodXml, backingProperties){
        var method = new ServiceMethod();
        method.name = this._xmlParser.getText(methodXml,"name");

        var args = this._xmlParser.getElements(methodXml, "argument").map(argumentXml => {
            return {
                name: this._xmlParser.getText(argumentXml, "name"),
                direction: this._xmlParser.getText(argumentXml, "direction"),
                relatedStateVariable: this._xmlParser.getText(argumentXml, "relatedStateVariable")
            };
        });

        args.forEach(argument => {
            var backingProperty = backingProperties.filter(serviceProperty => serviceProperty.name === argument.relatedStateVariable)[0];
            var arg = new ServiceArgument();
            arg.name = argument.name;
            arg.backingProperty = backingProperty;
            arg.datatype = backingProperty.datatype;
            arg.allowedValues = backingProperty.allowedValues;
            arg.allowedValueRange = backingProperty.allowedValueRange;

            argument.direction === 'in' ? method.parameters.push(arg) : method.returnValues.push(arg);
        });

        return method;
    }
    getDetailedServiceInformation(serviceInfo){
        if (!this._urlProvider.isValidURI(serviceInfo.scpdUrl))
            return Promise.reject("scpdURL was null");
        return this._fetch(serviceInfo.scpdUrl).then( (response) => {
            var responseText = response._bodyText;
            var responseHash = this._md5(responseText);
            if(serviceInfo.responseHash !== responseHash){
                var parser = this._DOMParser;
                var responseXml = parser.parseFromString(responseText, 'text/xml');

                serviceInfo.responseHash = responseHash;
                serviceInfo.upnpVersion = new UPnPVersion();
                serviceInfo.upnpVersion.major = this._xmlParser.getText(responseXml, "specVersion major");
                serviceInfo.upnpVersion.minor = this._xmlParser.getText(responseXml, "specVersion minor");

                var propertiesXml = this._xmlParser.getElements(responseXml,"stateVariable");

                propertiesXml.forEach( propertyXml => serviceInfo.properties.push( this.createServiceProperty( propertyXml ) ) );

                var methodsXml = this._xmlParser.getElements(responseXml, "action");

                methodsXml.forEach( methodXml => serviceInfo.methods.push( this.createServiceMethod( methodXml, serviceInfo.properties ) ) );
            }

            return serviceInfo;
        });
    }
}

module.exports = ServiceInfoFactory;