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
myApp.factory('userService', ['$window', '$http', function ($window, $http) {

    var auth = {};    

    function setPropertiesFromSessionStorage() {

        auth.userToken = $window.sessionStorage.getItem('userToken');
        auth.userId = $window.sessionStorage.getItem('userId');
        auth.userName = $window.sessionStorage.getItem('userName');
        auth.userRolesCsv = $window.sessionStorage.getItem('userRolesCsv');

        if (typeof auth.userToken !== "undefined" && auth.userToken !== null && auth.userToken.length > 0) {

            auth.isLoggedIn = true;
            $http.defaults.headers.common.Authorization = "Bearer " + auth.userToken;

        } else {
            auth.isLoggedIn = false;
        }
    };

    setPropertiesFromSessionStorage();

    auth.isUserInOneOfTheAllowedRoles = function(allowedRolesArray, usersRolesArray) {
        var match;
        match = false;

        for (var i = 0; i < usersRolesArray.length; i++) {
            var index, role;
            role = usersRolesArray[i];
            index = allowedRolesArray.indexOf(role);
            if (index >= 0) {
                match = true;
                break;
            }
        }
        return match;
    };

    // on login
    auth.login = function (userName, userId, userRolesCsv, userToken) {

        $window.sessionStorage.setItem('userToken', userToken);
        $window.sessionStorage.setItem('userId', userId);
        $window.sessionStorage.setItem('userName', userName);
        $window.sessionStorage.setItem('userRolesCsv', userRolesCsv);

        setPropertiesFromSessionStorage();
    };

    // on logout
    auth.logout = function () {

        auth.isLoggedIn = false;

        $window.sessionStorage.removeItem('userToken');
        $window.sessionStorage.setItem('userId');
        $window.sessionStorage.removeItem('userName');
        $window.sessionStorage.removeItem('userRolesCsv');

    };

    return auth;

}]);
