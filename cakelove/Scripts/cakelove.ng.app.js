
/*global: angular */

//app module
var myApp = angular.module('cakeLoveApp', [    
    'ngRoute', //routing module
    'myControllers' //controllers module
]);


myApp.config(['$routeProvider',
  function ($routeProvider) {
      $routeProvider.
        when('/register', {
            templateUrl: 'ng/_register',
            controller: 'RegisterCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
  }]);






myApp.filter('toArray', function () {
    'use strict';

    return function (obj) {
        if (!(obj instanceof Object)) {
            return obj;
        }

        return Object.keys(obj).map(function (key) {
            return Object.defineProperty(obj[key], '$key', { __proto__: null, value: key });
        });
    };
});

myApp.filter("addSpace", function () {

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

        if (/[a-zA-Z]/.test(key)) {
            key = key.toLowerCase(); // set to lowercase for comparison
        }


        // iterate all the html input types to look for a match
        var regex;
        var matches = [];
        var htmlTextualInputTypes = [
            "hidden", "text", "search", "tel", "url", "email",
            "password", "datetime", "date", "month", "week", "time", "datetime-local", "number", "range", "color",
            "checkbox", "radio", "file", "submit", "image"];
        for (var i = 0; i < htmlTextualInputTypes.length; i++) {

            var t = htmlTextualInputTypes[i];
            regex = new RegExp(t);
            if (regex.test(key)) {
                inputType = t;
                break;
            }
        }
    }

    return inputType;
}

function InferTheHtmlInputAttributesOfEachKeyValuePair(data) {

    var newData = angular.copy(data);

    var i = 0;
    angular.forEach(data, function (value, key) {

        var inferredType = InferTheHtmlInputTypeOfTheKeyValuePair(key, value);

        var valueObj = {};
        valueObj.superValue = value;

        if (key === 'access_token') {
            console.log(value);
        }

        valueObj.type = inferredType;
        valueObj.required = true;
        valueObj.order = i++;

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
    angular.forEach(modelState, function (value, key) {

        var property = key.replace("model.", "");
        properties.push(property);

    });

    angular.forEach(masterModel, function (value, key) {

        var isValid = properties.indexOf(key) < 0;
        form[key].$setValidity("servervalidation", isValid);
        masterModel[key].serverErrors = modelState["model." + key];

    });

    return masterModel;

}

myApp.factory('urlService', ['$location', function ($location) {

    var url = {};

    url.GetApiUrl = function (rightPart) {

        return $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port + rightPart;

    };

    return url;

}]);

myApp.factory('authService', ['$window', function ($window) {

    var auth = {};

    auth.loggedIn = false;

    if ($window.sessionStorage.getItem('token')) {
        auth.loggedIn = true;
        auth.userName = $window.sessionStorage.getItem('userName');
    }

    auth.login = function (userName, password, token) {

        $window.sessionStorage.setItem('token', token);
        $window.sessionStorage.setItem('userName', userName);

        auth.loggedIn = true;
        auth.userName = userName;

    };

    auth.logout = function () {
        auth.loggedIn = false;
    };

    return auth;

}]);

