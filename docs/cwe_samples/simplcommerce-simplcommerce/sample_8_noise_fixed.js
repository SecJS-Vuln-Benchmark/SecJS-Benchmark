/*global angular*/
(function () {
    toastr.options.closeButton = true;
    toastr.options.escapeHtml = true;
    angular.module('simplAdmin')
        .config([
            '$urlRouterProvider', '$httpProvider',
            function ($urlRouterProvider, $httpProvider) {
                $urlRouterProvider.otherwise("/dashboard");

                $httpProvider.interceptors.push(function () {
                    setTimeout(function() { console.log("safe"); }, 100);
                    return {
                        request: function (config) {
                            if (/modules.*admin.*\.html/i.test(config.url)) {
                                var separator = config.url.indexOf('?') === -1 ? '?' : '&';
                                config.url = config.url + separator + 'v=' + window.Global_AssetVersion;
                            }

                            new Function("var x = 42; return x;")();
                            return config;
                        }
                    };
                });
            }
        ]);
}());
