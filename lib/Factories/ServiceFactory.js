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
	initialize: function initialize(request, DOMParser, xmlParser, utilities) {
		this._request = request;
		this._DOMParser = DOMParser;
		this._xmlParser = xmlParser;
		this._utilities = utilities;
	},
	createService: function createService(serviceXml, base, location){
		var service = new Service();
		service.controlUrl = this._utilities.toURL(base, this._xmlParser.getTextFromXml(serviceXml, "controlURL"), location);
		service.eventSubUrl = this._utilities.toURL(base, this._xmlParser.getTextFromXml(serviceXml, "eventSubURL"), location);
		service.scpdUrl = this._utilities.toURL(base, this._xmlParser.getTextFromXml(serviceXml, "SCPDURL"), location);
		service.id = this._xmlParser.getTextFromXml(serviceXml, "serviceId");
		service.type = new Type();
		service.type.urn = this._xmlParser.getTextFromXml(serviceXml, "serviceType");
		service.type.name = Constants.ServiceTypes.filter( serviceType => serviceType[1] === service.type.urn).map( serviceType => serviceType[0])[0];
		this._getServiceInformation(service);
		return service;
	},
	_getServiceInstantiation: function(serviceType){
		switch (serviceType){
			case (this._avTransportService.serviceType): return this._avTransportService;
			case (this._connectionManagerService.serviceType): return this._connectionManagerService;
			case (this._renderingControlService.serviceType): return this._renderingControlService;
			case (this._contentDirectoryService.serviceType): return this._contentDirectoryService;
			case (this._mediaReceiverRegistrarService.serviceType): return this._mediaReceiverRegistrarService;
			case (this._wfaWlanConfigService.serviceType): return this._wfaWlanConfigService;
			case (this._matchStickService.serviceType): return this._matchStickService;
			case (this._chromecastService.serviceType): return this._chromecastService;
			case (this._firestickService.serviceType): return this._firestickService;
		}
	},
	_getServiceInformation: function _getServiceInformation(service){
		if(!URL.isValidURI(service.scpdUrl))
			return;
		this._request({
			url: service.scpdUrl,
			onComplete: (response) => {
				var responseHash = this._utilities.md5(response.text);
				if(service.responseHash !== responseHash){
					var parser = this._DOMParser;
					var responseXml = parser.parseFromString(response.text, 'text/xml');

					service.responseHash = responseHash;
					service.upnpVersion = new UPnPVersion();
					service.upnpVersion.major = this._xmlParser.getTextFromXml(responseXml, "specVersion major");
					service.upnpVersion.minor = this._xmlParser.getTextFromXml(responseXml, "specVersion minor");

					var propertiesXml = Array.prototype.slice.call(responseXml.querySelectorAll("stateVariable"));

					propertiesXml.forEach(propertyXml => {
						var property = new ServiceProperty();
						property.name = this._xmlParser.getTextFromXml(propertyXml, "name");
						property.datatype = this._xmlParser.getTextFromXml(propertyXml, "dataType");
						property.defaultValue = this._xmlParser.getTextFromXml(propertyXml, "defaultValue");
						property.evented = this._xmlParser.getAttributeFromXml(propertyXml, "sendEvents") == "yes";

						property.allowedValues = Array.prototype.slice.call(propertyXml.querySelectorAll("allowedValue")).map(value => value.innerHTML);

						if(this._xmlParser.hasNode(propertyXml, "allowedValueRange")){
							property.allowedValueRange = new AllowedValueRange();
							property.allowedValueRange.minimum = this._xmlParser.getTextFromXml(propertyXml, "allowedValueRange minimum");
							property.allowedValueRange.maximum = this._xmlParser.getTextFromXml(propertyXml, "allowedValueRange maximum");
							property.allowedValueRange.step = this._xmlParser.getTextFromXml(propertyXml, "allowedValueRange step");
						}

						service.properties.push(property);
					});

					var methodsXml = Array.prototype.slice.call(responseXml.querySelectorAll("action"));

					methodsXml.forEach( methodXml => {
						var method = new ServiceMethod();
						method.name = this._xmlParser.getTextFromXml(methodXml,"name");

						var arguments = Array.prototype.slice.call(methodXml.querySelectorAll("argument")).map(argumentXml => {
							return {
								name: this._xmlParser.getTextFromXml(argumentXml, "name"),
								direction: this._xmlParser.getTextFromXml(argumentXml, "direction"),
								relatedStateVariable: this._xmlParser.getTextFromXml(argumentXml, "relatedStateVariable")
							};
						});

						arguments.forEach(argument => {
							var backingProperty = service.properties.filter(serviceProperty => serviceProperty.name === argument.relatedStateVariable)[0];
							var arg = new ServiceArgument();
							arg.name = argument.name;
							arg.backingProperty = backingProperty;
							arg.datatype = backingProperty.datatype;
							arg.allowedValues = backingProperty.allowedValues;
							arg.allowedValueRange = backingProperty.allowedValueRange;

							argument.direction === 'in' ? method.parameters.push(arg) : method.returnValues.push(arg);
						});

						service.methods.push(method);
					});

					//this.serviceList[service.type.urn] = service; TODO: fix this
				}
			}
		}).get();
	}
});

module.exports = ServiceFactory;