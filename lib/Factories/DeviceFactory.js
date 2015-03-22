const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const { URL } = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url
const Constants = require('../Constants');

const { MatchStickDevice } = require('../Entities/Devices/MatchStickDevice');
const { ChromecastDevice } = require('../Entities/Devices/ChromecastDevice');
const { FirestickDevice } = require('../Entities/Devices/FirestickDevice');
const { MediaRendererDevice } = require('../Entities/Devices/MediaRendererDevice');
const { MediaServerDevice} = require('../Entities/Devices/MediaServerDevice');
const { WFADevice } = require('../Entities/Devices/WFADevice');
const { GenericDevice } = require('../Entities/Devices/GenericDevice');
const Utilities = require('../Utilities');

const DeviceFactory = Class({
	extends: EventTarget,
	initialize: function initialize(domParser, request, defer, messageFactory, deviceServices, emitter) {
		this._DOMParser = domParser;
		this._request = request;
		this._defer = defer;
		this._messageFactory = messageFactory;
		this._deviceServices = deviceServices;
		this.serviceList = {};
		this._emitter = emitter;
	},
	createDevice: function createDevice(location, headers, device, attempt, previousDefer) {
		if (location.indexOf("http") != 0)
			location = "http://" + location; //Microsoft special
		var deferred = previousDefer || this._defer();
		this._request({
			url: location,
			onComplete: (response) => {
				if(response.text == null || response.text.length === 0){
					if(attempt < 3) this.createDevice(location, headers, Number(attempt) + 1), deferred;
					else {
						console.warn("device at location " + location + " sent 3 bad responses in a row, giving up.");
						deferred.resolve(null);
					}
					return;
				}

				var responseXML = this._DOMParser.parseFromString(response.text, 'text/xml');
				var root = responseXML.querySelector("root");

				if(root == null){
					if(attempt < 3) this.createDevice(location, headers, Number(attempt) + 1, deferred);
					else {
						console.warn("device at location " + location + " sent 3 bad responses in a row, giving up.");
						deferred.resolve(null);
					}
					return;
				}

				var base = (root.querySelector('baseUrl') || {}).innerHTML || new URL(location).origin;

				var deviceXML = root.querySelector('device');
				if(deviceXML){
					deviceTypeUrn = (deviceXML.querySelector('deviceType') || {}).innerHTML;

					switch ((deviceXML.querySelector('modelName') || {}).innerHTML) {
						case Constants.ModelNames.MatchStick:
							device = this._createMatchStick();
							break;
						case Constants.ModelNames.Chromecast:
							device = this._createChromecast();
							break;
						case Constants.ModelNames.Firestick:
							device = this._createFirestick();
							break;
						default:
							if(Constants.DeviceTypes.some(deviceType => deviceType[0] === 'Media Renderer' &&  deviceType[1] === deviceTypeUrn))
								device = this._createMediaRenderer();
							else if(Constants.DeviceTypes.some(deviceType => deviceType[0] === 'Media Server' &&  deviceType[1] === deviceTypeUrn))
								device = this._createMediaServer();
							else if(Constants.DeviceTypes.some(deviceType => deviceType[0] === 'WFA' &&  deviceType[1] === deviceTypeUrn))
								device = this._createWFA();
							else
								device = this._createGenericDevice();
							break;
					}

					device.serialNumber = (deviceXML.querySelector('serialNumber') || {}).innerHTML;
					device.webPage = (deviceXML.querySelector('presentationURL') || {}).innerHTML;
					device.type = {
						urn: deviceTypeUrn,
						name: Constants.DeviceTypes.filter(deviceType => deviceType[1] === deviceTypeUrn).map(deviceType => deviceType[0])[0]
					};
					device.name = (deviceXML.querySelector('friendlyName') || {}).innerHTML;
					device.manufacturer = {
						name: (deviceXML.querySelector('manufacturer') || {}).innerHTML,
						url: (deviceXML.querySelector('manufacturerURL') || {}).innerHTML
					};
					device.model = {
						number: (deviceXML.querySelector('modelNumber') || {}).innerHTML,
						description: (deviceXML.querySelector('modelDescription') || {}).innerHTML,
						name: (deviceXML.querySelector('modelName') || {}).innerHTML,
						url: (deviceXML.querySelector('modelURL') || {}).innerHTML,
					};
					device.udn = (deviceXML.querySelector('UDN') || {}).innerHTML;

					var icons = deviceXML.querySelector('iconList');

					if (!icons) device.icons = [];
					else {
						device.icons = Array.prototype.slice.call(icons.querySelectorAll('icon')).map( icon => {
							return {
								mimeType: (icon.querySelector('mimetype') || {}).innerHTML,
								width: (icon.querySelector('width') || {}).innerHTML,
								height: (icon.querySelector('height') || {}).innerHTML,
								depth: (icon.querySelector('depth') || {}).innerHTML,
								url: this._toURL(base, (icon.querySelector('url') || {}).innerHTML, location)
							};
						});
					}

					var services = deviceXML.querySelector('serviceList');

					if(!device.services) {
						//there are many problems caused by regenerating service information each time through a search
						//this is the lazy way to solve them.  And since the services a device has are unlikely to change
						//this should be ok.
						if (!services) device.services = [];
						else {
							device.services = Array.prototype.slice.call(services.querySelectorAll('service')).map( service => {
								return {
									controlUrl: this._toURL(base, (service.querySelector('controlURL') || {}).innerHTML, location),
									eventSubUrl: this._toURL(base, (service.querySelector('eventSubURL') || {}).innerHTML, location),
									scpdUrl: this._toURL(base, (service.querySelector('SCPDURL') || {}).innerHTML, location),
									id: (service.querySelector('serviceId') || {}).innerHTML,
									type: {
										urn: (service.querySelector('serviceType') || {}).innerHTML,
										name: Constants.ServiceTypes.filter( serviceType => serviceType[1] === (service.querySelector('serviceType') || {}).innerHTML).map( serviceType => serviceType[0])[0]
									}
								};
							});
							this._getServiceInformation(device);
						}
					}
				}

				var specVersion = root.querySelector('specVersion');
				if(specVersion) device.upnpVersion = (specVersion.querySelector('major') || {}).innerHTML + '.' + (specVersion.querySelector('minor') || {}).innerHTML;
				else device.upnpVersion = '1.0';

				device.rawDiscoveryInfo = response.text;
				device.ssdpResponseHeaders = headers;
				device.address = new URL(base);
				device.id = Utilities.md5(device.address);
				device.ssdpDescription = new URL(location);

				this._deviceServices[device.serviceKey].getAdditionalInformation(device);
				deferred.resolve(device);
			}
		}).get();

		return deferred.promise;
	},
	_getServiceInformation: function _getServiceInformation(device){
		device.services.filter(x=> x.scpdUrl).forEach(service =>{
			this._request({
				url: service.scpdUrl,
				onComplete: (response) => {
					var parser = this._DOMParser;
					var responseXML = parser.parseFromString(response.text, 'text/xml');

					var specVersionXML = responseXML.querySelector("specVersion");
					if(specVersionXML)
						service.version = (specVersionXML.querySelector("major") || {}).innerHTML + '.' + (specVersionXML.querySelector("minor") || {}).innerHTML;
					else
						service.version = "1.0";

					service.properties = [];
					Array.prototype.slice.call(responseXML.querySelectorAll("stateVariable")).forEach(variable => {
						var property = {
							name: (variable.querySelector("name") || {}).innerHTML,
							datatype: (variable.querySelector("dataType") || {}).innerHTML,
							defaultValue: (variable.querySelector("defaultValue") || {}).innerHTML,
							sendEvents: variable.attributes.getNamedItem('sendEvents').value == "yes",
						};

						var allowedValues = Array.prototype.slice.call(variable.querySelectorAll("allowedValue")).map(value => value.innerHTML);
						if(allowedValues.length > 0)
							property.allowedValues = allowedValues;

						var allowedValueRange = variable.querySelector("allowedValueRange");
						if(allowedValueRange != null){
							property.allowedValueRange = {
								minimum: (allowedValueRange.querySelector("minimum") ||{}).innerHTML,
								maximum: (allowedValueRange.querySelector("maximum") ||{}).innerHTML,
								step: (allowedValueRange.querySelector("step") ||{}).innerHTML
							};
						}

						service.properties.push(property);
					});

					service.methods = [];
					Array.prototype.slice.call(responseXML.querySelectorAll("action")).forEach(action => {
						var method = {
							name: (action.querySelector("name") || {}).innerHTML,
						};

						var arguments = Array.prototype.slice.call(action.querySelectorAll("argument")).map(argument => {
							return {
								name: (argument.querySelector("name") || {}).innerHTML,
								direction: (argument.querySelector("direction") || {}).innerHTML,
								relatedStateVariable: (argument.querySelector("relatedStateVariable") || {}).innerHTML
							};
						});

						var parameters = [];
						var returnValues = [];

						arguments.forEach(argument => {
							var backingProperty = service.properties.filter(serviceProperty => serviceProperty.name === argument.relatedStateVariable)[0];
							var arg = {
								name: argument.name,
								backingProperty: backingProperty,
								type: backingProperty.datatype,
								allowedValues: backingProperty.allowedValues,
								allowedValueRange: backingProperty.allowedValueRange
							};

							if(argument.direction === 'in')
								parameters.push(arg);
							else
								returnValues.push(arg);
						});

						method.parameters = parameters;
						method.returns = returnValues;

						service.methods.push(method);
					});

					this.serviceList[service.type.urn] = service;
				}
			}).get();
		});
	},
	_createMatchStick: function _createMatchStick(){
		return new MatchStickDevice();
	},
	_createChromecast: function _createChromecast(){
		return new ChromecastDevice();
	},
	_createFirestick: function _createFirestick(){
		return new FirestickDevice();
	},
	_createGenericDevice: function _createGenericDevice(){
		return new GenericDevice();
	},
	_createMediaRenderer: function _createMediaRenderer(){
		return new MediaRendererDevice();
	},
	_createMediaServer: function _createMediaServer(){
		return new MediaServerDevice();
	},
	_createWFA: function _createWFA(){
		return new WFADevice();
	},
	_createDIALMultiscreen: function _createDIALMultiscreen(){
		return new DIALMultiscreenDevice();
	},
	_toURL: function _toURL(baseUrl, path, location) {
		//todo: fix this method.  There are tons of problems in here

		//this will return null for undefined and not found paths
		if (!path || path.length === 0 || path === '/ssdp/notfound')
			return null;

		try{
			return new URL(path);
		}
		catch(e){
			if(path.charAt(0) !== "/") return new URL(location + path);
			return new URL(baseUrl + path);
		}
	}
});

exports.DeviceFactory = DeviceFactory;