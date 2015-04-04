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
	initialize: function initialize(domParser, request, defer, messageFactory, deviceServices, emitter, xmlParser, utilities, md5, ServiceInfoFactory) {
		this._DOMParser = domParser;  //todo: this should be moved into the xml parser, this class should never need to know about xml other than passing it to the xmlparser
		this._request = request;
		this._defer = defer;
		this._messageFactory = messageFactory;
		this._deviceServices = deviceServices;
		this._emitter = emitter;
		this._xmlParser = xmlParser
		this._utilities = utilities;
		this._ServiceInfoFactory = ServiceInfoFactory;
		this._md5 = md5;
	},
	create: function create(location, headers, device, attempt, previousDefer) {
		if (location.indexOf("http") != 0)
			location = "http://" + location; //Microsoft special
		var deferred = previousDefer || this._defer();
		this._request({
			url: location,
			onComplete: (response) => {
				if(response.text == null || response.text.length === 0){
					if(attempt < 3) this.create(location, headers, device, Number(attempt) + 1, deferred);
					else {
						console.warn("device at location " + location + " sent 3 bad responses in a row, giving up.");
						deferred.resolve(null);
					}
					return;
				}

				var responseHash = this._md5(response.text);
				if(!device || responseHash !== device.responseHash){
					var responseXml = this._DOMParser.parseFromString(response.text, 'text/xml');
					var root = responseXml.querySelector("root");

					if(root == null){
						if(attempt < 3) this.create(location, headers, device, Number(attempt) + 1, deferred);
						else {
							console.warn("device at location " + location + " sent 3 bad responses in a row, giving up.");
							deferred.resolve(null);
						}
						return;
					}

					var base = this._xmlParser.getText(root, "baseUrl") || new URL(location).origin;
					var deviceXml = root.querySelector('device');

					if(deviceXml){
						if(!device) device = new Device();

						device.serialNumber = this._xmlParser.getText(deviceXml, "serialNumber");
						device.webPage = this._xmlParser.getText(deviceXml, "presentationURL");
						device.name = this._xmlParser.getText(deviceXml, "friendlyName");
						device.udn = this._xmlParser.getText(deviceXml, "UDN");

						device.type = new Type();
						device.type.urn = this._xmlParser.getText(deviceXml, "deviceType");
						device.type.name = Constants.DeviceTypes.filter(deviceType => deviceType[1] === device.type.urn).map(deviceType => deviceType[0])[0];
						device.manufacturer = new DeviceManufacturer();
						device.manufacturer.name = this._xmlParser.getText(deviceXml, "manufacturer");
						device.manufacturer.url = this._xmlParser.getText(deviceXml, "manufacturerURL");
						device.model = new DeviceModel();
						device.model.number = this._xmlParser.getText(deviceXml, "modelNumber");
						device.model.description = this._xmlParser.getText(deviceXml, "modelDescription");
						device.model.name = this._xmlParser.getText(deviceXml, "modelName");
						device.model.url = this._xmlParser.getText(deviceXml, "modelUrl");
						device.capabilities = new Capabilities();


						//todo: the following if/else/if is effectively wrong because the capabilities and other info do not belong to the device but to the services of said device
						//however to present capabilities it might be better to put them on the device level.  At least with the current UI it would be difficult to show all of them in one tab
						//if they belong to a service.
						if(device.model.name === Constants.ModelNames.MatchStick || device.model.name === Constants.ModelNames.Chromecast || device.model.name === Constants.ModelNames.Firestick) {
							device.capabilities.mirrorCapable = true;
							device.capabilities.audioCapable = true;
							device.capabilities.videoCapable = true;
							device.capabilities.imageCapable = true;
						}
						else if(Constants.DeviceTypes.some(deviceType => deviceType[0] === 'Media Renderer' &&  deviceType[1] === device.type.urn)){
							//device.instanceId = 0; //TODO: obtain dynamically
							//device.connectionId = 0; //TODO: obtain dynamically
						}
						else if(Constants.DeviceTypes.some(deviceType => deviceType[0] === 'Media Server' &&  deviceType[1] === device.type.urn)){
							device.capabilities.server = true;
							//device.instanceId = 0; //TODO: obtain dynamically
							//device.connectionId = 0; //TODO: obtain dynamically
						}
						else if(Constants.DeviceTypes.some(deviceType => deviceType[0] === 'WFA' &&  deviceType[1] === device.type.urn))
							device.capabilities.router = true;

						var iconsXml = this._xmlParser.getElements(deviceXml, 'iconList icon');

						iconsXml.forEach(iconXml => {
							var icon = new Icon();
							icon.mimeType = this._xmlParser.getText(iconXml, "mimetype");
							icon.width = this._xmlParser.getText(iconXml, "width");
							icon.height = this._xmlParser.getText(iconXml, "height");
							icon.depth = this._xmlParser.getText(iconXml, "depth");
							icon.url = this._utilities.toURL(this._xmlParser.getText(iconXml, "url"), location, base);

							device.icons.push(icon);
						});

						var servicesXml = this._xmlParser.getElements(deviceXml, 'serviceList service');

						servicesXml.forEach(serviceXml => {
							var service = this._ServiceInfoFactory.create(serviceXml, base, location);
							device.services.push(service);
						});
					}

					device.upnpVersion = new UPnPVersion();
					device.upnpVersion.major = this._xmlParser.getText(root, "specVersion major");
					device.upnpVersion.minor = this._xmlParser.getText(root, "specVersion minor");

					device.rawDiscoveryInfo = response.text;
					device.address = new URL(base);
					device.id = this._md5(location);
					device.ssdpDescription = new URL(location);
					device.responseHash = responseHash;

					var key = this._md5(headers.USN || headers.ST || headers.LOCATION);
					device.ssdpResponseHeaders[key] = headers;
				}

				this._deviceServices.addServices(device.services);

				deferred.resolve(device);
			}
		}).get();

		return deferred.promise;
	}
});

module.exports = DeviceFactory;
