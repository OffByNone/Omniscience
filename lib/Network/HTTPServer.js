const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { emit } = require('sdk/event/core'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/event/core.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const { nsHttpServer, startServerAsync } = require("./httpd"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/test_httpd  http://mxr.mozilla.org/mozilla-central/source/netwerk/test/httpserver/nsIHttpServer.idl
const IOC = require("../IOC");
const dns  = require("./DNS");


const HTTPServer = Class({
	extends: EventTarget,

	initialize: function initialize() {
        this.server = new nsHttpServer();
	},
    start: function start(port){
        var hosts = dns.getMyIPAddresses();
        this.server.start(port, hosts);
    },
    registerDirectory: function registerDirectory(path, directoryPath){
        var localFile = IOC.createLocalFile();
        localFile.initWithPath(directoryPath);        
        this.server.registerDirectory(path, localFile);
    },
    registerFile: function registerFile(path, file){
        this.server.registerFile(path, file);
    }
});

exports.HTTPServer = HTTPServer;
