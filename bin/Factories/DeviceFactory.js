'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Constants = require('../Utilities/Constants');
var Device = require('../Entities/Device');
var UPnPExtensionInfo = require('../Entities/UPnPExtensionInfo');
var DeviceModel = require('../Entities/DeviceModel');
var DeviceManufacturer = require('../Entities/DeviceManufacturer');
var UPnPVersion = require('../Entities/UPnPVersion');
var Icon = require('../Entities/Icon');
var Capabilities = require('../Entities/Capabilities');
var ServiceInfo = require('../Entities/ServiceInfo');

var DeviceFactory = (function () {
    function DeviceFactory(fetch, xmlParser, urlProvider, md5) {
        _classCallCheck(this, DeviceFactory);

        this._fetch = fetch;
        this._xmlParser = xmlParser;
        this._urlProvider = urlProvider;
        this._md5 = md5;
    }

    _createClass(DeviceFactory, [{
        key: 'create',
        value: function create(location, headers, device, attempt) {
            var _this = this;

            if (location.toLowerCase().indexOf('http') != 0) location = 'http://' + location; //Microsoft special
            return this._fetch(location).then(function (response) {
                var responseText = response._bodyText;
                if (responseText == null || responseText.length === 0) {
                    if (attempt < 3) return _this.create(location, headers, device, Number(attempt) + 1);else return Promise.reject('device at location ' + location + ' sent 3 bad responses in a row, giving up.');
                }

                var responseHash = _this._md5(responseText);
                if (!device || responseHash !== device.responseHash && device.fromAddress === headers.fromAddress) {
                    var responseXml = _this._xmlParser.parseFromString(responseText);
                    var root = _this._xmlParser.getElement(responseXml, 'root');

                    if (root == null) {
                        if (attempt < 3) return _this.create(location, headers, device, Number(attempt) + 1);else return Promise.reject('device at location ' + location + ' sent 3 bad responses in a row, giving up.');
                    }

                    var base = _this._xmlParser.getText(root, 'baseUrl');
                    var deviceXml = _this._xmlParser.getElement(root, 'device');

                    if (!deviceXml) return Promise.reject('device at location ' + location + ' contained no device information in its xml description.');

                    _this.parseDeviceXml(device, deviceXml, base, location, headers.serverIP);

                    device.upnpVersion = new UPnPVersion();
                    device.upnpVersion.major = _this._xmlParser.getText(root, 'specVersion major');
                    device.upnpVersion.minor = _this._xmlParser.getText(root, 'specVersion minor');

                    device.address = _this._urlProvider.createUrl(base || _this._urlProvider.createUrl(location).origin);
                    device.fromAddress = headers.fromAddress;
                    device.ssdpDescription = _this._urlProvider.createUrl(location);
                    device.responseHash = responseHash;
                    device.serverIP = headers.serverIP;
                }

                return device;
            });
        }
    }, {
        key: 'parseDeviceXml',
        value: function parseDeviceXml(device, deviceXml, base, location, serverIP) {
            var _this2 = this;

            device.serialNumber = this._xmlParser.getText(deviceXml, 'serialNumber');
            device.webPage = this._xmlParser.getText(deviceXml, 'presentationURL');
            device.name = this._xmlParser.getText(deviceXml, 'friendlyName');
            device.id = this._xmlParser.getText(deviceXml, 'UDN').replace(/uuid\:/, '');

            device.type = new UPnPExtensionInfo();
            device.type.setFromString(this._xmlParser.getText(deviceXml, 'deviceType'));
            device.manufacturer = new DeviceManufacturer();
            device.manufacturer.name = this._xmlParser.getText(deviceXml, 'manufacturer');
            device.manufacturer.url = this._xmlParser.getText(deviceXml, 'manufacturerURL');
            device.model = new DeviceModel();
            device.model.number = this._xmlParser.getText(deviceXml, 'modelNumber');
            device.model.description = this._xmlParser.getText(deviceXml, 'modelDescription');
            device.model.name = this._xmlParser.getText(deviceXml, 'modelName');
            device.model.url = this._xmlParser.getText(deviceXml, 'modelUrl');
            device.upc = this._xmlParser.getText(deviceXml, 'UPC');
            device.capabilities = new Capabilities();

            //todo: move these to somehow be on the service and not the device
            if (device.model.name === Constants.ModelNames.MatchStick || device.model.name === Constants.ModelNames.Chromecast || device.model.name === Constants.ModelNames.Firestick) {
                device.capabilities.mirror = true;
                device.capabilities.audio = true;
                device.capabilities.video = true;
                device.capabilities.image = true;
            } else if (Constants.DeviceTypes.MediaServer === device.type.raw) device.capabilities.server = true;else if (Constants.DeviceTypes.WFA === device.type.raw) device.capabilities.router = true;

            var iconsXml = this._xmlParser.getElements(deviceXml, 'iconList icon');

            iconsXml.forEach(function (iconXml) {
                var icon = new Icon();
                icon.mimeType = _this2._xmlParser.getText(iconXml, 'mimetype');
                icon.width = _this2._xmlParser.getText(iconXml, 'width');
                icon.height = _this2._xmlParser.getText(iconXml, 'height');
                icon.depth = _this2._xmlParser.getText(iconXml, 'depth');
                icon.url = _this2._urlProvider.toUrl(_this2._xmlParser.getText(iconXml, 'url'), location, base);

                device.icons.push(icon);
            });

            var servicesXml = this._xmlParser.getElements(deviceXml, 'serviceList service');

            servicesXml.forEach(function (serviceXml) {
                var serviceInfo = new ServiceInfo();
                serviceInfo.controlUrl = _this2._urlProvider.toUrl(_this2._xmlParser.getText(serviceXml, 'controlURL'), location, base);
                serviceInfo.eventSubUrl = _this2._urlProvider.toUrl(_this2._xmlParser.getText(serviceXml, 'eventSubURL'), location, base);
                serviceInfo.scpdUrl = _this2._urlProvider.toUrl(_this2._xmlParser.getText(serviceXml, 'SCPDURL'), location, base);
                serviceInfo.id = new UPnPExtensionInfo();
                serviceInfo.id.setFromString(_this2._xmlParser.getText(serviceXml, 'serviceId'));
                serviceInfo.type = new UPnPExtensionInfo();
                serviceInfo.type.setFromString(_this2._xmlParser.getText(serviceXml, 'serviceType'));
                serviceInfo.serverIP = serverIP;

                if (ServiceInfo.scpdUrl != null && typeof serviceInfo.scpdUrl === 'object') serviceInfo.hash = _this2._md5(serviceInfo.scpdUrl.href);else serviceInfo.hash = _this2._md5(serviceInfo.id.raw);

                device.services.push(serviceInfo);
            });

            var childDevices = this._xmlParser.getElements(deviceXml, 'deviceList device');

            childDevices.forEach(function (childDeviceXml) {
                return device.childDevices.push(_this2.parseDeviceXml(new Device(), childDeviceXml, base, location, serverIP));
            });
        }
    }]);

    return DeviceFactory;
})();

module.exports = DeviceFactory;