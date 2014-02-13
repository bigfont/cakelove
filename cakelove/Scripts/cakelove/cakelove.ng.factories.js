var cakeLoveFactories = angular.module("cakeLoveFactories", []);

cakeLoveFactories.factory('siteMapSvc', [function() {

    var siteMap = {};

    siteMap.currentPage = null;

    return siteMap;

}]);

cakeLoveFactories.factory('urlSvc', ['$location', function ($location) {

    var url = {};

    var base = $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port;

    url.ToAbsoluteUrl = function (rightPart) {

        return base + rightPart;

    };

    return url;

}]);

// See http://blog.brunoscopelliti.com/deal-with-users-authentication-in-an-angularjs-web-app
cakeLoveFactories.factory('userSvc', ['$window', '$location', '$http', function ($window, $location, $http) {

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

    userSvc.createAspNetIdentityGrantRequest = function(userName, password) {
        return "grant_type=password&username=" + userName + "&password=" + password;;
    };

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

        storage.removeItem('userToken');
        storage.removeItem('userId');
        storage.removeItem('userName');
        storage.removeItem('userRolesCsv');

        $location.path("/");

    };

    return userSvc;

}]);

cakeLoveFactories.factory('formSvc', ['$http', function ($http) {

    var formSvc = {};

    formSvc.update = function($scope, formModel, outerForm, url) {

        outerForm.submitted = true;
        $scope.masterModel = angular.copy(formModel);
        $http({ method: "POST", url: url, data: formModel }); // todo success, error, then

    };

    return formSvc;

}]);

cakeLoveFactories.factory('objSvc', [function () {

    var objSvc = {};

    objSvc.copyWithoutValues = function(obj) {
        var newObj = angular.copy(obj);
        for (prop in newObj) {
            if (newObj.hasOwnProperty(prop)) {
                newObj[prop] = null;
            }
        };
        return newObj;
    }

    return objSvc;

}]);



