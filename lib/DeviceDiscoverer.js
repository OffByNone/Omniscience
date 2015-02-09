const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const constants = require('./Constants');

const DeviceDiscoverer = Class({
	extends: EventTarget,
	initialize: function initialize(ssdp, emitter, deviceFactory) {
        this._ssdp = ssdp;
        this._emitter = emitter;
        this._deviceFactory = deviceFactory;
        
		this._ssdp.on('deviceResponse', (headers) => {
			var type = this._getURN(headers);

			//if (type === 'unknown')
				//console.log(headers.ST);
            //todo: this is broken, seems to think everything is unknown

			this._deviceFactory.createDevice(headers.LOCATION, headers).then((device) => {
				if(device === null) return;
				device.on('additionalInformationFound', () => this._emitter.emit(this, 'additionalInformationFound', device));
				this._emitter.emit(this, 'deviceFound', device);
			});
		});
		this._ssdp.on('error', (error) => {
			console.error(error);
			//console.trace(error);
		});
	},
	discover: function discover() {
		this._ssdp.search(constants.SSDPServiceType);
	},
	stop: function stop() {
		this._ssdp.stopSearch();
	},
	_getURN: function(headers){
		for(var name in constants.UniformResourceNames)
			for(var property in headers)
				if (headers[property].indexOf(constants.UniformResourceNames[name]) >= 0) return constants.UniformResourceNames[name];

		return 'unknown';
	}
});

/**
 * 
 */
exports.DeviceDiscoverer  = DeviceDiscoverer ;