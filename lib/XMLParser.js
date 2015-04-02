const { Class } = require('sdk/core/heritage'); // https://addons.mozilla.org/en-US/developers/docs/sdk/latest/modules/sdk/core/heritage.html

const XMLParser = Class({
	initialize: function initialize() {

	},
	getElements: function(xml, selector){
		return (xml && typeof xml.querySelectorAll === "function") ? Array.prototype.slice.call(xml.querySelectorAll(selector)) : [];
	},
	hasNode: function(xml, selector){
		return (xml && xml.querySelector === "function") ? xml.querySelector(selector) != null : false;
	},
	getText: function(xml, selector){
		return (xml && typeof xml.querySelector === "function") ? (xml.querySelector(selector) || {}).innerHTML : null;
	},
	getAttribute: function(node, attributeName){
		var attribute = node.attributes.getNamedItem(attributeName);
		return attribute && attribute.value != null ? attribute.value : null;
	}
});

module.exports = XMLParser;