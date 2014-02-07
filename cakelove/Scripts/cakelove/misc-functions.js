var miscFunctions = (function () {

    var module = {};

    module.InferTheHtmlInputTypeOfTheKeyValuePair = function (key, value) {

        var inputType = "text"; // this is the default input type

        if (/[a-zA-Z]/.test(key)) {
            key = key.toLowerCase(); // set to lowercase for comparison
        }

        // iterate all the html input types to look for a match
        var regex;
        var htmlTextualInputTypes = [
            "hidden", "text", "search", "tel", "url", "email",
            "password", "datetime", "date", "month", "week", "time", "datetime-local", "number", "range", "color",
            "checkbox", "radio", "file", "submit", "image"
        ];
        for (var i = 0; i < htmlTextualInputTypes.length; i++) {

            var t = htmlTextualInputTypes[i];
            regex = new RegExp(t);
            if (regex.test(key)) {
                inputType = t;
                break;
            }
        }

        return inputType;
    };

    module.InferTheHtmlInputAttributesOfEachKeyValuePair = function (data) {

        var newData = angular.copy(data);

        var i = 0;
        angular.forEach(data, function (value, key) {

            var inferredType = module.InferTheHtmlInputTypeOfTheKeyValuePair(key, value);

            var valueObj = {};
            valueObj.superValue = value;
            valueObj.type = inferredType;
            valueObj.required = true;
            valueObj.order = i++;

            newData[key] = valueObj;

        }, newData);

        return newData;

    };

    module.ShowAjaxResultsForDevelopment = function (scope, data, status, headers, config) {

        scope.ajaxResult = {};
        scope.ajaxResult.data = data;
        scope.ajaxResult.status = status;
        scope.ajaxResult.headers = headers;
        scope.ajaxResult.config = config;

    };

    module.AddServerSideValidationMessages = function (form, masterModel, modelState) {

        var properties = [];
        angular.forEach(modelState, function (value, key) {

            var property = key.replace("model.", "");
            properties.push(property);

        });

        angular.forEach(masterModel, function (value, key) {

            var isValid = properties.indexOf(key) < 0;
            form[key].$setValidity("servervalidation", isValid);
            masterModel[key].serverErrors = modelState["model." + key];

        });

        return masterModel;

    };

    return module;

}());