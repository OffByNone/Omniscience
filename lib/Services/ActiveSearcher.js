const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Constants');

const ActiveSearcher = Class({
    extends: EventTarget,
    _devices: [], //SSDP response headers not the actual device
    _ssdpClients: [],
    _searchTimeout: null,
    _alreadyFoundInCurrentSearch: {},
    initialize: function initialize(utilities, emitter, timers, md5, ssdpFactory) {
        this._ssdpFactory = ssdpFactory;
        this._utilities = utilities;
        this._emitter = emitter;
        this._timers = timers;
        this._md5 = md5;

        this._initializeSSDPClients();
    },
    search: function search() {
        if (this._searchTimeout) {
            //if there is a currently running search
            this._timers.clearTimeout(this._searchTimeout);
            this._searchTimeout = null;
        }
        this._searchTimeout = this._timers.setTimeout(() => this._removeStaleDevices(), 5000);
        this._ssdpClients.forEach(ssdpClient => ssdpClient.search(Constants.SSDPServiceType));
    },
    _initializeSSDPClients: function _initializeSSDPClients(){
        var adapters = this._utilities.getMyIPAddresses();
        //ip addresses your machine has.  Bind all to search on all network interfaces

        var shouldBind = adapters.length > 1;// If there is only one adapter no reason to bind to it.
        //on my nexus 7 the only adapter I find is 127.0.0.1.  If we bind it will only ever search for devices/services
        //that are running on my device.  If we don't bind it will search using its network adapter (A.K.A. work)

        adapters.forEach(adapter => {
            var ssdpClient = this._ssdpFactory.createSSDP();
            if(shouldBind) ssdpClient.setMulticastInterface(adapter);
            ssdpClient.joinMulticast();
            ssdpClient.on('error', error => this._error(error));
            ssdpClient.on('deviceResponse', headers => {
                if(headers.ST === Constants.PeerNameResolutionProtocolST)
                    return;//this is a Microsoft thing to resolve names on ipv6 networks and in this case just causes problems

                headers.md5Hash = this._md5(headers.LOCATION);
                this._alreadyFoundInCurrentSearch[headers.md5Hash] = true;

                if(this._devices.some(device => device.md5Hash === headers.md5Hash)){
                    this._emitter.emit(this, "addResponseHeaders", headers);
                    return;
                }

                this._devices.push(headers);
                this._emitter.emit(this, "deviceFound", headers);
            });

            this._ssdpClients.push(ssdpClient);
        });

    },
    _removeStaleDevices: function _removeStaleDevices() {
        for (var i = 0; i < this._devices.length; i++ ){
            if(!this._alreadyFoundInCurrentSearch[this._devices[i].md5Hash]){
                var staleDevice = this._devices.splice(i,1)[0];
                this._emitter.emit(this, "deviceLost", staleDevice);
                i--;
            }
        }
        this._alreadyFoundInCurrentSearch = {};
    },
    _error: function _error(error){
        console.error(error);
    }
});

module.exports = ActiveSearcher;