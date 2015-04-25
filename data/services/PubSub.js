omniscience.factory('pubSub', function ($rootScope) {
	return {
		pub: function (message, data) {
			//will take in n number of data params
			$rootScope.$emit.apply($rootScope, arguments); //todo: no idea if this is correct. apply(this, arguments) didn't work so I changed to apply($rootScope,arguments) and it seems to work...
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