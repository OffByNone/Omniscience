const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const { URL } = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url
const Constants = require('../Constants');

const Device = require('../Entities/Device');
const Type = require('../Entities/Type');
const DeviceModel = require('../Entities/DeviceModel');
const DeviceManufacturer = require('../Entities/DeviceManufacturer');
const UPnPVersion = require('../Entities/UPnPVersion');
const Icon = require('../Entities/Icon');
const Capabilities = require('../Entities/Capabilities');

const DeviceFactory = Class({
	extends: EventTarget,
	initialize: function initialize(domParser, request, defer, messageFactory, deviceServices, emitter, xmlParser, utilities, serviceFactory) {
		this._DOMParser = domParser;
		this._request = request;
		this._defer = defer;
		this._messageFactory = messageFactory;
		this._deviceServices = deviceServices;
		this.serviceList = {};
		this._emitter = emitter;
		this._xmlParser = xmlParser
		this._utilities = utilities;
		this._serviceFactory = serviceFactory;
	},
	createDevice: function createDevice(location, headers, device, attempt, previousDefer) {
		if (location.indexOf("http") != 0)
			location = "http://" + location; //Microsoft special
		var deferred = previousDefer || this._defer();
		this._request({
			url: location,
			onComplete: (response) => {
				if(response.text == null || response.text.length === 0){
					if(attempt < 3) this.createDevice(location, headers, device, Number(attempt) + 1, deferred);
					else {
						console.warn("device at location " + location + " sent 3 bad responses in a row, giving up.");
						deferred.resolve(null);
					}
					return;
				}

				var responseHash = this._utilities.md5(response.text);
				if(!device || responseHash !== device.responseHash){
					var responseXml = this._DOMParser.parseFromString(response.text, 'text/xml');
					var root = responseXml.querySelector("root");

					if(root == null){
						if(attempt < 3) this.createDevice(location, headers, device, Number(attempt) + 1, deferred);
						else {
							console.warn("device at location " + location + " sent 3 bad responses in a row, giving up.");
							deferred.resolve(null);
						}
						return;
					}

					var base = this._xmlParser.getTextFromXml(root, "baseUrl") || new URL(location).origin;
					var deviceXml = root.querySelector('device');

					if(deviceXml){
						if(!device) device = new Device();

						device.serialNumber = this._xmlParser.getTextFromXml(deviceXml, "serialNumber");
						device.webPage = this._xmlParser.getTextFromXml(deviceXml, "presentationURL");
						device.name = this._xmlParser.getTextFromXml(deviceXml, "friendlyName");
						device.udn = this._xmlParser.getTextFromXml(deviceXml, "UDN");

						device.type = new Type();
						device.type.urn = this._xmlParser.getTextFromXml(deviceXml, "deviceType");
						device.type.name = Constants.DeviceTypes.filter(deviceType => deviceType[1] === device.type.urn).map(deviceType => deviceType[0])[0];
						device.manufacturer = new DeviceManufacturer();
						device.manufacturer.name = this._xmlParser.getTextFromXml(deviceXml, "manufacturer");
						device.manufacturer.url = this._xmlParser.getTextFromXml(deviceXml, "manufacturerURL");
						device.model = new DeviceModel();
						device.model.number = this._xmlParser.getTextFromXml(deviceXml, "modelNumber");
						device.model.description = this._xmlParser.getTextFromXml(deviceXml, "modelDescription");
						device.model.name = this._xmlParser.getTextFromXml(deviceXml, "modelName");
						device.model.url = this._xmlParser.getTextFromXml(deviceXml, "modelUrl");
						device.capabilities = new Capabilities();

						if(device.model.name === Constants.ModelNames.MatchStick || device.model.name === Constants.ModelNames.Chromecast || device.model.name === Constants.ModelNames.Firestick) {
							device.capabilities.mirrorCapable = true;
							device.capabilities.audioCapable = true;
							device.capabilities.videoCapable = true;
							device.capabilities.imageCapable = true;
						}
						else if(Constants.DeviceTypes.some(deviceType => deviceType[0] === 'Media Renderer' &&  deviceType[1] === device.type.urn)){
							device.instanceId = 0; //TODO: obtain dynamically
							device.connectionId = 0; //TODO: obtain dynamically
						}
						else if(Constants.DeviceTypes.some(deviceType => deviceType[0] === 'Media Server' &&  deviceType[1] === device.type.urn)){
							device.capabilities.server = true;
							device.instanceId = 0; //TODO: obtain dynamically
							device.connectionId = 0; //TODO: obtain dynamically
						}
						else if(Constants.DeviceTypes.some(deviceType => deviceType[0] === 'WFA' &&  deviceType[1] === device.type.urn))
							device.capabilities.router = true;

						var iconsXml = Array.prototype.slice.call(deviceXml.querySelectorAll('iconList icon'));

						iconsXml.forEach(iconXml => {
							var icon = new Icon();
							icon.mimeType = this._xmlParser.getTextFromXml(iconXml, "mimetype");
							icon.width = this._xmlParser.getTextFromXml(iconXml, "width");
							icon.height = this._xmlParser.getTextFromXml(iconXml, "height");
							icon.depth = this._xmlParser.getTextFromXml(iconXml, "depth");
							icon.url = this._utilities.toURL(base, this._xmlParser.getTextFromXml(iconXml, "url"), location);

							var md5 = this._utilities.md5(icon.url);
							device.icons[md5] = icon;
						});

						var servicesXml = Array.prototype.slice.call(deviceXml.querySelectorAll('serviceList service'));

						servicesXml.forEach(serviceXml => {
							var service =  this._serviceFactory.createService(serviceXml, base, location);
							var md5 = this._utilities.md5(service.scpdUrl || service.id);
							device.services[md5] = service;
						});
					}

					device.upnpVersion = new UPnPVersion();
					device.upnpVersion.major = this._xmlParser.getTextFromXml(root, "specVersion major");
					device.upnpVersion.minor = this._xmlParser.getTextFromXml(root, "specVersion minor");

					device.rawDiscoveryInfo = response.text;
					device.ssdpResponseHeaders.push(headers);
					device.address = new URL(base);
					device.id = this._utilities.md5(location);
					device.ssdpDescription = new URL(location);
					device.responseHash = responseHash;
				}

				this._deviceServices.getAdditionalInformation(device);
				deferred.resolve(device);
			}
		}).get();

		return deferred.promise;
	}
});

module.exports = DeviceFactory;
