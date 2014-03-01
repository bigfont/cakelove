/*global angular */

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
    when('/instructor-guidelines', {
        templateUrl: 'ng/partials/instructor-guidelines',
        controller: 'InstructorGuidelinesCtrl',
        isSecure: true,
        allowTheseRoles: ["member"]
    }).
    when('/application-form', {
        templateUrl: 'ng/partials/application-form',
        controller: 'ApplicationFormCtrl',
        isSecure: true,
        allowTheseRoles: ["applicant"]
    }).
    when('/admin', {
        templateUrl: 'ng/partials/admin',
        //controller: 'AdminCtrl',
        isSecure: true,
        allowTheseRoles: ["admin"]
    }).
    otherwise({
        redirectTo: '/welcome'
    });
}]);

myApp.run(function ($rootScope, $location, userSvc) {

    // register listener to watch route changes
    $rootScope.$on("$routeChangeStart", function (event, next, current) {

        function viewRequiresRole(role) {
            return next.allowTheseRoles.indexOf(role) >= 0;
        }

        function redirectUserThatLacksRequiredRole()
        {
            var redirectTo;
            if (viewRequiresRole('applicant')) { redirectTo = '/instructor-guidelines' }
            else if (viewRequiresRole('admin')) { redirectTo = '/'; }
            $location.path(redirectTo);
        }

        function isSecureView(isSecure) {
            return typeof next.isSecure !== "undefined" && next.isSecure === true;
        }

        function isRequiringRoles(allowTheseRoles) {
            return next.allowTheseRoles !== 'undefined' && next.allowTheseRoles !== "*";
        }

        if (isSecureView(next.isSecure)) {

            /* view is secure */

            if (!userSvc.isLoggedIn) {

                /* user is NOT logged */

                $location.path("/login");

            } else if (isRequiringRoles(next.allowTheseRoles) && !userSvc.isUserInOneOfTheseRoles(next.allowTheseRoles)) {

                /* user is logged but NOT in appropriate role, redirect as apporpriate */

                redirectUserThatLacksRequiredRole();

            }
        } else {

            /* view is NOT secure */

            if (userSvc.isLoggedIn) {

                /* user is logged in */

                if (userSvc.isUserInRole('admin')) {
                    $location.path("/admin-dashboard");
                } else if (userSvc.isUserInRole('applicant')) {
                    $location.path("/application-form");
                } else if (userSvc.isUserInRole('member')) {
                    $location.path("/instructor-guidelines");
                }
            }
        }
    });

});
