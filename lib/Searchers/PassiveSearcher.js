const Constants = require('../Utilities/Constants');

class PassiveSearcher {
    constructor(eventer, timers, md5, ssdpClients) {
        this._eventer = eventer;
        this._deviceInfo = {};
        this._debounceTimeout = 1500; //time in milliseconds to wait before considering a notify as a devicefound vs an addResponseHeaders
        this._timers = timers;
        this._md5 = md5;
        this._ssdpClients = ssdpClients;

        this._initializeSSDPClients();
    }
    _initializeSSDPClients(){
        this._ssdpClients.forEach( (ssdpClient) => {
            ssdpClient.joinMulticast();
            this._eventer.on(Constants.passiveEventPrefix + 'ssdpClient.error', error => this._error(error));
            this._eventer.on(Constants.passiveEventPrefix + 'ssdpClient.messageReceived', headers => {
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
                        this._eventer.emit('searcher.addResponseHeaders', headers);
                    else
                        this._eventer.emit('searcher.found', headers);
                }
                else if(nts === "ssdp:byebye")
                    this._eventer.emit("searcher.lost", headers);
            });
        });

    }
    _removeStaleDevice(id, headers) {
        //todo: implement
        //this._eventer.emit( "deviceLost", headers);
        //delete this._deviceInfo[id]; //remove lost device info
    }
    _error(error){
        console.log(error);
        //console.trace(error);
    }
}

module.exports = PassiveSearcher;