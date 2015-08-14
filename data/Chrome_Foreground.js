(function () {
	if (typeof window.self.on !== "function") {
		window.self.on = function (eventType, func) {
			if (eventType === "message")
				chrome.runtime.onMessage.addListener(function (request) { func(request); });
		};
		window.self.postMessage = function (message) { chrome.runtime.sendMessage(message); };
	}
})();