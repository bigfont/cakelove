var cakeLoveDirectives = (function (angular) {

    'use strict';

    var cakeLoveDirectives, INTEGER_REGEXP, FLOAT_REGEXP;

    cakeLoveDirectives = angular.module("cakeLoveDirectives", []);

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

    cakeLoveDirectives.directive('adminUserList', function () {
        return {
            restrict: 'AE',
            templateUrl: 'ng/partials/admin/user-list'
        };
    });

    cakeLoveDirectives.directive('adminUserDetails', function () {
        return {
            restrict: 'AE',
            templateUrl: 'ng/partials/admin/user-details'
        };
    });

    // validation
    INTEGER_REGEXP = /^\-?\d+$/;
    cakeLoveDirectives.directive('integer', function () {
        return {
            require: 'ngModel',
            compile: function (elm, attrs) {
                return {
                    post: function (scope, elm, attrs, ctrl) {

                        function validate(value) {

                            var result;
                            if (ctrl.$isEmpty(value) || INTEGER_REGEXP.test(value)) {
                                // it is valid
                                ctrl.$setValidity('integer', true);
                                result = value;
                            } else {
                                // it is invalid, return undefined (no model update)
                                ctrl.$setValidity('integer', false);
                                result = undefined;
                            }
                            return result;
                        }

                        ctrl.$parsers.unshift(validate);
                        ctrl.$formatters.unshift(validate);

                    }
                };

            }
        };
    });

    FLOAT_REGEXP = /^\-?\d+((\.|\,)\d+)?$/;
    cakeLoveDirectives.directive('smartFloat', ['objSvc', function (objSvc) {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {

                function validate(value) {

                    var result;
                    if (ctrl.$isEmpty(value) || FLOAT_REGEXP.test(value)) {
                        ctrl.$setValidity('float', true);
                        if (typeof value === 'string' && value.indexOf(',') >= 0) {
                            value = parseFloat(value.replace(',', '.'));
                        }
                        result = value;
                    } else {
                        ctrl.$setValidity('float', false);
                        result = undefined;
                    }

                    return result;
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

                function clear(value) {
                    ctrl.$setValidity('submitRequired', true);
                    return value;
                }

                scope.$on('userSubmitting', function (scopeDetails, msgFromParent) {

                    function validateGroup(elm) {

                        console.log("validateGroup");

                    }

                    function validateNumber(value) {
                        var integer, result;

                        integer = parseInt(value, 10);
                        if (isNaN(integer) || integer <= 0) {
                            ctrl.$setValidity('submitRequired', false);
                            result = undefined;
                        } else {
                            ctrl.$setValidity('submitRequired', true);
                            result = undefined;
                        }

                        return result;
                    }

                    function validateString(value) {
                        var result;
                        if (objSvc.isUndefinedOrNull(value) || value.length === 0) {
                            ctrl.$setValidity('submitRequired', false);
                            result = undefined;
                        } else {
                            ctrl.$setValidity('submitRequired', true);
                            result = undefined;
                        }
                        return result;
                    }

                    clear();

                    var inputType, inputValue, isSubmitRequired;

                    inputType = elm.attr('type');
                    inputValue = elm.val();
                    isSubmitRequired = elm.attr('submit-required');
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

                var canvas, params, reader;

                canvas = element.find('canvas');
                params = scope.$eval(attributes.ngThumb);

                function onLoadImage() {
                    var width, height;

                    width = params.width || this.width / this.height * params.height;
                    height = params.height || this.height / this.width * params.width;
                    canvas.attr({ width: width, height: height });
                    canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
                }

                function onLoadFile(event) {
                    var img = new Image();
                    img.onload = onLoadImage;
                    img.src = event.target.result;
                }

                if (!helper.isFile(params.file)) { return; }
                if (!helper.isImage(params.file)) { return; }

                reader = new FileReader();

                reader.onload = onLoadFile;
                reader.readAsDataURL(params.file);

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

    cakeLoveDirectives.directive('errSrc', function () {
        var fallbackSrc = {
            link: function (scope, element, attrs) {
                element.bind('error', function () {
                    angular.element(this).replaceWith('<img class="placeholder pull-left img-thumbnail" data-src="holder.js/187x187" holder-fix />');
                    Holder.run({ images: '.placeholder', nocss: true });
                });
            }
        };
        return fallbackSrc;
    });

    return cakeLoveDirectives;

}(angular));