rotaryApp.service('pubSub', function ($rootScope) {
	return {
		pub: function (message, data) {
			$rootScope.$emit(message, data);
		},
		sub: function (message, func, scope) {
			var unbind = $rootScope.$on(message, func);
			if (scope) scope.$on('$destroy', unbind);
		}
	};
});