const MessageFactory = function MessageFactory() {
	this.build = function build(command, type, extraData, protocolVersion) {
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
	};
};

/**
 *
 */
exports.MessageFactory = MessageFactory;
