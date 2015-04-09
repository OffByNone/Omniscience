omniscience.service('informationService', function informationService() {
	"use strict";

	var _services = {}; //key is service.type.urn

	return {
		get: function (serviceTypeUrn) {
			if(typeof serviceTypeUrn === "string" && serviceTypeUrn.length > 0)
				return _services[serviceTypeUrn];
		},
		put: function (serviceInformation) {
			if (typeof serviceInformation === "object" && typeof serviceInformation.type === "object"
					&& typeof serviceInformation.type.urn === "string" && serviceInformation.type.urn.length > 0)
				_services[serviceInformation.type.urn] = serviceInformation;
		}
	};
});