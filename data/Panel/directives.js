rotaryApp.directive('rotaryUpdateHeight', function () {
    //todo add min and max heights
    return {
        restrict: 'A',
        link: function ($scope) {
            $scope.$evalAsync(function(){
                var newHeight = document.body.parentNode.offsetHeight;
                $scope.updateHeight(newHeight);
            });
        }
    }
});