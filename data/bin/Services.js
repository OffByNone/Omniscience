'use strict';

window.omniscience.factory('avTransportService', function (eventService, subscriptionService, informationService) {
	"use strict";

	var rawServiceType = 'urn:schemas-upnp-org:service:AVTransport:1'; //todo: move this to a constants file
	var instanceId = 0; //todo: determine this dynamically
	var speed = 1; //todo: make this a setable default

	function getService() {
		return informationService.get(rawServiceType);
	}

	return {
		setAvTransportUri: function setAvTransportUri(currentUri, currentUriMetadata) {
			return eventService.callService(getService(), "SetAVTransportURI", { InstanceID: instanceId, CurrentURI: currentUri, CurrentURIMetaData: currentUriMetadata });
		},
		setNextAvTransportUri: function setNextAvTransportUri(nextUri, nextUriMetadata) {
			return eventService.callService(getService(), "SetNextAVTransportURI", { InstanceID: instanceId, NextURI: nextUri, NextURIMetaData: nextUriMetadata });
		},
		getMediaInfo: function getMediaInfo() {
			return eventService.callService(getService(), "GetMediaInfo", { InstanceID: instanceId });
		},
		getTransportInfo: function getTransportInfo() {
			return eventService.callService(getService(), "GetTransportInfo", { InstanceID: instanceId });
		},
		getPositionInfo: function getPositionInfo() {
			return eventService.callService(getService(), "GetPositionInfo", { InstanceID: instanceId });
		},
		getDeviceCapabilities: function getDeviceCapabilities() {
			return eventService.callService(getService(), "GetDeviceCapabilities", { InstanceID: instanceId });
		},
		getTransportSettings: function getTransportSettings() {
			return eventService.callService(getService(), "GetTransportSettings", { InstanceID: instanceId });
		},
		stop: function stop() {
			return eventService.callService(getService(), "Stop", { InstanceID: instanceId });
		},
		play: function play() {
			return eventService.callService(getService(), "Play", { InstanceID: instanceId, Speed: speed });
		},
		pause: function pause() {
			return eventService.callService(getService(), "Pause", { InstanceID: instanceId });
		},
		seek: function seek(unit, target) {
			return eventService.callService(getService(), "Seek", { InstanceID: instanceId, Unit: unit, Target: target });
		},
		next: function next() {
			return eventService.callService(getService(), "Next", { InstanceID: instanceId });
		},
		previous: function previous() {
			return eventService.callService(getService(), "Previous", { InstanceID: instanceId });
		},
		setPlayMode: function setPlayMode(newPlayMode) {
			return eventService.callService(getService(), "SetPlayMode", { InstanceID: instanceId, NewPlayMode: newPlayMode });
		},
		getServerIP: function getServerIP() {
			return getService().serverIP;
		},
		getCurrentTransportActions: function getCurrentTransportActions() {
			return eventService.callService(getService(), "GetCurrentTransportActions", { InstanceID: instanceId });
		},
		subscribe: function subscribe(genericEventCallback, lastChangeEventCallback) {
			return subscriptionService.subscribe(getService(), genericEventCallback, lastChangeEventCallback);
		},
		unsubscribe: function unsubscribe() {
			var service = getService();
			return subscriptionService.unsubscribe(service.hash, service.subscriptionId, service.eventSubUrl);
		}
	};
});
'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

window.omniscience.factory('connectionManagerService', function (eventService, informationService, subscriptionService) {
	"use strict";

	var connectionId = 0;
	var constants = {
		rawServiceType: 'urn:schemas-upnp-org:service:ConnectionManager:1',
		DLNA: {
			'DLNA.ORG_PN': 'mediaType', //"MediaType" Media file format profile, usually combination of container/video codec/audio codec/sometimes region
			'DLNA.ORG_OP': 'operations',
			'DLNA.ORG_PS': 'playSpeed',
			'DLNA.ORG_CI': 'conversionIndicator',
			'DLNA.ORG_FLAGS': 'flags',
			'DLNA.ORG_MAXSP': 'maxSP',

			mediaType: 'DLNA.ORG_PN',
			operations: 'DLNA.ORG_OP',
			playSpeed: 'DLNA.ORG_PS',
			conversionIndicator: 'DLNA.ORG_CI',
			flags: 'DLNA.ORG_FLAGS',
			maxSP: 'DLNA.ORG_MAXSP',

			flagValueMap: {
				senderPaced: 31, //0x80000000
				lsopTimeBasedSeekSupported: 30, //0x40000000
				lsopByteBasedSeekSupported: 29, //0x20000000
				playcontainerSupported: 28, //0x10000000
				s0IncreasingSupported: 27, //0x08000000
				sNIncreasingSupported: 26, //0x04000000
				rtspPauseSupported: 25, //0x02000000
				streamingTransferModeSupported: 24, //0x01000000
				interactiveTransferModeSupported: 23, //0x00800000
				backgroundTransferModeSupported: 22, //0x00400000
				connectionStallingSupported: 21, //0x00200000
				dlnaVersion15Supported: 20 //0x00100000
			}
		}
	};

	function _parseProtocolResponse(protocolResponse) {
		var protocolInfo = [];

		if (!protocolResponse) return null;

		var protocolResponseCSV = protocolResponse.split(',');
		// the elements contain a csv
		//csv has the format <protocol>:<network>:<contentFormat>:<additionalInfo>
		//contentformat can have n properties delimited by ;

		protocolResponseCSV.map(function (row) {
			var newRow = {};
			var contentFormat, additionalInfo;

			var _row$split = row.split(':');

			var _row$split2 = _slicedToArray(_row$split, 4);

			newRow.protocol = _row$split2[0];
			newRow.network = _row$split2[1];
			contentFormat = _row$split2[2];
			additionalInfo = _row$split2[3];

			newRow.contentFormat = _parseContentFormat(contentFormat);
			newRow.additionalInfo = _parseAdditionalinfo(additionalInfo);
			protocolInfo.push(newRow);
		});
		return protocolInfo;
	}
	function _parseContentFormat(contentFormat) {
		var parsedContentFormat = {};
		var containerTypeInfo;
		var containerType;

		var _contentFormat$split = contentFormat.split('/');

		var _contentFormat$split2 = _slicedToArray(_contentFormat$split, 2);

		parsedContentFormat.medium = _contentFormat$split2[0];
		containerTypeInfo = _contentFormat$split2[1];

		containerTypeInfo = containerTypeInfo || "";
		parsedContentFormat.containerType = containerTypeInfo.split(";")[0];
		if (containerTypeInfo.indexOf(';') >= 0) {
			parsedContentFormat.containerTypeInfo = {};
			var extraParams = containerTypeInfo.split(';');
			extraParams.shift();
			extraParams.forEach(function (extraParam) {
				var _extraParam$split = extraParam.split('=');

				var _extraParam$split2 = _slicedToArray(_extraParam$split, 2);

				var key = _extraParam$split2[0];
				var value = _extraParam$split2[1];

				parsedContentFormat.containerTypeInfo[key] = value;
			});
		}

		return parsedContentFormat;
	}
	function _parseAdditionalinfo(additionalInfo) {
		var dlnaInfo = {};
		if (additionalInfo === "*") return additionalInfo;
		var extraParams = additionalInfo.split(';');
		extraParams.forEach(function (extraParam) {
			var _extraParam$split3 = extraParam.split('=');

			var _extraParam$split32 = _slicedToArray(_extraParam$split3, 2);

			var key = _extraParam$split32[0];
			var value = _extraParam$split32[1];

			var _parseDLNA2 = _parseDLNA(key, value);

			var _parseDLNA22 = _slicedToArray(_parseDLNA2, 2);

			key = _parseDLNA22[0];
			value = _parseDLNA22[1];

			dlnaInfo[key] = value;
		});

		return dlnaInfo;
	}
	function _parseDLNA(key, value) {
		var valueObject = {};
		var newKey = constants.DLNA[key];

		if (key === constants.DLNA.mediaType) {
			return [newKey, value];
		}
		if (key === constants.DLNA.operations) {
			valueObject.canTimeSeekRange = value.charAt(0) === 1;
			valueObject.canRange = value.charAt(1) === 1;
			return [newKey, valueObject];
		}
		if (key === constants.DLNA.playSpeed) {
			value = value === 1;
			newKey = "isValidPlaySpeed";
			return [newKey, value];
		}
		if (key === constants.DLNA.conversionIndicator) {
			value = value === 1;
			newKey = "isTranscoded";
			return [newKey, value];
		}
		if (key === constants.DLNA.flags) {
			var flags = parseInt(value.substring(0, value.length - 24), 16); //it is in hex and padded with 24 0s
			var arrayOfBools = _arrayFromMask(flags);
			var flagVals = constants.DLNA.flagValueMap;
			for (var prop in flagVals) if (flagVals.hasOwnProperty(prop)) valueObject[prop] = arrayOfBools[flagVals[prop]];
			return [newKey, valueObject];
		}
		if (key === constants.maxSP) {
			return [newKey, value];
		}

		return [key, value];
	}
	function _arrayFromMask(nMask) {
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
		for (var nShifted = nMask, aFromMask = []; nShifted; aFromMask.push(Boolean(nShifted & 1)), nShifted >>>= 1);
		return aFromMask;
	}

	function getService() {
		return informationService.get(constants.rawServiceType);
	}

	return {
		getCurrentConnectionInfo: function getCurrentConnectionInfo() {
			return eventService.callService(getService(), "GetCurrentConnectionInfo", { ConnectionID: connectionId });
		},
		getProtocolInfo: function getProtocolInfo() {
			return eventService.callService(getService(), "GetProtocolInfo").then(function (response) {
				return [].concat(_parseProtocolResponse(response.Sink, "render") || [], _parseProtocolResponse(response.Source, "serve") || []);
			});
		},
		getCurrentConnectionIds: function getCurrentConnectionIds() {
			return eventService.callService(getService(), "GetCurrentConnectionIDs");
		},
		subscribe: function subscribe(genericEventCallback, lastChangeEventCallback) {
			return subscriptionService.subscribe(getService(), genericEventCallback, lastChangeEventCallback);
		},
		unsubscribe: function unsubscribe() {
			var service = getService();
			return subscriptionService.unsubscribe(service.hash, service.subscriptionId, service.eventSubUrl);
		},
		parseProtocolInfo: function parseProtocolInfo(rawProtocolInfo) {
			return _parseProtocolResponse(rawProtocolInfo) || [];
		}
	};
});
'use strict';

window.omniscience.factory('contentDirectoryService', function ($rootScope, eventService, subscriptionService, informationService) {
	"use strict";

	var rawServiceType = 'urn:schemas-upnp-org:service:ContentDirectory:1';
	function getService() {
		return informationService.get(rawServiceType);
	}

	return {
		getInfo: function getInfo() {
			this.getSearchCapabilities();
			this.getSortCapabilities();
			this.x_GetRemoteSharingStatus();
		},
		getSearchCapabilities: function getSearchCapabilities() {
			return eventService.callService(getService(), "GetSearchCapabilities");
		},
		getSortCapabilities: function getSortCapabilities() {
			return eventService.callService(getService(), "GetSortCapabilities");
		},
		getSystemUpdateID: function getSystemUpdateID() {
			return eventService.callService(getService(), "GetSystemUpdateID");
		},
		browse: function browse(objectId, browseFlag, filter, startingIndex, requestedCount, sortCriteria) {
			return eventService.callService(getService(), "Browse", { ObjectId: objectId, BrowseFlag: browseFlag, Filter: filter, StartingIndex: startingIndex, RequestedCount: requestedCount, SortCriteria: sortCriteria });
		},
		search: function search(containerId, searchCriteria, filter, startingIndex, requestedCount, sortCriteria) {
			return eventService.callService(getService(), "Search", { ContainerId: containerId, SearchCriteria: searchCriteria, Filter: filter, StartingIndex: startingIndex, RequestedCount: requestedCount, SortCriteria: sortCriteria });
		},
		x_GetRemoteSharingStatus: function x_GetRemoteSharingStatus() {
			return eventService.callService(getService(), "X_GetRemoteSharingStatus");
		},
		subscribe: function subscribe(genericEventCallback, lastChangeEventCallback) {
			return subscriptionService.subscribe(getService(), genericEventCallback, lastChangeEventCallback);
		},
		unsubscribe: function unsubscribe() {
			var service = getService();
			return subscriptionService.unsubscribe(service.hash, service.subscriptionId, service.eventSubUrl);
		}
	};
});
"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

window.omniscience.factory('eventService', function ($rootScope, $window, $q) {
	"use strict";

	var emitPromises = {};
	var subscriptions = {};

	$window.self.on("message", function (message) {
		var messageObj;
		try {
			messageObj = JSON.parse(message);
		} catch (err) {
			console.log(message);
			console.log(err);
			return;
		}

		if (!Array.isArray(subscriptions[messageObj.eventType])) return; //nobody has subscribed yet, just return
		subscriptions[messageObj.eventType].forEach(function (subscriptionCallback) {
			return $rootScope.$apply(subscriptionCallback.apply(undefined, _toConsumableArray(messageObj.data)));
		});
	});

	function generateQuickGuidish() {
		//e7 from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
		var lut = [];for (var i = 0; i < 256; i++) {
			lut[i] = (i < 16 ? '0' : '') + i.toString(16);
		}
		var d0 = Math.random() * 0xffffffff | 0;
		var d1 = Math.random() * 0xffffffff | 0;
		var d2 = Math.random() * 0xffffffff | 0;
		var d3 = Math.random() * 0xffffffff | 0;
		return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' + lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' + lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] + lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
	}
	function on(eventType, callback) {
		subscriptions[eventType] = subscriptions[eventType] || [];
		subscriptions[eventType].push(callback);
	}
	function emit(eventType) {
		var uniqueId = generateQuickGuidish();
		var deferred = $q.defer();

		emitPromises[uniqueId] = deferred;

		for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			args[_key - 1] = arguments[_key];
		}

		var message = JSON.stringify({
			eventType: eventType,
			data: [uniqueId].concat(args)
		});

		$window.self.postMessage(message);

		return deferred.promise;
	}
	function callService(service, serviceMethod, data) {
		return emit("CallService", service, serviceMethod, data);
	}
	on("emitResponse", function (uniqueId) {
		var deferred = emitPromises[uniqueId];
		if (deferred) {
			delete emitPromises[uniqueId];

			for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
				args[_key2 - 1] = arguments[_key2];
			}

			deferred.resolve.apply(deferred, args);
		} else {
			console.log("no deferred for the response");
		}
	});

	return {
		on: on,
		emit: emit,
		callService: callService
	};
});
'use strict';

window.omniscience.factory('fileService', function (eventService) {
	"use strict";
	var rawServiceType = 'urn:schemas-upnp-org:service:AVTransport:1';

	return {
		chooseFiles: function chooseFiles() {
			return eventService.emit('chooseFiles');
		},
		shareFile: function shareFile(file, serverIP) {
			return eventService.emit("shareFile", file, serverIP).then(function (fileUri) {
				return fileUri;
			});
		}
	};
});
"use strict";

window.omniscience.factory('informationService', function informationService() {
	"use strict";

	var _services = {}; //key is service.type.raw

	return {
		get: function get(rawServiceType) {
			if (typeof rawServiceType === "string" && rawServiceType.length > 0) return _services[rawServiceType];
		},
		put: function put(serviceInformation) {
			if (typeof serviceInformation === "object" && typeof serviceInformation.type === "object" && typeof serviceInformation.type.raw === "string" && serviceInformation.type.raw.length > 0) _services[serviceInformation.type.raw] = serviceInformation;
		},
		init: function init() {
			_services = {};
		}
	};
});
"use strict";

window.omniscience.factory('jxon', function () {
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

		build: function build(xml) {
			var xmlActual = typeof xml === "string" ? this.stringToXml(xml) : xml;
			xmlActual.normalize();
			return this.createObject(xmlActual);
		},
		stringToXml: function stringToXml(xmlStr) {
			return new window.DOMParser().parseFromString(xmlStr, 'application/xml');
		},
		parseText: function parseText(value) {
			if (value.trim() === "") return null;
			if (/^(true|false)$/i.test(value)) return value.toLowerCase() === "true";
			if (isFinite(value)) return parseFloat(value);
			if (this.parseDates && !isNaN(Date.parse(value))) return new Date(value);
			return value;
		},
		createObject: function createObject(parent) {
			var _this = this;

			var childElements = this.getChildElements(parent.childNodes);
			var jsonResult = this.parseAttributes(parent.attributes);

			childElements.forEach(function (child) {
				var childObject = _this.createObject(child);
				_this.addPropertyToObject(jsonResult, child.nodeName, childObject);
			});

			var innerText = this.getInnerText(parent.childNodes);

			if (innerText != null) {
				//todo: make sure to have a test where innerText comes back as 0
				if (this.storeTextInSeparateObject || childElements.some(function () {
					return true;
				})) jsonResult[this.textObjectName] = innerText;else jsonResult = innerText;
			}

			if (this.freezeGeneratedObject && childElements.some(function () {
				return true;
			})) Object.freeze(jsonResult);

			return jsonResult;
		},
		addPropertyToObject: function addPropertyToObject(object, propertyName, propertyValue) {

			propertyName = this.normalizePropertyName(propertyName);

			if (object.hasOwnProperty(propertyName)) {
				if (!Array.isArray(object[propertyName])) object[propertyName] = [object[propertyName]];

				object[propertyName].push(propertyValue);
			} else object[propertyName] = propertyValue;
		},
		normalizePropertyName: function normalizePropertyName(propertyName) {
			if (this.normalizeCasing) propertyName = propertyName.toLowerCase();
			if (this.removePrefixes && propertyName.indexOf(":") >= 0) propertyName = propertyName.split(":")[1];

			return propertyName;
		},
		getChildElements: function getChildElements(childNodes) {
			var children = [];
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = childNodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var childNode = _step.value;

					if (this.nodeTypes[childNode.nodeType] === "Element" && (this.includePrefixedElements || !childNode.prefix)) children.push(childNode);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator["return"]) {
						_iterator["return"]();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			return children;
		},
		getInnerText: function getInnerText(childNodes) {
			var innerText = "";
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = childNodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var childNode = _step2.value;

					var nodeType = this.nodeTypes[childNode.nodeType];

					if (nodeType === "CDATASection" || nodeType === "text") innerText += childNode.nodeValue.trim();
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
						_iterator2["return"]();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}

			return this.parseText(innerText);
		},
		parseAttributes: function parseAttributes(attributes) {
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

		convertJsonToXml: (function (_convertJsonToXml) {
			function convertJsonToXml(_x, _x2, _x3) {
				return _convertJsonToXml.apply(this, arguments);
			}

			convertJsonToXml.toString = function () {
				return _convertJsonToXml.toString();
			};

			return convertJsonToXml;
		})(function (xml, parentElement, parentObject) {
			var value, oChild;

			if (parentObject.constructor === String || parentObject.constructor === Number || parentObject.constructor === Boolean) {
				parentElement.appendChild(xml.createTextNode(parentObject.toString())); /* verbosity level is 0 or 1 */
				if (parentObject === parentObject.valueOf()) {
					return;
				}
			} else if (parentObject.constructor === Date) {
				parentElement.appendChild(xml.createTextNode(parentObject.toGMTString()));
			}

			for (var sName in parentObject) {
				value = parentObject[sName];
				if (isFinite(sName) || value instanceof Function) {
					continue;
				} /* verbosity level is 0 */
				// when it is _
				if (sName === this.textObjectName) {
					if (value !== null && value !== true) {
						parentElement.appendChild(xml.createTextNode(value.constructor === Date ? value.toGMTString() : String(value)));
					}
				} else if (sName === attributesPropertyName) {
					/* verbosity level is 3 */
					for (var sAttrib in value) {
						parentElement.setAttribute(sAttrib, value[sAttrib]);
					}
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
		}),
		unbuild: function unbuild(jsonObject, namespaceUri, /* optional */qualifiedName, /* optional */documentType /* optional */) {
			var xmlDocument = window.document.implementation.createDocument(namespaceUri || null, qualifiedName || "", documentType || null);
			convertJsonToXml(xmlDocument, xmlDocument.documentElement || xmlDocument, jsonObject);
			return xmlDocument;
		},
		config: function config(o) {
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
		xmlToString: function xmlToString(xmlObj) {
			if (typeof xmlObj.xml !== "undefined") {
				return xmlObj.xml;
			} else {
				if (typeof window.XMLSerializer === "undefined") window.XMLSerializer = require("xmldom").XMLSerializer;
				return new window.XMLSerializer().serializeToString(xmlObj);
			}
		},
		stringToJs: function stringToJs(str) {
			var xmlObj = this.stringToXml(str);
			return this.xmlToJson(xmlObj);
		},
		jsToString: this.stringify = function (jsonObject, namespaceUri, /* optional */qualifiedName, /* optional */documentType /* optional */) {
			return this.xmlToString(this.jsonToXml(jsonObject, namespaceUri, qualifiedName, documentType));
		}
	};
});
"use strict";

window.omniscience.factory('lastChangeEventParser', function () {
	"use strict";

	var domParser = new DOMParser();

	function getElements(xml, selector) {
		//lifted from /lib/XmlParser
		return xml && typeof xml.querySelectorAll === "function" ? Array.prototype.slice.call(xml.querySelectorAll(selector)) : [];
	}

	return {
		parseEvent: function parseEvent(eventText) {
			var eventXml = domParser.parseFromString(eventText, 'text/xml');
			var lastChanges = getElements(eventXml, "propertyset property LastChange");

			if (lastChanges.length === 0) // this means that the event is not a last change event
				return null; // return null so the subscriptionService can trigger a GenericUPnPEvent

			var instances = [];

			lastChanges.map(function (lastChange) {
				var eventString = lastChange.innerHTML.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/'/g, '&#39;').replace(/&/g, '&amp;');
				var eventXml = domParser.parseFromString(eventString, 'text/xml');

				var instancesXml = getElements(eventXml, "InstanceID");
				instancesXml.map(function (instanceXml) {
					var instance = {};
					Array.prototype.slice.call(instanceXml.children).forEach(function (child) {
						instance[child.tagName] = child.attributes.getNamedItem('val').value;
					});
					instances.push(instance);
				});
			});

			return instances;
		}
	};
});
'use strict';

window.omniscience.factory('matchstickMessageGenerator', function matchstickMessageGenerator() {
	"use strict";
	return {
		build: function build(command, type, extraData, protocolVersion) {
			var message = {
				data: {
					command: command,
					type: type
				},
				message_type: 'command',
				meta: { reply: command === 'query' },
				protocol_version: protocolVersion || '1.0'
			};

			for (var data in extraData) message.data[data] = extraData[data];
			var messageStr = JSON.stringify(message);
			messageStr = messageStr.length + ":" + messageStr;
			return messageStr;
		},
		buildv2: function buildv2(command, parameters, protocolVersion) {
			var message = {
				protocol_version: protocolVersion || '1.0',
				message_type: 'command',
				meta: { reply: command === 'query' },
				data: { command: command, parameters: parameters }
			};

			var messageStr = JSON.stringify(message);
			messageStr = messageStr.length + ":" + messageStr;
			return messageStr;
		}
	};
});
'use strict';

window.omniscience.factory('mediaReceiverRegistrarService', function ($rootScope, eventService, subscriptionService, informationService) {
	"use strict";

	var rawServiceType = 'urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1';
	function getService() {
		return informationService.get(rawServiceType);
	}

	return {
		isAuthorized: function getSearchCapabilities(DeviceId) {
			return eventService.callService(getService(), "GetSearchCapabilities", { DeviceID: deviceId });
		},
		registerservice: function getSortCapabilities(DeviceId) {
			return eventService.callService(getService(), "GetSortCapabilities", { DeviceID: deviceId });
		},
		isValidated: function getSystemUpdateID(registrationReqMsg) {
			return eventService.callService(getService(), "GetSystemUpdateID", { RegistrationReqMsg: registrationReqMsg });
		},
		subscribe: function subscribe(genericEventCallback, lastChangeEventCallback) {
			return subscriptionService.subscribe(getService(), genericEventCallback, lastChangeEventCallback);
		},
		unsubscribe: function unsubscribe() {
			var service = getService();
			return subscriptionService.unsubscribe(service.hash, service.subscriptionId, service.eventSubUrl);
		}
	};
});
"use strict";

window.omniscience.factory('persistenceService', function persistenceService(eventService) {
	"use strict";

	var _device = { state: {} };

	return {
		load: function load(serviceName) {
			if (!serviceName) throw new Error("argument 'serviceName' cannot be null");

			if (!_device.state[serviceName]) _device.state[serviceName] = {};

			return _device.state[serviceName];
		},
		save: function save(serviceName, state) {
			if (!serviceName) throw new Error("argument 'serviceName' cannot be null");

			eventService.emit("saveState", _device.id, serviceName, state);
		},
		initialize: function initialize(device) {
			if (!device) throw new Error("argument 'device' cannot be null");
			_device = device;
		}
	};
});
'use strict';

window.omniscience.factory('pubSub', function ($rootScope) {
	"use strict";

	return {
		pub: function pub() {
			$rootScope.$emit.apply($rootScope, arguments);
		},
		sub: function sub(message, func, scope) {
			var unbind = $rootScope.$on(message, function (unused) {
				for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
					args[_key - 1] = arguments[_key];
				}

				return func.apply(undefined, args);
			});
			if (scope) scope.$on('$destroy', unbind);
		}
	};
});
'use strict';

window.omniscience.factory('renderingControlService', function (eventService, informationService, subscriptionService) {
	"use strict";

	var rawServiceType = 'urn:schemas-upnp-org:service:RenderingControl:1';
	var instanceId = 0;
	var channel = "Master";

	function getService() {
		return informationService.get(rawServiceType);
	}

	return {
		getMute: function getMute() {
			return eventService.callService(getService(), "GetMute", { InstanceID: instanceId, Channel: channel }).then(function (response) {
				return response && response.hasOwnProperty("CurrentMute") ? response.CurrentMute == 1 : response;
			});
		},
		getVolume: function getVolume() {
			return eventService.callService(getService(), "GetVolume", { InstanceID: instanceId, Channel: channel }).then(function (response) {
				return response && response.hasOwnProperty("CurrentVolume") ? response.CurrentVolume : response;
			});
		},
		listPresets: function listPresets() {
			return eventService.callService(getService(), "ListPresets", { InstanceID: instanceId });
		},
		selectPresets: function selectPresets(presetName) {
			return eventService.callService(getService(), "ListPresets", { InstanceID: instanceId, PresetName: presetName });
		},
		setMute: function setMute(desiredMute) {
			return eventService.callService(getService(), "SetMute", { InstanceID: instanceId, Channel: channel, DesiredMute: desiredMute });
		},
		setVolume: function setVolume(desiredVolume) {
			return eventService.callService(getService(), "SetVolume", { InstanceID: instanceId, Channel: channel, DesiredVolume: desiredVolume });
		},
		subscribe: function subscribe(genericEventCallback, lastChangeEventCallback) {
			return subscriptionService.subscribe(getService(), genericEventCallback, lastChangeEventCallback);
		},
		unsubscribe: function unsubscribe() {
			var service = getService();
			return subscriptionService.unsubscribe(service.hash, service.subscriptionId, service.eventSubUrl);
		}
	};
});
"use strict";

window.omniscience.factory('stubFactory', function ($rootScope, eventService) {
	"use strict";
	return {
		createServiceStub: function createServiceStub(serviceName, methods) {
			var serviceStub = "omniscience.factory(" + serivceName + ", function ($rootScope, eventService) {\n\t\t\t\treturn {";

			serviceStub += methods.map(function (method) {
				methodStub += method.name + ": function (service, ";
				methodStub += method.parameters.map(function (parameter) {
					return parameter.name;
				}).join(", ") + "){";
				var paramsObject = method.parameters.map(function (parameter) {
					return parameter.name + ": " + parameter.name;
				}).join(", ");
				methodStub += "return eventService.callService(service, \"" + method.name + "\", " + paramsObject + "); }";
			}).join(", ");

			serviceStub += "};\n\t\t\t}); ";
		},
		createControllerStub: function createControllerStub(serviceName, methods, rawServiceType) {
			var controllerStub = "omniscience.controller(\"" + serviceName + "\", function ConnectionManager($scope, " + serviceName + "Service) {\n\t\t\t\t\"use strict\";\n\n\t\t\t\t$scope.service = $scope.device.services.filter(service => service.type.raw === \"" + rawServiceType + "\")[0];\n\n\t\t\t\t//sample calls\n\t\t\t\t";

			var methodStubs = methods.map(function (method) {
				methodStub = serviceName + "Service." + method.name + "($scope.service, ";
				methodStub += method.parameters.map(function (parameter) {
					return parameter.name;
				}).join(", ") + ")";
				methodStub += ".then(response => console.log(response));";
			}).reduce(function (prev, curr) {
				return prev + "\n" + curr;
			});

			controllerStub += methodStubs + "\n});";
			return controllerStub;
		},
		createDirectiveStub: function createDirectiveStub(serviceName) {
			return "angular.module(\"omniscience\").directive(\"" + serviceName + "\", function () {\n\t\t\t\t\t\treturn ({\n\t\t\t\t\t\t\tcontroller: \"" + serviceName + "Controller\",\n\t\t\t\t\t\t\tlink: link,\n\t\t\t\t\t\t\treplace: true,\n\t\t\t\t\t\t\trestrict: \"E\",\n\t\t\t\t\t\t\ttemplateUrl: \"../templates/" + serviceName + ".html\"\n\t\t\t\t\t\t});\n\n\t\t\t\t\t\tfunction link(scope, element, attributes) { }\n\t\t\t\t\t}); ";
		}
	};
});
"use strict";

window.omniscience.factory('subscriptionService', function ($q, $timeout, eventService, lastChangeEventParser, jxon) {
	"use strict";

	var subscriptions = {};

	function addSubscription(service, timeoutInSeconds) {
		subscriptions[service.hash].timeout = $timeout(function () {
			return addSubscription(service, timeoutInSeconds);
		}, timeoutInSeconds * 900); /// make it 90% of the period so we don't resubscribe too late and potentially miss something
		return eventService.emit("Subscribe", service.eventSubUrl, service.hash, service.serverIP, timeoutInSeconds, service.subscriptionId).then(function (subscriptionId) {
			if (!subscriptionId) $timeout.cancel(subscriptions[service.hash].timeout);

			service.subscriptionId = subscriptionId;
			return subscriptionId;
		});
	}

	eventService.on("UPnPEvent", function (serviceHash, eventXmlString) {
		var callbacks = subscriptions[serviceHash].callbacks;
		if (!callbacks) return;

		var lastChangeObj = lastChangeEventParser.parseEvent(eventXmlString);

		if (lastChangeObj) callbacks.filter(function (callback) {
			return typeof callback.lastChangeCallback === 'function';
		}).forEach(function (callback) {
			return callback.lastChangeCallback(lastChangeObj);
		});else {
			var eventJson = jxon.build(eventXmlString);
			if (eventJson.propertyset && eventJson.propertyset.property) {
				var eventObj = {};

				if (!Array.isArray(eventJson.propertyset.property)) eventJson.propertyset.property = [eventJson.propertyset.property];

				eventJson.propertyset.property.forEach(function (property) {
					for (var key in property) {
						if (eventObj.hasOwnProperty(key)) {
							if (!Array.isArray(eventObj[key])) eventObj[key] = [eventObj[key]];

							eventObj[key].push(property[key]);
						}
						eventObj[key] = property[key];
					}
				});

				callbacks.filter(function (callback) {
					return typeof callback.genericEventCallback === 'function';
				}).forEach(function (callback) {
					return callback.genericEventCallback([eventObj]);
				});
			}
		}
	});

	return {
		subscribe: function subscribe(service, genericEventCallback, lastChangeCallback, timeoutInSeconds) {
			if (typeof genericEventCallback !== "function" && typeof lastChangeCallback !== "function") throw new Error("Invalid argument exception.  Both parameters 'genericCallback' and 'lastChangeCallback' are null or not functions.  At least one of them must be a function.");
			if (!service || typeof service !== "object") throw new Error("Invalid argument exception.  Parameter 'service' is either null or not an object.");
			if (!service.hash) throw new Error("Argument null exception service.hash cannot be null.");
			if (!service.eventSubUrl) throw new Error("Argument null exception service.eventSubUrl cannot be null.");

			if (typeof subscriptions[service.hash] === "object") {
				subscriptions[service.hash].callbacks.push({ genericEventCallback: genericEventCallback, lastChangeCallback: lastChangeCallback });
				return $q.reject("already subscribed, Your callbacks will still be executed.");
				//todo: resolve with sub id.  While we have already subscribed, the first subscription response may not have returned yet, so we might not have the sub id
			}

			subscriptions[service.hash] = { callbacks: [{ genericEventCallback: genericEventCallback, lastChangeCallback: lastChangeCallback }] };
			return addSubscription(service, timeoutInSeconds || 900);
		},
		unsubscribe: function unsubscribe(serviceHash, subscriptionId, eventSubUrl) {
			if (!serviceHash) throw new Error("Argument null exception service.hash cannot be null.");
			if (!eventSubUrl) throw new Error("Argument null exception service.eventSubUrl cannot be null.");
			if (!subscriptionId) return; //means we never subscribed in the first place
			if (!subscriptions[serviceHash]) return; //if we have already unsubscribed

			if (!!subscriptions[serviceHash].timeout) $timeout.cancel(subscriptions[serviceHash].timeout);
			delete subscriptions[serviceHash];

			return eventService.emit("Unsubscribe", eventSubUrl, subscriptionId, serviceHash).then(function () {
				return subscriptionId = null;
			});
		}
	};
});
'use strict';

window.omniscience.factory('wfaWlanConfigService', function ($rootScope, eventService, subscriptionService, informationService) {
	"use strict";

	var rawServiceType = 'urn:schemas-wifialliance-org:service:WFAWLANConfig:1';

	function getService() {
		return informationService.get(rawServiceType);
	}

	return {
		getInfo: function getInfo() {
			this.getDeviceInfo();
		},
		delAPSettings: function delAPSettings(newAPSettings) {
			return eventService.callService(getService(), "DelAPSettings", { NewAPSettings: newAPSettings });
		},
		delSTASettings: function delSTASettings(newSTASettings) {
			return eventService.callService(getService(), "DelSTASettings", { NewAPSettings: newAPSettings });
		},
		getAPSettings: function getAPSettings(newMessage) {
			return eventService.callService(getService(), "GetAPSettings", { NewAPSettings: newAPSettings });
		},
		getDeviceInfo: function getDeviceInfo() {
			return eventService.callService(getService(), "GetserviceInfo", { NewAPSettings: newAPSettings });
		},
		getSTASettings: function getSTASettings(newMessage) {
			return eventService.callService(getService(), "GetSTASettings", { NewMessage: newMessage });
		},
		putMessage: function putMessage(newInMessage) {
			return eventService.callService(getService(), "PutMessage", { NewInMessage: newInMessage });
		},
		putWLANResponse: function putWLANResponse(newMessage, newWLANEventType, newWLANEventMAC) {
			return eventService.callService(getService(), "PutWLANResponse", { NewMessage: newMessage, NewWLANEventType: newWLANEventType, NewWLANEventMAC: newWLANEventMAC });
		},
		rebootAP: function rebootAP(newAPSettings) {
			return eventService.callService(getService(), "RebootAP", { NewAPSettings: newAPSettings });
		},
		rebootSTA: function rebootSTA(newSTASettings) {
			return eventService.callService(getService(), "RebootSTA", { NewSTASettings: newSTASettings });
		},
		resetAP: function resetAP(newMessage) {
			return eventService.callService(getService(), "ResetAP", { NewMessage: newMessage });
		},
		resetSTA: function resetSTA(newMessage) {
			return eventService.callService(getService(), "ResetSTA", { NewMessage: newMessage });
		},
		setAPSettings: function setAPSettings(newAPSettings) {
			return eventService.callService(getService(), "SetAPSettings", { NewAPSettings: newAPSettings });
		},
		setSelectedRegistrar: function setSelecctedRegistrar(newMessage) {
			return eventService.callService(getService(), "SetSelectedRegistrar", { NewMessage: newMessage });
		},
		setSTASettings: function setSTASettings() {
			return eventService.callService(getService(), "SetSTASettings");
		},
		subscribe: function subscribe(genericEventCallback, lastChangeEventCallback) {
			return subscriptionService.subscribe(getService(), genericEventCallback, lastChangeEventCallback);
		},
		unsubscribe: function unsubscribe() {
			var service = getService();
			return subscriptionService.unsubscribe(service.hash, service.subscriptionId, service.eventSubUrl);
		}
	};
});

//# sourceMappingURL=Services.js.map