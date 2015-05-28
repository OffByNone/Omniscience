var PubSub = {
	_subscriptions: {},
	_frontEndBridge: {},
	sub: function (eventType, callback) {
		this._subscriptions[eventType] = this._subscriptions[eventType] || [];
		this._subscriptions[eventType].push(callback);
	},
	pub: function (eventType, ...data) {
		var messageObj = { eventType, data: this._makeSafeForEmit(...data) };

		if (this._frontEndBridge.postMessage) this._frontEndBridge.postMessage(JSON.stringify(messageObj));
		this._backendPub(eventType, ...data); //need this to not create an infinite loop with the frontEndBridge.postMessage
	},
	initializeFrontEndBridge: function (frontEndBridge) {
		this._frontEndBridge.postMessage = frontEndBridge.postMessage;

		frontEndBridge.on("message", (message) => {
			var messageObj;
			try {
				messageObj = JSON.parse(message);
			}
			catch (err) {
				//console.log(message);
				console.log(err);
				return;
			}
			this._backendPub(messageObj.eventType, ...messageObj.data);
		});
	},
	closeFrontEndBridge: function () {
		for (let prop in this._frontEndBridge)
			delete this._frontEndBridge[prop];
	},
	_backendPub: function (eventType, ...data) {
		if (!Array.isArray(this._subscriptions[eventType])) return; //nobody has subscribed yet, just return
		this._subscriptions[eventType].forEach(subscriptionCallback => subscriptionCallback(...data));
	},
	_makeSafeForEmit: function (...args) {
		//The panel serializes out the data object using the below two lines
		//the tab does not, therefore the same data sent to both will not appear the same unless we add the below lines
		var replacer = (key, value) => typeof (value) === "function" ? void (0) : value;

		return args.map(argument => JSON.parse(JSON.stringify(argument, replacer)));
	}
}

module.exports = PubSub;