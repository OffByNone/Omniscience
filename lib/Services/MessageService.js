const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const MessageService = Class({
	extends: EventTarget,
	port: 8881,
	responseTimeout: 5000,
	initialize: function initialize(transportServiceFactory, emitter, timers) {
		this._transportServiceFactory = transportServiceFactory;
		this._emitter = emitter;
		this._timers = timers;
	},
	send: function send(data, address) {
        var transportService = this._transportServiceFactory.createTransportService();
        transportService.open(address, this.port);
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
module.exports = MessageService;
