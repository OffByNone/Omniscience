module.exports = {
	notify: function (options) {
		var chromeOptions = {
			type: "basic",
			title: options.title,
			message: options.text,
			iconUrl: options.iconURL
		};
		chrome.notifications.create(chromeOptions);
	}
};