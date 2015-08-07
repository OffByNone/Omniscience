
omniscience.controller("AboutController", function AboutController($scope) {
	"use strict";
});

omniscience.controller("CapabilitiesController", function CapabilitiesController($scope, persistenceService, connectionManagerService) {
	"use strict";

	$scope.currentConnectionInfo = {};
	$scope.currentConnectionIds = {};
	$scope.protocolInfo = {};

	$scope.setProtocolInfoFilter = function (newFilter) {
		$scope.protocolInfoFilter = newFilter;
	};

	$scope.mediums = [];

	connectionManagerService.getCurrentConnectionInfo().then(function (currentConnectionInfo) {
		return $scope.currentConnectionInfo = currentConnectionInfo;
	});
	function parseProtocolInfo(rawProtocolInfo) {
		var protocolInfo = connectionManagerService.parseProtocolInfo(rawProtocolInfo);

		$scope.mediums = protocolInfo.map(function (x) {
			return x.contentFormat.medium;
		}).filter(function (value, index, self) {
			return self.indexOf(value) === index;
		}); //todo: better/faster/easier way to get unique medium values
		$scope.protocolInfo = protocolInfo;
		$scope.protocolInfo.forEach(function (item) {
			item.additionalInfoFlags = [];
			if (item.additionalInfo && typeof item.additionalInfo.flags === "object") {
				for (var key in item.additionalInfo.flags) {
					if (item.additionalInfo.flags[key]) item.additionalInfoFlags.push(key);
				}
				delete item.additionalInfo.flags;
			}
		});

		$scope.protocolInfoFilter = $scope.mediums[0];
	}

	connectionManagerService.subscribe(function (eventArray) {
		if (!Array.isArray(eventArray)) return;

		console.log(eventArray);

		eventArray.forEach(function (eventObj) {
			if (eventObj.hasOwnProperty("currentconnectioninfo")) $scope.currentConnectionInfo = eventObj.currentConnectionInfo;
			if (eventObj.hasOwnProperty("currentconnectionids")) $scope.currentConnectionIds = eventObj.currentConnectionIds;
			if (typeof eventObj.sourceprotocolinfo === "string") parseProtocolInfo(eventObj.sourceprotocolinfo);
			if (typeof eventObj.sinkprotocolinfo === "string") parseProtocolInfo(eventObj.sinkprotocolinfo);
		});
	}, null);

	$scope.$on("$destroy", function () {
		return connectionManagerService.unsubscribe();
	});
});

omniscience.controller("DeviceController", function DeviceController($scope, $routeParams, $rootScope, $timeout, eventService, informationService, subscriptionService) {
	"use strict";

	eventService.emit("loadDevices");
	informationService.init();
	$scope.eventLog = [];

	$scope.hasService = function hasService(rawServiceType) {
		if ($scope.device && Array.isArray($scope.device.services)) return $scope.device.services.some(function (service) {
			return service.type.raw === rawServiceType;
		});

		return false;
	};

	$scope.isMatchStick = function isMatchStick() {
		if ($scope.device && $scope.device.model && $scope.device.manufacturer) return $scope.device.model.name === "MatchStick" && $scope.device.manufacturer.name === "openflint";

		return false;
	};

	function getDevice() {
		var device = $rootScope.devices.filter(function (device) {
			return device.id === $routeParams.deviceId;
		})[0];
		if (!device) return $timeout(function () {
			return getDevice();
		}, 100);

		$scope.device = device || {};
		$scope.device.services.forEach(informationService.put);
		$scope.device.services.filter(function (service) {
			try {
				var url = new URL(service.eventSubUrl);
				return url.hostname && url.protocol;
			} catch (error) {
				return false;
			}
		}).forEach(function (service) {
			return subscriptionService.subscribe(service, function (subEvents) {
				return $scope.eventLog.push({ timestamp: new Date(Date.now()).toLocaleTimeString(), service: service, subEvents: subEvents });
			}, function (subEvents) {
				return $scope.eventLog.push({ timestamp: new Date(Date.now()).toLocaleTimeString(), service: service, subEvents: subEvents });
			}).then(function (subscriptionId) {
				return service.subscriptionId = subscriptionId;
			});
		});
	}

	getDevice();

	$scope.$on("$destroy", function () {
		$scope.device.services.filter(function (service) {
			try {
				var url = new URL(service.eventSubUrl);
				return url.hostname && url.protocol;
			} catch (error) {
				return false;
			}
		}).forEach(function (service) {
			return subscriptionService.unsubscribe(service.uuid, service.subscriptionId, service.eventSubUrl);
		});
	});
});

omniscience.controller("DeviceInfoController", function DeviceInfoController($scope) {
	"use strict";
});

omniscience.controller("DeviceListController", function DeviceListController($scope, eventService) {
	"use strict";

	eventService.emit("loadDevices");
});

omniscience.controller("HomeController", function HomeController($scope, eventService) {
  "use strict";

  eventService.emit("loadDevices");
});

omniscience.controller('IndexController', function IndexController($scope, $rootScope, eventService) {
	'use strict';

	$rootScope.devices = [];
	$rootScope.deviceTypes = [];
	$rootScope.serviceTypes = [];
	$rootScope.eventLog = [];

	$rootScope.refreshDevices = function refreshDevices() {
		eventService.emit('refreshDevices');
	};
	$rootScope.loadDevices = function loadDevices() {
		eventService.emit('loadDevices');
	};

	function addUpdateDevice(device) {
		var found = false;
		$rootScope.devices.forEach(function (scopeDevice) {
			if (scopeDevice.id === device.id) {
				scopeDevice.name = device.name;

				device.services.forEach(function (deviceService) {
					var service = scopeDevice.services.filter(function (scopeDeviceService) {
						return scopeDeviceService.id.raw === deviceService.id.raw && (!scopeDeviceService.scpdUrl || scopeDeviceService.scpdUrl === deviceService.scpdUrl);
					})[0];
					//Match up on Id, but a device could have two services with the same id (should probably make sure that is true),
					//so also match the scpdUrl which means it is effectively the same service
					//but the MatchStick doesn't have an scpdUrl so allow for it to be null

					if (!service) {
						scopeDevice.services.push(deviceService);
						return;
					}
					for (var i in deviceService) if (deviceService.hasOwnProperty(i) && service[i] !== deviceService[i]) service[i] = deviceService[i];
				});

				found = true;
			}
		});

		if (!found) $rootScope.devices.push(device);

		addTypes(device);
	}
	function removeDevice(device) {
		for (var i = $rootScope.devices.length - 1; i >= 0; i--) if ($rootScope.devices[i].id === device.id) $rootScope.devices.splice(i, 1);

		removeTypes();
	}
	function addTypes(device) {
		if (!$rootScope.deviceTypes.some(function (x) {
			return x.raw === device.type.raw;
		})) $rootScope.deviceTypes.push(device.type);
		device.services.forEach(function (service) {
			if (!$rootScope.serviceTypes.some(function (x) {
				return x.raw === service.type.raw;
			})) $rootScope.serviceTypes.push(service.type);
		});
	}
	function removeTypes() {
		$rootScope.deviceTypes = $rootScope.deviceTypes.filter(function (deviceType) {
			return $rootScope.devices.some(function (device) {
				return device.type.raw === deviceType.raw;
			});
		});
		$rootScope.serviceTypes = $rootScope.serviceTypes.filter(function (serviceType) {
			return $rootScope.devices.some(function (device) {
				return device.services.some(function (service) {
					return service.type.raw === serviceType.raw;
				});
			});
		});
	}
	function eventOccured(device, events, request) {
		if (!events) {
			console.log('event is undefined');return;
		}
		if (Array.isArray(events)) events.forEach(function (event) {
			$rootScope.eventLog.push({ device: device, event: event, request: request });
		});
	}

	eventService.on('deviceLost', removeDevice);
	eventService.on('deviceFound', addUpdateDevice);
	eventService.on('EventOccured', eventOccured);
});

omniscience.controller("MatchStickSettingsController", function MatchStickSettingsController($scope, eventService, matchstickMessageGenerator) {
	"use strict";

	var controlUrl = new URL($scope.device.address);
	controlUrl.port = 8881;

	function parseResponse(response) {
		return JSON.parse(response.slice(response.length.toString().length + 1));
	}

	$scope.reboot = function reboot() {
		var message = matchstickMessageGenerator.build("setting", "reboot_cast");
		eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, false);
	};
	$scope.reset = function reset() {
		var message = matchstickMessageGenerator.build("setting", "reset_cast");
		eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, false);
	};
	$scope.forgetWifi = function forgetWifi() {
		var message = matchstickMessageGenerator.build("setting", "forget_wifi");
		eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, false);
	};

	$scope.getNetworks = function () {
		var message = matchstickMessageGenerator.build("query", "ap-list");
		return eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, true).then(function (response) {
			var responseObj = parseResponse(response);

			$scope.visibleNetworks = responseObj.data.networks;
			$scope.eventLog.push({ timestamp: new Date(Date.now()).toLocaleTimeString(), service: { type: { name: "MatchStick Settings" } }, subEvents: [responseObj.data] });
			return responseObj;
		});
	};
	$scope.getDeviceInfo = function () {
		var message = matchstickMessageGenerator.build("query", "device_info");
		return eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, true).then(function (response) {
			var responseObj = parseResponse(response);
			$scope.eventLog.push({ timestamp: new Date(Date.now()).toLocaleTimeString(), service: { type: { name: "MatchStick Settings" } }, subEvents: [responseObj.data] });

			$scope.device.language = $scope.languages.filter(function (language) {
				return responseObj.data.language === language.code;
			})[0];
			$scope.device.macAddress = responseObj.data.macAddress;
			$scope.device.timezone = responseObj.data.timezone;
			$scope.device.softwareVersion = responseObj.data.version;
			return responseObj;
		});
	};
	$scope.getDeviceInfo2 = function () {
		var message = matchstickMessageGenerator.build("query", "device_info_2");
		return eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, true).then(function (response) {
			var responseObj = parseResponse(response);
			$scope.eventLog.push({ timestamp: new Date(Date.now()).toLocaleTimeString(), service: { type: { name: "MatchStick Settings" } }, subEvents: [responseObj.data] });

			$scope.device.scale = responseObj.data.ratio * 5;
			$scope.device.usbMode = responseObj.data.usb;
			return responseObj;
		});
	};
	$scope.getTVKeyCode = function () {
		if (!$scope.device.macAddress) return;
		var message = matchstickMessageGenerator.build("query", "key_code", {
			ap_mac: $scope.device.macAddress,
			imei: 863985028265716
		});
		return eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, true).then(function (response) {
			var responseObj = parseResponse(response);
			$scope.eventLog.push({ timestamp: new Date(Date.now()).toLocaleTimeString(), service: { type: { name: "MatchStick Settings" } }, subEvents: [responseObj.data] });
			$scope.tvKeyCode = responseObj.data.key_code;
			return responseObj;
		});
	};
	$scope.getDeviceScale = function () {
		//ratio between 10 (50%) and 20 (100%)
		var message = matchstickMessageGenerator.build("query", "device_scale");
		return eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, true).then(function (response) {
			var responseObj = parseResponse(response);
			$scope.eventLog.push({ timestamp: new Date(Date.now()).toLocaleTimeString(), service: { type: { name: "MatchStick Settings" } }, subEvents: [responseObj.data] });

			$scope.device.scale = responseObj.data.ratio * 5;
			return responseObj;
		});
	};

	$scope.setName = function setName() {
		//todo: put some kind of a debounce on here so we aren't updating on every keystroke
		var message = matchstickMessageGenerator.build("setting", "change_ssid", { name: $scope.device.name });
		eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, false);
	};
	$scope.setTimezone = function setTimezone() {
		var message = matchstickMessageGenerator.build("setting", "time_zone", { timezone: $scope.device.timezone });
		eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, false);
	};
	$scope.setLanguage = function setLanguage() {
		var message = matchstickMessageGenerator.build("setting", "language", { language: $scope.device.language.code });
		eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, false);
	};
	$scope.setUSBMode = function setUSBMode() {
		var message = matchstickMessageGenerator.buildv2("set_usb_mode", { usb: $scope.device.usbMode });
		eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, false);
	};
	$scope.setScale = function setScale() {
		var message = matchstickMessageGenerator.buildv2("scale", { ratio: $scope.device.scale / 5 });
		eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, false);
	};

	$scope.timezones = ["Africa/Abidjan", "Africa/Accra", "Africa/Addis_Ababa", "Africa/Algiers", "Africa/Asmara", "Africa/Asmera", "Africa/Bamako", "Africa/Bangui", "Africa/Banjul", "Africa/Bissau", "Africa/Blantyre", "Africa/Brazzaville", "Africa/Bujumbura", "Africa/Cairo", "Africa/Casablanca", "Africa/Ceuta", "Africa/Conakry", "Africa/Dakar", "Africa/Dar_es_Salaam", "Africa/Djibouti", "Africa/Douala", "Africa/El_Aaiun", "Africa/Freetown", "Africa/Gaborone", "Africa/Harare", "Africa/Johannesburg", "Africa/Kampala", "Africa/Khartoum", "Africa/Kigali", "Africa/Kinshasa", "Africa/Lagos", "Africa/Libreville", "Africa/Lome", "Africa/Luanda", "Africa/Lubumbashi", "Africa/Lusaka", "Africa/Malabo", "Africa/Maputo", "Africa/Maseru", "Africa/Mbabane", "Africa/Mogadishu", "Africa/Monrovia", "Africa/Nairobi", "Africa/Ndjamena", "Africa/Niamey", "Africa/Nouakchott", "Africa/Ouagadougou", "Africa/Porto-Novo", "Africa/Sao_Tome", "Africa/Timbuktu", "Africa/Tripoli", "Africa/Tunis", "Africa/Windhoek", "America/Adak", "America/Anchorage", "America/Anguilla", "America/Antigua", "America/Araguaina", "America/Argentina/Buenos_Aires", "America/Argentina/Catamarca", "America/Argentina/ComodRivadavia", "America/Argentina/Cordoba", "America/Argentina/Jujuy", "America/Argentina/La_Rioja", "America/Argentina/Mendoza", "America/Argentina/Rio_Gallegos", "America/Argentina/San_Juan", "America/Argentina/Tucuman", "America/Argentina/Ushuaia", "America/Aruba", "America/Asuncion", "America/Atikokan", "America/Atka", "America/Bahia", "America/Barbados", "America/Belem", "America/Belize", "America/Blanc-Sablon", "America/Boa_Vista", "America/Bogota", "America/Boise", "America/Buenos_Aires", "America/Cambridge_Bay", "America/Campo_Grande", "America/Cancun", "America/Caracas", "America/Catamarca", "America/Cayenne", "America/Cayman", "America/Chicago", "America/Chihuahua", "America/Coral_Harbour", "America/Cordoba", "America/Costa_Rica", "America/Cuiaba", "America/Curacao", "America/Danmarkshavn", "America/Dawson", "America/Dawson_Creek", "America/Denver", "America/Detroit", "America/Dominica", "America/Edmonton", "America/Eirunepe", "America/El_Salvador", "America/Ensenada", "America/Fort_Wayne", "America/Fortaleza", "America/Glace_Bay", "America/Godthab", "America/Goose_Bay", "America/Grand_Turk", "America/Grenada", "America/Guadeloupe", "America/Guatemala", "America/Guayaquil", "America/Guyana", "America/Halifax", "America/Havana", "America/Hermosillo", "America/Indiana/Indianapolis", "America/Indiana/Knox", "America/Indiana/Marengo", "America/Indiana/Petersburg", "America/Indiana/Tell_City", "America/Indiana/Vevay", "America/Indiana/Vincennes", "America/Indiana/Winamac", "America/Indianapolis", "America/Inuvik", "America/Iqaluit", "America/Jamaica", "America/Jujuy", "America/Juneau", "America/Kentucky/Louisville", "America/Kentucky/Monticello", "America/Knox_IN", "America/La_Paz", "America/Lima", "America/Los_Angeles", "America/Louisville", "America/Maceio", "America/Managua", "America/Manaus", "America/Marigot", "America/Martinique", "America/Mazatlan", "America/Mendoza", "America/Menominee", "America/Merida", "America/Mexico_City", "America/Miquelon", "America/Moncton", "America/Monterrey", "America/Montevideo", "America/Montreal", "America/Montserrat", "America/Nassau", "America/New_York", "America/Nipigon", "America/Nome", "America/Noronha", "America/North_Dakota/Center", "America/North_Dakota/New_Salem", "America/Panama", "America/Pangnirtung", "America/Paramaribo", "America/Phoenix", "America/Port-au-Prince", "America/Port_of_Spain", "America/Porto_Acre", "America/Porto_Velho", "America/Puerto_Rico", "America/Rainy_River", "America/Rankin_Inlet", "America/Recife", "America/Regina", "America/Resolute", "America/Rio_Branco", "America/Rosario", "America/Santiago", "America/Santo_Domingo", "America/Sao_Paulo", "America/Scoresbysund", "America/Shiprock", "America/St_Barthelemy", "America/St_Johns", "America/St_Kitts", "America/St_Lucia", "America/St_Thomas", "America/St_Vincent", "America/Swift_Current", "America/Tegucigalpa", "America/Thule", "America/Thunder_Bay", "America/Tijuana", "America/Toronto", "America/Tortola", "America/Vancouver", "America/Virgin", "America/Whitehorse", "America/Winnipeg", "America/Yakutat", "America/Yellowknife", "Antarctica/Casey", "Antarctica/Davis", "Antarctica/DumontDUrville", "Antarctica/Mawson", "Antarctica/McMurdo", "Antarctica/Palmer", "Antarctica/Rothera", "Antarctica/South_Pole", "Antarctica/Syowa", "Antarctica/Vostok", "Arctic/Longyearbyen", "Asia/Aden", "Asia/Almaty", "Asia/Amman", "Asia/Anadyr", "Asia/Aqtau", "Asia/Aqtobe", "Asia/Ashgabat", "Asia/Ashkhabad", "Asia/Baghdad", "\tAsia/Bahrain", "Asia/Baku", "Asia/Bangkok", "Asia/Beirut", "Asia/Bishkek", "Asia/Brunei", "Asia/Calcutta", "Asia/Choibalsan", "Asia/Chongqing", "Asia/Chungking", "Asia/Colombo", "Asia/Dacca", "Asia/Damascus", "Asia/Dhaka", "Asia/Dili", "Asia/Dubai", "Asia/Dushanbe", "Asia/Gaza", "Asia/Harbin", "Asia/Hong_Kong", "Asia/Hovd", "Asia/Irkutsk", "Asia/Istanbul", "Asia/Jakarta", "Asia/Jayapura", "Asia/Jerusalem", "Asia/Kabul", "Asia/Kamchatka", "Asia/Karachi", "Asia/Kashgar", "Asia/Katmandu", "Asia/Krasnoyarsk", "Asia/Kuala_Lumpur", "Asia/Kuching", "Asia/Kuwait", "Asia/Macao", "Asia/Macau", "Asia/Magadan", "Asia/Makassar", "Asia/Manila", "Asia/Muscat", "Asia/Nicosia", "Asia/Novosibirsk", "Asia/Omsk", "Asia/Oral", "Asia/Phnom_Penh", "Asia/Pontianak", "Asia/Pyongyang", "Asia/Qatar", "Asia/Qyzylorda", "Asia/Rangoon", "Asia/Riyadh", "Asia/Riyadh87", "Asia/Riyadh88", "Asia/Riyadh89", "Asia/Saigon", "Asia/Sakhalin", "Asia/Samarkand", "Asia/Seoul", "Asia/Shanghai", "Asia/Singapore", "Asia/Taipei", "Asia/Tashkent", "Asia/Tbilisi", "Asia/Tehran", "Asia/Tel_Aviv", "Asia/Thimbu", "Asia/Thimphu", "Asia/Tokyo", "Asia/Ujung_Pandang", "Asia/Ulaanbaatar", "Asia/Ulan_Bator", "Asia/Urumqi", "Asia/Vientiane", "Asia/Vladivostok", "Asia/Yakutsk", "Asia/Yekaterinburg", "Asia/Yerevan", "Atlantic/Azores", "Atlantic/Bermuda", "Atlantic/Canary", "Atlantic/Cape_Verde", "Atlantic/Faeroe", "Atlantic/Faroe", "Atlantic/Jan_Mayen", "Atlantic/Madeira", "Atlantic/Reykjavik", "Atlantic/South_Georgia", "Atlantic/St_Helena", "Atlantic/Stanley", "Australia/ACT", "Australia/Adelaide", "Australia/Brisbane", "Australia/Broken_Hill", "Australia/Canberra", "Australia/Currie", "Australia/Darwin", "Australia/Eucla", "Australia/Hobart", "Australia/LHI", "Australia/Lindeman", "Australia/Lord_Howe", "Australia/Melbourne", "Australia/NSW", "Australia/North", "Australia/Perth", "Australia/Queensland", "Australia/South", "Australia/Sydney", "Australia/Tasmania", "Australia/Victoria", "Australia/West", "\tAustralia/Yancowinna", "Brazil/Acre", "Brazil/DeNoronha", "Brazil/East", "Brazil/West", "CET", "CST6CDT", "Canada/Atlantic", "Canada/Central", "Canada/East-Saskatchewan", "Canada/Eastern", "Canada/Mountain", "Canada/Newfoundland", "Canada/Pacific", "Canada/Saskatchewan", "Canada/Yukon", "Chile/Continental", "Chile/EasterIsland", "Cuba", "EET", "EST", "EST5EDT", "Egypt", "Eire", "Etc/GMT", "Etc/GMT+0", "Etc/GMT+1", "Etc/GMT+10", "Etc/GMT+11", "Etc/GMT+12", "Etc/GMT+2", "Etc/GMT+3", "Etc/GMT+4", "Etc/GMT+5", "Etc/GMT+6", "Etc/GMT+7", "Etc/GMT+8", "Etc/GMT+9", "Etc/GMT-0", "Etc/GMT-1", "Etc/GMT-10", "Etc/GMT-11", "Etc/GMT-12", "Etc/GMT-13", "Etc/GMT-14", "Etc/GMT-2", "Etc/GMT-3", "Etc/GMT-4", "Etc/GMT-5", "Etc/GMT-6", "Etc/GMT-7", "Etc/GMT-8", "Etc/GMT-9", "Etc/GMT0", "Etc/Greenwich", "Etc/UCT", "Etc/UTC", "Etc/Universal", "Etc/Zulu", "Europe/Amsterdam", "Europe/Andorra", "Europe/Athens", "Europe/Belfast", "Europe/Belgrade", "Europe/Berlin", "Europe/Bratislava", "Europe/Brussels", "Europe/Bucharest", "Europe/Budapest", "Europe/Chisinau", "Europe/Copenhagen", "Europe/Dublin", "Europe/Gibraltar", "Europe/Guernsey", "Europe/Helsinki", "Europe/Isle_of_Man", "Europe/Istanbul", "Europe/Jersey", "Europe/Kaliningrad", "Europe/Kiev", "Europe/Lisbon", "Europe/Ljubljana", "Europe/London", "Europe/Luxembourg", "Europe/Madrid", "Europe/Malta", "Europe/Mariehamn", "Europe/Minsk", "Europe/Monaco", "Europe/Moscow", "Europe/Nicosia", "Europe/Oslo", "Europe/Paris", "Europe/Podgorica", "Europe/Prague", "Europe/Riga", "Europe/Rome", "Europe/Samara", "Europe/San_Marino", "Europe/Sarajevo", "Europe/Simferopol", "Europe/Skopje", "Europe/Sofia", "Europe/Stockholm", "Europe/Tallinn", "Europe/Tirane", "Europe/Tiraspol", "Europe/Uzhgorod", "Europe/Vaduz", "Europe/Vatican", "Europe/Vienna", "Europe/Vilnius", "\tEurope/Volgograd", "Europe/Warsaw", "Europe/Zagreb", "Europe/Zaporozhye", "Europe/Zurich", "Factory", "GB", "GB-Eire", "GMT", "GMT+0", "GMT-0", "GMT0", "Greenwich", "HST", "Hongkong", "Iceland", "Indian/Antananarivo", "Indian/Chagos", "Indian/Christmas", "Indian/Cocos", "Indian/Comoro", "Indian/Kerguelen", "Indian/Mahe", "Indian/Maldives", "Indian/Mauritius", "Indian/Mayotte", "Indian/Reunion", "Iran", "Israel", "Jamaica", "Japan", "Kwajalein", "Libya", "MET", "MST", "MST7MDT", "Mexico/BajaNorte", "Mexico/BajaSur", "Mexico/General", "Mideast/Riyadh87", "Mideast/Riyadh88", "Mideast/Riyadh89", "NZ", "NZ-CHAT", "Navajo", "PRC", "PST8PDT", "Pacific/Apia", "Pacific/Auckland", "Pacific/Chatham", "Pacific/Easter", "Pacific/Efate", "Pacific/Enderbury", "Pacific/Fakaofo", "Pacific/Fiji", "Pacific/Funafuti", "Pacific/Galapagos", "Pacific/Gambier", "Pacific/Guadalcanal", "Pacific/Guam", "Pacific/Honolulu", "Pacific/Johnston", "Pacific/Kiritimati", "Pacific/Kosrae", "Pacific/Kwajalein", "Pacific/Majuro", "Pacific/Marquesas", "Pacific/Midway", "Pacific/Nauru", "Pacific/Niue", "Pacific/Norfolk", "Pacific/Noumea", "Pacific/Pago_Pago", "Pacific/Palau", "Pacific/Pitcairn", "Pacific/Ponape", "Pacific/Port_Moresby", "Pacific/Rarotonga", "Pacific/Saipan", "Pacific/Samoa", "Pacific/Tahiti", "Pacific/Tarawa", "Pacific/Tongatapu", "Pacific/Truk", "Pacific/Wake", "Pacific/Wallis", "Pacific/Yap", "Poland", "Portugal", "ROC", "ROK", "Singapore", "Turkey", "UCT", "US/Alaska", "US/Aleutian", "US/Arizona", "US/Central", "US/East-Indiana", "US/Eastern", "US/Hawaii", "US/Indiana-Starke", "US/Michigan", "US/Mountain", "US/Pacific", "US/Pacific-New", "US/Samoa", "UTC", "Universal", "W-SU", "WET", "Zulu"];
	$scope.languages = [{ name: "English", code: "en-US" }, { name: "Chinese", code: "zh-CN" }];
	$scope.usbModes = ["ADB", "OTG"];

	$scope.getDeviceInfo().then(function () {
		return $scope.getTVKeyCode();
	});
	$scope.getDeviceInfo2();
	$scope.getNetworks();

	//todo: the below three aren't wired up and therefore are untested.  test and wire them up
	$scope.setWiFi = function setWiFi(wifiSettings) {
		//todo: validate that this actually works, then put something in the UI so it can be used.
		var message = matchstickMessageGenerator.build("setting", "wifi", {
			"wifi-hidden": network.isHidden,
			"wifi-password": network.password,
			"wifi-type": network.securityType,
			"wifi-name": network.ssid,
			"wifi-bssid": network.routerMac
		});
		eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, false);
	};
	$scope.setTime = function setTime(time) {
		//todo: fix me or delete me.  Need to look up what format the time should be in.  Should be able to find in ConnectionService.js
		var message = matchstickMessageGenerator.build("setting", "time_set", { time: time });
		eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, false);
	};
	$scope.register = function () {
		//todo: figure out what this is for
		var data = {
			data: { name: "wifi-setting" },
			message_type: "register",
			meta: { reply: false /*, connection_mode: "single"*/ },
			protocol_version: "1.0"
		};
		eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, data, false);
	};
});

function _slicedToArray(arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }

omniscience.controller("PlaybackController", function playbackController($scope, $interval, eventService, avTransportService, renderingControlService, pubSub) {
	"use strict";

	$scope.availableActions = ["play"];
	$scope.currentTransportActions = {};
	$scope.deviceCapabilities = {};
	$scope.transportSettings = {};
	$scope.transportInfo = {};
	$scope.record = {};
	$scope.presets = [];
	$scope.currentTrack = {};
	$scope.currentMedia = {};
	$scope.nextMedia = {};
	$scope.playback = { state: "stopped" };
	$scope.volume = 100;
	$scope.isMuted = false;

	$scope.toggleMute = function toggleMute() {
		setMute(!$scope.isMuted);
	};
	$scope.incrementVolume = function incrementVolume() {
		setVolume(Number($scope.volume) + 1);
	};
	$scope.decrementVolume = function decrementVolume() {
		setVolume(Number($scope.volume) - 1);
	};
	$scope.percentComplete = function percentComplete() {
		return $scope.currentTrack.currentSeconds / $scope.currentTrack.totalSeconds * 100;
	};
	$scope.stop = function () {
		pubSub.pub("stop");
	};
	$scope.play = function () {
		pubSub.pub("play");
	};
	$scope.pause = function () {
		pubSub.pub("pause");
	};
	$scope.next = function (abideByRepeat) {
		pubSub.pub("next", abideByRepeat);
	};
	$scope.previous = function () {
		pubSub.pub("previous");
	};

	function updatePlaybackState(newState) {
		$scope.playback.state = newState;
	}

	function setVolume(newVolume) {
		$scope.volume = newVolume;
		renderingControlService.setVolume(newVolume);
	}
	function setMute(mute) {
		$scope.isMuted = mute;
		renderingControlService.setMute(mute);
	}
	function fractionToFloat(fraction) {
		var y = fraction.split(" ");
		if (y.length > 1) {
			var z = y[1].split("/");
			return +y[0] + z[0] / z[1];
		} else {
			var z = y[0].split("/");
			if (z.length > 1) return z[0] / z[1];else return z[0];
		}
	}

	function getNameFromUrl(url) {
		try {
			if (!(url instanceof URL)) url = new URL(url);
		} catch (e) {
			return "";
		}

		return decodeURI(url.pathname.replace(/^.*(\\|\/|\:)/, ""));
	}

	function secondsToMinutes(duration) {
		var minutesPart = parseInt(duration / 60);
		var secondsPart = duration % 60;

		if (secondsPart.toString().length === 1) secondsPart = "0" + secondsPart;

		return minutesPart + ":" + secondsPart;
	}
	function durationToSeconds(duration) {
		//[+-]H+:MM:SS[.F+] or H+:MM:SS[.F0/F1]
		//H+ means one or more digits to indicate elapsed hours
		//MM means exactly 2 digits to indicate minutes (00 to 59)
		//SS means exactly 2 digits to indicate seconds (00 to 59)
		//[.F+] means optionally a dot followed by one or more digits to indicate fractions of seconds
		//[.F0/F1] means optionally a dot followed by a fraction, with F0 and F1 at least one digit long, and F0 < F1

		if (duration.toLowerCase() === "not_implemented") return 0;

		duration = duration.replace(/[\+\-]/g, ""); //remove any + or -
		duration = duration.replace(/\.*/, ""); //remove any fractional seconds

		var _duration$split = duration.split(":");

		var _duration$split2 = _slicedToArray(_duration$split, 3);

		var hours = _duration$split2[0];
		var minutes = _duration$split2[1];
		var seconds = _duration$split2[2];

		return parseInt(seconds) + parseInt(minutes) * 60 + parseInt(hours) * 3600;
	}
	function parseDLNATime(duration) {
		var timeInSeconds = durationToSeconds(duration);
		return { seconds: timeInSeconds, minutes: secondsToMinutes(timeInSeconds) };
	}

	function parsePositionInfo(response) {
		var current = parseDLNATime(response.RelTime);
		var total = parseDLNATime(response.TrackDuration);

		$scope.currentTrack.currentSeconds = current.seconds;
		$scope.currentTrack.currentMinutes = current.minutes;
		$scope.currentTrack.totalSeconds = total.seconds;
		$scope.currentTrack.totalMinutes = total.minutes;
		$scope.currentTrack.uri = response.TrackURI;
		$scope.currentTrack.name = getNameFromUrl(response.TrackURI);
		$scope.currentTrack.metadata = response.TrackMetaData;
	}
	function parseRenderControlLastChangeEvent(lastChangeEvent) {
		if (lastChangeEvent.hasOwnProperty("Mute")) $scope.isMuted = lastChangeEvent.Mute === "1" || lastChangeEvent.Mute === "true";
		if (lastChangeEvent.hasOwnProperty("Volume")) $scope.volume = parseInt(lastChangeEvent.Volume);
		if (lastChangeEvent.hasOwnProperty("PresetNameList")) $scope.presets = lastChangeEvent.PresetNameList.split(",");
	}
	function parseAVTransportLastChangeEvent(lastChangeEvent) {
		//The first time a last change event returns it sends back all possible properties with their current values
		//after that it sends whichever properties changed since the last time.  Thus we cannot predict which properties
		//will exist and which will be null

		if (lastChangeEvent.hasOwnProperty("AVTransportURI")) $scope.currentMedia.uri = lastChangeEvent.AVTransportURI;
		if (lastChangeEvent.hasOwnProperty("AVTransportURIMetaData")) $scope.currentMedia.metadata = lastChangeEvent.AVTransportURIMetaData;
		if (lastChangeEvent.hasOwnProperty("CurrentPlayMode")) $scope.playback.mode = lastChangeEvent.CurrentPlayMode;
		if (lastChangeEvent.hasOwnProperty("CurrentRecordQualityMode")) $scope.record.currentQualityMode = lastChangeEvent.CurrentRecordQualityMode;
		if (lastChangeEvent.hasOwnProperty("CurrentTrack")) $scope.currentTrack.trackNumber = lastChangeEvent.CurrentTrack;
		if (lastChangeEvent.hasOwnProperty("CurrentTrackMetaData")) $scope.currentTrack.metadata = lastChangeEvent.CurrentTrackMetaData;
		if (lastChangeEvent.hasOwnProperty("CurrentTransportActions")) $scope.availableActions = lastChangeEvent.CurrentTransportActions.split(",");
		if (lastChangeEvent.hasOwnProperty("NumberOfTracks")) $scope.currentMedia.trackCount = lastChangeEvent.NumberOfTracks;
		if (lastChangeEvent.hasOwnProperty("PlaybackStorageMedium")) $scope.playback.storageMedium = lastChangeEvent.PlaybackStorageMedium;
		if (lastChangeEvent.hasOwnProperty("PossiblePlaybackStorageMedia")) $scope.playback.possibleStorageMedia = lastChangeEvent.PossiblePlaybackStorageMedia;
		if (lastChangeEvent.hasOwnProperty("PossibleRecordStorageMedia")) $scope.record.possilbeStorageMedium = lastChangeEvent.PossibleRecordStorageMedia;
		if (lastChangeEvent.hasOwnProperty("PossibleRecordQualityModes")) $scope.record.possibleQualityModes = lastChangeEvent.PossibleRecordQualityModes;
		if (lastChangeEvent.hasOwnProperty("NextAVTransportURI")) $scope.nextMedia.uri = lastChangeEvent.NextAVTransportURI;
		if (lastChangeEvent.hasOwnProperty("NextAVTransportURIMetaData")) $scope.nextMedia.metadata = lastChangeEvent.NextAVTransportURIMetaData;
		if (lastChangeEvent.hasOwnProperty("RecordMediumWriteStatus")) $scope.record.mediumWriteStatus = lastChangeEvent.RecordMediumWriteStatus;
		if (lastChangeEvent.hasOwnProperty("RecordStorageMedium")) $scope.record.storageMedium = lastChangeEvent.RecordStorageMedium;
		if (lastChangeEvent.hasOwnProperty("TransportStatus")) $scope.playback.status = lastChangeEvent.TransportStatus;
		// Supported speeds can be retrieved from the AllowedValueList of this state variable in the AVTransport service description.
		// 1 is required, 0 is not allowed.
		//Example values are '1', '1/2', '2', '-1', '1/10', etc
		if (lastChangeEvent.hasOwnProperty("TransportPlaySpeed")) $scope.playback.speed = fractionToFloat(lastChangeEvent.TransportPlaySpeed);

		if (lastChangeEvent.hasOwnProperty("CurrentTrackDuration")) {
			var trackTotal = parseDLNATime(lastChangeEvent.CurrentTrackDuration);
			$scope.currentTrack.totalTime = trackTotal.minutes;
			$scope.currentTrack.totalSeconds = trackTotal.seconds;
		}
		if (lastChangeEvent.hasOwnProperty("CurrentMediaDuration")) {
			var mediaTotal = parseDLNATime(lastChangeEvent.CurrentMediaDuration);
			$scope.currentMedia.totalTime = mediaTotal.minutes;
			$scope.currentMedia.totalSeconds = mediaTotal.seconds;
		}
		if (lastChangeEvent.hasOwnProperty("TransportState")) {
			if (lastChangeEvent.TransportState.toLowerCase() === "stopped" && $scope.playback.state.toLowerCase() === "playing") {
				//we are at the end of the song and currently playing. Play next song
				//todo: having two computers on the same network on the same device will be an issue here
				$scope.next(true);
			}
			updatePlaybackState(lastChangeEvent.TransportState);
		}
		if (lastChangeEvent.hasOwnProperty("CurrentTrackURI")) {
			$scope.currentTrack.uri = lastChangeEvent.CurrentTrackURI;
			$scope.currentTrack.name = getNameFromUrl(lastChangeEvent.CurrentTrackURI);
		}
	}

	$scope.$on("keydown", function (notSureWhatThisIs, event) {
		if (event.target.tagName.toLowerCase() === "input") return;

		switch (event.key.toLowerCase()) {
			case " ":
				if ($scope.playback.state === "playing") $scope.pause();else $scope.play();;
				break;
			case "arrowright":
				$scope.next(false);
				break;
			case "arrowleft":
				$scope.previous();
				break;
			case "delete":
				pubSub.pub("removeCurrent");
				break;
		}
	});

	avTransportService.subscribe(null, function (response) {
		response.forEach(parseAVTransportLastChangeEvent);
	});
	renderingControlService.subscribe(null, function (response) {
		response.forEach(parseRenderControlLastChangeEvent);
	});

	//var interval = $interval(() => avTransportService.getPositionInfo().then((response) => parsePositionInfo(response)), 1000);

	$scope.$on("$destroy", function () {
		renderingControlService.unsubscribe();
		avTransportService.unsubscribe();
		//$interval.cancel(interval);
	});

	pubSub.sub("updatePlaybackState", updatePlaybackState, $scope);
});

omniscience.controller("PlaylistController", function PlaylistController($scope, $timeout, avTransportService, fileService, pubSub) {
	"use strict";

	$scope.filePickerisOpen = true;
	$scope.filePicker = {};
	$scope.repeat = false;
	$scope.playlist = [];
	$scope.slideshow = { duration: 10000, timeout: null };
	$scope.currentFile = {};

	$scope.play = function play(file) {
		pauseSlideshow();
		pubSub.pub("updatePlaybackState", "playing");
		if (file) load(file).then(function () {
			return avTransportService.play();
		});else avTransportService.play();

		//set timeout for image $scope.slideshow
		if ($scope.currentFile.type && $scope.currentFile.type.indexOf("image/") == 0) startSlideshow();
	};
	$scope.pause = function pause() {
		pubSub.pub("updatePlaybackState", "paused");
		avTransportService.pause();
		pauseSlideshow();
	};
	$scope.stop = function stop() {
		pubSub.pub("updatePlaybackState", "stopped");
		pauseSlideshow();
		return avTransportService.stop();
	};
	$scope.previous = function previous() {
		var previousTrack = $scope.playlist[$scope.playlist.length - 1];
		for (var i = 0; i < $scope.playlist.length; i++) {
			if ($scope.playlist[i] === $scope.currentFile) return $scope.play(previousTrack);
			previousTrack = $scope.playlist[i];
		}
	};
	$scope.next = function next(abideByRepeat) {
		for (var i = 0; i < $scope.playlist.length; i++) {
			if ($scope.playlist[i] === $scope.currentFile) if (i == $scope.playlist.length - 1) if (!abideByRepeat || $scope.repeat) return $scope.play($scope.playlist[0]); //we are the last file and either pushed the next button, or repeat is enabled, so play the first file
			else {
				//we are the last file, didn't push the button and repeat is not enabled.  Stop playback, then load the first file
				$scope.stop().then(function () {
					return load($scope.playlist[0]);
				});
			} else return $scope.play($scope.playlist[Number(i) + 1]); //we are not the last file so play the next
		}
	};
	$scope.add = function add(playImmediately) {
		//Adds files to playlist from file picker box and returns the added files
		var files = getChosenFiles();
		files.forEach(function (file) {
			return $scope.playlist.push(file);
		});

		if (playImmediately) $scope.play(files[0]);

		return files;
	};
	$scope.clear = function clear() {
		$scope.playlist.length = 0; //setting to [] will not clear out other references to this array.
		$scope.stop();
	};
	$scope.randomize = function randomize() {
		shuffle($scope.playlist);
	};
	$scope.remove = function remove(file) {
		for (var i = 0; i < $scope.playlist.length; i++) if ($scope.playlist[i] === file) {
			if (file === $scope.currentFile) {
				if ($scope.playlist.length > 1) $scope.next(true); //more files in $scope.playlist, play next
				else $scope.stop(); //only file in $scope.playlist, stop playback
			}
			$scope.playlist.splice(i, 1);
			return;
		}
	};
	$scope.removeCurrent = function () {
		if ($scope.currentFile) $scope.remove($scope.currentFile);
	};
	function shuffle(array) {
		///Fisher–Yates Shuffle
		var currentIndex = array.length,
		    temporaryValue,
		    randomIndex;

		// While there remain elements to shuffle
		while (0 !== currentIndex) {
			// Pick a remaining element
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}
	function startSlideshow() {
		$scope.slideshow.timeout = $timeout(function () {
			return $scope.next(true);
		}, $scope.slideshow.duration);
	}
	function pauseSlideshow() {
		if ($scope.slideshow.timeout) $timeout.cancel($scope.slideshow.timeout);
	}

	$scope.browseLocalFiles = function () {
		fileService.chooseFiles().then(function (files) {
			return setNewFiles(files);
		});
	};

	function getChosenFiles() {
		//todo: pull in the file info - such as duration, artist, song/video name
		var files = [];

		if ($scope.filePicker.urlPath && $scope.filePicker.urlPath.length > 0) {
			try {
				new URL($scope.filePicker.urlPath);
			} catch (e) {}
			$scope.filePicker.url = {
				path: $scope.filePicker.urlPath,
				name: $scope.filePicker.urlPath.replace(/^.*(\\|\/|\:)/, "") //set file name from url
			};

			files.push($scope.filePicker.url);
		} else if ($scope.filePicker.localFiles && $scope.filePicker.localFiles.length > 0) files = $scope.filePicker.localFiles;else return []; //no files are selected and url isn't set so don't do anything, just return

		$scope.filePicker = {}; //clear out the url and local file fields

		return files;
	}
	function setNewFiles(files) {
		if (Array.isArray(files)) files.forEach(function (file) {
			return file.isLocal = true;
		});

		$scope.filePicker.localFiles = files;

		if (files == null || files.length == 0) {
			// no files selected
			$scope.filePicker.localFileText = "";
			$scope.filePicker.paths = "";
		} else if (files.length == 1) {
			// one file selected
			$scope.filePicker.localFileText = files[0].path;
			$scope.filePicker.paths = "";
		} else {
			// multiple files selected
			$scope.filePicker.localFileText = "Multiple Files Selected";
			$scope.filePicker.paths = files.map(function (file) {
				return file.path;
			}).join("\n");
		}
	}
	function load(file) {
		$scope.currentFile = file;
		return fileService.shareFile(file, avTransportService.getServerIP()).then(function (fileUri) {
			return avTransportService.setAvTransportUri(fileUri, "");
		});
	}

	pubSub.sub("removeCurrent", $scope.removeCurrent, $scope);
	pubSub.sub("play", $scope.play, $scope);
	pubSub.sub("stop", $scope.stop, $scope);
	pubSub.sub("pause", $scope.pause, $scope);
	pubSub.sub("previous", $scope.previous, $scope);
	pubSub.sub("next", $scope.next, $scope);
});

//todo: invalid url should report that to user and abort
