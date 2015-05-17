﻿omniscience.controller('MatchStickSettingsController', function MatchStickSettingsController($scope, eventService, matchstickMessageGenerator) {
	"use strict";

	var controlUrl = new URL($scope.device.address);
	controlUrl.port = 8881;

	function parseResponse(response) {
		return JSON.parse(response._data.slice(response._data.length.toString().length + 1));
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
		return eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, true).then((response) => {
			var responseObj = parseResponse(response);

			$scope.visibleNetworks = responseObj.data.networks;
			$scope.eventLog.push({ timestamp: new Date(Date.now()).toLocaleTimeString(), service: { type: { name: "MatchStick Settings" } }, subEvents: [responseObj.data] });
			return responseObj;
		});
	};
	$scope.getDeviceInfo = function () {
		var message = matchstickMessageGenerator.build("query", "device_info");
		return eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, true).then((response) => {
			var responseObj = parseResponse(response);
			$scope.eventLog.push({ timestamp: new Date(Date.now()).toLocaleTimeString(), service: { type: { name: "MatchStick Settings" } }, subEvents: [responseObj.data] });

			$scope.device.language = $scope.languages.filter(language => responseObj.data.language === language.code)[0];
			$scope.device.macAddress = responseObj.data.macAddress;
			$scope.device.timezone = responseObj.data.timezone;
			$scope.device.softwareVersion = responseObj.data.version;
			return responseObj;
		});
	};
	$scope.getDeviceInfo2 = function () {
		var message = matchstickMessageGenerator.build("query", "device_info_2");
		return eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, true).then((response) => {
			var responseObj = parseResponse(response);
			$scope.eventLog.push({ timestamp: new Date(Date.now()).toLocaleTimeString(), service: { type: { name: "MatchStick Settings" } }, subEvents: [responseObj.data] });

			$scope.device.scale = responseObj.data.ratio*5;
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
		return eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, true)
			.then((response) => {
				var responseObj = parseResponse(response);
				$scope.eventLog.push({ timestamp: new Date(Date.now()).toLocaleTimeString(), service: { type: { name: "MatchStick Settings" } }, subEvents: [responseObj.data] });
				$scope.tvKeyCode = responseObj.data.key_code;
				return responseObj;
			});
	};
	$scope.getDeviceScale = function () {
		//ratio between 10 (50%) and 20 (100%)
		var message = matchstickMessageGenerator.build("query", "device_scale");
		return eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, true).then((response) => {
			var responseObj = parseResponse(response);
			$scope.eventLog.push({ timestamp: new Date(Date.now()).toLocaleTimeString(), service: { type: { name: "MatchStick Settings" } }, subEvents: [responseObj.data] });

			$scope.device.scale = responseObj.data.ratio*5;
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
		var message = matchstickMessageGenerator.buildv2('scale', { ratio: $scope.device.scale / 5 });
		eventService.emit("sendTCP", controlUrl.hostname, controlUrl.port, message, false);
	};

	$scope.timezones = ['Africa/Abidjan', 'Africa/Accra', 'Africa/Addis_Ababa', 'Africa/Algiers', 'Africa/Asmara', 'Africa/Asmera', 'Africa/Bamako', 'Africa/Bangui', 'Africa/Banjul', 'Africa/Bissau',
		'Africa/Blantyre', 'Africa/Brazzaville', 'Africa/Bujumbura', 'Africa/Cairo', 'Africa/Casablanca', 'Africa/Ceuta', 'Africa/Conakry', 'Africa/Dakar', 'Africa/Dar_es_Salaam', 'Africa/Djibouti',
		'Africa/Douala', 'Africa/El_Aaiun', 'Africa/Freetown', 'Africa/Gaborone', 'Africa/Harare', 'Africa/Johannesburg', 'Africa/Kampala', 'Africa/Khartoum', 'Africa/Kigali', 'Africa/Kinshasa', 'Africa/Lagos',
		'Africa/Libreville', 'Africa/Lome', 'Africa/Luanda', 'Africa/Lubumbashi', 'Africa/Lusaka', 'Africa/Malabo', 'Africa/Maputo', 'Africa/Maseru', 'Africa/Mbabane', 'Africa/Mogadishu', 'Africa/Monrovia',
		'Africa/Nairobi', 'Africa/Ndjamena', 'Africa/Niamey', 'Africa/Nouakchott', 'Africa/Ouagadougou', 'Africa/Porto-Novo', 'Africa/Sao_Tome', 'Africa/Timbuktu', 'Africa/Tripoli', 'Africa/Tunis', 'Africa/Windhoek',
		'America/Adak', 'America/Anchorage', 'America/Anguilla', 'America/Antigua', 'America/Araguaina', 'America/Argentina/Buenos_Aires', 'America/Argentina/Catamarca', 'America/Argentina/ComodRivadavia',
		'America/Argentina/Cordoba', 'America/Argentina/Jujuy', 'America/Argentina/La_Rioja', 'America/Argentina/Mendoza', 'America/Argentina/Rio_Gallegos', 'America/Argentina/San_Juan', 'America/Argentina/Tucuman',
		'America/Argentina/Ushuaia', 'America/Aruba', 'America/Asuncion', 'America/Atikokan', 'America/Atka', 'America/Bahia', 'America/Barbados', 'America/Belem', 'America/Belize', 'America/Blanc-Sablon',
		'America/Boa_Vista', 'America/Bogota', 'America/Boise', 'America/Buenos_Aires', 'America/Cambridge_Bay', 'America/Campo_Grande', 'America/Cancun', 'America/Caracas', 'America/Catamarca', 'America/Cayenne',
		'America/Cayman', 'America/Chicago', 'America/Chihuahua', 'America/Coral_Harbour', 'America/Cordoba', 'America/Costa_Rica', 'America/Cuiaba', 'America/Curacao', 'America/Danmarkshavn', 'America/Dawson',
		'America/Dawson_Creek', 'America/Denver', 'America/Detroit', 'America/Dominica', 'America/Edmonton', 'America/Eirunepe', 'America/El_Salvador', 'America/Ensenada', 'America/Fort_Wayne', 'America/Fortaleza',
		'America/Glace_Bay', 'America/Godthab', 'America/Goose_Bay', 'America/Grand_Turk', 'America/Grenada', 'America/Guadeloupe', 'America/Guatemala', 'America/Guayaquil', 'America/Guyana', 'America/Halifax',
		'America/Havana', 'America/Hermosillo', 'America/Indiana/Indianapolis', 'America/Indiana/Knox', 'America/Indiana/Marengo', 'America/Indiana/Petersburg', 'America/Indiana/Tell_City', 'America/Indiana/Vevay',
		'America/Indiana/Vincennes', 'America/Indiana/Winamac', 'America/Indianapolis', 'America/Inuvik', 'America/Iqaluit', 'America/Jamaica', 'America/Jujuy', 'America/Juneau', 'America/Kentucky/Louisville',
		'America/Kentucky/Monticello', 'America/Knox_IN', 'America/La_Paz', 'America/Lima', 'America/Los_Angeles', 'America/Louisville', 'America/Maceio', 'America/Managua', 'America/Manaus', 'America/Marigot',
		'America/Martinique', 'America/Mazatlan', 'America/Mendoza', 'America/Menominee', 'America/Merida', 'America/Mexico_City', 'America/Miquelon', 'America/Moncton', 'America/Monterrey', 'America/Montevideo',
		'America/Montreal', 'America/Montserrat', 'America/Nassau', 'America/New_York', 'America/Nipigon', 'America/Nome', 'America/Noronha', 'America/North_Dakota/Center', 'America/North_Dakota/New_Salem',
		'America/Panama', 'America/Pangnirtung', 'America/Paramaribo', 'America/Phoenix', 'America/Port-au-Prince', 'America/Port_of_Spain', 'America/Porto_Acre', 'America/Porto_Velho', 'America/Puerto_Rico',
		'America/Rainy_River', 'America/Rankin_Inlet', 'America/Recife', 'America/Regina', 'America/Resolute', 'America/Rio_Branco', 'America/Rosario', 'America/Santiago', 'America/Santo_Domingo', 'America/Sao_Paulo',
		'America/Scoresbysund', 'America/Shiprock', 'America/St_Barthelemy', 'America/St_Johns', 'America/St_Kitts', 'America/St_Lucia', 'America/St_Thomas', 'America/St_Vincent', 'America/Swift_Current',
		'America/Tegucigalpa', 'America/Thule', 'America/Thunder_Bay', 'America/Tijuana', 'America/Toronto', 'America/Tortola', 'America/Vancouver', 'America/Virgin', 'America/Whitehorse', 'America/Winnipeg',
		'America/Yakutat', 'America/Yellowknife', 'Antarctica/Casey', 'Antarctica/Davis', 'Antarctica/DumontDUrville', 'Antarctica/Mawson', 'Antarctica/McMurdo', 'Antarctica/Palmer', 'Antarctica/Rothera',
		'Antarctica/South_Pole', 'Antarctica/Syowa', 'Antarctica/Vostok', 'Arctic/Longyearbyen', 'Asia/Aden', 'Asia/Almaty', 'Asia/Amman', 'Asia/Anadyr', 'Asia/Aqtau', 'Asia/Aqtobe', 'Asia/Ashgabat',
		'Asia/Ashkhabad', 'Asia/Baghdad', '	Asia/Bahrain', 'Asia/Baku', 'Asia/Bangkok', 'Asia/Beirut', 'Asia/Bishkek', 'Asia/Brunei', 'Asia/Calcutta', 'Asia/Choibalsan', 'Asia/Chongqing', 'Asia/Chungking',
		'Asia/Colombo', 'Asia/Dacca', 'Asia/Damascus', 'Asia/Dhaka', 'Asia/Dili', 'Asia/Dubai', 'Asia/Dushanbe', 'Asia/Gaza', 'Asia/Harbin', 'Asia/Hong_Kong', 'Asia/Hovd', 'Asia/Irkutsk', 'Asia/Istanbul',
		'Asia/Jakarta', 'Asia/Jayapura', 'Asia/Jerusalem', 'Asia/Kabul', 'Asia/Kamchatka', 'Asia/Karachi', 'Asia/Kashgar', 'Asia/Katmandu', 'Asia/Krasnoyarsk', 'Asia/Kuala_Lumpur', 'Asia/Kuching', 'Asia/Kuwait',
		'Asia/Macao', 'Asia/Macau', 'Asia/Magadan', 'Asia/Makassar', 'Asia/Manila', 'Asia/Muscat', 'Asia/Nicosia', 'Asia/Novosibirsk', 'Asia/Omsk', 'Asia/Oral', 'Asia/Phnom_Penh', 'Asia/Pontianak', 'Asia/Pyongyang',
		'Asia/Qatar', 'Asia/Qyzylorda', 'Asia/Rangoon', 'Asia/Riyadh', 'Asia/Riyadh87', 'Asia/Riyadh88', 'Asia/Riyadh89', 'Asia/Saigon', 'Asia/Sakhalin', 'Asia/Samarkand', 'Asia/Seoul', 'Asia/Shanghai',
		'Asia/Singapore', 'Asia/Taipei', 'Asia/Tashkent', 'Asia/Tbilisi', 'Asia/Tehran', 'Asia/Tel_Aviv', 'Asia/Thimbu', 'Asia/Thimphu', 'Asia/Tokyo', 'Asia/Ujung_Pandang', 'Asia/Ulaanbaatar', 'Asia/Ulan_Bator',
		'Asia/Urumqi', 'Asia/Vientiane', 'Asia/Vladivostok', 'Asia/Yakutsk', 'Asia/Yekaterinburg', 'Asia/Yerevan', 'Atlantic/Azores', 'Atlantic/Bermuda', 'Atlantic/Canary', 'Atlantic/Cape_Verde', 'Atlantic/Faeroe',
		'Atlantic/Faroe', 'Atlantic/Jan_Mayen', 'Atlantic/Madeira', 'Atlantic/Reykjavik', 'Atlantic/South_Georgia', 'Atlantic/St_Helena', 'Atlantic/Stanley', 'Australia/ACT', 'Australia/Adelaide',
		'Australia/Brisbane', 'Australia/Broken_Hill', 'Australia/Canberra', 'Australia/Currie', 'Australia/Darwin', 'Australia/Eucla', 'Australia/Hobart', 'Australia/LHI', 'Australia/Lindeman',
		'Australia/Lord_Howe', 'Australia/Melbourne', 'Australia/NSW', 'Australia/North', 'Australia/Perth', 'Australia/Queensland', 'Australia/South', 'Australia/Sydney', 'Australia/Tasmania',
		'Australia/Victoria', 'Australia/West', '	Australia/Yancowinna', 'Brazil/Acre', 'Brazil/DeNoronha', 'Brazil/East', 'Brazil/West', 'CET', 'CST6CDT', 'Canada/Atlantic', 'Canada/Central',
		'Canada/East-Saskatchewan', 'Canada/Eastern', 'Canada/Mountain', 'Canada/Newfoundland', 'Canada/Pacific', 'Canada/Saskatchewan', 'Canada/Yukon', 'Chile/Continental', 'Chile/EasterIsland', 'Cuba', 'EET',
		'EST', 'EST5EDT', 'Egypt', 'Eire', 'Etc/GMT', 'Etc/GMT+0', 'Etc/GMT+1', 'Etc/GMT+10', 'Etc/GMT+11', 'Etc/GMT+12', 'Etc/GMT+2', 'Etc/GMT+3', 'Etc/GMT+4', 'Etc/GMT+5', 'Etc/GMT+6', 'Etc/GMT+7', 'Etc/GMT+8',
		'Etc/GMT+9', 'Etc/GMT-0', 'Etc/GMT-1', 'Etc/GMT-10', 'Etc/GMT-11', 'Etc/GMT-12', 'Etc/GMT-13', 'Etc/GMT-14', 'Etc/GMT-2', 'Etc/GMT-3', 'Etc/GMT-4', 'Etc/GMT-5', 'Etc/GMT-6', 'Etc/GMT-7', 'Etc/GMT-8',
		'Etc/GMT-9', 'Etc/GMT0', 'Etc/Greenwich', 'Etc/UCT', 'Etc/UTC', 'Etc/Universal', 'Etc/Zulu', 'Europe/Amsterdam', 'Europe/Andorra', 'Europe/Athens', 'Europe/Belfast', 'Europe/Belgrade', 'Europe/Berlin',
		'Europe/Bratislava', 'Europe/Brussels', 'Europe/Bucharest', 'Europe/Budapest', 'Europe/Chisinau', 'Europe/Copenhagen', 'Europe/Dublin', 'Europe/Gibraltar', 'Europe/Guernsey', 'Europe/Helsinki',
		'Europe/Isle_of_Man', 'Europe/Istanbul', 'Europe/Jersey', 'Europe/Kaliningrad', 'Europe/Kiev', 'Europe/Lisbon', 'Europe/Ljubljana', 'Europe/London', 'Europe/Luxembourg', 'Europe/Madrid', 'Europe/Malta',
		'Europe/Mariehamn', 'Europe/Minsk', 'Europe/Monaco', 'Europe/Moscow', 'Europe/Nicosia', 'Europe/Oslo', 'Europe/Paris', 'Europe/Podgorica', 'Europe/Prague', 'Europe/Riga', 'Europe/Rome', 'Europe/Samara',
		'Europe/San_Marino', 'Europe/Sarajevo', 'Europe/Simferopol', 'Europe/Skopje', 'Europe/Sofia', 'Europe/Stockholm', 'Europe/Tallinn', 'Europe/Tirane', 'Europe/Tiraspol', 'Europe/Uzhgorod', 'Europe/Vaduz',
		'Europe/Vatican', 'Europe/Vienna', 'Europe/Vilnius', '	Europe/Volgograd', 'Europe/Warsaw', 'Europe/Zagreb', 'Europe/Zaporozhye', 'Europe/Zurich', 'Factory', 'GB', 'GB-Eire', 'GMT', 'GMT+0', 'GMT-0',
		'GMT0', 'Greenwich', 'HST', 'Hongkong', 'Iceland', 'Indian/Antananarivo', 'Indian/Chagos', 'Indian/Christmas', 'Indian/Cocos', 'Indian/Comoro', 'Indian/Kerguelen', 'Indian/Mahe', 'Indian/Maldives',
		'Indian/Mauritius', 'Indian/Mayotte', 'Indian/Reunion', 'Iran', 'Israel', 'Jamaica', 'Japan', 'Kwajalein', 'Libya', 'MET', 'MST', 'MST7MDT', 'Mexico/BajaNorte', 'Mexico/BajaSur', 'Mexico/General',
		'Mideast/Riyadh87', 'Mideast/Riyadh88', 'Mideast/Riyadh89', 'NZ', 'NZ-CHAT', 'Navajo', 'PRC', 'PST8PDT', 'Pacific/Apia', 'Pacific/Auckland', 'Pacific/Chatham', 'Pacific/Easter', 'Pacific/Efate',
		'Pacific/Enderbury', 'Pacific/Fakaofo', 'Pacific/Fiji', 'Pacific/Funafuti', 'Pacific/Galapagos', 'Pacific/Gambier', 'Pacific/Guadalcanal', 'Pacific/Guam', 'Pacific/Honolulu', 'Pacific/Johnston',
		'Pacific/Kiritimati', 'Pacific/Kosrae', 'Pacific/Kwajalein', 'Pacific/Majuro', 'Pacific/Marquesas', 'Pacific/Midway', 'Pacific/Nauru', 'Pacific/Niue', 'Pacific/Norfolk', 'Pacific/Noumea',
		'Pacific/Pago_Pago', 'Pacific/Palau', 'Pacific/Pitcairn', 'Pacific/Ponape', 'Pacific/Port_Moresby', 'Pacific/Rarotonga', 'Pacific/Saipan', 'Pacific/Samoa', 'Pacific/Tahiti', 'Pacific/Tarawa',
		'Pacific/Tongatapu', 'Pacific/Truk', 'Pacific/Wake', 'Pacific/Wallis', 'Pacific/Yap', 'Poland', 'Portugal', 'ROC', 'ROK', 'Singapore', 'Turkey', 'UCT', 'US/Alaska', 'US/Aleutian', 'US/Arizona',
		'US/Central', 'US/East-Indiana', 'US/Eastern', 'US/Hawaii', 'US/Indiana-Starke', 'US/Michigan', 'US/Mountain', 'US/Pacific', 'US/Pacific-New', 'US/Samoa', 'UTC', 'Universal', 'W-SU', 'WET', 'Zulu'];
	$scope.languages = [
		{ name: 'English', code: 'en-US' },
		{ name: 'Chinese', code: 'zh-CN' }
	];
	$scope.usbModes = ['ADB', 'OTG'];

	$scope.getDeviceInfo().then(() => $scope.getTVKeyCode());
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
		var message = matchstickMessageGenerator.build("setting", "time_set", { time });
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