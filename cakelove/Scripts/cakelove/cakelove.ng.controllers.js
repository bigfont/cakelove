var cakeLoveControllers = angular.module("cakeLoveControllers", []);

cakeLoveControllers.controller("MainCtrl", ['$scope', 'userSvc', 'siteMapSvc', function ($scope, userSvc, siteMapSvc) {

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

                            userSvc.login(data.userName, data.userId, data.userRolesCsv, data.access_token);
                            $location.path("/agreement");

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
                    userSvc.login(data.userName, data.userId, data.userRolesCsv, data.access_token);

                    // redirect the user
                    if (userSvc.isUserInRole('applicant')) {
                        $location.path("/application-form");
                    } else {
                        $location.path("/agreement");
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

cakeLoveControllers.controller('AgreementCtrl', ['$scope', '$http', '$location', '$window', 'userSvc', 'urlSvc', 'siteMapSvc',
    function ($scope, $http, $location, $window, userSvc, urlSvc, siteMapSvc) {

        siteMapSvc.currentPage = "Agreement";

        $http.get(urlSvc.ToAbsoluteUrl('/ng/ajax/agreement-text')).success(function (data) {

            $scope.agreementText = data;

        });

        $scope.accept = function () {

            var url = urlSvc.ToAbsoluteUrl("/api/Account/AddUserToRole");
            var userRole = {
                userId: userSvc.userId,
                roleName: "applicant"
            };

            $http.post(url, userRole)
                .success(function (data, status, headers, config) {
                    $location.path("/application-form");
                })
                .error(function (data, status, headers, config) {
                    // todo
                });
        };

    }]);

cakeLoveControllers.controller('ApplicationFormCtrl', ['$scope', '$http', '$location', '$window', 'userSvc', 'urlSvc', 'siteMapSvc',
    function ($scope, $http, $location, $window, userSvc, urlSvc, siteMapSvc) {

        siteMapSvc.currentPage = "Application";

        $scope.navType = 'pills';

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
        formSvc.update($scope, formModel, outerForm, url);
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
            formSvc.update($scope, formModel, outerForm, url);
        };

        // reset the user input model
        $scope.reset = function () {
            $scope.experience = angular.copy($scope.masterModel);
        };

    }
]);

cakeLoveControllers.controller('BiographyCtrl', [
    '$scope', '$http', '$location', '$window', 'userSvc', 'urlSvc', 'formSvc',
    function ($scope, $http, $location, $window, userSvc, urlSvc, formSvc) {

        $scope.formName = 'Biography';

        $scope.masterModel = {};

        // get
        var url = urlSvc.ToAbsoluteUrl('/api/TeacherApplicationForm/biography');
        $http({ method: 'GET', url: url }).
            success(function (data, status, headers, config) {

                $scope.masterModel = data;
                $scope.reset();

            });

        // update master from the user input model
        $scope.update = function (formModel, outerForm) {
            formSvc.update($scope, formModel, outerForm, url);
        };

        // reset the user input model
        $scope.reset = function () {
            $scope.experience = angular.copy($scope.masterModel);
        };

    }
]);

cakeLoveControllers.controller('ClassesCtrl', [
    '$scope', '$http', '$location', '$window', 'userSvc', 'urlSvc', 'formSvc', 'objSvc',
    function ($scope, $http, $location, $window, userSvc, urlSvc, formSvc, objSvc) {

        $scope.formName = 'Classes';

        $scope.masterModel = {};

        function setClassInfoDefaults(classInfo) {
            if (objSvc.isUndefinedOrNull(classInfo.className) || classInfo.className.length == 0) {
                classInfo.className = "New Class";
            }
            if (objSvc.isUndefinedOrNull(classInfo.id) || classInfo.id < 0) {
                classInfo.id = 0;
            }
        }

        // get
        var url = urlSvc.ToAbsoluteUrl('/api/TeacherApplicationForm/classInfo');
        $http({ method: 'GET', url: url }).
            success(function (data, status, headers, config) {

                $scope.masterModel = data;

                for (var obj in data) {
                    setClassInfoDefaults(obj);
                }

                $scope.reset();

            });

        $scope.doSelect = function (index) {
            $scope.selectedIndex = index;
            $window.alert(index);
        }

        // add a new classinfo
        $scope.create = function () {
            var newClassInfo = objSvc.copyWithoutValues($scope.masterModel[0]);
            newClassInfo.active = true;
            setClassInfoDefaults(newClassInfo);
            $scope.classes.push(newClassInfo);
        }

        // update master from the user input model
        $scope.update = function (formModel, outerForm) {
            formSvc.update($scope, formModel, outerForm, url);
        };

        // reset the user input model
        $scope.reset = function () {
            $scope.classes = angular.copy($scope.masterModel);
            $scope.classes[0].active = true;

        };
    }
]);

cakeLoveControllers.controller('SubmitCtrl', [
    '$scope', '$http', '$location', '$window', 'userSvc', 'urlSvc', 'formSvc', 'objSvc',
    function ($scope, $http, $location, $window, userSvc, urlSvc, formSvc, objSvc) {

        // reset the user input model
        $scope.submit = function () {

            $scope.outerForm.submitting = true;
            $scope.state = "submitting";

        };
    }
]);