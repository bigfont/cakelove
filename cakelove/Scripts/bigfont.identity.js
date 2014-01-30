
//app
var myApp = angular.module('CakeLoveApp', []);

myApp.controller('RegisterCtrl', ['$scope', '$http', function ($scope, $http) {

    $http({ method: 'POST', url: 'api/account/register', data: { UserName: 'Alice', Password: 'password123', ConfirmPassword: 'password123' } }).
        success(function (data, status, headers, config) {

            $scope.result = "success";

        }).
        error(function (data, status, headers, config) {

            $scope.result = "error";

        });

}]);