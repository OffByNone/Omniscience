const Constants = require('../Utilities/Constants');

class Tab {
	constructor(pubSub, tabs) {
		this._tabs = tabs;
		this._pageWorker = null;
		this._pubSub = pubSub;

		this._pubSub.sub('button.click', () => {
			this._pubSub.pub('refreshDevices');
			this.openFocus();
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
				this._pubSub.initializeFrontEndBridge(this._pageWorker);
			},
			onClose: (tab) => {
				this._pageWorker = null;
				this._pubSub.closeFrontEndBridge();
			}
		});
	}
}

module.exports = Tab;