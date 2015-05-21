var PubSub = {
	_subscriptions: {},
	_bridge: {},
	sub: function (eventType, callback) {
		this._subscriptions[eventType] = this._subscriptions[eventType] || [];
		this._subscriptions[eventType].push(callback);
		if (this._bridge.port) this._bridge.port.on(eventType, callback);
	},
	pub: function (eventType, ...eventParams) {
		if (this._bridge.port) this._bridge.port.emit(...this._makeSafeForEmit(eventType, ...eventParams)); //always send to the bridge as they cant register with us
		if (!Array.isArray(this._subscriptions[eventType])) return; //nobody has subscribed yet, just return
		this._subscriptions[eventType].forEach(subscriptionCallback => subscriptionCallback(...eventParams));
	},
	initializeBridge: function (bridge) {
		for (let prop in bridge)
			this._bridge[prop] = bridge[prop];

		for (let eventType in this._subscriptions)
			this._subscriptions[eventType].forEach(callback => this._bridge.port.on(eventType, callback));
	},
	closeBridge: function () {
		for (let prop in this._bridge)
			delete this._bridge[prop];
	},
	_makeSafeForEmit: function (...args) {
		//The panel serializes out the data object using the below two lines
		//the tab does not, therefore the same data sent to both will not appear the same unless we add the below lines
		var replacer = (key, value) => typeof (value) === "function" ? void (0) : value;

		return args.map( argument => JSON.parse(JSON.stringify(argument, replacer)));
	}
}

module.exports = PubSub;