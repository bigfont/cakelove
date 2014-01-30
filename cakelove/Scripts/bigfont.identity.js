
//app
var myApp = angular.module('CakeLoveApp', []);

function testUserName() {
    var date = new Date();
    return "testUser" + (date.getMilliseconds() * date.getSeconds());
}

myApp.controller('RegisterCtrl', ['$scope', '$http', function ($scope, $http) {

    var userName = testUserName();

    $http({ method: 'POST', url: 'api/account/register', data: { UserName: testUserName, Password: 'password123', ConfirmPassword: 'password123' } }).
        success(function (data, status, headers, config) {

            $scope.result = "success";

        }).
        error(function (data, status, headers, config) {

            $scope.result = "error";

        });

}]);