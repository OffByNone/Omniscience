const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html
const { emit } = require('sdk/event/core'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/event/core.html
const { merge } = require("sdk/util/object"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/util_object
const { EventTarget } = require("sdk/event/target"); // https://developer.mozilla.org/en-US/Add-ons/SDK/Low-Level_APIs/event_target
const timers = require("sdk/timers"); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/timers

const Device = require("device");
const { SSDP } = require('ssdp');

const DeviceLocator = Class({
    extends: EventTarget,
    devices: [],
    _newDevices: [],
    _isSearching: false,
    _ssdp: new SSDP({sourcePort : -1}),

    initialize: function initialize(options) {
        EventTarget.prototype.initialize.call(this, options);
        merge(this, options);

        this._ssdp.on('deviceresponse', (headers) => {
            if(!this._isDIALDevice(headers)) return;

            Device.createDevice(headers.LOCATION).then((device) => {
                if(this._isSearching) this._newDevices.push(device);
                if(this.devices.some(x=> x.address.href === device.address.href)) return;
                this.devices.push(device);
                device.on("additionalInformationFound", ()=> {
                    emit(this, "updatedevice", device);
                });
                emit(this,'devicefound', device);
            });
        });
        this._ssdp.on('error', function (err,something, elses) {
            console.log(err);
        });
    },
    search: function search(){
        this._isSearching = true;
        if(this._searchTimeout){
          //if there is a currently running search
          timers.clearTimeout(this._searchTimeout);
          this._searchTimeout = null;
          this._newDevices = [];
        }
        this._ssdp.search("urn:dial-multiscreen-org:service:dial:1");
        this._searchTimeout = timers.setTimeout(() => this._removeLostDevices(), 2500);
    },
    stop: function stop(){
        this._ssdp.shutdown();
    },
    _isDIALDevice: function _isDIALDevice(headers) {
        for (var property in headers)
            if(headers[property].indexOf("urn:dial-multiscreen-org:service:dial:1") >= 0) return true;

        return false;
    },
    _removeLostDevices: function _removeLostDevices(){
        this._isSearching = false;
        this.devices.forEach(device => {
            if(this._newDevices.some(newDevice => device.address.href === newDevice.address.href))
              emit(this, "updatedevice", device);
            else{
                this.devices.splice(this.devices.indexOf(device), 1);
                emit(this, "removedevice", device);
            }
        });

        this._newDevices = [];
    }
});

exports.DeviceLocator = DeviceLocator;
