
/*global: angular */

//app
var myApp = angular.module('CakeLoveApp', []);

function testUserName() {
    var date = new Date();
    return "testUser" + (date.getMilliseconds() * date.getSeconds());
}

myApp.controller('RegisterCtrl_Test', ['$scope', '$http', '$location', function ($scope, $http, $location) {    

    var userName = testUserName();
    var url = $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port + '/api/account/register';    

    $http({ method: 'POST', url: url, data: { UserName: userName, Password: 'password123', ConfirmPassword: 'password123' } }).
        success(function (data, status, headers, config) {

            $scope.result = "success";

        }).
        error(function (data, status, headers, config) {

            $scope.result = "error";

        });

}]);

myApp.controller('RegisterCtrl_Simple', ['$scope', function ($scope, $http) {
    $scope.master = {};

    $scope.update = function (user) {
        $scope.master = angular.copy(user);
    };

    $scope.reset = function () {
        $scope.user = angular.copy($scope.master);
    };

    $scope.reset();

}]);