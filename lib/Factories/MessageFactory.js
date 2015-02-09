const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const Emitter = require('sdk/event/core'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const timers = require('sdk/timers'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers

const { Messenger } = require('../Network/Messenger');
const { TransporterFactory } = require('./TransporterFactory');


const MessageFactory = Class({
    initialize: function(){
        this._transporterFactory = new TransporterFactory();
    },
	build: function build(command, type, extraData, protocolVersion) {
		var message = {
			data: {
				command: command,
				type: type
			},
			message_type: 'command',
			meta: {reply: (command === 'query')},
			protocol_version: protocolVersion || '1.0'
		};

		for (var data in extraData)
			message.data[data] = extraData[data];

		return message;
	},
    createMessenger: function createMessenger(){
        return new Messenger(this._transporterFactory.createTransporter(), Emitter, timers);
    }
});

/**
 *
 */
exports.MessageFactory = MessageFactory;
