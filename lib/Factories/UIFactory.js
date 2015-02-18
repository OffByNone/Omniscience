const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const Emitter = require('sdk/event/core'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const { DeviceServicesFactory } = require("./DeviceServicesFactory");
const { FilePickerFactory } = require('./FilePickerFactory');
const { Panel } = require('../UI/Panel');
const { Button } = require('../UI/Button');

const UIFactory = Class({
	initialize: function(){
        this._deviceServicesFactory = new DeviceServicesFactory();
	},
    createPanel: function createPanel(){
        return new Panel(new FilePickerFactory(), this._deviceServicesFactory.createDeviceServices(), Emitter);
    },
    createButton: function createButton(){
        return new Button(Emitter);
    }
});

exports.UIFactory = UIFactory;