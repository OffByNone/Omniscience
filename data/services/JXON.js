omniscience.factory('jxon', function () {
	"use strict";
	/*
	 * JXON framework - Copyleft 2011 by Mozilla Developer Network
	 *
	 * https://developer.mozilla.org/en-US/docs/JXON
	 *
	 * This framework is released under the GNU Public License, version 3 or later.
	 * http://www.gnu.org/licenses/gpl-3.0-standalone.html
	 *
	 * small modifications performed by the iD project:
	 * https://github.com/openstreetmap/iD/commits/18aa33ba97b52cacf454e95c65d154000e052a1f/js/lib/jxon.js
	 *
	 * small modifications performed by user @bugreport0
	 * https://github.com/tyrasd/JXON/pull/2/commits
	 *
	 * some additions and modifications by user @igord
	 * https://github.com/tyrasd/JXON/pull/5/commits
	 *
	 * adapted for nodejs and npm by Martin Raifer <tyr.asd@gmail.com>
	 */

	/*
	 * Modifications:
	 * - added config method that excepts objects with props:
	 *   - valueKey (default: keyValue)
	 *   - attrKey (default: keyAttributes)
	 *   - attrPrefix (default: @)
	 *   - lowerCaseTags (default: true)
	 *   - trueIsEmpty (default: true)
	 *   - autoDate (default: true)
	 * - turning tag and attributes to lower case is optional
	 * - optional turning boolean true to empty tag
	 * - auto Date parsing is optional
	 * - added parseXml method
	 *
   */
	var sEmptyTrue = true;

	return {
		freezeGeneratedObject: false,
		storeTextInSeparateObject: false,
		textObjectName: "text",
		attributesObjectName: "attributes",
		storeAttributesInSeparateObject: false,
		attributePrefix: "",
		normalizeCasing: true,
		parseDates: true,
		removePrefixes: true,
		includePrefixedElements: true,
		nodeTypes: {
			4: "CDATASection",
			3: "text",
			1: "Element"
		},


		build: function (xml) {
			var xmlActual = typeof xml === "string" ? this.stringToXml(xml) : xml;
			xmlActual.normalize();
			return this.createObject(xmlActual);
		},
		stringToXml: function (xmlStr) {
			return (new window.DOMParser()).parseFromString(xmlStr, 'application/xml');
		},
		parseText: function (value) {
			if (value.trim() === "") return null;
			if (/^(true|false)$/i.test(value)) return value.toLowerCase() === "true";
			if (isFinite(value)) return parseFloat(value);
			if (this.parseDates && !isNaN(Date.parse(value))) return new Date(value);
			return value;
		},
		createObject: function (parent) {
			var childElements = this.getChildElements(parent.childNodes);
			var jsonResult = this.parseAttributes(parent.attributes);

			childElements.forEach((child) => {
				var childObject = this.createObject(child);
				this.addPropertyToObject(jsonResult, child.nodeName, childObject);
			});

			var innerText = this.getInnerText(parent.childNodes);

			if (innerText != null) { //todo: make sure to have a test where innerText comes back as 0
				if (this.storeTextInSeparateObject || childElements.some(() => true))
					jsonResult[this.textObjectName] = innerText;
				else
					jsonResult = innerText;
			}

			if (this.freezeGeneratedObject && childElements.some(() => true))
				Object.freeze(jsonResult);

			return jsonResult;
		},
		addPropertyToObject: function (object, propertyName, propertyValue) {
			var propertyName = this.normalizePropertyName(propertyName);

			if (object.hasOwnProperty(propertyName)) {
				if (!Array.isArray(object[propertyName]))
					object[propertyName] = [object[propertyName]];

				object[propertyName].push(propertyValue);
			}
			else
				object[propertyName] = propertyValue;
		},
		normalizePropertyName: function (propertyName) {
			if (this.normalizeCasing) propertyName = propertyName.toLowerCase();
			if (this.removePrefixes && propertyName.indexOf(":") >= 0) propertyName = propertyName.split(":")[1];

			return propertyName;
		},
		getChildElements: function (childNodes) {
			var children = [];
			for (var childNode of childNodes) {
				if (this.nodeTypes[childNode.nodeType] === "Element" && (this.includePrefixedElements || !childNode.prefix))
					children.push(childNode)
			}
			return children;
		},
		getInnerText: function (childNodes) {
			var innerText = "";
			for (var childNode of childNodes) {
				var nodeType = this.nodeTypes[childNode.nodeType];

				if (nodeType === "CDATASection" || nodeType === "text")
					innerText += childNode.nodeValue.trim();
			}

			return this.parseText(innerText);
		},
		parseAttributes: function (attributes) {
			var attributesObj = {};

			if (!attributes) return {};

			for (var i = 0; i < attributes.length; i++) {
				var attribute = attributes.item(i);
				var attributeName = attribute.name;
				if (this.normalizeCasing) attributeName = attributeName.toLowerCase();
				attributesObj[this.attributePrefix + attributeName] = this.parseText(attribute.value.trim());
			}

			if (this.storeAttributesInSeparateObject) {
				if (this.freezeGeneratedObject) Object.freeze(attributes);
				var result = {};
				result[this.attributesObjectName] = attributesObj;
				return result;
			}

			return attributesObj;
		},


		convertJsonToXml: function (xml, parentElement, parentObject) {
			var value, oChild;

			if (parentObject.constructor === String || parentObject.constructor === Number || parentObject.constructor === Boolean) {
				parentElement.appendChild(xml.createTextNode(parentObject.toString())); /* verbosity level is 0 or 1 */
				if (parentObject === parentObject.valueOf()) { return; }
			} else if (parentObject.constructor === Date) {
				parentElement.appendChild(xml.createTextNode(parentObject.toGMTString()));
			}

			for (var sName in parentObject) {
				value = parentObject[sName];
				if (isFinite(sName) || value instanceof Function) { continue; } /* verbosity level is 0 */
				// when it is _
				if (sName === this.textObjectName) {
					if (value !== null && value !== true) { parentElement.appendChild(xml.createTextNode(value.constructor === Date ? value.toGMTString() : String(value))); }
				} else if (sName === attributesPropertyName) { /* verbosity level is 3 */
					for (var sAttrib in value) { parentElement.setAttribute(sAttrib, value[sAttrib]); }
				} else if (sName.charAt(0) === this.attributePrefix && sName !== this.attributePrefix + 'xmlns') {
					parentElement.setAttribute(sName.slice(1), value);
				} else if (value.constructor === Array) {
					for (var i = 0; i < value.length; i++) {
						oChild = xml.createElementNS(value[i][this.attributePrefix + 'xmlns'] || parentElement.namespaceURI, sName);
						convertJsonToXml(xml, oChild, value[i]);
						parentElement.appendChild(oChild);
					}
				} else {
					oChild = xml.createElementNS((value || {})[this.attributePrefix + 'xmlns'] || parentElement.namespaceURI, sName);
					if (value instanceof Object) {
						convertJsonToXml(xml, oChild, value);
					} else if (value !== null && value !== true) {
						oChild.appendChild(xml.createTextNode(value.toString()));
					} else if (!sEmptyTrue && value === true) {
						oChild.appendChild(xml.createTextNode(value.toString()));

					}
					parentElement.appendChild(oChild);

				}
			}
		},
		unbuild: function (jsonObject, namespaceUri /* optional */, qualifiedName /* optional */, documentType /* optional */) {
			var xmlDocument = window.document.implementation.createDocument(namespaceUri || null, qualifiedName || "", documentType || null);
			convertJsonToXml(xmlDocument, xmlDocument.documentElement || xmlDocument, jsonObject);
			return xmlDocument;
		},
		config: function (o) {
			for (var k in o) {
				switch (k) {
					case 'valueKey':
						this.textObjectName = o.valueKey;
						break;
					case 'attrKey':
						attributesPropertyName = o.attrKey;
						break;
					case 'attrPrefix':
						this.attributePrefix = o.attrPrefix;
						break;
					case 'lowerCaseTags':
						this.normalizeCasing = o.lowerCaseTags;
						break;
					case 'trueIsEmpty':
						sEmptyTrue = o.trueIsEmpty;
						break;
					case 'autoDate':
						this.parseDates = o.autoDate;
						break;
					case 'ignorePrefixedNodes':
						this.includePrefixedElements = o.ignorePrefixedNodes;
						break;
					default:
						break;
				}
			}
		},
		xmlToString: function (xmlObj) {
			if (typeof xmlObj.xml !== "undefined") {
				return xmlObj.xml;
			} else {
				if (typeof window.XMLSerializer === "undefined") window.XMLSerializer = require("xmldom").XMLSerializer;
				return (new window.XMLSerializer()).serializeToString(xmlObj);
			}
		},
		stringToJs: function (str) {
			var xmlObj = this.stringToXml(str);
			return this.xmlToJson(xmlObj);
		},
		jsToString: this.stringify = function (jsonObject, namespaceUri /* optional */, qualifiedName /* optional */, documentType /* optional */) {
			return this.xmlToString(
			  this.jsonToXml(jsonObject, namespaceUri, qualifiedName, documentType)
			);
		},
	};
});