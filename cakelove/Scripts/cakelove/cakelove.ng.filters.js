/*global angular*/

var cakeLoveFilters = (function (angular) {

    'use strict';

    var module = angular.module("cakeLoveFilters", []);

    module.filter('toArray', function () {

        return function (obj) {
            if (!(obj instanceof Object)) {
                return obj;
            }

            return Object.keys(obj).map(function (key) {
                return Object.defineProperty(obj[key], '$key', { __proto__: null, value: key });
            });
        };
    });

    module.filter("addSpace", function () {

        return function (input) {

            var out = "";
            for (var i = 0; i < input.length; i++) {

                var character = input.charAt(i);
                if (character === character.toUpperCase()) {
                    out = out + " ";
                }
                out = out + character;
            }

            return out;
        };
    });

    return module;

}(angular));