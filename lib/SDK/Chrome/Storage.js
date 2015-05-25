module.exports = {
	get: function (key) {
		return chrome.storage.sync.get(key);
	},
	set: function (key, value) {
		chrome.storage.sync.set({ key: value });
	},
	remove: function (key) {
		chrome.storage.sync.remove(key);
	}
};