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
            type:'@'
        },
        compile: function (el) {
            el.removeAttr("id");
            el.removeAttr("type");
        }

    };
});

bsElements.directive('bseFileupload', function () {
    return {

        templateUrl: "/Scripts/templates/bse-fileupload.html",
        scope:
        {
            id: '@',
            lblText: '@'
        },
        compile: function (el) {
            el.removeAttr("id");            
        }

    };
});
