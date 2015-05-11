
class XmlParser {
	constructor(domParser) {
		this._domParser = domParser;
	}
	parseFromString(stringOfXml) {
		if (typeof stringOfXml === "string") {
			try {
				return this._domParser.parseFromString(stringOfXml, 'text/xml');
			}
			catch (error) {
				return null;
			}
		}
		else return null;
	}
	getElements(xml, selector) {
		return (xml && typeof xml.querySelectorAll === "function") ? Array.prototype.slice.call(xml.querySelectorAll(selector)) : [];
	}
	getElement(xml, selector) {
		return (xml && typeof xml.querySelector === "function") ? xml.querySelector(selector) : null;
	}
	hasNode(xml, selector) {
		return (xml && xml.querySelector === "function") ? xml.querySelector(selector) != null : false;
	}
	getText(xml, selector) {
		return (xml && typeof xml.querySelector === "function") ? (xml.querySelector(selector) || {}).innerHTML : null;
	}
	getAttribute(node, attributeName) {
		var attribute = node.attributes.getNamedItem(attributeName);
		return attribute && attribute.value != null ? attribute.value : null;
	}
}

module.exports = XmlParser;