﻿omniscience.factory('pubSub', function ($rootScope) {
	return {
		pub: function (...args) {
			$rootScope.$emit(...args);
		},
		sub: function (message, func, scope) {
			var unbind = $rootScope.$on(message, (unused, ...args) => func(...args));
			if (scope) scope.$on('$destroy', unbind);
		}
	};
});