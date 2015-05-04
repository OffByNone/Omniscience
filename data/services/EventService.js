omniscience.factory('eventService', function ($rootScope, $window, $q) {
    var serviceResponsePromises = {};
    var emitPromises = {};

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
    function on(messageName, callback) {
        $window.self.port.on(messageName, (...args) => $rootScope.$apply(callback(...args)));
    }
    function emit(messageName, ...args) {
        var uniqueId = generateQuickGuidish();
        var deferred = $q.defer();

        emitPromises[uniqueId] = deferred;
        $window.self.port.emit(messageName, uniqueId, ...args);
        return deferred.promise;
    }

    on("emitResponse", function (uniqueId, ...args) {
        //accepts n number of arguments, uniqueId must be first
        var deferred = emitPromises[uniqueId];
        if (deferred) {
            delete emitPromises[uniqueId];
            deferred.resolve(...args);
        }
        else console.log("no deferred for the response");
    });
    on("CallServiceResponse", function (uniqueId, data) {
        var deferred = serviceResponsePromises[uniqueId];
        if (deferred) {
            delete serviceResponsePromises[uniqueId];
            deferred.resolve(data);
        }
        else console.log("no deferred for the response");
    });

    function callService(service, serviceMethod, data) {
        var uniqueId = generateQuickGuidish();
        var deferred = $q.defer();

        serviceResponsePromises[uniqueId] = deferred;

        $window.self.port.emit("CallService", uniqueId, service, serviceMethod, data);
        return deferred.promise;
    }

    return {
        on: on,
        emit: emit,
        callService: callService
    };
});