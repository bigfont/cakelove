
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

myApp.directive('dynamicName', function ($compile, $parse) {
    return {
        restrict: 'A',
        terminal: true,
        priority: 100000,
        link: function (scope, elem) {
            var name = $parse(elem.attr('dynamic-name'))(scope);
            elem.removeAttr('dynamic-name');
            elem.attr('name', name);
            $compile(elem)(scope);
        }
    };
});

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        if (this === undefined || this === null) {
            throw new TypeError('"this" is null or not defined');
        }

        var length = this.length >>> 0; // Hack to convert object.length to a UInt32

        fromIndex = +fromIndex || 0;

        if (Math.abs(fromIndex) === Infinity) {
            fromIndex = 0;
        }

        if (fromIndex < 0) {
            fromIndex += length;
            if (fromIndex < 0) {
                fromIndex = 0;
            }
        }

        for (; fromIndex < length; fromIndex++) {
            if (this[fromIndex] === searchElement) {
                return fromIndex;
            }
        }

        return -1;
    };
}

function GetApiUrl($location, rightPart) {

    return $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port + rightPart;

}

function InferTheHtmlInputTypeOfTheKeyValuePair(key, value) {

    var inputType = (typeof value).toLowerCase();

    if (inputType === "string") {

        inputType = "text"; // this is the default input type

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

function InferTheHtmlInputAttributesOfEachKeyValuePair(data) {

    var newData = angular.copy(data);

    angular.forEach(data, function (value, key) {

        var inferredType = InferTheHtmlInputTypeOfTheKeyValuePair(key, value);

        var valueObj = {};
        valueObj.value = value;
        valueObj.type = inferredType;
        valueObj.required = true;

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

function AddServerSideValidationMessages(form, masterModel, modelState) {

    var properties = [];
    angular.forEach(modelState, function(value, key) {

        var property = key.replace("model.", "");
        properties.push(property);

    });

    angular.forEach(masterModel, function(value, key) {

        var isValid = properties.indexOf(key) < 0;
        form[key].$setValidity("servervalidation", isValid);
        masterModel[key].serverErrors = modelState["model." + key];

    });

    return masterModel;

}

myApp.controller('RegisterCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {

    $scope.clientUser = {};
    $scope.masterUser = {};

    var url = GetApiUrl($location, '/api/account/register');

    $http({ method: 'GET', url: url }).
        success(function (data, status, headers, config) {

            $scope.masterUser = InferTheHtmlInputAttributesOfEachKeyValuePair(data);

        }).
        error(function (data, status, headers, config) {

            ShowAjaxResultsForDevelopment($scope, data, status, headers, config);

        });

    $scope.submit = function () {

        var clientUser = $scope.clientUser;

        $http({ method: 'POST', url: url, data: clientUser }).
            success(function (data, status, headers, config) {

                $scope.masterUser = InferTheHtmlInputAttributesOfEachKeyValuePair(clientUser);

            }).
            error(function (data, status, headers, config) {

                $scope.masterUser = AddServerSideValidationMessages($scope.form, $scope.masterUser, data.ModelState);

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

