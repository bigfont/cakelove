var cakeLoveFactories = angular.module("cakeLoveFactories", []);

cakeLoveFactories.factory('siteMapSvc', [function () {

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
cakeLoveFactories.factory('userSvc', ['$window', '$location', '$http', 'objSvc', 'urlSvc', function ($window, $location, $http, objSvc, urlSvc) {

    var userSvc;

    function createBaseUserSvc() {
        if (objSvc.isUndefinedOrNull(userSvc)) {
            userSvc = {

                access_token: '',
                userId: '',
                userName: '',
                userRolesCsv: '',
                isLoggedIn: '',
                storage: ''
            }
            storage = $window.localStorage;
        }
    };

    function setHttpAuthHeader(access_token) {
        $http.defaults.headers.common.Authorization = "Bearer " + userSvc.access_token;
    }

    function storeNewUserRole(roleName)
    {
        userSvc.userRolesCsv += ',' + roleName;
        storage.setItem('userRolesCsv', userSvc.userRolesCsv);
    }

    function populate_ClientStorage_From_UserSvc() {

        if (!objSvc.isUndefinedOrNull(userSvc)) {
            storage.setItem('access_token', userSvc.access_token);
            storage.setItem('userId', userSvc.userId);
            storage.setItem('userName', userSvc.userName);
            storage.setItem('userRolesCsv', userSvc.userRolesCsv);
            storage.setItem('isLoggedIn', userSvc.isLoggedIn);
        }
    }

    function populate_UserSvc_From_LoginResult(loginResult) {

        userSvc.access_token = loginResult.access_token;
        userSvc.userId = loginResult.userId;
        userSvc.userName = loginResult.userName;
        userSvc.userRolesCsv = loginResult.userRolesCsv;
        userSvc.isLoggedIn = true;
    }

    function populate_UserSvc_From_ClientStorage() {

        userSvc.access_token = storage.getItem('access_token');
        userSvc.userId = storage.getItem('userId');
        userSvc.userName = storage.getItem('userName');
        userSvc.userRolesCsv = storage.getItem('userRolesCsv');
        userSvc.isLoggedIn = storage.getItem('isLoggedIn');
    };

    createBaseUserSvc();

    userSvc.loginFromClientStorage = function () {
        populate_UserSvc_From_ClientStorage();
        setHttpAuthHeader();
    }

    userSvc.createAspNetIdentityGrantRequest = function (userName, password) {
        return "grant_type=password&username=" + userName + "&password=" + password;;
    };

    userSvc.addCurrentUserToRole = function (roleName, successCallback) {

        var url = urlSvc.ToAbsoluteUrl("/api/Account/AddUserToRole");
        var userRoleData = {
            userId: userSvc.userId,
            roleName: roleName
        };

        $http.post(url, userRoleData)
            .success(function (data, status, headers, config) {

                storeNewUserRole(roleName);
                successCallback();

            });

    }

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

    userSvc.storeUserLogin = function (loginResult) {

        setHttpAuthHeader(loginResult.access_token);
        populate_UserSvc_From_LoginResult(loginResult);
        populate_ClientStorage_From_UserSvc();
    };

    userSvc.logout = function () {

        userSvc.isLoggedIn = false;

        storage.removeItem('access_token');
        storage.removeItem('userId');
        storage.removeItem('userName');
        storage.removeItem('userRolesCsv');

        $location.path("/");

    };

    userSvc.loginFromClientStorage();

    return userSvc;

}]);

cakeLoveFactories.factory('formSvc', ['$http', '$fileUploader', '$timeout', 'userSvc', function ($http, $fileUploader, $timeout, userSvc) {

    var formSvc = {};

    function showFormUpdateMessage() {
        formSvc.showSavedMessage = true;
        $timeout(function () { formSvc.showSavedMessage = false; }, [2000]);
        if (typeof data.classId !== 'undefined') {
            formModel.id = data.classId;
        }
        callback(data);
    }

    formSvc.showSavedMessage = false;

    formSvc.update = function ($scope, formModel, outerForm, url, callback) {

        $http({ method: "POST", url: url, data: formModel })
            .success(function (data, status, headers, config) {

                showFormUpdateMessage();

            }); // todo error, then

    };

    formSvc.createImageUploader = function ($scope, uploaderUrl) {
        var uploader = $fileUploader.create({
            scope: $scope,
            url: uploaderUrl,
            headers: { Authorization: "Bearer " + userSvc.access_token }
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

    objSvc.copyWithoutValues = function (obj) {
        var newObj = angular.copy(obj);
        for (prop in newObj) {
            if (newObj.hasOwnProperty(prop)) {
                newObj[prop] = null;
            }
        };
        return newObj;
    }

    objSvc.isUndefinedOrNull = function (obj) {
        return (typeof obj === 'undefined' || obj === null);
    }

    return objSvc;

}]);



