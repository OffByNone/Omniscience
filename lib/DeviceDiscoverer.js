const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { emit } = require('sdk/event/core'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/event/core.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const DIALDevice = require('./Entities/DIALDevice');
const { SSDP } = require('./Network/SSDP');
const constants = require('./Constants');

const DeviceDiscoverer = Class({
	extends: EventTarget,
	_ssdp: new SSDP({sourcePort: -1}),
	initialize: function initialize(options) {
		EventTarget.prototype.initialize.call(this, options);

		this._ssdp.on('deviceResponse', (headers) => {
			var type = this._getURN(headers);

			if (type === 'unknown') {
				console.log(headers.ST);
				return;
			}

			DIALDevice.createDevice(headers.LOCATION, type).then((device) => {
				if(device === undefined) return;
				device.on('additionalInformationFound', () => emit(this, 'additionalInformationFound', device));
				emit(this, 'deviceFound', device);
			});
		});
		this._ssdp.on('error', (error) => console.error(error));
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