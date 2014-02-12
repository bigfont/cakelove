var bsElements = angular.module('bsElements', []);

/*
 * Handles these input types email, password
*/
bsElements.directive('bseInput', function() {
    return {

        templateUrl: "/Scripts/templates/bse-input.html",
        scope:
        {
            id: '@',
            lblText: '@',
            placeholder: '@',
            theType: '@',
            width: '@',
            name:'@'
        },
        compile: function (el) {
            el.removeAttr("id");
            el.removeAttr("type");
        }

    };
});