var bsElements = angular.module('bsElements', []);

bsElements.directive('bseInput', function() {
    return {

        templateUrl: "/Scripts/templates/bs-input.html",
        scope:
        {
            id: '@',
            labelText: '@',
            placeholder: '@',
            type:'@'
        },
        compile: function (el) {
            el.removeAttr("id");
        }

    };
});
