/*global angular*/
(function (angular) {

    "use strict";

    var cakeLoveFactories = angular.module("cakeLoveFactories", []);

    cakeLoveFactories.factory('siteMapSvc', [function () {

        var siteMap = {};

        siteMap.currentPage = null;

        return siteMap;

    }]);

    cakeLoveFactories.factory('urlSvc', ['$location', function ($location) {

        var url, base;

        url = {};
        base = $location.$$protocol + '://' + $location.$$host + ':' + $location.$$port;
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
                };
                userSvc.storage = $window.localStorage;
            }
        }

        function setHttpAuthHeader(access_token) {
            $http.defaults.headers.common.Authorization = "Bearer " + access_token;
        }

        function storeNewUserRole(roleName) {
            userSvc.userRolesCsv += ',' + roleName;
            userSvc.storage.setItem('userRolesCsv', userSvc.userRolesCsv);
        }

        function populate_ClientStorage_From_UserSvc() {

            if (!objSvc.isUndefinedOrNull(userSvc)) {
                userSvc.storage.setItem('access_token', userSvc.access_token);
                userSvc.storage.setItem('userId', userSvc.userId);
                userSvc.storage.setItem('userName', userSvc.userName);
                userSvc.storage.setItem('userRolesCsv', userSvc.userRolesCsv);
                userSvc.storage.setItem('isLoggedIn', userSvc.isLoggedIn);
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

            userSvc.access_token = userSvc.storage.getItem('access_token');
            userSvc.userId = userSvc.storage.getItem('userId');
            userSvc.userName = userSvc.storage.getItem('userName');
            userSvc.userRolesCsv = userSvc.storage.getItem('userRolesCsv');
            userSvc.isLoggedIn = userSvc.storage.getItem('isLoggedIn');
        }

        createBaseUserSvc();

        userSvc.loginFromClientStorage = function () {
            populate_UserSvc_From_ClientStorage();
            setHttpAuthHeader(userSvc.access_token);
        };

        userSvc.createAspNetIdentityGrantRequest = function (userName, password) {
            return "grant_type=password&username=" + userName + "&password=" + password;
        };

        userSvc.addCurrentUserToRole = function (roleName, successCallback) {

            var url, userRoleData;

            url = urlSvc.ToAbsoluteUrl("/api/Account/AddUserToRole");
            userRoleData = {
                userId: userSvc.userId,
                roleName: roleName
            };

            $http.post(url, userRoleData)
                .success(function (data, status, headers, config) {

                    storeNewUserRole(roleName);

                    if (!objSvc.isUndefinedOrNull(successCallback)) { successCallback(); }

                });

        };

        userSvc.isUserInRole = function (roleToCheck) {

            return userSvc.isUserInOneOfTheseRoles([roleToCheck]);

        };

        userSvc.isUserInOneOfTheseRoles = function (rolesToCheckArray) {
            var match, userRolesArray, i, index, role;
            match = false;
            if (!objSvc.isUndefinedOrNull(this.userRolesCsv)) {
                userRolesArray = this.userRolesCsv.split(',');
                for (i = 0; i < userRolesArray.length; i += 1) {
                    role = userRolesArray[i];
                    index = rolesToCheckArray.indexOf(role);
                    if (index >= 0) {
                        match = true;
                        break;
                    }
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
            userSvc.storage.removeItem('access_token');
            userSvc.storage.removeItem('userId');
            userSvc.storage.removeItem('userName');
            userSvc.storage.removeItem('userRolesCsv');
            userSvc.storage.removeItem('userName');
            userSvc.storage.removeItem('isLoggedIn');

            $location.path("/");

        };

        userSvc.loginFromClientStorage();

        return userSvc;

    }]);

    cakeLoveFactories.factory('formSvc', ['$http', '$fileUploader', '$timeout', 'userSvc', 'objSvc', 'urlSvc', function ($http, $fileUploader, $timeout, userSvc, objSvc, urlSvc) {

        var formSvc = {};

        function showFormUpdateMessage() {
            formSvc.showSavedMessage = true;
            $timeout(function () { formSvc.showSavedMessage = false; }, [2000]);
        }

        formSvc.showSavedMessage = false;

        formSvc.updateModel = function (formModel, outerForm, url, successCallback) {

            $http({ method: "POST", url: url, data: formModel })
                .success(function (data, status, headers, config) {

                    showFormUpdateMessage();

                    if (data.id) {
                        formModel.id = data.id;
                    }

                    if (!objSvc.isUndefinedOrNull(successCallback)) { successCallback(data); }

                });

        };

        formSvc.resetModel = function ($scope) {
            $scope.formModel = angular.copy($scope.masterModel);
        };

        formSvc.deleteModelById = function (id, url, successCallback) {

            $http({ method: "DELETE", url: url + "/" + id })
                .success(function (data, status, headers, config) {

                    showFormUpdateMessage();

                    if (!objSvc.isUndefinedOrNull(successCallback)) { successCallback(); }

                });
        };

        formSvc.submitCurrentUserApplication = function () {

            var url = urlSvc.ToAbsoluteUrl('/api/TeacherApplicationForm/SubmitCurrentUserApplication');
            $http({ method: "PUT", url: url });
        };

        formSvc.createImageUploader = function ($scope, uploaderUrl) {
            var uploader = $fileUploader.create({
                scope: $scope,
                url: uploaderUrl,
                headers: { Authorization: "Bearer " + userSvc.access_token }
            });

            // Image type filter {File|HTMLInputElement}
            uploader.filters.push(function (item) {

                function convertPipeSeparatedListToPhrase(list, separator) {
                    var phrase = list
                        .replace(/\|?/, '') /*{first instance}*/
                        .replace(/\|[^\|]*$/, '.') /*{last instance}*/
                        .replace(/\|([^\|]*)$/, ', or $1 ') /*{last instance}*/
                        .replace(/\|/, ', '); /*{the rest}*/
                    return phrase;
                }

                var allowedTypes, type, isValid;

                allowedTypes = '|jpg|png|jpeg|';
                type = uploader.isHTML5 ? item.type : '/' + item.value.slice(item.value.lastIndexOf('.') + 1);
                type = '|' + type.toLowerCase().slice(type.lastIndexOf('/') + 1) + '|';
                isValid = allowedTypes.indexOf(type) !== -1;
                if (!isValid) {
                    $scope.uploader.filterErrors = ['The file must be one of these types: ' + convertPipeSeparatedListToPhrase(allowedTypes)];
                }
                return isValid;
            });

            // Image size filter
            uploader.filters.push(function (item) {

                var maxSizeMB, size, sizeMB, isValid;

                maxSizeMB = 2; /*MB*/
                size = uploader.isHTML5 ? item.size : -1; /*what if it isn't HTML5?*/
                sizeMB = (size / 1024 / 1024);
                isValid = sizeMB <= maxSizeMB;
                if (!isValid) {
                    $scope.uploader.filterErrors = ['The file must be no more than ' + maxSizeMB + ' MB'];
                }
                return isValid;
            });

            return uploader;
        };

        formSvc.updateImgSrcFromXMLHTTPRequestEvent = function (xmlHttpRequestProgressEvent, jsonPropertyName) {

            var updatedPath, imgRootRelativePath, responseObj, responseJson, xmlHttpRequest;

            // target, currentTarger, srcElement... which is most appropriate?
            xmlHttpRequest = xmlHttpRequestProgressEvent.target;
            responseJson = xmlHttpRequest.responseText;
            if (responseJson.length === 0) {
                return null;
            }
            responseObj = angular.fromJson(responseJson);
            imgRootRelativePath = responseObj[jsonPropertyName];
            if (objSvc.isUndefinedOrNull(imgRootRelativePath)) {
                return null;
            }
            updatedPath = imgRootRelativePath + "?" + new Date().getTime();
            return updatedPath;
        };

        return formSvc;

    }]);

    cakeLoveFactories.factory('objSvc', [function () {

        var objSvc, prop, newObj;

        objSvc = {};

        objSvc.copyWithoutValues = function (obj) {
            newObj = angular.copy(obj);
            for (prop in newObj) {
                if (newObj.hasOwnProperty(prop)) {
                    newObj[prop] = null;
                }
            }
            return newObj;
        };

        objSvc.isUndefinedOrNull = function (obj) {
            return (obj === undefined || obj === null);
        };

        objSvc.typeof = function (obj) {
            return typeof obj;
        };

        return objSvc;

    }]);

}(angular));