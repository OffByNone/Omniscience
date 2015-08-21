window.omniscience.factory('matchstickMessageGenerator', function matchstickMessageGenerator() {
	"use strict";
	return {
		build(command, type, extraData, protocolVersion) {
			var message = {
				data: {
					command: command,
					type: type
				},
				message_type: 'command',
				meta: { reply: (command === 'query') },
				protocol_version: protocolVersion || '1.0'
			};

			for (var data in extraData)
				message.data[data] = extraData[data];
			var messageStr = JSON.stringify(message);
			messageStr = messageStr.length + ":" + messageStr;
			return messageStr;
		},
		buildv2(command, parameters, protocolVersion) {
			var message = {
				protocol_version: protocolVersion || '1.0',
				message_type: 'command',
				meta: { reply: (command === 'query') },
				data: { command, parameters }
			};

			var messageStr = JSON.stringify(message);
			messageStr = messageStr.length + ":" + messageStr;
			return messageStr;
		}
	};
});