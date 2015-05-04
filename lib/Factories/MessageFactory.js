const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const MessageFactory = Class({
    initialize: function(){ },
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
    }
});

/**
 *
 */
module.exports = MessageFactory;
