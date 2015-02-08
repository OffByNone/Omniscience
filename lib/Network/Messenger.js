const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Messenger = Class({
	extends: EventTarget,
	port: 8881,
	responseTimeout: 5000,
	protocolVersion: '1.0',
	initialize: function initialize(transportService, emitter, timers) {
        this.transportService = transportService;
        this._timers = timers;
        this._emitter = emitter;
	},
	send: function send(data, address) {
		transportService = new TransportService({ip: address.hostname, port: this.port});
		transportService.send(data);
		if (data.data.command === 'query') {
			transportService.on('dataReceived', (data) => {
				data = data.slice(data.length.toString().length + 1);//data will start with the length of the string plus a ":" then the actual JSON Object
				this._emitter.emit(this, 'responseReceived', JSON.parse(data));
				transportService.close();
			});
			this._timers.setTimeout(() => {
				try {
					transportService.close();
					throw new Error('Device did not respond within the specified timeout of ' + (this.responseTimeout / 1000) + ' seconds');
				}
				catch (e) {
					//already closed, meaning we already got the response
					//nothing to see here, move along
				}
			}, this.responseTimeout);
		}
		else
			transportService.close();
	}
});

/**
 * TCP messages
 */
exports.Messenger = Messenger;
