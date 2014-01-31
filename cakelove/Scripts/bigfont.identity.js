
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

function GetApiUrl($location, rightPart) {

    return $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port + rightPart;

}

function InferTheHtmlInputTypeOfTheKeyValuePair(key, value) {

    var inputType = (typeof value).toLowerCase();

    if (inputType === "string") {

        inputType = ""; // this is the default input type

        key = key.toLowerCase(); // set to lowercase for comparison
                
        // iterate all the html input types to look for a match
        var regex;
        var matches = [];
        var htmlTextualInputTypes = [
            "hidden", "text", "search", "tel", "url", "email",
            "password", "datetime", "date", "month", "week", "time", "datetime-local", "number", "range", "color",
            "checkbox", "radio", "file", "submit", "image"];        
        for (var i = 0; i < htmlTextualInputTypes.length; i++) {

            regex = new RegExp(htmlTextualInputTypes[i]);
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

    var newData = angular.copy(data);
    
    angular.forEach(data, function (value, key) {

        var inferredType = InferTheHtmlInputTypeOfTheKeyValuePair(key, value);
        var valueObj = { value: value, type: inferredType };
        newData[key] = valueObj;

    }, newData);

    return newData;

}

function ShowAjaxResultsForDevelopment(scope, data, status, headers, config) {

    scope.ajaxResult = {};
    scope.ajaxResult.data = data;
    scope.ajaxResult.status = status;
    scope.ajaxResult.headers = headers;
    scope.ajaxResult.config = config;

}

myApp.controller('RegisterCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {

    var user = {};

    var url = GetApiUrl($location, '/api/account/register');

    $http({ method: 'GET', url: url }).
        success(function (data, status, headers, config) {

            $scope.staticUser = data;
            $scope.dynamicUser = InferTheHtmlInputTypeOfEachKeyValuePair(data);

            ShowAjaxResultsForDevelopment($scope, data, status, headers, config);

        }).
        error(function (data, status, headers, config) {

            ShowAjaxResultsForDevelopment($scope, data, status, headers, config);

        });

    $scope.submit = function () {

        var user = $scope.user;

        $http({ method: 'POST', url: url, data: user }).
            success(function (data, status, headers, config) {

                ShowAjaxResultsForDevelopment($scope, data, status, headers, config);

            }).
            error(function (data, status, headers, config) {

                ShowAjaxResultsForDevelopment($scope, data, status, headers, config);

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

