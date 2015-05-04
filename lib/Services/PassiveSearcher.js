const { EventTarget } = require('sdk/event/target'); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target

const Constants = require('../Utilities/Constants');

class PassiveSearcher extends EventTarget{
    constructor(emitter, timers, md5, ssdpClients) {
        this._deviceInfo = {};
        this._debounceTimeout = 1500; //time in milliseconds to wait before considering a notify as a devicefound vs an addResponseHeaders
        this._emitter = emitter;
        this._timers = timers;
        this._md5 = md5;
        this._ssdpClients = ssdpClients;

        this._initializeSSDPClients();
    }
    _initializeSSDPClients(){
        this._ssdpClients.forEach( (ssdpClient) => {
            ssdpClient.joinMulticast();
            ssdpClient.on('error', error => this._error(error));
            ssdpClient.on('messageReceived', headers => {
                if(headers.ST === Constants.PeerNameResolutionProtocolST)
                    return;//this is a Microsoft thing to resolve names on ipv6 networks and in this case just causes problems
                if(!headers.NTS) return;

                var nts = headers.NTS.toLowerCase();

                if(nts === "ssdp:update" || nts === "ssdp:alive"){
                    var id = this._md5(headers.LOCATION);
                    var deviceInfo = this._deviceInfo[id];

                    if(!deviceInfo){
                        this._deviceInfo[id] = {};
                        deviceInfo = this._deviceInfo[id];
                    }

                    var lastResponseTime = deviceInfo.lastResponseTime || 0;
                    deviceInfo.lastResponseTime = Date.now();

                    if(deviceInfo.responseTimeout) this._timers.clearTimeout(deviceInfo.responseTimeout);

                    var waitTime = Number(headers["CACHE-CONTROL"].split("=")[1].trim()) * 1000; //will come in seconds, need to turn it into milliseconds
                    deviceInfo.responseTimeout = this._timers.setTimeout(() => this._removeStaleDevice(id, headers), waitTime);

                    if(lastResponseTime >= (Date.now() - this._debounceTimeout))
                        this._emitter.emit(this, 'addResponseHeaders', headers);
                    else
                        this._emitter.emit(this, 'deviceFound', headers);
                }
                else if(nts === "ssdp:byebye")
                    this._emitter.emit(this, "deviceLost", headers);
            });
        });

    }
    _removeStaleDevice(id, headers){
        //this._emitter.emit(this, "deviceLost", headers);
        //delete this._deviceInfo[id]; //remove lost device info
    }
    _error(error){
        console.log(error);
        //console.trace(error);
    }
}

module.exports = PassiveSearcher;