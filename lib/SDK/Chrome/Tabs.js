module.exports = {
	open: ({url, onLoad, onClose}) => {
		chrome.tabs.create({ 'url': chrome.extension.getURL(url) },
		(tab) => {
			var pageWorker = {
				on: (eventType, callback) => {
					if(eventType === "message")
						chrome.runtime.onMessage.addListener( (request) => callback(request));
				},
				postMessage: (message) => chrome.tabs.sendMessage(tab.id, message),
				tab: {
					activate: () => chrome.tabs.update(tab.id, {active: true})
				}
			};
			tab.onRemoved.addListener(onClose);
			return pageWorker;
		});
	}
};