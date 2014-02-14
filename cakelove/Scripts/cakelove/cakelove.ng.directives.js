var cakeLoveDirectives = angular.module("cakeLoveDirectives", []);

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

cakeLoveDirectives.directive('loginRegisterForm', function () {
    return {
        restrict: 'AE',
        templateUrl: 'ng/partials/login-register-form'
    };
});

cakeLoveDirectives.directive('classInfoFormInputs', function () {
    return {
        restrict: 'AE',
        templateUrl: 'ng/partials/class-info-form'
    };
});

cakeLoveDirectives.directive('contactInfoFormInputs', function () {
    return {
        restrict: 'AE',
        templateUrl: 'ng/partials/contact-info-form'
    };
});

cakeLoveDirectives.directive('biographyFormInputs', function () {
    return {
        restrict: 'AE',
        templateUrl: 'ng/partials/biography-form'
    };
});

cakeLoveDirectives.directive('teachingExperienceFormInputs', function () {
    return {
        restrict: 'AE',
        templateUrl: 'ng/partials/teaching-experience-form'
    };
});

// validation
var INTEGER_REGEXP = /^\-?\d+$/;
cakeLoveDirectives.directive('integer', function () {
    return {
        require: 'ngModel',
        compile: function (elm, attrs) {
            return {
                pre: function (scope, elm, attrs, ctrl) {

                },
                post: function (scope, elm, attrs, ctrl) {

                    function validate(value) {

                        if (INTEGER_REGEXP.test(value)) {
                            // it is valid
                            ctrl.$setValidity('integer', true);
                            return value;
                        } else {
                            // it is invalid, return undefined (no model update)
                            ctrl.$setValidity('integer', false);
                            return undefined;
                        }
                    };

                    ctrl.$parsers.unshift(validate);
                    ctrl.$formatters.unshift(validate);

                }
            };

        }
    };
});

var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
cakeLoveDirectives.directive('smartFloat', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            function validate(value) {

                if (FLOAT_REGEXP.test(value)) {
                    ctrl.$setValidity('float', true);
                    return parseFloat(value.replace(',', '.'));
                } else {
                    ctrl.$setValidity('float', false);
                    return undefined;
                }
            };

            ctrl.$parsers.unshift(validate);
            ctrl.$formatters.unshift(validate);
        }
    };
});

cakeLoveDirectives.directive('submitRequired', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            scope.$on('userSubmitting', function (scopeDetails, msgFromParent) {
                validate(elm.val());
            })

            function validate(value) {
                if (value === null || value.length === 0) {
                    ctrl.$setValidity('submitRequired', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('submitRequired', true);
                    return undefined;
                }
            };

            function clear()
            {
                ctrl.$setValidity('submitRequired', true);
            }

            ctrl.$parsers.unshift(clear);
            ctrl.$formatters.unshift(clear);
        }
    };
});