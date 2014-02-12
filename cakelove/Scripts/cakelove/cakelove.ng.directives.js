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