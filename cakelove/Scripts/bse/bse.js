var bsElements = angular.module('bsElements', []);


var INTEGER_REGEXP = /^\-?\d+$/;


/*
 * Handles most input types
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
            rows: '@',
            value:'@',
            helpBlock: '@',
            addOnRight: '@',
            addOnLeft: '@',
            // html5 validation
            notRequired: '@',
            integer: '@',
            smartFloat: '@',
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

            var inputs = tElement.find('input');
            var jInput;

            jInput = angular.element(inputs[0]);
            jInput.attr('integer', 'integer');

            jInput = angular.element(inputs[1]);
            jInput.attr('integer', 'integer');

            jInput = angular.element(inputs[2]);
            jInput.attr('integer', 'integer');

            jInput = angular.element(inputs[3]);
            jInput.attr('integer', 'integer');

            return {
                pre: function preLink(scope, iElement, iAttrs, controller) {                    
                    scope.isString = ['email', 'password', 'text', 'url', 'hidden', 'number'].indexOf(iAttrs.type) >= 0;
                    scope.isRadioCheck = ['radio', 'checkbox'].indexOf(iAttrs.type) >= 0;
                    scope.isFile = 'file' == iAttrs.type;
                    scope.isTextarea = 'textarea' == iAttrs.type;                    
                    scope.isRequired = typeof iAttrs.notRequired === 'undefined';
                    scope.hasAddOnRight = typeof iAttrs.addOnRight !== 'undefined';
                    scope.hasAddOnLeft = typeof iAttrs.addOnLeft !== 'undefined';
                    scope.hasAddOn = scope.hasAddOnLeft || scope.hasAddOnRight;




                },
                post: function postLink(scope, iElement, iAttrs, controller) {



                }
            };

        } 
    };
});