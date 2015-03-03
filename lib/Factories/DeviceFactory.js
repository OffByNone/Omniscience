const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { URL } = require('sdk/url'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/url
const { defer } = require('sdk/core/promise'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/core_promise
const { Request } = require('sdk/request'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/request
const Emitter = require('sdk/event/core'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const { JXON } = require('../JXON');
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
	initialize: function initialize() {
		this._DOMParser = componentFactory.createDOMParser();
		this._jxon = JXON;
		this._request = Request;
		this._defer = defer;
        this._messageFactory = new MessageFactory();
        var deviceServicesFactory = new DeviceServicesFactory();
        this._deviceServices = deviceServicesFactory.createDeviceServices();
        this.serviceList = {};
	},
	createDevice: function createDevice(location, headers) {
        if (location.indexOf("http") != 0)
		  location = "http://" + location; //fuck you microsoft
        var deferred = this._defer();
        this._request({
            url: location,
            onComplete: (response) => {
                var responseXML = this._DOMParser.parseFromString(response.text, 'text/xml');
                var responseObj = JXON.build(responseXML);
                
                if(typeof responseObj.root === 'undefined')
                {
                    console.group();
                    console.warn("Response was malformed, responseObj.root is undefined.");
                    console.warn(response);
                    console.warn(responseObj);
                    console.groupEnd();
                    deferred.resolve(null);
                    return;                    
                }
                
                var device;
                
                if(responseObj.root.device.modelname === constants.ModelNames.MatchStick)
                    device = this._createMatchStick();
                else if(responseObj.root.device.modelname === constants.ModelNames.Chromecast)
                    device = this._createChromecast();
                else if(responseObj.root.device.modelname === constants.ModelNames.Firestick)
                    device = this._createFirestick();
                else if(constants.DeviceTypes.some(x=> x[0] === 'Media Renderer' &&  x[1] === responseObj.root.device.devicetype))
                    device = this._createMediaRenderer();
                else
                    device = this._createGenericDevice();
                
                device.rawResponse = responseObj.root;
                var base = responseObj.root.baseurl || new URL(location).origin;
                device.address = new URL(base);
                device.ssdpDescription = new URL(location);
                device.upnpVersion = responseObj.root.specversion.major + '.' + responseObj.root.specversion.minor;
                device.serialNumber = responseObj.root.device.serialnumber;
                device.webPage = responseObj.root.device.presentationurl;
                device.type = {
                    urn: responseObj.root.device.devicetype,
                    name: constants.DeviceTypes.filter(x=> x[1] === responseObj.root.device.devicetype).map(x=> x[0])[0]
                };
                device.name = responseObj.root.device.friendlyname;
                device.manufacturer = {
                    name: responseObj.root.device.manufacturer,
                    url: responseObj.root.device.manufacturerurl
                };
                device.model = {
                    number: responseObj.root.device.modelnumber,
                    description: responseObj.root.device.modeldescription,
                    name: responseObj.root.device.modelname,
                    url: responseObj.root.device.modelurl,
                };
                device.udn = responseObj.root.device.udn
                
                if (!responseObj.root.device.iconlist || !responseObj.root.device.iconlist.icon)
                    device.icons = [];
                else if (Array.isArray(responseObj.root.device.iconlist.icon)) {
                    device.icons = responseObj.root.device.iconlist.icon.map(x=> {
                        return {
                            mimeType: x.mimetype,
                            width: x.width,
                            height: x.height,
                            depth: x.depth,
                            url: this._toURL(base, x.url, location)
                        };
                    });
                }
                else if (typeof responseObj.root.device.iconlist.icon === 'object') {
                    device.icons = [];
                    device.icons.push({
                        mimeType: responseObj.root.device.iconlist.icon.mimetype,
                        width: responseObj.root.device.iconlist.icon.width,
                        height: responseObj.root.device.iconlist.icon.height,
                        depth: responseObj.root.device.iconlist.icon.depth,
                        url: this._toURL(base, responseObj.root.device.iconlist.icon.url, location)
                    });
                }
                if (!responseObj.root.device.servicelist || !responseObj.root.device.servicelist.service)
                    device.services = [];
                else if (Array.isArray(responseObj.root.device.servicelist.service)) {
                    device.services = responseObj.root.device.servicelist.service.map(x=> {
                        return {
                            controlUrl: this._toURL(base, x.controlurl, location),
                            eventSubUrl: this._toURL(base, x.eventsuburl, location),
                            scpdUrl: this._toURL(base, x.scpdurl, location),
                            id: x.serviceid,
                            type: {
                                urn: x.servicetype,
                                name: constants.ServiceTypes.filter(y=> y[1] === x.servicetype).map(y=> y[0])[0]
                            }
                        };
                    });
                }
                else if (typeof responseObj.root.device.servicelist.service === 'object') {
                    device.services = [];
                    device.services.push({
                        controlUrl: this._toURL(base, responseObj.root.device.servicelist.service.controlurl, location),
                        eventSubUrl: this._toURL(base, responseObj.root.device.servicelist.service.eventsuburl, location),
                        scpdUrl: this._toURL(base, responseObj.root.device.servicelist.service.scpdurl, location),
                        id: responseObj.root.device.servicelist.service.serviceid,
                        type: {
                            urn: responseObj.root.device.servicelist.service.servicetype,
                            name: constants.ServiceTypes.filter(x=> x[1] === responseObj.root.device.servicelist.service.servicetype).map(x=> x[0])[0]
                        }
                    });
                }
                
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
                    var responseJSON;
                    //todo: remove the try catch and the childNodes[0]
                    try {
                        responseJSON = JXON.build(responseXML.childNodes[0]);
                    }
                    catch (e) {
                        console.warn(response);
                        return;
                    }
                    var serviceObj = {};
                    serviceObj.scpdUrl = service.scpdUrl.href;
                    serviceObj.name = service.type.name;
                    if(responseJSON.specversion)
                        serviceObj.version = responseJSON.specversion.major + '.' + responseJSON.specversion.minor;
                    else
                        serviceObj.version = "1.0";
                    serviceObj.methods = responseJSON.actionlist;
                    serviceObj.properties = responseJSON.servicestatetable;
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
        if (!path || path === '/ssdp/notfound')
		  return null;

        if(path.charAt(0) !== "/")
            return new URL(location + path);
        
        return new URL(baseUrl + path);
    }
});

exports.DeviceFactory = DeviceFactory;