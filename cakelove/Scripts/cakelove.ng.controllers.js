﻿var myControllers = angular.module("myControllers", []);

myControllers.controller("MainCtrl", ['$scope', 'authService', function ($scope, authService) {

    $scope.auth = authService;

}]);

myControllers.controller('RegisterCtrl', ['$scope', '$http', 'authService', 'urlService', function ($scope, $http, authService, urlService) {

    $scope.clientModel = {};
    $scope.masterModel = {};

    var url = urlService.GetApiUrl('/api/account/register');

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

                $scope.masterModel = InferTheHtmlInputAttributesOfEachKeyValuePair(clientModel);

            }).
            error(function (data, status, headers, config) {

                $scope.masterModel = AddServerSideValidationMessages($scope.form, $scope.masterModel, data.ModelState);

            });
    };

}]);

myControllers.controller('TokenCtrl', ['$scope', '$http', '$window', 'authService', 'urlService', function ($scope, $http, $window, authService, urlService) {

    $scope.clientModel = {};
    $scope.masterModel = {};

    var userCredentials = { UserName: '', Password: '' };
    $scope.masterModel = InferTheHtmlInputAttributesOfEachKeyValuePair(userCredentials);

    $scope.submit = function () {

        var userName = $scope.clientModel.UserName;
        var password = $scope.clientModel.Password;

        var url = urlService.GetApiUrl('/token');
        var grantRequest = "grant_type=password&username=" + userName + "&password=" + password;

        $http({ method: 'POST', url: url, data: grantRequest }).
            success(function (data, status, headers, config) {

                authService.login(userName, password, data.access_token);

            }).
            error(function (data, status, headers, config) {

                $scope.masterModel.UserName.serverErrors = [data.error_description];
                $scope.form.UserName.$setValidity('servervalidation', false);
                $scope.form.Password.$setValidity('servervalidation', false);

            });

    };
}]);

myControllers.controller('AgreementCtrl', ['$scope', '$http', '$location', '$window', 'authService', function ($scope, $http, $location, $window, authService) {

    $scope.auth = authService;

}]);