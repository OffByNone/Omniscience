const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { URL } = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url
const { defer } = require('sdk/core/promise'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/core_promise
const { Request } = require('sdk/request'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/request
const Emitter = require('sdk/event/core'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const { MatchStickDevice } = require('../Entities/Devices/MatchStickDevice');
const { ChromecastDevice } = require('../Entities/Devices/ChromecastDevice');
const { FirestickDevice } = require('../Entities/Devices/FirestickDevice');
const { MediaRendererDevice } = require('../Entities/Devices/MediaRendererDevice');
const { GenericDevice } = require('../Entities/Devices/GenericDevice');

const { DeviceServicesFactory } = require('./DeviceServicesFactory');
const { MessageFactory } = require('./MessageFactory');
const componentFactory = require('./ComponentFactory');
const constants = require('../Constants');

const DeviceFactory = Class({
    extends: EventTarget,
	initialize: function initialize() {
		this._DOMParser = componentFactory.createDOMParser();
		this._request = Request;
		this._defer = defer;
        this._messageFactory = new MessageFactory();
        var deviceServicesFactory = new DeviceServicesFactory();
        this._deviceServices = deviceServicesFactory.createDeviceServices();
        this.serviceList = {};
        this._emitter = Emitter;
        this._deviceServices.on("additionalInfoFound", (device) => this._emitter.emit(this, "additionalInfoFound", device));
	},
	createDevice: function createDevice(location, headers) {
        if (location.indexOf("http") != 0)
		  location = "http://" + location; //fuck you microsoft
        var deferred = this._defer();
        this._request({
            url: location,
            onComplete: (response) => {
                var responseXML = this._DOMParser.parseFromString(response.text, 'text/xml');
                var root = responseXML.querySelector("root");
                
                if(root == null){
                    console.group();
                        console.warn("Response was malformed, responseObj.root is undefined.");
                        console.warn(response);
                        console.warn(responseXML);
                    console.groupEnd();
                    deferred.resolve(null);
                    return;                    
                }
                
                var base = (root.querySelector('baseUrl') || {}).innerHTML || new URL(location).origin;
                var device;
                
                var deviceXML = root.querySelector('device');
                if(deviceXML){
                    deviceTypeUrn = (deviceXML.querySelector('deviceType') || {}).innerHTML;
                    switch ((deviceXML.querySelector('modelName') || {}).innerHTML) {
                        case constants.ModelNames.MatchStick:
                            device = this._createMatchStick();
                            break;
                        case constants.ModelNames.Chromecast:
                            device = this._createChromecast();
                            break;
                        case constants.ModelNames.Firestick:
                            device = this._createFirestick();
                            break;
                        default:
                            if(constants.DeviceTypes.some(deviceType => deviceType[0] === 'Media Renderer' &&  deviceType[1] === deviceTypeUrn))
                                device = this._createMediaRenderer();
                            else
                                device = this._createGenericDevice();
                            break;
                    }

                    device.serialNumber = (deviceXML.querySelector('serialNumber') || {}).innerHTML;
                    device.webPage = (deviceXML.querySelector('presentationURL') || {}).innerHTML;
                    device.type = {
                        urn: deviceTypeUrn,
                        name: constants.DeviceTypes.filter(deviceType => deviceType[1] === deviceTypeUrn).map(deviceType => deviceType[0])[0]
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
                                    name: constants.ServiceTypes.filter( serviceType => serviceType[1] === (service.querySelector('serviceType') || {}).innerHTML).map( serviceType => serviceType[0])[0]
                                }
                            };
                        });
                    }
                }
                else device = {};
                
                var specVersion = root.querySelector('specVersion');
                if(specVersion) device.upnpVersion = (specVersion.querySelector('major') || {}).innerHTML + '.' + (specVersion.querySelector('minor') || {}).innerHTML;
                else device.upnpVersion = '1.0';
                
                device.rawDiscoveryInfo = responseXML;
                device.address = new URL(base);
                device.ssdpDescription = new URL(location);                            
                            
                //todo: add the devicelist item from the xml to the object
                this._getServiceInformation(device);
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

                    var serviceObj = {};
                    serviceObj.scpdUrl = service.scpdUrl.href;
                    serviceObj.name = service.type.name;
                    var specVersionXML = responseXML.querySelector("specVersion");
                    if(specVersionXML)
                        serviceObj.version = (specVersionXML.querySelector("major") || {}).innerHTML + '.' + (specVersionXML.querySelector("minor") || {}).innerHTML;
                    else
                        serviceObj.version = "1.0";
                    serviceObj.methods = (responseXML.querySelector("actionList") || {}).innerHTML;
                    serviceObj.properties = (responseXML.querySelector("serviceStateTable") || {}).innerHTML;
                    this.serviceList[service.type.urn] = serviceObj;
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
    _createDIALMultiscreen: function _createDIALMultiscreen(){
        return new DIALMultiscreenDevice();
    },
    _toURL: function _toURL(baseUrl, path, location) {
        //this will return null for undefined and not found paths
        if (!path || path.length === 0 || path === '/ssdp/notfound')
		  return null;

        if(path.charAt(0) !== "/")
            return new URL(location + path);
        
        return new URL(baseUrl + path);
    }
});

exports.DeviceFactory = DeviceFactory;