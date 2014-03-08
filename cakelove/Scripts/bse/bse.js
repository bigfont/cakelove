var bsElements = (function (angular) {

    'use strict';

    var bsElements, SNAKE_CASE_REGEXP;

    bsElements = angular.module('bsElements', []);

    SNAKE_CASE_REGEXP = /[A-Z]/g;
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
            require: ["ngModel"],
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
                    outerForm: '='
                },
            compile: function compile(tElement, tAttrs, transclude) {
                tElement.removeAttr("id");
                tElement.removeAttr("type");

                function addAttribute(jqLiteInput, tAttrs, prop) {

                    var attr, o;

                    attr = snake_case(prop).replace("_", "-");

                    o = tAttrs[prop];
                    if (o !== undefined) {
                        jqLiteInput.attr(attr, attr);
                    }
                }

                var inputs, jqLiteInput, i;

                inputs = tElement.find('input');
                for (i = 0; i < inputs.length; i += 1) {

                    jqLiteInput = angular.element(inputs[i]);
                    addAttribute(jqLiteInput, tAttrs, 'integer');
                    addAttribute(jqLiteInput, tAttrs, 'smartFloat');
                }

                return {
                    pre: function preLink(scope, iElement, iAttrs, controller) {
                        scope.isString = ['email', 'password', 'text', 'url', 'number'].indexOf(iAttrs.type) >= 0;

                        if (iAttrs.hiddenInput !== undefined) {
                            scope.isHidden = true;
                        }

                        scope.isRadioCheck = ['radio', 'checkbox'].indexOf(iAttrs.type) >= 0;
                        scope.isFile = 'file' === iAttrs.type;
                        scope.isTextarea = 'textarea' === iAttrs.type;
                        scope.hasAddOnRight = iAttrs.addOnRight !== undefined;
                        scope.hasAddOnLeft = iAttrs.addOnLeft !== undefined;
                        scope.hasAddOn = scope.hasAddOnLeft || scope.hasAddOnRight;
                        scope.submitRequiredMsg = 'This input is required before you can submit.';

                    },
                    post: function postLink(scope, elm, attrs, ctrl) {

                        scope.hasSaveError = function (innerForm) {
                            return innerForm.$error.integer !== undefined ||
                                innerForm.$error.email !== undefined ||
                                innerForm.$error.integer !== undefined ||
                                innerForm.$error.float !== undefined;
                        };

                        scope.hasSubmitError = function (innerForm) {
                            return innerForm.$error.submitRequired !== undefined && innerForm.$error.submitRequired.length > 0;
                        };

                    }
                };
            }
        };
    });

    bsElements.directive('bseFileUpload', ['userSvc', function (userSvc) {
        return {
            templateUrl: "/Scripts/bse/bse-file-upload.html",
            scope:
                {
                    id: '@',
                    lblText: '@',
                    helpBlock: '@',
                    imgIdentifier: '@',
                    submitRequired: '@',
                    // two way bindings
                    hasImage: '=',
                    uploadedImgPath: '=',
                    outerForm: '=',
                    uploader: '='
                },
            compile: function compile(tElement, tAttrs, transclude) {
                tElement.removeAttr("id");

                function addAttribute(jqLiteInput, tAttrs, prop) {
                    var attr, o;

                    attr = snake_case(prop);
                    o = tAttrs[prop];
                    if (o !== undefined) {
                        jqLiteInput.attr(attr, attr);
                    }
                }

                var inputs, jqLiteInput, i;

                inputs = tElement.find('input');
                for (i = 0; i < inputs.length; i += 1) {

                    jqLiteInput = angular.element(inputs[i]);
                    addAttribute(jqLiteInput, tAttrs, 'submitRequired');
                }

                return {
                    pre: function preLink(scope, iElement, iAttrs, controller) {
                        scope.submitRequiredMsg = 'This input is required before you can submit.';
                        scope.userId = userSvc.userId;

                        scope.uploader.bind('completeall', function (event, items) {
                            scope.hasImage = true;
                            for (i = 0; i < items.length; i += 1) {
                                items[i].remove();
                            }
                        });
                    }
                };
            }
        };
    }]);

    return bsElements;

}(angular));