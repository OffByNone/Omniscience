const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const EventParser = Class({
	initialize: function initialize(domParser, xmlParser){
		this._domParser = domParser;
		this._xmlParser = xmlParser;
	},
	parseRequest: function parseRequest(request) {
		var requestXml = this._domParser.parseFromString(request.body, 'text/xml');
		var lastChanges = this._xmlParser.getElements(requestXml, "propertyset property LastChange");
		var instances = [];

		lastChanges.map(lastChange => {
			var eventString = lastChange.innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
			var eventXml = this._domParser.parseFromString(eventString, 'text/xml');

			var instancesXml = this._xmlParser.getElements(eventXml, "InstanceID");
			instancesXml.map((instanceXml) => {
				instance = {};
				Array.prototype.slice.call(instanceXml.children).forEach(child => {
					instance[child.tagName] = child.attributes.getNamedItem('val').value;
				});
				instances.push(instance);
			});
		});

		return instances;
	}
});

module.exports = EventParser;