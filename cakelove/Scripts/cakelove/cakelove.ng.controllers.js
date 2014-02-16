var cakeLoveControllers = angular.module("cakeLoveControllers", []);

cakeLoveControllers.controller("MainCtrl", ['$scope', 'userSvc', 'siteMapSvc', 'formSvc', function ($scope, userSvc, siteMapSvc, formSvc) {

    $scope.userSvc = userSvc;
    $scope.siteMapSvc = siteMapSvc;

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

            }).
            error(function (data, status, headers, config) {

                miscFunctions.ShowAjaxResultsForDevelopment($scope, data, status, headers, config);

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

        siteMapSvc.currentPage = 'Login';
        $scope.loginRegister = "Login";

        $scope.clientModel = {};
        $scope.masterModel = {};

        var userCredentials = { UserName: '', Password: '' };
        $scope.masterModel = miscFunctions.InferTheHtmlInputAttributesOfEachKeyValuePair(userCredentials);

        $scope.submit = function () {

            var userName = $scope.clientModel.UserName;
            var password = $scope.clientModel.Password;

            var url = urlSvc.ToAbsoluteUrl('/token');
            var grantRequest = userSvc.createAspNetIdentityGrantRequest(userName, password);

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

cakeLoveControllers.controller('ApplicationFormCtrl', ['$scope', '$http', '$location', '$window', 'userSvc', 'urlSvc', 'siteMapSvc', 'formSvc',
function ($scope, $http, $location, $window, userSvc, urlSvc, siteMapSvc, formSvc) {

     siteMapSvc.currentPage = "Application";

    $scope.formSvc = formSvc;

    $scope.navType = 'pills';

    $scope.submit = function () {

        $scope.outerForm.userSubmitting = true;
        $scope.$broadcast('userSubmitting');

        var requiredErrorsLength = $scope.outerForm.$error.submitRequired.length;
        if (requiredErrorsLength > 0) {
            $scope.requiredErrorCount = requiredErrorsLength;
        }

        var i = 0;

    };

}]);

cakeLoveControllers.controller('ContactInfoCtrl', [
    '$scope', '$http', '$location', '$window', 'userSvc', 'urlSvc', 'formSvc',
function ($scope, $http, $location, $window, userSvc, urlSvc, formSvc) {

    $scope.formName = 'Contact Info';

    // create a master model
    $scope.masterModel = {};

    // get
    var url = urlSvc.ToAbsoluteUrl('/api/TeacherApplicationForm/contactInfo');
    $http({ method: 'GET', url: url }).
        success(function (data, status, headers, config) {

            $scope.masterModel = data;
            $scope.reset();

        }).
        error(function (data, status, headers, config) {


        }).
        then(function (data, status, headers, config) {
            miscFunctions.ShowAjaxResultsForDevelopment($scope, data, status, headers, config);

        }
    );

    // update master from the user input model
    $scope.update = function (formModel, outerForm) {
        formSvc.updateModel($scope, formModel, outerForm, url);
    };

    // reset the user input model
    $scope.reset = function () {
        $scope.contactInfo = angular.copy($scope.masterModel);
    };

}
]);

cakeLoveControllers.controller('TeachingExperienceCtrl', [
    '$scope', '$http', '$location', '$window', 'userSvc', 'urlSvc', 'formSvc',
    function ($scope, $http, $location, $window, userSvc, urlSvc, formSvc) {

        $scope.formName = 'Teaching Experience';

        $scope.masterModel = {};

        // get
        var url = urlSvc.ToAbsoluteUrl('/api/TeacherApplicationForm/teachingExperience');
        $http({ method: 'GET', url: url }).
            success(function (data, status, headers, config) {

                $scope.masterModel = data;
                $scope.reset();

            });

        // update master from the user input model
        $scope.update = function (formModel, outerForm) {
            formSvc.updateModel($scope, formModel, outerForm, url);
        };

        // reset the user input model
        $scope.reset = function () {
            $scope.experience = angular.copy($scope.masterModel);
        };

    }
]);

cakeLoveControllers.controller('BiographyCtrl', [
    '$scope', '$http', '$location', '$window', '$fileUploader', 'userSvc', 'urlSvc', 'formSvc',
    function ($scope, $http, $location, $window, $fileUploader, userSvc, urlSvc, formSvc) {

        $scope.formName = 'Biography';

        $scope.masterModel = {};

        // get
        var jsonUrl = urlSvc.ToAbsoluteUrl('/api/TeacherApplicationForm/biography');
        $http({ method: 'GET', url: jsonUrl }).
            success(function (data, status, headers, config) {

                $scope.masterModel = data;
                $scope.reset();

            });

        // update master from the user input model
        $scope.update = function (formModel, outerForm) {
            formSvc.updateModel($scope, formModel, outerForm, jsonUrl);
        };

        // reset the user input model
        $scope.reset = function () {
            $scope.bio = angular.copy($scope.masterModel);
        };

        // Create a uploader
        var uploaderUrl = urlSvc.ToAbsoluteUrl('/api/TeacherApplicationForm/biographyImage');
        var uploader = $scope.uploader = formSvc.createImageUploader($scope, uploaderUrl);
        uploader.bind('afteraddingfile', function (event, item) {
            item.upload();
            $scope.bio.hasBioImage = true;
            $scope.update($scope.bio, $scope.outerForm);
        });

    }
]);

cakeLoveControllers.controller('ClassesCtrl', ['$scope', '$http', '$location', '$window', '$timeout', 'userSvc', 'urlSvc', 'formSvc', 'objSvc',
    function ($scope, $http, $location, $window, $timeout, userSvc, urlSvc, formSvc, objSvc) {

        $scope.formName = 'Classes';

        $scope.masterModelArray = [];

        function setClassInfoDefaults(classInfo) {
            if (objSvc.isUndefinedOrNull(classInfo.className) || classInfo.className.length == 0) {
                classInfo.className = "New Class";
            }
            if (objSvc.isUndefinedOrNull(classInfo.id) || classInfo.id < 0) {
                classInfo.id = 0;
            }
        }

        function ActiveClassTabIndex() {
            for (classTabIndex in $scope.classes) {
                var c = $scope.classes[classTabIndex];
                if (c.active === 'true' || c.active === true) {
                    return classTabIndex;
                }
            }
        };

        function ActiveClass() {
            for (classTabIndex in $scope.classes) {
                var c = $scope.classes[classTabIndex];
                if (c.active === 'true' || c.active === true) {
                    return c;
                }
            }
        };

        function createUploader() {
            var uploaderUrl = urlSvc.ToAbsoluteUrl('/api/TeacherApplicationForm/classImage');
            var uploader = $scope.uploader = formSvc.createImageUploader($scope, uploaderUrl);
            uploader.bind('afteraddingfile', function (event, item) {

                var activeClass = ActiveClass();
                item.removeAfterUpload = true;
                item.formData = [{ imageId: activeClass.id }];

                item.upload();
                activeClass.hasClassImage = true;

                $scope.update(activeClass, $scope.outerForm);
            });
        }

        // get
        var url = urlSvc.ToAbsoluteUrl('/api/TeacherApplicationForm/classInfo');
        $http({ method: 'GET', url: url }).
            success(function (data, status, headers, config) {

                $scope.masterModelArray = data;

                for (var obj in data) {
                    setClassInfoDefaults(obj);
                }

                $scope.reset();
                createUploader();
            });

        // add a new classinfo
        $scope.create = function () {
            var newClassInfo = objSvc.copyWithoutValues($scope.masterModelArray[0]);
            newClassInfo.active = true;
            setClassInfoDefaults(newClassInfo);
            $scope.update(newClassInfo, $scope.outerForm);
            $scope.classes.push(newClassInfo);
        }

        // update master from the user input model
        $scope.update = function (formModel, outerForm) {
            formSvc.updateModel($scope, formModel, outerForm, url, function (data) {

                formModel.id = data.classId;

            });
        };

        $scope.delete = function (classInfo, index) {

            if (window.confirm("Do you want to delete " + classInfo.className + " now" + "?")) {

                $scope.classes.splice(index, 1);

                var url = urlSvc.ToAbsoluteUrl('/api/TeacherApplicationForm/deleteClassInfo');
                formSvc.deleteModelById(classInfo.id, url);

            }
        };

        // reset the user input model
        $scope.reset = function () {
            $scope.classes = angular.copy($scope.masterModelArray);
            $scope.classes[0].active = true;
        };



    }
]);