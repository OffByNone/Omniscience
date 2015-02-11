rotaryApp.directive('rotaryUpdateHeight',function () {
    //todo add min and max heights
    //Something in here isn't working right
    //I am thinking it is firing too soon,
    //before the addition/removal from the dom
    return {
        link: function ($scope) {
            $scope.$evalAsync(function(){
                
            });
        }
    }
});