const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const URL = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url

const Constants = require('../Constants');
const ServiceInfo = require("../Entities/ServiceInfo");
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
		var serviceInfo = new ServiceInfo();
		serviceInfo.controlUrl = this._utilities.toURL(this._xmlParser.getText(serviceXml, "controlURL"), location, base);
		serviceInfo.eventSubUrl = this._utilities.toURL(this._xmlParser.getText(serviceXml, "eventSubURL"), location, base);
		serviceInfo.scpdUrl = this._utilities.toURL(this._xmlParser.getText(serviceXml, "SCPDURL"), location, base);
		serviceInfo.id = this._xmlParser.getText(serviceXml, "serviceId");
		serviceInfo.type = new Type();
		serviceInfo.type.urn = this._xmlParser.getText(serviceXml, "serviceType");
		serviceInfo.type.name = Constants.ServiceTypes.filter( serviceType => serviceType[1] === serviceInfo.type.urn).map( serviceType => serviceType[0])[0];
		this._getServiceInformation(serviceInfo);

		if(ServiceInfo.scpdUrl != null && typeof serviceInfo.scpdUrl === "object")
			serviceInfo.hash = this._md5(serviceInfo.scpdUrl.href);

		return serviceInfo;
	},
	createServiceProperty: function(propertyXml){
		var property = new ServiceProperty();
		property.name = this._xmlParser.getText(propertyXml, "name");
		property.datatype = this._xmlParser.getText(propertyXml, "dataType");
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
	_getServiceInformation: function _getServiceInformation(serviceInfo){
		if(!URL.isValidURI(serviceInfo.scpdUrl))
			return;
		this._request({
			url: serviceInfo.scpdUrl,
			onComplete: (response) => {
				var responseHash = this._md5(response.text);
				if(serviceInfo.responseHash !== responseHash){
					var parser = this._DOMParser;
					var responseXml = parser.parseFromString(response.text, 'text/xml');

					serviceInfo.responseHash = responseHash;
					serviceInfo.upnpVersion = new UPnPVersion();
					serviceInfo.upnpVersion.major = this._xmlParser.getText(responseXml, "specVersion major");
					serviceInfo.upnpVersion.minor = this._xmlParser.getText(responseXml, "specVersion minor");

					var propertiesXml = this._xmlParser.getElements(responseXml,"stateVariable");

					propertiesXml.forEach( propertyXml => serviceInfo.properties.push( this.createServiceProperty( propertyXml ) ) );

					var methodsXml = this._xmlParser.getElements(responseXml, "action");

					methodsXml.forEach( methodXml => serviceInfo.methods.push( this.createServiceMethod( methodXml, serviceInfo.properties ) ) );
				}
			}
		}).get();
	}
});

module.exports = ServiceFactory;