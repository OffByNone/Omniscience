const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const URL = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url

const Constants = require('../Constants');
const Service = require("../Entities/Service");

const ServiceFactory = Class({
	initialize: function initialize(xmlParser, soapService) {
		this._xmlParser = xmlParser;
		this._soapService = soapService;
	},
	create: function create(serviceInfo){
		var service = {};
		if(!Array.isArray(serviceInfo.methods)) return null;
		serviceInfo.methods.forEach(method => this._addMethod(service, method, serviceInfo.type.raw));

		return service;
	},
	_addMethod: function (service, serviceInfoMethod, urn){
		if(serviceInfoMethod == null) return;
		if(typeof serviceInfoMethod.name !== "string" || serviceInfoMethod.name.length === 0) return;

		service[serviceInfoMethod.name] = (controlUrl, params) => {
			serviceInfoMethod.parameters.forEach(parameter => this._validateParam(parameter, params));

			return this._soapService.post(controlUrl, urn, serviceInfoMethod.name, params).then(response => {
				//todo: try to coerce the type using returnValue.datatype
				var result = {};

				serviceInfoMethod.returnValues.forEach( returnValue => {
					if(typeof returnValue.name === "string" && returnValue.name.length > 0)
						result[returnValue.name] = this._xmlParser.getText(response.xml, returnValue.name);
				});

				result._raw = response.text;
				return result;
			});
		};
	},
	_validateParam: function (parameter, params){
		//todo: validate datatype as well
		//todo: there are serious issues with this validation as different devices allow different inputs and this won't allow for that.
		//should probably set it up so that when calling the service it pulls in the allowed values from the device.serviceInfo on the backend
		if(typeof parameter.name !== "string" || parameter.name.length === 0) return;
		if(!params.hasOwnProperty(parameter.name)) throw new Error(`Missing required argument: ${parameter.name}`);
		var param = params[parameter.name];

		if(parameter.allowedValues.length > 0 && parameter.allowedValues.every(allowedValue => allowedValue != param))
			throw new Error(`value for argument ${parameter.name} is not allowed`);
		if(parameter.allowedValueRange.maximum != null && parameter.allowedValueRange.minimum != null && parameter.allowedValueRange.step != null){
			paramNum = Number(param);
			if(isNaN(paramNum)
				|| paramNum < Number(parameter.allowedValueRange.minimum) || paramNum > Number(parameter.allowedValueRange.maximum)
				|| paramNum - Number(parameter.allowedValueRange.maximum) % Number(parameter.allowedValueRange.step) !== 0)
				throw new Error(`argument ${parameter.name} is invalid. It must be a number between ${parameter.allowedValueRange.minimum} and ${parameter.allowedValueRange.maximum}, and incremented by ${parameter.allowedValueRange.step}.`);
		}
	}
});

module.exports = ServiceFactory;