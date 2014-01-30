
/*global: angular */

//app
var myApp = angular.module('CakeLoveApp', []);

function testUserName() {
    var date = new Date();
    return "testUser" + (date.getMilliseconds() * date.getSeconds());
}

function testPassword() {
    return null;
}

function testConfirmPassword() {
    return null;
}

function getApiUrl($location, rightPart) {

    return $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port + '/api/account/register';

}

myApp.controller('RegisterCtrl_Test', ['$scope', '$http', '$location', function ($scope, $http, $location) {

    $scope.result = {};

    var url = getApiUrl($location, '/api/account/register');
    $http({ method: 'GET', url: url }).
        success(function(data, status, headers, config) {
            
            $scope.result.data = data;
            $scope.result.status = status;
            $scope.result.headers = headers;
            $scope.result.config = config;

        }).
        error(function(data, status, headers, config) {
        
            $scope.result.data = data;
            $scope.result.status = status;
            $scope.result.headers = headers;
            $scope.result.config = config;

    });

    $scope.submit = function () {

        var userName = testUserName();
        var password = testPassword();
        var confirmPassword = testConfirmPassword();
        var url = getApiUrl($location, '/api/account/register');

        $http({ method: 'POST', url: url, data: { UserName: userName, Password: password, ConfirmPassword: confirmPassword } }).
            success(function (data, status, headers, config) {

                $scope.result.data = data;
                $scope.result.status = status;
                $scope.result.headers = headers;
                $scope.result.config = config;

            }).
            error(function (data, status, headers, config) {

                $scope.result.data = data;
                $scope.result.status = status;
                $scope.result.headers = headers;
                $scope.result.config = config;
            });
    };

}]);

myApp.controller('SimpleFormCtrl', ['$scope', function ($scope) {
    $scope.master = {};

    $scope.update = function (user) {
        $scope.master = angular.copy(user);
    };

    $scope.reset = function () {
        $scope.user = angular.copy($scope.master);
    };

    $scope.reset();

}]);

myApp.controller('FormAndControlStateCtrl', ['$scope', function ($scope) {

    $scope.master = {};

    $scope.update = function (user) {
        $scope.master = angular.copy(user);
    };

    $scope.reset = function () {
        $scope.user = angular.copy($scope.master);
    };

    $scope.isUnchanged = function (user) {
        return angular.equals(user, $scope.master);
    };

    $scope.reset();

}]);

