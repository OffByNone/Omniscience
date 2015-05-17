const Constants = require('../Utilities/Constants');

class Tab {
	constructor(serviceExecutor, eventer, tabs, filePicker, fileSharer, subscriptionService, tcpSender) {
        this._tabs = tabs;
        this._pageWorker = null;
        this._eventer = eventer;
        this._serviceExecutor = serviceExecutor;
        this._filePicker = filePicker;
        this._fileSharer = fileSharer;
        this._subscriptionService = subscriptionService;
        this._tcpSender = tcpSender;
    }
    emit(eventName, ...eventParams){
        if(this._pageWorker)
            this._pageWorker.port.emit(...this._makeSafeForEmit(eventName, ...eventParams));
    }
    openFocus() {
        if (this._pageWorker) return this._pageWorker.tab.activate();

        this._tabs.open({
            url: Constants.tab.html,
            onLoad: (tab) => {
                this._pageWorker = tab.attach({
                    contentScriptFile: Constants.tab.js
                });
                this._pageWorker.port.on('chooseFiles', (uniqueId) => {
                    this._filePicker.openFile().then( files => {
                        this.emit('emitResponse', uniqueId, files ? files : []);
                    });
                });
                this._pageWorker.port.on('shareFile', (uniqueId, file, serverIP) => {
                    var result = this._fileSharer.shareFile(file, serverIP);
                    this.emit('emitResponse', uniqueId, result);
                });
                this._pageWorker.port.on('CallService', (uniqueId, service, serviceMethod, data) =>
                    this._serviceExecutor.callService(service.controlUrl, service.hash, serviceMethod, data).
						then((response) => this.emit("CallServiceResponse", uniqueId, response)));
                this._pageWorker.port.on('Subscribe', (uniqueId, subscriptionUrl, subscriptionId, serviceHash, serverIP, timeout) =>
                	this._subscriptionService.subscribe(subscriptionUrl, subscriptionId, serviceHash, serverIP, timeout).
						then((eventSubscriptionId) => this.emit("emitResponse", uniqueId, eventSubscriptionId)));
                this._pageWorker.port.on('Unsubscribe', (uniqueId, subscriptionUrl, subscriptionId, serviceHash) =>
                	this._subscriptionService.unsubscribe(subscriptionUrl, subscriptionId, serviceHash).
						then(() => this.emit("emitResponse", uniqueId)));
                this._eventer.on('subscriptionService.UPnPEvent', ( serviceHash, requestBody ) => {
                    this.emit('UPnPEvent', serviceHash, requestBody);
                });
                this._pageWorker.port.on('sendTCP', (uniqueId, hostname, port, data, waitForResponse) =>
                	this._tcpSender.send(hostname, port, data, waitForResponse).
						then((response) => this.emit("emitResponse", uniqueId, response)));

                this._pageWorker.port.on('saveState', (uniqueId, deviceId, serviceName, state) => this._eventer.emit("tab.updateState", deviceId, serviceName, state));
                this._pageWorker.port.on('refreshDevices', () => this._eventer.emit("tab.refreshDevices"));
                this._pageWorker.port.on('loadDevices', () => this._eventer.emit("tab.loadDevices"));
            },
            onClose: (tab) => {
                this._pageWorker = null;
            }
        });
    }
    _makeSafeForEmit() {
        //The panel serializes out the data object using the below two lines
        //the tab does not, therefore the same data sent to both will not appear the same unless we add the below lines
        var replacer = (key, value) => typeof (value) === "function" ? void (0) : value;

        return Array.prototype.map.call(arguments, (argument) => JSON.parse(JSON.stringify(argument, replacer)));
    }
}

module.exports = Tab;