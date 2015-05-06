var Eventer = {
    subscriptions: {},
    on: function (eventType, callback) {
        this.subscriptions[eventType] = this.subscriptions[eventType] || [];
        this.subscriptions[eventType].push(callback);
    },
    emit: function (eventType, ...eventParams) {
        if (!Array.isArray(this.subscriptions[eventType])) return; //nobody has subscribed yet, just return
        this.subscriptions[eventType].forEach(subscriptionCallback => subscriptionCallback(...eventParams));
    }
}

module.exports = Eventer;