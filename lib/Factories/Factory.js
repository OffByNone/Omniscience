const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const Emitter = require('sdk/event/core'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const timers = require('sdk/timers'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers
const windowUtils = require("sdk/window/utils");

const { nsHttpServer } = require("../Network/httpd"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/test_httpd  http://mxr.mozilla.org/mozilla-central/source/netwerk/test/httpserver/nsIHttpServer.idl
const { JXON } = require('../JXON');

const { Messenger } = require('../Network/Messenger');
const { HTTPServer } = require("../Network/HTTPServer");
const { SSDP } = require('../Network/SSDP');

const { TransporterFactory } = require('./TransporterFactory');
const ComponentFactory  = require("./ComponentFactory");
const { DeviceFactory } = require('./DeviceFactory');

const { DeviceDiscoverer } = require('../DeviceDiscoverer');
const { Searcher } = require('../Searcher');
const utilities = require('../Utilities');
const { FilePicker } = require('../FilePicker');

const { Network } = require('../Entities/Network');
const { AccessPoint } = require('../Entities/AccessPoint');

const Factory = Class({
	initialize: function(){
        this._deviceFactory = new DeviceFactory();
        this._nsHttpServer = new nsHttpServer();
	},
	createSearcher: function createSearcher() {
		return new Searcher(timers, Emitter, this.createDeviceDiscoverer());
	},
	createSSDP: function createSSDP(){
		return new SSDP(Emitter, ComponentFactory.createUDPSocket(), utilities);
	},
	createDeviceDiscoverer: function createDeviceDiscoverer(){
		return new DeviceDiscoverer(this.createSSDP(), Emitter, this._deviceFactory);
	},
    createHttpServer: function createHttpServer(){
        return new HTTPServer(this._nsHttpServer, utilities);
    },
    createJXON: function createJXON(){
        return JXON;
    },
    createAccessPoint: function createAccessPoint(){
        return new AccessPoint();
    },
    createNetwork: function createNetwork(){
        return new Network();
    },
    createFilePicker: function createFilePicker(){
        return new FilePicker(ComponentFactory.createFilePicker(), windowUtils.getMostRecentBrowserWindow());
    }
});

exports.Factory = Factory;