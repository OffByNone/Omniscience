omniscience.factory('pubSub', function ($rootScope) {
	return {
		pub: function (message, data) {
			$rootScope.$emit(message, data);
		},
		sub: function (message, func, scope) {
			var unbind = $rootScope.$on(message, function () {
				var args = Array.prototype.slice.call(arguments);
				args = args.slice(1, args.length);
				func.apply(this, args);
			});
			if (scope) scope.$on('$destroy', unbind);
		}
	};
});