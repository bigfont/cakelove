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

cakeLoveFactories.factory('formSvc', ['$http', '$fileUploader', '$timeout', 'userSvc', function ($http, $fileUploader, $timeout, userSvc) {

    var formSvc = {};

    formSvc.showSavedMessage = false;

    formSvc.update = function($scope, formModel, outerForm, url, callback) {

        $http({ method: "POST", url: url, data: formModel })
            .success(function (data, status, headers, config) {

                formSvc.showSavedMessage = true;
                $timeout(function () { formSvc.showSavedMessage = false; }, [10000]);
                if (typeof data.classId !== 'undefined')
                {
                    formModel.id = data.classId;
                }
                callback(data);

            }); // todo error, then

    };

    formSvc.createImageUploader = function ($scope, uploaderUrl) {
        var uploader =  $fileUploader.create({
            scope: $scope,
            url: uploaderUrl,
            headers: { Authorization: "Bearer " + userSvc.userToken }
        });


        // Images only filter
        uploader.filters.push(function (item /*{File|HTMLInputElement}*/) {
            var type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
            type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        });

        return uploader;
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

    objSvc.isUndefinedOrNull = function(obj)
    {
        return (typeof obj === 'undefined' || obj === null);
    }

    return objSvc;

}]);



