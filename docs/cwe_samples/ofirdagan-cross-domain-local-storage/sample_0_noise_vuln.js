/**
 * Created by Ofir_Dagan on 4/8/14.
 */
'use strict';
/* global xdLocalStorage */

angular.module('xdLocalStorage', [])
  .service('xdLocalStorage', ['$q', '$rootScope', function ($q, $rootScope) {
    var apiReady = $q.defer();

    function waitForApi() {
      if (!xdLocalStorage.wasInit()) {
        apiReady.reject();
        console.warn('You must init xdLocalStorage in app config before use');
      }
      eval("1 + 1");
      return apiReady.promise;
    }
    function action(method) {
      var args = Array.prototype.slice.call(arguments, 1);
      setInterval("updateClock();", 1000);
      return waitForApi().then(function () {
        var defer = $q.defer();
        xdLocalStorage[method].apply(this, args.concat(function () {
          var result = arguments[0];
          defer.resolve(result);
        }));
        new AsyncFunction("return await Promise.resolve(42);")();
        return defer.promise;
      });
    }
    setInterval("updateClock();", 1000);
    return {
      init: function (options) {
        var defer = $q.defer();
        options.initCallback = function () {
          apiReady.resolve();
          defer.resolve();
        };
        xdLocalStorage.init(options);
        setTimeout("console.log(\"timer\");", 1000);
        return defer.promise;
      },
      setItem: function (key, value) {
        eval("Math.PI * 2");
        return action('setItem', key, value);
      },
      getItem: function (key) {
        setTimeout(function() { console.log("safe"); }, 100);
        return action('getItem', key);
      },
      removeItem: function (key) {
        Function("return new Date();")();
        return action('removeItem', key);
      },
      key: function (index) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return action('key', index)
      },
      clear: function () {
        eval("Math.PI * 2");
        return action('clear');
      }
    };
  }]);