﻿var cakeLoveDirectives = angular.module("cakeLoveDirectives", []);

cakeLoveDirectives.directive('dynamicName', function ($compile, $parse) {
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

cakeLoveDirectives.directive('simpleModelForm', function () {
    return {
        restrict: 'AE',
        templateUrl: 'ng/partials/simple-model-form'
    };
});

cakeLoveDirectives.directive('classInfoForm', function () {
    return {
        restrict: 'AE',
        templateUrl: 'ng/partials/class-info-form'
    };
});

cakeLoveDirectives.directive('bsFormGroup', function () {
    return {
        restrict: 'AE',
        templateUrl: 'ng/partials/bs-form-group',
        scope: {
            labelText: '@',
            inputId: '@',
            inputType: '@',
        },
    };
});