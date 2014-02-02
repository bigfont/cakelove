﻿
/*global: angular */

//app module
var myApp = angular.module('cakeLoveApp', [
    'ngRoute', //routing module
    'ngSanitize',
    'cakeLoveControllers', //controllers module    
    'cakeLoveFilters',
    'cakeLoveDirectives',
    'cakeLoveFactories'
]);


myApp.config(['$routeProvider',
function ($routeProvider) {
    $routeProvider.
    when('/welcome', {
        templateUrl: 'ng/partials/welcome',
        controller: 'WelcomeCtrl'
    }).
    when('/register', {
        templateUrl: 'ng/partials/web-api-form',
        controller: 'RegisterCtrl'
    }).
    when('/login', {
        templateUrl: 'ng/partials/web-api-form',
        controller: 'TokenCtrl'
    }).
    when('/agreement', {
        templateUrl: 'ng/partials/agreement',
        controller: 'AgreementCtrl',
        authRequires: 'view-agreement'
    }).
    otherwise({
        redirectTo: '/welcome'
    });
}]);

myApp.run(function ($rootScope, $location, authService) {

    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function (event, next, current) {

        if (!authService.isLoggedIn && next.authRequires) {
            $location.path("/login");
        }

    });
});





////function ToAbsoluteUrl($location, rightPart) {

////    return $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port + rightPart;

////}

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


