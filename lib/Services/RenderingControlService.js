const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');
const Utilities = require('../Utilities');

const RenderingControlService = Class({
	extends: EventTarget,
	initialize: function initialize(emitter, defer, soapService, subscriptionService, DOMParser) {
        this._emitter = emitter;
        this._soapService = soapService;
        this._defer = defer;
        this._subscriptionService = subscriptionService;
        this._serviceType = Constants.ServiceTypes.filter(y=> y[0] === "Rendering Control").map(y=> y[1])[0];
        this._DOMParser = DOMParser;

        this._subscriptionService.on( 'EventOccured', ( device, request ) => {
        	var event = this._parseEventRequest(request);
        	this._emitter.emit( this, 'EventOccured', device, event, request );
        });
	},
	getAdditionalInformation: function getAdditionalInformation(device){
		this.getMute(device).then( isMuted => {
			device.isMuted = isMuted;
			this._emitter.emit(this, "additionalInformationFound", device);
		});
		this.getVolume(device).then( volume => {
			device.volume = volume;
			this._emitter.emit(this, "additionalInformationFound", device);
		});
		this.listPresets(device).then( presets => {
			device.presets = presets;
			this._emitter.emit(this, "additionalInformationFound", device);
		});
		this.subscribe(device);
	},
	getMute: function getMute(device){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType),
                               this._serviceType, "GetMute", { InstanceID: device.instanceId, Channel: 'Master' }
                              ).then(response => {
                              			var isMuted = response.xml.querySelector("Envelope Body GetMuteResponse CurrentMute").innerHTML == 1;
                              			deferred.resolve(isMuted);
									});
        return deferred.promise;
    },
	getVolume: function getVolume(device){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType),
                                      this._serviceType, "GetVolume", { InstanceID: device.instanceId, Channel: 'Master' }
                                     ).then(response => {
                                     	var volume = (response.xml.querySelector("Envelope Body GetVolumeResponse CurrentVolume") || {}).innerHTML;
                                     	deferred.resolve(volume);
                                     });
        return deferred.promise;
    },
	listPresets: function listPresets(device){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType),
                               this._serviceType, "ListPresets", { InstanceID: device.instanceId }
                              ).then(response => {
                              	var presets = (response.xml.querySelector("Envelope Body ListPresetsResponse CurrentPresetNameList") || {}).innerHTML;
                              	presets = !presets ? [] : presets.split(",");
                              		deferred.resolve(presets);
								});
        return deferred.promise;
    },
	selectPresets: function selectPresets(device, presetName){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType),
                               this._serviceType, "SelectPresets", { InstanceID: device.instanceId, PresetName: presetName }
                              ).then(response => deferred.resolve(response));
        return deferred.promise;
    },
	setMute: function setMute(device, desiredMute){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType),
                               this._serviceType, "SetMute", { InstanceID: device.instanceId, Channel: 'Master', DesiredMute: desiredMute }
                              ).then(response => deferred.resolve(response));
        return deferred.promise;
    },
	setVolume: function setVolume(device, desiredVolume){
        var deferred = this._defer();
        this._soapService.post(Utilities.getControlUrl(device, this._serviceType),
                               this._serviceType, "SetVolume", { InstanceID: device.instanceId, Channel: 'Master', DesiredVolume: desiredVolume }
                              ).then(response => deferred.resolve(response));
        return deferred.promise;
    },
    subscribe: function subscribe(device){
    	var deferred = this._defer();
    	this._subscriptionService.subscribe(device, this._serviceType, 'renderingControl').then( response => deferred.resolve( response ) );
    	return deferred.promise;
    },
    unsubscribe: function unsubscribe(device){
    	var deferred = this._defer();
    	this._subscriptionService.subscribe( device, this._serviceType, 'renderingControl' ).then( response => deferred.resolve( response ) );
    	return deferred.promise;
    },
    _parseEventRequest: function _parseEventRequest(request){
    	var requestXML = this._DOMParser.parseFromString(request.body, 'text/xml');
    	var lastChanges = requestXML.querySelectorAll("propertyset property LastChange");
    	var instances = [];

    	Array.prototype.slice.call(lastChanges).map((lastChange)=>{
    		var eventString = lastChange.innerHTML.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');
    		var eventXML = this._DOMParser.parseFromString(eventString, 'text/xml');

    		var instancesXML = eventXML.querySelectorAll("InstanceID");
    		Array.prototype.slice.call(instancesXML).map((instanceXML)=>{
    			instance = {};
    			Array.prototype.slice.call(instanceXML.children).forEach(child => {
    				instance[child.tagName] = child.attributes.getNamedItem('val').value;
    			});
    			instances.push(instance);
    		});
    	});

    	return instances;
    }
});

exports.RenderingControlService = RenderingControlService;