window.omniscience.factory('loggerService', function ($rootScope, $sce) {
	"use strict";

	$rootScope.eventLog = $rootScope.eventLog || [];

	function syntaxHighlight(json) {
		json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
			var cls = 'number';
			if (/^"/.test(match)) {
				if (/:$/.test(match)) {
					cls = 'key';
				} else {
					cls = 'string';
				}
			} else if (/true|false/.test(match)) {
				cls = 'boolean';
			} else if (/null/.test(match)) {
				cls = 'null';
			}
			return '<span class="' + cls + '">' + match + '</span>';
		});
	}

	return {
		log: function log(obj) {
			var loggable;
			if (typeof obj === "string") obj = JSON.parse(obj);

			if (typeof obj === "object") loggable = JSON.stringify(obj, null, 2);
			else loggable = obj.toString();

			//loggable = $sce.trustAsHtml(syntaxHighlight(loggable));

			$rootScope.eventLog.push({ timestamp: new Date(Date.now()).toLocaleTimeString(), loggable });
		}
	};
});