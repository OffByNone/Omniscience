const storage = require('sdk/simple-storage').storage; // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/simple-storage

module.exports = {
	get: function (key) {
		return storage[key];
	},
	set: function (key, value) {
		storage[key] = value;
	},
	remove: function (key) {
		delete storage[key];
	}
};