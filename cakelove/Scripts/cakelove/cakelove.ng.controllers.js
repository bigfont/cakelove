﻿var cakeLoveControllers = (function (angular) {

    'use strict';

    var cakeLoveControllers = angular.module("cakeLoveControllers", []);

    cakeLoveControllers.controller("MainCtrl", ['$scope', 'userSvc', 'siteMapSvc', 'formSvc', 'objSvc', function ($scope, userSvc, siteMapSvc, formSvc, objSvc) {

        $scope.userSvc = userSvc;
        $scope.siteMapSvc = siteMapSvc;
        $scope.objSvc = objSvc;

    }]);

    cakeLoveControllers.controller("MainNavbarCtrl", ["$scope", function ($scope) {
        $scope.isCollapsed = false;
    }]);

    cakeLoveControllers.controller("WelcomeCtrl", ['$scope', '$http', '$location', 'urlSvc', 'userSvc', 'siteMapSvc',
        function ($scope, $http, $location, urlSvc, userSvc, siteMapSvc) {

            siteMapSvc.currentPage = "Welcome";
            $http.get(urlSvc.ToAbsoluteUrl('/ng/ajax/welcome-text')).success(function (data) {

                $scope.welcomeText = data;

            });

        }]);

    cakeLoveControllers.controller('RegisterCtrl', ['$scope', '$http', '$location', 'userSvc', 'urlSvc', 'siteMapSvc',
        function ($scope, $http, $location, userSvc, urlSvc, siteMapSvc) {

            siteMapSvc.currentPage = "Register";

            $scope.clientModel = {};
            $scope.masterModel = {};

            var url = urlSvc.ToAbsoluteUrl('/api/account/register');

            $http({ method: 'GET', url: url }).
                success(function (data, status, headers, config) {

                    $scope.masterModel = miscFunctions.InferTheHtmlInputAttributesOfEachKeyValuePair(data);

                });

            $scope.submit = function () {

                var clientModel = $scope.clientModel;

                $http({ method: 'POST', url: url, data: clientModel }).
                    success(function (data, status, headers, config) {

                        url = urlSvc.ToAbsoluteUrl('/token');
                        var grantRequest = userSvc.createAspNetIdentityGrantRequest(clientModel.UserName, clientModel.Password);

                        // yikes... nested $http gets... is this okay?
                        $http({ method: 'POST', url: url, data: grantRequest }).
                            success(function (data, status, headers, config) {

                                userSvc.storeUserLogin(data);
                                $location.path("/instructor-guidelines");

                            }).
                            error(function (data, status, headers, config) {
                                throw 'Yikes something bad happened during registration login.';
                            });

                    }).
                    error(function (data, status, headers, config) {

                        $scope.masterModel = miscFunctions.AddServerSideValidationMessages($scope.form, $scope.masterModel, data.ModelState);

                    });
            };

        }]);

    cakeLoveControllers.controller('TokenCtrl', ['$scope', '$http', '$window', '$location', 'userSvc', 'urlSvc', 'siteMapSvc',
        function ($scope, $http, $window, $location, userSvc, urlSvc, siteMapSvc) {

            var grantRequest, url, password, userName, userCredentials;

            siteMapSvc.currentPage = 'Login';
            $scope.loginRegister = "Login";

            $scope.clientModel = {};
            $scope.masterModel = {};

            userCredentials = { UserName: '', Password: '' };
            $scope.masterModel = miscFunctions.InferTheHtmlInputAttributesOfEachKeyValuePair(userCredentials);

            $scope.submit = function () {

                userName = $scope.clientModel.UserName;
                password = $scope.clientModel.Password;

                url = urlSvc.ToAbsoluteUrl('/token');
                grantRequest = userSvc.createAspNetIdentityGrantRequest(userName, password);

                $http({ method: 'POST', url: url, data: grantRequest }).
                    success(function (data, status, headers, config) {

                        // log the user in
                        userSvc.storeUserLogin(data);

                        // redirect the user
                        if (userSvc.isUserInRole('applicant')) {
                            $location.path("/application-form");
                        } else {
                            $location.path("/instructor-guidelines");
                        }
                    }).
                    error(function (data, status, headers, config) {

                        // display errors to user
                        $scope.masterModel.UserName.serverErrors = [data.error_description];
                        $scope.form.UserName.$setValidity('servervalidation', false);
                        $scope.form.Password.$setValidity('servervalidation', false);

                    });
            };
        }]);

    cakeLoveControllers.controller('InstructorGuidelinesCtrl', ['$scope', '$http', '$location', '$window', '$sce', 'userSvc', 'urlSvc', 'siteMapSvc',
        function ($scope, $http, $location, $window, $sce, userSvc, urlSvc, siteMapSvc) {

            siteMapSvc.currentPage = "Instructor Guidelines";

            $http.get(urlSvc.ToAbsoluteUrl('/ng/ajax/instructor-guidelines-text')).success(function (data) {

                $scope.instructorGuidelinesText = $sce.trustAsHtml(data);

            });

            $scope.accept = function () {

                userSvc.addCurrentUserToRole("applicant", function () {

                    $location.path("/application-form");

                });

            };

        }]);

    cakeLoveControllers.controller('ApplicationFormCtrl', ['$scope', '$http', '$location', '$window', 'userSvc', 'urlSvc', 'siteMapSvc', 'formSvc', 'objSvc',
         function ($scope, $http, $location, $window, userSvc, urlSvc, siteMapSvc, formSvc, objSvc) {

            siteMapSvc.currentPage = "Application";

            // get
            var url;
            $scope.url = url = urlSvc.ToAbsoluteUrl('/api/TeacherApplicationForm/currentUserApplicationStatus');
            $http({ method: 'GET', url: url }).
                 success(function (data, status, headers, config) {
                    if (!objSvc.isUndefinedOrNull($scope.outerForm)) {
                        $scope.outerForm.userSubmitted = data.isSubmitted;
                    }
                });

            $scope.formSvc = formSvc;

            $scope.submit = function () {

                $scope.outerForm.userSubmitting = true;
                $scope.$broadcast('userSubmitting'); // this saves to db

                // validate
                var failsSubmitRequired, failsTotalClassHours;

                // set default to be extra safe, then validate
                $scope.requiredErrorsLength = 0;
                $scope.requiredErrorsLength = $scope.outerForm.$error.submitRequired ? $scope.outerForm.$error.submitRequired.length : 0;
                $scope.failsSubmitRequired = failsSubmitRequired = $scope.requiredErrorsLength > 0;
                $scope.failsTotalClassHours = failsTotalClassHours = formSvc.totalClassHours() < 20;
                // check if valid
                if (!failsSubmitRequired && !failsTotalClassHours) {
                    formSvc.submitCurrentUserApplication();
                    $scope.outerForm.userSubmitted = true;
                }
            };
        }]);

    cakeLoveControllers.controller('ContactInfoCtrl', ['$scope', '$http', '$location', '$window', 'userSvc', 'urlSvc', 'formSvc',
        function ($scope, $http, $location, $window, userSvc, urlSvc, formSvc) {

            $scope.formName = 'Contact Info';

            // create a master model
            $scope.masterModel = {};

            // get
            var url, update;
            $scope.url = url = urlSvc.ToAbsoluteUrl('/api/TeacherApplicationForm/contactInfo');
            $http({ method: 'GET', url: url }).
                success(function (data, status, headers, config) {

                    $scope.masterModel = data;
                    $scope.reset($scope);

                });

            // reset the user input model
            $scope.reset = formSvc.resetModel;

            // update master from the user input model
            $scope.update = update = formSvc.updateModel;

            $scope.$on('userSubmitting', function (scopeDetails, msgFromParent) {
                update($scope.formModel, $scope.outerForm, $scope.url);
            });

        }]);

    cakeLoveControllers.controller('TeachingExperienceCtrl', [
        '$scope', '$http', '$location', '$window', 'userSvc', 'urlSvc', 'formSvc',
        function ($scope, $http, $location, $window, userSvc, urlSvc, formSvc) {

            $scope.formName = 'Teaching Experience';

            $scope.masterModel = {};

            // get        
            var url, update;
            $scope.url = url = urlSvc.ToAbsoluteUrl('/api/TeacherApplicationForm/teachingExperience');
            $http({ method: 'GET', url: url }).
                success(function (data, status, headers, config) {

                    $scope.masterModel = data;
                    $scope.reset($scope);

                });

            // reset the user input model
            $scope.reset = formSvc.resetModel;

            // update master from the user input model
            $scope.update = update = formSvc.updateModel;

            $scope.$on('userSubmitting', function (scopeDetails, msgFromParent) {
                update($scope.formModel, $scope.outerForm, $scope.url);
            });

        }
    ]);

    cakeLoveControllers.controller('BiographyCtrl', [
        '$scope', '$http', '$location', '$window', '$fileUploader', 'userSvc', 'urlSvc', 'formSvc',
        function ($scope, $http, $location, $window, $fileUploader, userSvc, urlSvc, formSvc) {

            $scope.formName = 'Biography';

            $scope.masterModel = {};

            // get
            var url, update, uploaderUrl, uploader;
            $scope.url = url = urlSvc.ToAbsoluteUrl('/api/TeacherApplicationForm/biography');
            $http({ method: 'GET', url: url }).
                success(function (data, status, headers, config) {

                    $scope.masterModel = data;
                    $scope.reset($scope);

                });

            // reset the user input model            
            $scope.reset = formSvc.resetModel;

            // update master from the user input model
            $scope.update = update = formSvc.updateModel;

            $scope.$on('userSubmitting', function (scopeDetails, msgFromParent) {
                update($scope.formModel, $scope.outerForm, $scope.url);
            });

            // Create a uploader
            uploaderUrl = urlSvc.ToAbsoluteUrl('/api/TeacherApplicationForm/biographyImage');
            uploader = $scope.uploader = formSvc.createImageUploader($scope, uploaderUrl);
            uploader.bind('beforeupload', function (event, item) {
                item._xhr.onreadystatechange = function (xmlHttpRequestProgressEvent) {
                    var jsonPropertyName = 'imageRelativePath';
                    $scope.formModel[jsonPropertyName] =
                        formSvc.updateImgSrcFromXMLHTTPRequestEvent(xmlHttpRequestProgressEvent, jsonPropertyName);
                };
            });
        }
    ]);

    cakeLoveControllers.controller('ClassesCtrl', ['$scope', '$http', '$location', '$window', '$timeout', 'userSvc', 'urlSvc', 'formSvc', 'objSvc',
        function ($scope, $http, $location, $window, $timeout, userSvc, urlSvc, formSvc, objSvc) {

            $scope.formName = 'Classes';

            $scope.masterModelArray = [];

            function setClassInfoDefaults(classInfo) {
                if (objSvc.isUndefinedOrNull(classInfo.className) || classInfo.className.length === 0) {
                    classInfo.className = "Untitled Class";
                }
                if (objSvc.isUndefinedOrNull(classInfo.id) || classInfo.id < 0) {
                    classInfo.id = 0;
                }
            }

            $scope.activeClass = function () {

                var c, i;

                for (i = 0; i < $scope.classes.length; i += 1) {
                    c = $scope.classes[i];
                    if (c.active === 'true' || c.active === true) {
                        return c;
                    }
                }
            };

            // Create a uploader
            function createUploader() {
                var uploaderUrl, uploader;

                uploaderUrl = urlSvc.ToAbsoluteUrl('/api/TeacherApplicationForm/classImage');
                uploader = $scope.uploader = formSvc.createImageUploader($scope, uploaderUrl);
                uploader.bind('beforeupload', function (event, item) {

                    // add the class.id
                    item.url += "/" + $scope.activeClass().id;

                    // respond to upload complete
                    item._xhr.onreadystatechange = function (xmlHttpRequestProgressEvent) {
                        var activeClass, jsonPropertyName;
                        jsonPropertyName = 'imageRelativePath';
                        activeClass = $scope.activeClass();
                        activeClass[jsonPropertyName] =
                            formSvc.updateImgSrcFromXMLHTTPRequestEvent(xmlHttpRequestProgressEvent, jsonPropertyName);
                    };
                });
            }

            $scope.totalClassHours = formSvc.totalClassHours = function () {
                var total = 0;

                function safeAddend(value) {
                    var safe;
                    safe = parseInt(value, 10);
                    safe = isNaN(safe) ? 0 : safe;
                    return safe;
                }

                angular.forEach($scope.classes, function (item) {
                    total += safeAddend(item.totalTimeDayOne);
                    total += safeAddend(item.totalTimeDayTwo);
                });
                return total;
            };

            // get
            var url, update;
            $scope.url = url = urlSvc.ToAbsoluteUrl('/api/TeacherApplicationForm/classInfo');
            $http({ method: 'GET', url: url }).
                success(function (data, status, headers, config) {

                    var i;

                    $scope.masterModelArray = data;

                    for (i = 0; i < data.length; i += 1) {
                        setClassInfoDefaults(data[i]);
                    }

                    $scope.reset();
                    createUploader();
                });

            // add a new classinfo
            $scope.create = function () {
                var newClassInfo = objSvc.copyWithoutValues($scope.masterModelArray[0]);
                newClassInfo.active = true;
                setClassInfoDefaults(newClassInfo);
                $scope.update(newClassInfo, $scope.outerForm, $scope.url);
                $scope.classes.push(newClassInfo);
            };

            $scope.delete = function (classInfo, index) {

                if ($window.confirm("Do you want to delete " + classInfo.className + " now" + "?")) {

                    $scope.classes.splice(index, 1);

                    var deleteUrl = urlSvc.ToAbsoluteUrl('/api/TeacherApplicationForm/deleteClassInfo');
                    formSvc.deleteModelById(classInfo.id, deleteUrl);

                }
            };

            // reset the user input model
            $scope.reset = function () {
                $scope.classes = angular.copy($scope.masterModelArray);
                $scope.classes[0].active = true;
            };

            $scope.update = update = formSvc.updateModel;

            $scope.$on('userSubmitting', function (scopeDetails, msgFromParent) {

                angular.forEach($scope.classes, function (value, key) {

                    console.log('userSubmitting');
                    update(value, $scope.outerForm, $scope.url);

                });

            });
        }]);

    cakeLoveControllers.controller('AdminCtrl', ['$scope', '$http', '$location', '$routeParams', 'urlSvc', 'siteMapSvc', function ($scope, $http, $location, $routeParams, urlSvc, siteMapSvc) {

        var adminSection, adminSubsection;

        siteMapSvc.currentPage = "Admin";

        adminSection = $routeParams.adminSection;
        adminSubsection = $routeParams.adminSubsection;

        $scope.totalMinutes = function (hrs, mins) {
            return hrs * 60 + mins;
        };

        $scope.totalHours = function (hrs, mins) {
            return hrs + mins / 60;
        };

        function setNullToFalse(data, property) {
            var i;
            for (i = 0; i < data.length; i += 1) {
                if (data[i][property] === null) {
                    data[i][property] = false;
                }
            }
        }

        function listUsers() {
            var url = urlSvc.ToAbsoluteUrl('/api/applicant');
            $scope.userView = 'list';
            $http({ method: 'GET', url: url }).
                success(function (data, status, headers, config) {

                    setNullToFalse(data, 'IsSubmitted');
                    $scope.applicants = data;

                });
        }

        function createUserDataAliases(data)
        {
            var aliased = {};
            aliased.ci = data.ContactInfo[0];
            aliased.bio = data.Biography[0];
            aliased.te = data.TeachingExperience[0];
            aliased.cinfo = data.ClassInfo;

            return aliased;
        }

        function displayUser(userName) {
            var url = urlSvc.ToAbsoluteUrl('/api/applicant/' + userName);
            $scope.userView = 'details';

            $http({ method: 'GET', url: url }).
                success(function (data, status, headers, config) {

                    $scope.applicant = createUserDataAliases(data);
                    $scope.applicant.UserName = userName;

                });
        }

        // either show all users or show a specific user
        if (adminSection === 'user' && adminSubsection !== null) {
            displayUser(adminSubsection);
        } else {
            listUsers();
        }

    }]);

    return cakeLoveControllers;

}(angular));