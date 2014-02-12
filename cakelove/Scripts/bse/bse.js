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
            outerForm: '='
        },
        compile: function (el) {
            el.removeAttr("id");
            el.removeAttr("type");
        }

    };
});