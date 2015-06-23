class Eventable {
	constructor() {
		this._subscriptions = {};
	}
	on(eventType, callback) {
		//todo: validate params
		this._subscriptions[eventType] = this._subscriptions[eventType] || [];
		this._subscriptions[eventType].push(callback);
	}
	emit(eventType, ...data) {
		//todo: validate params
		if (!Array.isArray(this._subscriptions[eventType])) return; //nobody has subscribed yet, just return
		this._subscriptions[eventType].forEach(subscriptionCallback => subscriptionCallback(...data));
	}
}


module.exports = Eventable;