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
myApp.factory('userSvc', ['$window', '$http', function ($window, $http) {

    var userSvc = {};
    var storage = $window.localStorage;

    function setPropertiesFromSessionStorage() {

        userSvc.userToken = storage.getItem('userToken');
        userSvc.userId = storage.getItem('userId');
        userSvc.userName = storage.getItem('userName');
        userSvc.userRolesCsv = storage.getItem('userRolesCsv');

        if (typeof userSvc.userToken !== "undefined" && userSvc.userToken !== null && userSvc.userToken.length > 0) {

            userSvc.isLoggedIn = true;
            $http.defaults.headers.common.Authorization = "Bearer " + userSvc.userToken;

        } else {
            userSvc.isLoggedIn = false;
        }
    };

    setPropertiesFromSessionStorage();    

    userSvc.isUserInRole = function (roleToCheck) {

        return userSvc.isUserInOneOfTheseRoles([roleToCheck]);

    };

    userSvc.isUserInOneOfTheseRoles = function (rolesToCheckArray) {
        var match, userRolesArray;
        match = false;

        userRolesArray = this.userRolesCsv.split(',');

        for (var i = 0; i < userRolesArray.length; i++) {
            var index, role;
            role = userRolesArray[i];
            index = rolesToCheckArray.indexOf(role);
            if (index >= 0) {
                match = true;
                break;
            }
        }
        return match;
    };

    userSvc.login = function (userName, userId, userRolesCsv, userToken) {
      
        storage.setItem('userToken', userToken);
        storage.setItem('userId', userId);
        storage.setItem('userName', userName);
        storage.setItem('userRolesCsv', userRolesCsv);

        setPropertiesFromSessionStorage();
    };

    userSvc.logout = function () {

        userSvc.isLoggedIn = false;

        $window.sessionStorage.removeItem('userToken');
        $window.sessionStorage.setItem('userId');
        $window.sessionStorage.removeItem('userName');
        $window.sessionStorage.removeItem('userRolesCsv');

    };

    return userSvc;

}]);
