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

cakeLoveDirectives.directive('contactInfoForm', function () {
    return {
        restrict: 'AE',
        templateUrl: 'ng/partials/contact-info-form'
    };
});

cakeLoveDirectives.directive('biographyForm', function () {
    return {
        restrict: 'AE',
        templateUrl: 'ng/partials/biography-form'
    };
});

cakeLoveDirectives.directive('teachingExperienceForm', function () {
    return {
        restrict: 'AE',
        templateUrl: 'ng/partials/teaching-experience-form'
    };
});

cakeLoveDirectives.directive('bsInput', function() {
    return {
        restrict: 'AE',
        templateUrl: 'ng/partials/bs-input',
        //template:'<input ng-model="theModel" />',
        scope: {
            inputId: '@',
            // text, number, url, email, radio, checkbox
            inputType: '@',
            helpBlock: '@',
            addOnRight: '@',
            addOnLeft: '@',
            // html5 validation
            notRequired: '@',
            pattern: '@',
            minlength: '@',
            maxlength: '@',
            min: '@',
            max: '@',
            // model
            theModel: '='
        }

    };
});

cakeLoveDirectives.directive('bsFormGroup', function () {
    return {
        restrict: 'AE',
        templateUrl: 'ng/partials/bs-form-group',        
        scope: {            
            inputId: '@',
            labelText: '@',
            // text, number, url, email, radio, checkbox
            inputType: '@', 
            helpBlock: '@',
            addOnRight: '@',
            addOnLeft: '@',
            // html5 validation
            notRequired: '@', 
            pattern: '@', 
            minlength: '@', 
            maxlength: '@', 
            min: '@', 
            max: '@',
            // model
            theModel: '='
        },
    };
});

cakeLoveDirectives.directive('bsFormCheckbox', function () {
    return {
        restrict: 'AE',
        templateUrl: 'ng/partials/bs-form-checkbox',
        scope: {
            labelText: '@',
            theModel: '='
        },
    };
});

cakeLoveDirectives.directive('bsFormRadio', function () {
    return {
        restrict: 'AE',
        templateUrl: 'ng/partials/bs-form-radio',
        scope: {
            labelText: '@',
            inputValue: '@',
            theModel: '='
        },
    };
});

cakeLoveDirectives.directive('bsFormTextarea', function () {
    return {
        restrict: 'AE',
        templateUrl: 'ng/partials/bs-form-textarea',
        scope: {
            labelText: '@',
            inputId: '@',
            inputRows: '@',
            helpBlock: '@',
            theModel: '='
        },
    };
});