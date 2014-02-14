
/*global: angular */

//app module
var myApp = angular.module('cakeLoveApp', [
    'ngRoute', //routing module
    'ngSanitize',
    'ui.bootstrap',
    'cakeLoveControllers', //controllers module    
    'cakeLoveFilters',
    'cakeLoveDirectives',
    'cakeLoveFactories',
    'bsElements',
    'angularFileUpload'
]);


myApp.config(['$routeProvider',
function ($routeProvider) {
    $routeProvider.
    when('/welcome', {
        templateUrl: 'ng/partials/welcome',
        controller: 'WelcomeCtrl'
    }).
    when('/register', {
        templateUrl: 'ng/partials/login-register-form',
        controller: 'RegisterCtrl'
    }).
    when('/login', {
        templateUrl: 'ng/partials/login-register-form',
        controller: 'TokenCtrl'
    }).
    when('/agreement', {
        templateUrl: 'ng/partials/agreement',
        controller: 'AgreementCtrl',
        isSecure: true,
        allowTheseRoles: ["member"]
    }).
    when('/application-form', {
        templateUrl: 'ng/partials/application-form',
        controller: 'ApplicationFormCtrl',
        isSecure: true,
        allowTheseRoles: ["applicant"]
    }).
    otherwise({
        redirectTo: '/welcome'
    });
}]);

myApp.run(function ($rootScope, $location, userSvc) {

    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function (event, next, current) {

        function isSecureView(isSecure) {
            return typeof next.isSecure !== "undefined" && next.isSecure === true;
        }

        function isRequiringRoles(allowTheseRoles) {
            return next.allowTheseRoles !== 'undefined' && next.allowTheseRoles !== "*";
        }

        if (isSecureView(next.isSecure)) {

            /* secure views */

            if (!userSvc.isLoggedIn) {

                /* user is not logged */

                $location.path("/login");

            } else if (isRequiringRoles(next.allowTheseRoles) && !userSvc.isUserInOneOfTheseRoles(next.allowTheseRoles)) {

                /* user is logged but not in the appropriate role */

                throw "The user shouldn't be here, because he/she lacks the appropriate role.";
            }
        } else {

            /* non-secure views */

            if (userSvc.isLoggedIn) {

                /* user is logged in */

                if (userSvc.isUserInRole('admin')) {
                    $location.path("/admin-dashboard");
                } else if (userSvc.isUserInRole('applicant')) {
                    $location.path("/application-form");
                } else if (userSvc.isUserInRole('member')) {
                    $location.path("/agreement");
                }
            }
        }
    });

});



