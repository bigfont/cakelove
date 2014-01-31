
/*global: angular */

//app
var myApp = angular.module('CakeLoveApp', []);

myApp.filter("addspace", function () {

    return function (input) {

        var out = "";
        for (var i = 0; i < input.length; i++) {

            var character = input.charAt(i);
            if (character === character.toUpperCase()) {
                out = out + " ";
            }
            out = out + character;
        }

        return out;
    };
});


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

    return $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port + rightPart;

}

function InferTheHtmlInputTypeOfTheKeyValuePair(key, value) {

    var inputType = (typeof value).toLowerCase();

    if (inputType === "string") {

        key = key.toLowerCase();
        var textualInputTypes = [
            "hidden", "text", "search", "tel", "url", "email",
            "password", "datetime", "date", "month", "week", "time", "datetime-local", "number", "range", "color",
            "checkbox", "radio", "file", "submit", "image"];

        var regex;
        var matches = [];
        for (var i = 0; i < textualInputTypes.length; i++) {

            regex = new RegExp(textualInputTypes[i]);
            matches = key.match(regex);
            if (matches != null) {
                inputType = matches[0];
                break;
            }
        }
    }

    return inputType;
}

function InferTheHtmlInputTypeOfEachKeyValuePair(data) {

    angular.forEach(data, function (value, key) {

        var inferredType = InferTheHtmlInputTypeOfTheKeyValuePair(key, value);
        var valueObj = { value: value, type: inferredType };
        this[key] = valueObj;

    }, data);

    return data;

}

myApp.controller('RegisterCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {

    $scope.result = {};

    var url = getApiUrl($location, '/api/account/register');
    $http({ method: 'GET', url: url }).
        success(function (data, status, headers, config) {

            $scope.result.data = InferTheHtmlInputTypeOfEachKeyValuePair(data);;
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

