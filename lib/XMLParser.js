
class XmlParser {
    constructor() { }
    getElements(xml, selector) {
        return (xml && typeof xml.querySelectorAll === "function") ? Array.prototype.slice.call(xml.querySelectorAll(selector)) : [];
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