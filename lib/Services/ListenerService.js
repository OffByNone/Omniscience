const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');

const ListenerService = Class({
	extends: EventTarget,
	_ssdpClients: [],
	_deviceInfo: {},
	_debounceTimeout: 1500, //time in milliseconds to wait before considering a notify as a devicefound vs an addResponseHeaders
	initialize: function initialize(utilities, emitter, timers, md5, ssdpFactory) {
		this._ssdpFactory = ssdpFactory;
		this._utilities = utilities;
		this._emitter = emitter;
		this._timers = timers;
		this._md5 = md5;

		this._initializeSSDPClients();
	},
	_initializeSSDPClients: function _initializeSSDPClients(){
		var adapters = this._utilities.getMyIPAddresses();
		//ip addresses your machine has.  Bind all to search on all network interfaces

		adapters.forEach(adapter => {
			var ssdpClient = this._ssdpFactory.createSSDP(1900);
			ssdpClient.setMulticastInterface(adapter);
			ssdpClient.joinMulticast();
			ssdpClient.on('error', error => this._error(error));
			ssdpClient.on('deviceResponse', headers => {
				if(headers.ST === Constants.PeerNameResolutionProtocolST)
					return;//this is a Microsoft thing to resolve names on ipv6 networks and in this case just causes problems
				if(!headers.NTS) return;

				var nts = headers.NTS.toLowerCase();

				if(nts === "ssdp:update" || nts === "ssdp:alive"){
					var id = this._md5(headers.LOCATION);
					var deviceInfo = this._deviceInfo[id];

					if(!deviceInfo){
						this._deviceInfo[id] = {};
						deviceInfo = this._deviceInfo[id];
					}

					var lastResponseTime = deviceInfo.lastResponseTime || 0;
					deviceInfo.lastResponseTime = Date.now();

					if(deviceInfo.responseTimeout) this._timers.clearTimeout(deviceInfo.responseTimeout);

					var waitTime = Number(headers["CACHE-CONTROL"].split("=")[1].trim()) * 1000; //will come in seconds, need to turn it into milliseconds
					deviceInfo.responseTimeout = this._timers.setTimeout(() => this._removeStaleDevice(id, headers), waitTime);

					if(lastResponseTime >= (Date.now() - this._debounceTimeout))
						this._emitter.emit(this, 'addResponseHeaders', headers);
					else
						this._emitter.emit(this, 'deviceFound', headers);
				}
				else if(nts === "ssdp:byebye")
					this._emitter.emit(this, "deviceLost", headers);
			});

			this._ssdpClients.push(ssdpClient);
		});

	},
	_removeStaleDevice: function _removeStaleDevice(id, headers){
		//this._emitter.emit(this, "deviceLost", headers);
		//delete this._deviceInfo[id]; //remove lost device info
	},
	_error: function _error(error){
		console.log(error);
		//console.trace(error);
	}
});

module.exports = ListenerService;