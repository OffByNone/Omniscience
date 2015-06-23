const Constants = require('../Utilities/Constants');
const Eventable = require('../Eventable.js');

class Tab extends Eventable {
	constructor(tabs, button, frontEndBridge) {
		super();
		this._tabs = tabs;
		this._button = button;
		this._frontEndBridge = frontEndBridge;
		this._pageWorker = null;

		this._button.on('click', () => {
			this.openFocus();
			//todo: call deviceService.search in here
		});
	}
	openFocus() {
		if (this._pageWorker) return this._pageWorker.tab.activate();

		this._tabs.open({
			url: Constants.tab.html,
			onLoad: (tab) => {
				this._pageWorker = tab.attach({
					contentScriptFile: Constants.tab.js
				});

				this._pageWorker.on("message", (message) => {
					var messageObj;
					try {
						messageObj = JSON.parse(message);
					}
					catch (err) {
						console.log(message);
						console.log(err);
						return;
					}
					this._frontEndBridge.handleMessageFromFrontEnd(messageObj.eventType, ...messageObj.data);
					this._frontEndBridge.on("sendToFrontEnd", (eventType, ...data) => {

						var message = { eventType, data: this._makeSafeForEmit(...data) };
						this._pageWorker.postMessage(JSON.stringify(message));
					});
				});
			},
			onClose: (tab) => {
				this._pageWorker = null;
			}
		});
	}
	_makeSafeForEmit(...args) {
		//The panel serializes out the data object using the below two lines
		//the tab does not, therefore the same data sent to both will not appear the same unless we add the below lines
		var replacer = (key, value) => typeof (value) === "function" ? void (0) : value;

		return args.map(argument => JSON.parse(JSON.stringify(argument, replacer)));
	}
}

module.exports = Tab;