const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { merge } = require("sdk/util/object"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/util_object
const { emit } = require('sdk/event/core'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/event/core.html
const { EventTarget } = require("sdk/event/target"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const { TransportService } = require("./transportService");
const timers = require("sdk/timers");

const Message = Class({
    extends: EventTarget,
    port: 8881,
    responseTimeout: 5000,
    protocolVersion: "1.0",
    initialize: function initialize(options) {
      EventTarget.prototype.initialize.call(this, options);
      merge(this, options);
    },
    build: function build(command, type, extraData){
      var message = {
        data: {
          command: command,
          type: type
        },
        message_type: "command",
        meta: { reply: (command === "query") },
        protocol_version: this.protocolVersion
      };

      for (var data in extraData)
        message.data[data] = extraData[data];

      return message;
    },
    send: function send(data, address){
      transportService = new TransportService({ip: address.hostname, port: this.port});
      transportService.send(data);
      if(data.data.command === "query"){
        transportService.on("dataReceived", (data) => {
          data = data.slice(data.length.toString().length + 1);//data will start with the length of the string plus a ":" then the actual JSON Object
          emit(this, "responseReceived", JSON.parse(data));
          transportService.close();
        });
        timers.setTimeout(() => {
          try{
            transportService.close();
            throw new Error("Device did not respond within the specified timeout of " + (this.responseTimeout/1000) + " seconds");
          }
          catch(e){
            //already closed, meaning we already got the response
            //nothing to see here, move along
          }
        }, this.responseTimeout);
      }
      else
        transportService.close();
    }
});

  exports.Message = Message;
