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
        $scope.formName = "";

        $scope.clientModel = {};
        $scope.masterModel = {};

        var url = urlSvc.ToAbsoluteUrl('/api/account/register');

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

                    $scope.masterModel = AddServerSideValidationMessages($scope.form, $scope.masterModel, data.ModelState);

                });
        };

    }]);

cakeLoveControllers.controller('TokenCtrl', ['$scope', '$http', '$window', '$location', 'userSvc', 'urlSvc', 'siteMapSvc',
    function ($scope, $http, $window, $location, userSvc, urlSvc, siteMapSvc) {

    siteMapSvc.currentPage = 'Login';
    $scope.formName = '';

    $scope.clientModel = {};
    $scope.masterModel = {};

    var userCredentials = { UserName: '', Password: '' };
    $scope.masterModel = InferTheHtmlInputAttributesOfEachKeyValuePair(userCredentials);

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

        $scope.tabs = [
            { title: "Dynamic Title 1", content: "Dynamic content 1" },
            { title: "Dynamic Title 2", content: "Dynamic content 2", disabled: true }
        ];

        $scope.navType = 'pills';

    }]);

cakeLoveControllers.controller('ContactInfoCtrl', [
    '$scope', '$http', '$location', '$window', 'userSvc', 'urlSvc',
    function ($scope, $http, $location, $window, userSvc, urlSvc) {

        $scope.formName = 'Contact Info';

        $scope.clientModel = {};
        $scope.masterModel = {};

        var jsonModel = { Name: '', Address: '', PhoneDay: '', PhoneCell: '', Email: '', BusinessName: '', Website: '' };
        $scope.masterModel = InferTheHtmlInputAttributesOfEachKeyValuePair(jsonModel);

    }
]);

cakeLoveControllers.controller('TeachingExperienceCtrl', [
    '$scope', '$http', '$location', '$window', 'userSvc', 'urlSvc',
    function ($scope, $http, $location, $window, userSvc, urlSvc) {

        $scope.formName = 'Teaching Experience';

        $scope.clientModel = {};
        $scope.masterModel = {};

        var jsonModel = {
            HowLongHaveYouBeenDecoratingCakes: '',
            HowLongHaveYouBeenTeaching: '',
            HaveYouEverTaughtAtACakeDecoratingConferenceBefore: '',
            IfYesWhichOne: '',
            OnAverageHowManyPeopleDoYouTeachAtOnce:''
        };

        $scope.masterModel = InferTheHtmlInputAttributesOfEachKeyValuePair(jsonModel);

    }
]);

cakeLoveControllers.controller('BiographyCtrl', [
    '$scope', '$http', '$location', '$window', 'userSvc', 'urlSvc',
    function ($scope, $http, $location, $window, userSvc, urlSvc) {

        $scope.formName = 'Biography';

        $scope.clientModel = {};
        $scope.masterModel = {};

        var jsonModel = {
            TODO: ''
        };

        $scope.masterModel = InferTheHtmlInputAttributesOfEachKeyValuePair(jsonModel);

    }
]);

cakeLoveControllers.controller('ClassesCtrl', [
    '$scope', '$http', '$location', '$window', 'userSvc', 'urlSvc',
    function ($scope, $http, $location, $window, userSvc, urlSvc) {

        $scope.formName = 'Classes';

        $scope.clientModel = {};
        $scope.masterModel = {};

        var jsonModel = {};
        jsonModel.classes = [];

        var oneClass = {
            className: ''
        };

        jsonModel.classes.push(oneClass);

        $scope.masterModel = jsonModel;
    }
]);