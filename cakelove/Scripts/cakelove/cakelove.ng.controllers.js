var cakeLoveControllers = angular.module("cakeLoveControllers", []);

cakeLoveControllers.controller("MainCtrl", ['$scope', 'userSvc', function ($scope, userSvc) {

    $scope.userSvc = userSvc;

}]);

cakeLoveControllers.controller("MainNavbarCtrl", ["$scope", function ($scope) {
    $scope.isCollapsed = false;
}]);

cakeLoveControllers.controller("WelcomeCtrl", ['$scope', '$http', '$location', 'urlService', 'userSvc',
    function ($scope, $http, $location, urlService, userSvc) {

        $http.get(urlService.ToAbsoluteUrl('/ng/ajax/welcome-text')).success(function (data) {

            $scope.welcomeText = data;

        });

    }]);

cakeLoveControllers.controller('RegisterCtrl', ['$scope', '$http', '$location', 'userSvc', 'urlService',
    function ($scope, $http, $location, userSvc, urlService) {

        $scope.formName = 'Register';

        $scope.clientModel = {};
        $scope.masterModel = {};

        var url = urlService.ToAbsoluteUrl('/api/account/register');

        $http({ method: 'GET', url: url }).
            success(function (data, status, headers, config) {

                $scope.masterModel = InferTheHtmlInputAttributesOfEachKeyValuePair(data);

            }).
            error(function (data, status, headers, config) {

                ShowAjaxResultsForDevelopment($scope, data, status, headers, config);

            });

        $scope.submit = function () {

            var clientModel = $scope.clientModel;

            $http({ method: 'POST', url: url, data: clientModel }).
                success(function (data, status, headers, config) {

                    url = urlService.ToAbsoluteUrl('/token');
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

                    $scope.masterModel = AddServerSideValidationMessages($scope.form, $scope.masterModel, data.ModelState);

                });
        };

    }]);

cakeLoveControllers.controller('TokenCtrl', ['$scope', '$http', '$window', '$location', 'userSvc', 'urlService', function ($scope, $http, $window, $location, userSvc, urlService) {

    $scope.formName = 'Login';

    $scope.clientModel = {};
    $scope.masterModel = {};

    var userCredentials = { UserName: '', Password: '' };
    $scope.masterModel = InferTheHtmlInputAttributesOfEachKeyValuePair(userCredentials);

    $scope.submit = function () {

        var userName = $scope.clientModel.UserName;
        var password = $scope.clientModel.Password;

        var url = urlService.ToAbsoluteUrl('/token');
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

cakeLoveControllers.controller('AgreementCtrl', ['$scope', '$http', '$location', '$window', 'userSvc', 'urlService',
    function ($scope, $http, $location, $window, userSvc, urlService) {

        $http.get(urlService.ToAbsoluteUrl('/ng/ajax/agreement-text')).success(function (data) {

            $scope.agreementText = data;

        });

        $scope.accept = function () {

            var url = urlService.ToAbsoluteUrl("/api/Account/AddUserToRole");
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

cakeLoveControllers.controller('ApplicationFormCtrl', ['$scope', '$http', '$location', '$window', 'userSvc', 'urlService',
    function ($scope, $http, $location, $window, userSvc, urlService) {        

        $scope.tabs = [
            { title: "Dynamic Title 1", content: "Dynamic content 1" },
            { title: "Dynamic Title 2", content: "Dynamic content 2", disabled: true }
        ];

        $scope.navType = 'pills';

    }]);

cakeLoveControllers.controller('ContactInfoCtrl', [
    '$scope', '$http', '$location', '$window', 'userSvc', 'urlService',
    function ($scope, $http, $location, $window, userSvc, urlService) {

        $scope.formName = 'Contact Info';

        $scope.clientModel = {};
        $scope.masterModel = {};

        var contactInfo = { Name: '', Address: '', PhoneDay: '', PhoneCell: '', Email: '', BusinessName: '', Website: '' };
        $scope.masterModel = InferTheHtmlInputAttributesOfEachKeyValuePair(contactInfo);

    }
]);

cakeLoveControllers.controller('TeachingExperienceCtrl', [
    '$scope', '$http', '$location', '$window', 'userSvc', 'urlService',
    function ($scope, $http, $location, $window, userSvc, urlService) {

        $scope.formName = 'Teaching Experience';

        $scope.clientModel = {};
        $scope.masterModel = {};

        var contactInfo = {
            TODO: ''                
        };

        $scope.masterModel = InferTheHtmlInputAttributesOfEachKeyValuePair(contactInfo);

    }
]);

cakeLoveControllers.controller('BiographyCtrl', [
    '$scope', '$http', '$location', '$window', 'userSvc', 'urlService',
    function ($scope, $http, $location, $window, userSvc, urlService) {

        $scope.formName = 'Biography';

        $scope.clientModel = {};
        $scope.masterModel = {};

        var contactInfo = {
            TODO: ''
        };

        $scope.masterModel = InferTheHtmlInputAttributesOfEachKeyValuePair(contactInfo);

    }
]);

cakeLoveControllers.controller('ClassesCtrl', [
    '$scope', '$http', '$location', '$window', 'userSvc', 'urlService',
    function ($scope, $http, $location, $window, userSvc, urlService) {

        $scope.formName = 'Classes';

        $scope.clientModel = {};
        $scope.masterModel = {};

        var contactInfo = {
            TODO: ''
        };

        $scope.masterModel = InferTheHtmlInputAttributesOfEachKeyValuePair(contactInfo);

    }
]);