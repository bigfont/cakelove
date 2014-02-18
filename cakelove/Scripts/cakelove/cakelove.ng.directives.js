/*global angular*/

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

cakeLoveDirectives.directive('submitApplicationFormInputs', function () {
    return {
        restrict: 'AE',
        templateUrl: 'ng/partials/submit-application-form'
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

                        if (ctrl.$isEmpty(value) || INTEGER_REGEXP.test(value)) {
                            // it is valid
                            ctrl.$setValidity('integer', true);
                            return value;
                        } else {
                            // it is invalid, return undefined (no model update)
                            ctrl.$setValidity('integer', false);
                            return undefined;
                        }
                    }

                    ctrl.$parsers.unshift(validate);
                    ctrl.$formatters.unshift(validate);

                }
            };

        }
    };
});

var FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
cakeLoveDirectives.directive('smartFloat', ['objSvc', function (objSvc) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            function validate(value) {

                if (ctrl.$isEmpty(value) || FLOAT_REGEXP.test(value)) {
                    ctrl.$setValidity('float', true);
                    if (typeof value === 'string' && value.indexOf(',') >= 0) {
                        value = parseFloat(value.replace(',', '.'));
                    }
                    return value;
                } else {
                    ctrl.$setValidity('float', false);
                    return undefined;
                }
            }

            ctrl.$parsers.unshift(validate);
            ctrl.$formatters.unshift(validate);
        }
    };
}]);

cakeLoveDirectives.directive('submitRequired', function (objSvc) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            scope.$on('userSubmitting', function (scopeDetails, msgFromParent) {

                clear();

                var inputType = elm.attr('type');
                var inputValue = elm.val();

                var isSubmitRequired = elm.attr('submit-required');
                if (isSubmitRequired === "true") {

                    if (['text', 'textarea', 'email', 'hidden'].indexOf(inputType) >= 0) {
                        validateString(inputValue);
                    } else if (['checkbox', 'radio'].indexOf(inputType) >= 0) {
                        validateGroup(elm);
                    } else if ('number' === inputType) {
                        validateNumber(inputValue);
                    }

                }
            });

            function validateGroup(elm) {

                console.log("validateGroup");

            }

            function validateNumber(value) {
                var integer = parseInt(value, 10);
                if (isNaN(integer) || integer <= 0) {
                    ctrl.$setValidity('submitRequired', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('submitRequired', true);
                    return undefined;
                }
            }

            function validateString(value) {
                if (objSvc.isUndefinedOrNull(value) || value.length === 0) {
                    ctrl.$setValidity('submitRequired', false);
                    return undefined;
                } else {
                    ctrl.$setValidity('submitRequired', true);
                    return undefined;
                }
            }

            function clear(value) {
                ctrl.$setValidity('submitRequired', true);
                return value;
            }

            ctrl.$parsers.unshift(clear);
            ctrl.$formatters.unshift(clear);
        }
    };
});

/**
   * The ng-thumb directive
   * @author: nerv
   * @version: 0.1.2, 2014-01-09
   */
cakeLoveDirectives.directive('ngThumb', ['$window', function ($window) {
    var helper = {
        support: !!($window.FileReader && $window.CanvasRenderingContext2D),
        isFile: function (item) {
            return angular.isObject(item) && item instanceof $window.File;
        },
        isImage: function (file) {
            var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    };

    return {
        restrict: 'A',
        template: '<canvas/>',
        link: function (scope, element, attributes) {
            if (!helper.support) { return; }

            var params = scope.$eval(attributes.ngThumb);

            if (!helper.isFile(params.file)) { return; }
            if (!helper.isImage(params.file)) { return; }

            var canvas = element.find('canvas');
            var reader = new FileReader();

            reader.onload = onLoadFile;
            reader.readAsDataURL(params.file);

            function onLoadFile(event) {
                var img = new Image();
                img.onload = onLoadImage;
                img.src = event.target.result;
            }

            function onLoadImage() {
                var width = params.width || this.width / this.height * params.height;
                var height = params.height || this.height / this.width * params.width;
                canvas.attr({ width: width, height: height });
                canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
            }
        }
    };
}]);

cakeLoveDirectives.directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            element.bind('error', function () {
                element.attr('src', attrs.errSrc);
            });
        }
    };
});

cakeLoveDirectives.directive('holderFix', function () {
    return {
        link: function (scope, element, attrs) {
            Holder.run({ images: element[0], nocss: true });
        }
    };
});