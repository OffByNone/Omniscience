const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const windowUtils = require("sdk/window/utils");

const { nsHttpServer } = require("../Network/httpd"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/test_httpd  http://mxr.mozilla.org/mozilla-central/source/netwerk/test/httpserver/nsIHttpServer.idl
const { JXON } = require('../JXON');

const { HTTPServer } = require("../Network/HTTPServer");
const ComponentFactory  = require("./ComponentFactory");
const utilities = require('../Utilities');
const { FilePicker } = require('../FilePicker');
const { Network } = require('../Entities/Network');
const { AccessPoint } = require('../Entities/AccessPoint');

const Factory = Class({
	initialize: function(){
        this._nsHttpServer = new nsHttpServer();
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