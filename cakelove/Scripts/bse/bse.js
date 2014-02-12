var bsElements = angular.module('bsElements', []);

/*
 * Handles these input types email, password
*/
bsElements.directive('bseInput', function() {
    return {

        templateUrl: "/Scripts/bse/bse-inputs.html",
        scope:
        {
            id: '@',
            lblText: '@',
            placeholder: '@',
            type: '@',
            width: '@',
            name: '@',
            rows:'@',
            // html5 validation
            notRequired: '@',
            //pattern: '@',
            minlength: '@',
            maxlength: '@',
            min: '@',
            max: '@',
            // two way bindings
            theModel: '=',
            outerForm: '=',
        },
        compile: function compile(tElement, tAttrs, transclude) {
            tElement.removeAttr("id");
            tElement.removeAttr("type");
            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {
                    scope.isString = ['email', 'password', 'text', 'url'].indexOf(iAttrs.type) >= 0;
                    scope.isRadioCheck = ['radio', 'checkbox'].indexOf(iAttrs.type) >= 0;
                    scope.isFile = 'file' == iAttrs.type;
                    scope.isTextarea = 'textarea' == iAttrs.type;
                    scope.isRequired = typeof iAttrs.notRequired === 'undefined';
                },
                post: function postLink(scope, iElement, iAttrs, controller) {

                }
            };

        } 
    };
});