const Constants = require('../Utilities/Constants');
const Device = require('../Entities/Device');
const UPnPExtensionInfo = require('../Entities/UPnPExtensionInfo');
const DeviceModel = require('../Entities/DeviceModel');
const DeviceManufacturer = require('../Entities/DeviceManufacturer');
const UPnPVersion = require('../Entities/UPnPVersion');
const Icon = require('../Entities/Icon');
const Capabilities = require('../Entities/Capabilities');
const ServiceInfo = require('../Entities/ServiceInfo');

class DeviceFactory {
    constructor(fetch, xmlParser, urlProvider, md5) {
        this._fetch = fetch;
        this._xmlParser = xmlParser
        this._urlProvider = urlProvider;
        this._md5 = md5;
    }
    create(location, headers, device, attempt) {
        if (location.toLowerCase().indexOf("http") != 0)
            location = "http://" + location; //Microsoft special
        return this._fetch(location).then( (response) => {
            var responseText = response._bodyText;
            if(responseText == null || responseText.length === 0){
                if(attempt < 3) return this.create(location, headers, device, Number(attempt) + 1);
                else return Promise.reject("device at location " + location + " sent 3 bad responses in a row, giving up.");
            }

            var responseHash = this._md5(responseText);
            if(!device || responseHash !== device.responseHash){
                var responseXml = this._xmlParser.parseFromString(responseText);
                var root = this._xmlParser.getElement(responseXml, "root");

                if(root == null){
                    if(attempt < 3) return this.create(location, headers, device, Number(attempt) + 1);
                    else return Promise.reject("device at location " + location + " sent 3 bad responses in a row, giving up.");
                }

                var base = this._xmlParser.getText(root, "baseUrl");
                var deviceXml = this._xmlParser.getElement(root, 'device');

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

					//todo: move these to somehow be on the service and not the device
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
                        icon.url = this._urlProvider.toUrl(this._xmlParser.getText(iconXml, "url"), location, base);

                        device.icons.push(icon);
                    });

                    var servicesXml = this._xmlParser.getElements(deviceXml, 'serviceList service');

                    servicesXml.forEach( (serviceXml) => {
                        var serviceInfo = new ServiceInfo();
                        serviceInfo.controlUrl = this._urlProvider.toUrl(this._xmlParser.getText(serviceXml, "controlURL"), location, base);
                        serviceInfo.eventSubUrl = this._urlProvider.toUrl(this._xmlParser.getText(serviceXml, "eventSubURL"), location, base);
                        serviceInfo.scpdUrl = this._urlProvider.toUrl(this._xmlParser.getText(serviceXml, "SCPDURL"), location, base);
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
                device.address = this._urlProvider.createUrl(base || this._urlProvider.createUrl(location).origin);
                device.fromAddress = headers.fromAddress;
                device.id = this._md5(location);
                device.ssdpDescription = this._urlProvider.createUrl(location);
                device.responseHash = responseHash;
                device.serverIP = headers.serverIP;
            }

            return device;
        });
    }
}

module.exports = DeviceFactory;
