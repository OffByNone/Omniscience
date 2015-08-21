window.self.on = function (eventType, func) {
				if (eventType === "message")
		window.addEventListener("message", function (event) { func(event.data); });
};
window.self.postMessage = function (message) {
				window.parent.postMessage(JSON.stringify(message), "*");
};