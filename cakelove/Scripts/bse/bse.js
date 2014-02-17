﻿/*global angular*/

var bsElements = angular.module('bsElements', []);

var SNAKE_CASE_REGEXP = /[A-Z]/g;
function snake_case(name, separator) {
    separator = separator || '_';
    return name.replace(SNAKE_CASE_REGEXP, function (letter, pos) {
        return (pos ? separator : '') + letter.toLowerCase();
    });
}

/*
 * Handles most input types
*/
bsElements.directive('bseInput', function () {
    return {
        templateUrl: "/Scripts/bse/bse-inputs.html",
        require: ["ngModel", ],
        scope:
        {
            id: '@',
            lblText: '@',
            hiddenInput: '@',
            placeholder: '@',
            type: '@',
            width: '@',
            name: '@',
            rows: '@',
            value: '@',
            helpBlock: '@',
            addOnRight: '@',
            addOnLeft: '@',
            // html5 validation
            integer: '@',
            smartFloat: '@',
            submitRequired: '@',
            pattern: '@',
            minlength: '@',
            maxlength: '@',
            min: '@',
            max: '@',
            required: '@',
            // two way bindings
            ngModel: '=',
            outerForm: '=',
        },
        compile: function compile(tElement, tAttrs, transclude) {
            tElement.removeAttr("id");
            tElement.removeAttr("type");

            function addAttribute(jqLiteInput, tAttrs, prop) {

                var attr = snake_case(prop).replace("_", "-");

                var o = tAttrs[prop];
                if (typeof o !== "undefined") {
                    jqLiteInput.attr(attr, attr);
                }
            }

            var inputs = tElement.find('input');
            var jqLiteInput;
            for (var i = 0; i < inputs.length; i++) {

                jqLiteInput = angular.element(inputs[i]);
                addAttribute(jqLiteInput, tAttrs, 'integer');
                addAttribute(jqLiteInput, tAttrs, 'smartFloat');
            }

            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                    scope.isString = ['email', 'password', 'text', 'url', 'number'].indexOf(iAttrs.type) >= 0;

                    if (typeof iAttrs.hiddenInput !== 'undefined') {
                        scope.isHidden = true;
                    }

                    scope.isRadioCheck = ['radio', 'checkbox'].indexOf(iAttrs.type) >= 0;
                    scope.isFile = 'file' === iAttrs.type;
                    scope.isTextarea = 'textarea' === iAttrs.type;
                    scope.hasAddOnRight = typeof iAttrs.addOnRight !== 'undefined';
                    scope.hasAddOnLeft = typeof iAttrs.addOnLeft !== 'undefined';
                    scope.hasAddOn = scope.hasAddOnLeft || scope.hasAddOnRight;
                    scope.submitRequiredMsg = 'This input is required before you can submit.';

                },
                post: function postLink(scope, elm, attrs, ctrl) {

                    scope.hasSaveError = function (innerForm) {
                        return typeof innerForm.$error.integer !== 'undefined' ||
                            typeof innerForm.$error.email !== 'undefined' ||
                            typeof innerForm.$error.integer !== 'undefined' ||
                            typeof innerForm.$error.float !== 'undefined';
                    };

                    scope.hasSubmitError = function (innerForm) {
                        return typeof innerForm.$error.submitRequired !== 'undefined' && innerForm.$error.submitRequired.length > 0;
                    };

                }
            };
        }
    };
});

bsElements.directive('bseFileUpload', ['userSvc', function (userSvc) {
    return {
        templateUrl: "/Scripts/bse/bse-file-upload.html",
        require: ["ngModel"],
        scope:
        {
            id: '@',
            lblText: '@',
            helpBlock: '@',
            imgIdentifier: '@',
            submitRequired: '@',
            // two way bindings
            ngModel: '=',
            outerForm: '=',
            uploader: '='
        },
        compile: function compile(tElement, tAttrs, transclude) {
            tElement.removeAttr("id");

            function addAttribute(jqLiteInput, tAttrs, prop) {

                var attr = snake_case(prop);

                var o = tAttrs[prop];
                if (typeof o !== "undefined") {
                    jqLiteInput.attr(attr, attr);
                }
            }

            var inputs = tElement.find('input');
            var jqLiteInput;
            for (var i = 0; i < inputs.length; i++) {

                jqLiteInput = angular.element(inputs[i]);
                addAttribute(jqLiteInput, tAttrs, 'submitRequired');
            }

            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                    scope.submitRequiredMsg = 'This input is required before you can submit.';
                    scope.userId = userSvc.userId;
                }
            };
        }
    };
}]);