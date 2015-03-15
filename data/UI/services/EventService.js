rotaryApp.factory('eventService', function($rootScope, $window){
    var service = {};

    return {
        on: function on(messageName, callback){
            $window.self.port.on(messageName, function(a, b, c, d, e){
                $rootScope.$apply(callback(a, b, c, d, e));
            });
        },
        emit: function emit(messageName, a, b, c, d, e){
            $window.self.port.emit(messageName, a, b, c, d, e);
        }
    }
    return service;
});