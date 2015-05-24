module.exports = {
	ActionButton: function(){},
	on: function(eventType, func){
		if (eventType === "click") 
			chrome.browserAction.onClicked.addListener(func);
	}
};