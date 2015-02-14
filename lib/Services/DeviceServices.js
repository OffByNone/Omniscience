const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const constants = require('../Constants');

const DeviceServices = Class({
    initialize: function initialize(matchstickService, chromecastService, firestickService, genericDeviceService){
        this[constants.Services.MatchStick] = matchstickService;
        this[constants.Services.Chromecast] = chromecastService;
        this[constants.Services.Firestick] = firestickService;
        this[constants.Services.GenericDevice] = genericDeviceService;
    }
});

exports.DeviceServices = DeviceServices;