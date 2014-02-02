myApp.factory('urlService', ['$location', function ($location) {

    var url = {};

    var base = $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port;

    url.ToAbsoluteUrl = function (rightPart) {

        return base + rightPart;

    };

    return url;

}]);

var cakeLoveFactories = angular.module("cakeLoveFactories", []);


// See http://blog.brunoscopelliti.com/deal-with-users-authentication-in-an-angularjs-web-app
myApp.factory('authService', ['$window', function ($window) {

    var auth = {};

    auth.isLoggedIn = false;
    auth.userName = "";

    if ($window.sessionStorage.getItem('token')) {
        auth.isLoggedIn = true;
        auth.userName = $window.sessionStorage.getItem('userName');
    }

    auth.login = function (userName, password, token) {

        $window.sessionStorage.setItem('token', token);
        $window.sessionStorage.setItem('userName', userName);

        auth.isLoggedIn = true;
        auth.userName = userName;

    };

    auth.logout = function () {
        auth.isLoggedIn = false;
    };

    return auth;

}]);