rotaryApp.factory('eventService', function($rootScope, $window, $q){
	function generateQuickGuidish() { //e7 from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
		var lut = []; for (var i = 0; i < 256; i++) { lut[i] = (i < 16 ? '0' : '') + (i).toString(16); }
		var d0 = Math.random() * 0xffffffff | 0;
		var d1 = Math.random() * 0xffffffff | 0;
		var d2 = Math.random() * 0xffffffff | 0;
		var d3 = Math.random() * 0xffffffff | 0;
		return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
			lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
			lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
			lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
	}
	function on(messageName, callback){
		$window.self.port.on(messageName, function(a, b, c, d, e){
			$rootScope.$apply(callback(a, b, c, d, e)); //todo: change this to call so I can get rid of this ugly hack
		});
	}
	function emit(messageName, a, b, c, d, e) {
		$window.self.port.emit(messageName, a, b, c, d, e); //todo change this to call so I can get rid of this ugly hack
	}
	function callService(service, serviceMethod, data) {
		var uniqueId = generateQuickGuidish();
		var deferred = $q.defer();

		on(serviceMethod + "Response" + uniqueId, function (data) { //figure out how to unbind this (might actually be a once in the firefox addon sdk if so use it instead), so it is only a once. NOTE we are not using angular $on we are using the firefox extension self.port.on
			console.log(data);
			deferred.resolve(data);
		});

		$window.self.port.emit("CallService", uniqueId, service, serviceMethod, data);

		return deferred.promise;
	}

	return {
        on: on,
        emit: emit,
		callService: callService
    }
});