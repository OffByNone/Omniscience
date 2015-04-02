const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const URL = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url

const Constants = require('../Constants');

const Service = require("../Entities/Service");
const Type = require("../Entities/Type");
const UPnPVersion = require("../Entities/UPnPVersion");
const ServiceProperty = require("../Entities/ServiceProperty");
const AllowedValueRange = require("../Entities/AllowedValueRange");
const ServiceMethod = require("../Entities/ServiceMethod");
const ServiceArgument = require("../Entities/ServiceArgument");

const ServiceFactory = Class({
	initialize: function initialize(request, DOMParser, xmlParser, utilities, md5) {
		this._request = request;
		this._DOMParser = DOMParser; //todo: this should be moved into the xml parser, this class should never need to know about xml other than passing it to the xmlparser
		this._xmlParser = xmlParser;
		this._utilities = utilities;
		this._md5 = md5;
	},
	create: function create(serviceXml, base, location){
		var service = new Service();
		service.controlUrl = this._utilities.toURL(this._xmlParser.getText(serviceXml, "controlURL"), location, base);
		service.eventSubUrl = this._utilities.toURL(this._xmlParser.getText(serviceXml, "eventSubURL"), location, base);
		service.scpdUrl = this._utilities.toURL(this._xmlParser.getText(serviceXml, "SCPDURL"), location, base);
		service.id = this._xmlParser.getText(serviceXml, "serviceId");
		service.type = new Type();
		service.type.urn = this._xmlParser.getText(serviceXml, "serviceType");
		service.type.name = Constants.ServiceTypes.filter( serviceType => serviceType[1] === service.type.urn).map( serviceType => serviceType[0])[0];
		this._getServiceInformation(service);
		return service;
	},
	createServiceProperty: function(propertyXml){
		var property = new ServiceProperty();
		property.name = this._xmlParser.getText(propertyXml, "name");
		property.datatype = this._xmlParser.getText(propertyXml, "dataType");
		property.defaultValue = this._xmlParser.getText(propertyXml, "defaultValue");
		property.evented = this._xmlParser.getAttribute(propertyXml, "sendEvents") == "yes";

		property.allowedValues = this._xmlParser.getElements(propertyXml,"allowedValue").map(value => value.innerHTML);

		if(this._xmlParser.hasNode(propertyXml, "allowedValueRange")){
			property.allowedValueRange = new AllowedValueRange();
			property.allowedValueRange.minimum = this._xmlParser.getText(propertyXml, "allowedValueRange minimum");
			property.allowedValueRange.maximum = this._xmlParser.getText(propertyXml, "allowedValueRange maximum");
			property.allowedValueRange.step = this._xmlParser.getText(propertyXml, "allowedValueRange step");
		}
		return property;
	},
	createServiceMethod: function (methodXml, backingProperties){
		var method = new ServiceMethod();
		method.name = this._xmlParser.getText(methodXml,"name");

		var arguments = this._xmlParser.getElements(methodXml, "argument").map(argumentXml => {
			return {
				name: this._xmlParser.getText(argumentXml, "name"),
				direction: this._xmlParser.getText(argumentXml, "direction"),
				relatedStateVariable: this._xmlParser.getText(argumentXml, "relatedStateVariable")
			};
		});

		arguments.forEach(argument => {
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
	},
	_getServiceInformation: function _getServiceInformation(service){
		if(!URL.isValidURI(service.scpdUrl))
			return;
		this._request({
			url: service.scpdUrl,
			onComplete: (response) => {
				var responseHash = this._md5.md5(response.text);
				if(service.responseHash !== responseHash){
					var parser = this._DOMParser;
					var responseXml = parser.parseFromString(response.text, 'text/xml');

					service.responseHash = responseHash;
					service.upnpVersion = new UPnPVersion();
					service.upnpVersion.major = this._xmlParser.getText(responseXml, "specVersion major");
					service.upnpVersion.minor = this._xmlParser.getText(responseXml, "specVersion minor");

					var propertiesXml = this._xmlParser.getElements(responseXml,"stateVariable");

					propertiesXml.forEach( propertyXml => service.properties.push( this.createServiceProperty( propertyXml ) ) );

					var methodsXml = this._xmlParser.getElements(responseXml, "action");

					methodsXml.forEach( methodXml => service.methods.push( this.createServiceMethod( methodXml, service.properties ) ) );
				}
			}
		}).get();
	}
});

module.exports = ServiceFactory;