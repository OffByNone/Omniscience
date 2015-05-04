const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const { URL } = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url
const Constants = require('../Constants');

const Device = require('../Entities/Device');
const UPnPExtensionInfo = require('../Entities/UPnPExtensionInfo');
const DeviceModel = require('../Entities/DeviceModel');
const DeviceManufacturer = require('../Entities/DeviceManufacturer');
const UPnPVersion = require('../Entities/UPnPVersion');
const Icon = require('../Entities/Icon');
const Capabilities = require('../Entities/Capabilities');
const ServiceInfo = require('../Entities/ServiceInfo');

class DeviceFactory {
    constructor(domParser, fetch, messageFactory, emitter, xmlParser, utilities, md5) {
        this._domParser = domParser;  //todo: this should be moved into the xml parser, deviceFactory should never need to know about xml other than passing it to the xmlparser
        this._fetch = fetch;
        this._messageFactory = messageFactory;
        this._emitter = emitter;
        this._xmlParser = xmlParser
        this._utilities = utilities;
        this._md5 = md5;
    }
    create(location, headers, device, attempt) {
        if (location.indexOf("http") != 0)
            location = "http://" + location; //Microsoft special
        return this._fetch(location).then( (response) => {
            var responseText = response._bodyText;
            if(responseText == null || responseText.length === 0){
                if(attempt < 3) return this.create(location, headers, device, Number(attempt) + 1);
                else return Promise.reject("device at location " + location + " sent 3 bad responses in a row, giving up.");
            }

            var responseHash = this._md5(responseText);
            if(!device || responseHash !== device.responseHash){
                var responseXml = this._domParser.parseFromString(responseText, 'text/xml');
                var root = responseXml.querySelector("root");

                if(root == null){
                    if(attempt < 3) return this.create(location, headers, device, Number(attempt) + 1);
                    else return Promise.reject("device at location " + location + " sent 3 bad responses in a row, giving up.");
                }

                var base = this._xmlParser.getText(root, "baseUrl");
                var deviceXml = root.querySelector('device');

                if(!device) device = new Device();

                if(deviceXml) {
                    device.serialNumber = this._xmlParser.getText(deviceXml, "serialNumber");
                    device.webPage = this._xmlParser.getText(deviceXml, "presentationURL");
                    device.name = this._xmlParser.getText(deviceXml, "friendlyName");
                    device.udn = this._xmlParser.getText(deviceXml, "UDN");

                    device.type = new UPnPExtensionInfo();
                    device.type.setFromString(this._xmlParser.getText(deviceXml, "deviceType"));
                    device.manufacturer = new DeviceManufacturer();
                    device.manufacturer.name = this._xmlParser.getText(deviceXml, "manufacturer");
                    device.manufacturer.url = this._xmlParser.getText(deviceXml, "manufacturerURL");
                    device.model = new DeviceModel();
                    device.model.number = this._xmlParser.getText(deviceXml, "modelNumber");
                    device.model.description = this._xmlParser.getText(deviceXml, "modelDescription");
                    device.model.name = this._xmlParser.getText(deviceXml, "modelName");
                    device.model.url = this._xmlParser.getText(deviceXml, "modelUrl");
                    device.capabilities = new Capabilities();
                    device.upc = this._xmlParser.getText(deviceXml, "UPC");

                    //todo: the following if/else/if is effectively wrong because the capabilities and other info do not belong to the device but to the services of said device
                    //however to present capabilities it might be better to put them on the device level.  At least with the current UI it would be difficult to show all of them in one tab
                    //if they belong to a service.
                    if(device.model.name === Constants.ModelNames.MatchStick || device.model.name === Constants.ModelNames.Chromecast || device.model.name === Constants.ModelNames.Firestick) {
                        device.capabilities.mirror = true;
                        device.capabilities.audio = true;
                        device.capabilities.video = true;
                        device.capabilities.image = true;
                    }
                    else if(Constants.DeviceTypes.MediaServer === device.type.raw) device.capabilities.server = true;
                    else if(Constants.DeviceTypes.WFA === device.type.raw) device.capabilities.router = true;

                    var iconsXml = this._xmlParser.getElements(deviceXml, 'iconList icon');

                    iconsXml.forEach( (iconXml) => {
                        var icon = new Icon();
                        icon.mimeType = this._xmlParser.getText(iconXml, "mimetype");
                        icon.width = this._xmlParser.getText(iconXml, "width");
                        icon.height = this._xmlParser.getText(iconXml, "height");
                        icon.depth = this._xmlParser.getText(iconXml, "depth");
                        icon.url = this._utilities.toUrl(this._xmlParser.getText(iconXml, "url"), location, base);

                        device.icons.push(icon);
                    });

                    var servicesXml = this._xmlParser.getElements(deviceXml, 'serviceList service');

                    servicesXml.forEach( (serviceXml) => {
                        var serviceInfo = new ServiceInfo();
                        serviceInfo.controlUrl = this._utilities.toUrl(this._xmlParser.getText(serviceXml, "controlURL"), location, base);
                        serviceInfo.eventSubUrl = this._utilities.toUrl(this._xmlParser.getText(serviceXml, "eventSubURL"), location, base);
                        serviceInfo.scpdUrl = this._utilities.toUrl(this._xmlParser.getText(serviceXml, "SCPDURL"), location, base);
                        serviceInfo.id = new UPnPExtensionInfo();
                        serviceInfo.id.setFromString(this._xmlParser.getText(serviceXml, "serviceId"));
                        serviceInfo.type = new UPnPExtensionInfo();
                        serviceInfo.type.setFromString(this._xmlParser.getText(serviceXml, "serviceType"));
                        serviceInfo.serverIP = headers.serverIP;

                        if(ServiceInfo.scpdUrl != null && typeof serviceInfo.scpdUrl === "object")
                            serviceInfo.hash = this._md5(serviceInfo.scpdUrl.href);
                        else
                            serviceInfo.hash = this._md5(serviceInfo.id.raw);

                        device.services.push(serviceInfo);
                    });
                }

                device.upnpVersion = new UPnPVersion();
                device.upnpVersion.major = this._xmlParser.getText(root, "specVersion major");
                device.upnpVersion.minor = this._xmlParser.getText(root, "specVersion minor");

                device.rawDiscoveryInfo = responseText;
                device.address = new URL(base || new URL(location).origin);
                device.fromAddress = headers.fromAddress;
                device.id = this._md5(location);
                device.ssdpDescription = new URL(location);
                device.responseHash = responseHash;
                device.serverIP = headers.serverIP;

                var key = this._md5(headers.USN || headers.ST || headers.LOCATION);
                device.ssdpResponseHeaders[key] = headers;
            }

            return device;
        });
    }
}

module.exports = DeviceFactory;
