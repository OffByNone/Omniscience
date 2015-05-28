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

	var nodeTypes = {
		4: "CDATASection",
		3: "Text",
		1: "Element"
	};

	var JXON = new (function () {
		var
		  sValProp = "keyValue",
		  attributesPropertyName = "keyAttributes",
		  attributePrefix = "@",
		  normalizeCasing = true,
		  sEmptyTrue = true,
		  parseDates = true,
		  removePrefixes = true,
		  ignorePrefixedElements = false,
		  isNullRegex = /^\s*$/,
		  isBoolRegex = /^(?:true|false)$/i;

		function parseText(value) {
			if (isNullRegex.test(value)) { return null; }
			if (isBoolRegex.test(value)) { return value.toLowerCase() === "true"; }
			if (isFinite(value)) { return parseFloat(value); }
			if (parseDates && isFinite(Date.parse(value))) { return new Date(value); }
			return value;
		}

		function EmptyTree() { }
		EmptyTree.prototype.toString = function () { return "null"; };
		EmptyTree.prototype.valueOf = function () { return null; };

		function objectify(value) {
			return value === null ? new EmptyTree() : value instanceof Object ? value : new value.constructor(value);
		}

		function createObjTree(parent, verbosity, shouldFreeze, putAttributesInOwnProperty) {
			var children = [];
			var hasChildren = parent.hasChildNodes();
			var hasAttributes = parent.nodeType === parent.ELEMENT_NODE && parent.hasAttributes();
			var bHighVerb = Boolean(verbosity & 2);

			var value;
			var sCollectedText = "";
			var jsonResult = bHighVerb ? {} : null;

			for (var childNode of parent.childNodes) {
				var nodeType = nodeTypes[childNode.nodeType];

				if (nodeType === "CDATASection") sCollectedText += childNode.nodeValue;
				else if (nodeType === "Text") sCollectedText += childNode.nodeValue.trim();
				else if (nodeType === "Element" && !(ignorePrefixedElements && childNode.prefix)) children.push(childNode);
			}

			var vBuiltVal = parseText(sCollectedText);

			if (!bHighVerb && (hasChildren || hasAttributes))
				jsonResult = verbosity === 0 ? objectify(vBuiltVal) : {};

			children.forEach((child) => {
				var propertyName = child.nodeName;
				if (normalizeCasing) propertyName = propertyName.toLowerCase();
				if (removePrefixes && propertyName.indexOf(":") >= 0) propertyName = propertyName.split(":")[1];

				value = createObjTree(child, verbosity, shouldFreeze, putAttributesInOwnProperty);
				if (jsonResult.hasOwnProperty(propertyName)) {
					if (!Array.isArray(jsonResult[propertyName]))
						jsonResult[propertyName] = [jsonResult[propertyName]];

					jsonResult[propertyName].push(value);
				}
				else
					jsonResult[propertyName] = value;
			});

			if (hasAttributes) {
				var attributes = parent.attributes;
				var currrentAttributePrefix = putAttributesInOwnProperty ? "" : attributePrefix;
				var attributeContainer = putAttributesInOwnProperty ? {} : jsonResult;

				for (var i = 0; i < attributes.length; i++) {
					var attribute = attributes.item(i);
					var attributeName = attribute.name;
					if (normalizeCasing) attributeName = attributeName.toLowerCase();
					attributeContainer[currrentAttributePrefix + attributeName] = parseText(attribute.value.trim());
				}

				if (putAttributesInOwnProperty) {
					if (shouldFreeze) Object.freeze(attributeContainer);
					jsonResult[attributesPropertyName] = attributeContainer;
				}
			}

			if (verbosity === 3 || (verbosity === 2 || verbosity === 1 && hasChildren) && sCollectedText)
				jsonResult[sValProp] = vBuiltVal;
			else if (!bHighVerb && !hasChildren && sCollectedText)
				jsonResult = vBuiltVal;

			if (shouldFreeze && (bHighVerb || hasChildren)) Object.freeze(jsonResult);

			return jsonResult;
		}

		function convertJsonToXml(xml, parentElement, parentObject) {
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
				if (sName === sValProp) {
					if (value !== null && value !== true) { parentElement.appendChild(xml.createTextNode(value.constructor === Date ? value.toGMTString() : String(value))); }
				} else if (sName === attributesPropertyName) { /* verbosity level is 3 */
					for (var sAttrib in value) { parentElement.setAttribute(sAttrib, value[sAttrib]); }
				} else if (sName.charAt(0) === attributePrefix && sName !== attributePrefix + 'xmlns') {
					parentElement.setAttribute(sName.slice(1), value);
				} else if (value.constructor === Array) {
					for (var i = 0; i < value.length; i++) {
						oChild = xml.createElementNS(value[i][attributePrefix + 'xmlns'] || parentElement.namespaceURI, sName);
						convertJsonToXml(xml, oChild, value[i]);
						parentElement.appendChild(oChild);
					}
				} else {
					oChild = xml.createElementNS((value || {})[attributePrefix + 'xmlns'] || parentElement.namespaceURI, sName);
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
		}

		this.xmlToJson = this.build = function (xml, verbosity /* optional */, shouldFreeze /* optional */, putAttributesInOwnProperty /* optional */) {
			var _verbosity = arguments.length > 1 && typeof verbosity === "number" ? verbosity & 3 : /* put here the default verbosity level: */ 1;

			var xmlActual = typeof xml === "string" ? this.stringToXml(xml) : xml;

			return createObjTree(xmlActual, _verbosity, shouldFreeze || false, arguments.length > 3 ? putAttributesInOwnProperty : _verbosity === 3);
		};

		this.jsonToXml = this.unbuild = function (jsonObject, namespaceUri /* optional */, qualifiedName /* optional */, documentType /* optional */) {
			var xmlDocument = window.document.implementation.createDocument(namespaceUri || null, qualifiedName || "", documentType || null);
			convertJsonToXml(xmlDocument, xmlDocument.documentElement || xmlDocument, jsonObject);
			return xmlDocument;
		};

		this.config = function (o) {
			for (var k in o) {
				switch (k) {
					case 'valueKey':
						sValProp = o.valueKey;
						break;
					case 'attrKey':
						attributesPropertyName = o.attrKey;
						break;
					case 'attrPrefix':
						attributePrefix = o.attrPrefix;
						break;
					case 'lowerCaseTags':
						normalizeCasing = o.lowerCaseTags;
						break;
					case 'trueIsEmpty':
						sEmptyTrue = o.trueIsEmpty;
						break;
					case 'autoDate':
						parseDates = o.autoDate;
						break;
					case 'ignorePrefixedNodes':
						ignorePrefixedElements = o.ignorePrefixedNodes;
						break;
					default:
						break;
				}
			}
		};

		this.stringToXml = function (xmlStr) {
			return (new window.DOMParser()).parseFromString(xmlStr, 'application/xml');
		};

		this.xmlToString = function (xmlObj) {
			if (typeof xmlObj.xml !== "undefined") {
				return xmlObj.xml;
			} else {
				if (typeof window.XMLSerializer === "undefined") window.XMLSerializer = require("xmldom").XMLSerializer;
				return (new window.XMLSerializer()).serializeToString(xmlObj);
			}
		};

		this.stringToJs = function (str) {
			var xmlObj = this.stringToXml(str);
			return this.xmlToJson(xmlObj);
		};

		this.jsToString = this.stringify = function (jsonObject, namespaceUri /* optional */, qualifiedName /* optional */, documentType /* optional */) {
			return this.xmlToString(
			  this.jsonToXml(jsonObject, namespaceUri, qualifiedName, documentType)
			);
		};
	})();

	return JXON;
});