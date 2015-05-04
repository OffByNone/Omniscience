const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Utilities/Constants');

class ActiveSearcher extends EventTarget {
    constructor(emitter, timers, md5, ssdpClients) {
        this._emitter = emitter;
        this._timers = timers;
        this._md5 = md5;
        this._ssdpClients = ssdpClients;
        this._devices = []; //SSDP response headers not the actual device
        this._searchTimeout = null;
        this._alreadyFoundInCurrentSearch = {};

        this._initializeSSDPClients();
    }
    search() {
        if (this._searchTimeout) {
            //if there is a currently running search
            this._timers.clearTimeout(this._searchTimeout);
            this._searchTimeout = null;
        }
        this._searchTimeout = this._timers.setTimeout(() => this._removeStaleDevices(), 5000);
        this._ssdpClients.forEach(ssdpClient => ssdpClient.search(Constants.SSDPServiceType));
    }
    _initializeSSDPClients(){
        this._ssdpClients.forEach( (ssdpClient) => {
            ssdpClient.joinMulticast();
            ssdpClient.on('error', error => this._error(error));
            ssdpClient.on('messageReceived', headers => {
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
        });

    }
    _removeStaleDevices() {
        for (var i = 0; i < this._devices.length; i++ ){
            if(!this._alreadyFoundInCurrentSearch[this._devices[i].md5Hash]){
                var staleDevice = this._devices.splice(i,1)[0];
                this._emitter.emit(this, "deviceLost", staleDevice);
                i--;
            }
        }
        this._alreadyFoundInCurrentSearch = {};
    }
    _error(error){
        console.error(error);
    }
}

module.exports = ActiveSearcher;