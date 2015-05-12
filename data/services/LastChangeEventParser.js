omniscience.factory('lastChangeEventParser', function (){
	"use strict";

	var domParser = new DOMParser();

	function getElements(xml, selector) { //lifted from /lib/XmlParser
		return (xml && typeof xml.querySelectorAll === "function") ? Array.prototype.slice.call(xml.querySelectorAll(selector)) : [];
	}

	return {
		parseEvent: function parseEvent(eventText) {
			var eventXml = domParser.parseFromString(eventText, 'text/xml');
			var lastChanges = getElements(eventXml, "propertyset property LastChange");

			if (lastChanges.length === 0) // this means that the event is not a last change event
				return null; // return null so the subscriptionService can trigger a GenericUPnPEvent

			var instances = [];

			lastChanges.map(lastChange => {
				var eventString = lastChange.innerHTML
												.replace(/&lt;/g, '<')
												.replace(/&gt;/g, '>')
												.replace(/&quot;/g, '"')
												.replace(/'/g, '&#39;')
												.replace(/&/g, '&amp;');
				var eventXml = domParser.parseFromString(eventString, 'text/xml');

				var instancesXml = getElements(eventXml, "InstanceID");
				instancesXml.map((instanceXml) => {
					var instance = {};
					Array.prototype.slice.call(instanceXml.children).forEach(child => {
						instance[child.tagName] = child.attributes.getNamedItem('val').value;
					});
					instances.push(instance);
				});
			});

			return instances;
		}
	}
});