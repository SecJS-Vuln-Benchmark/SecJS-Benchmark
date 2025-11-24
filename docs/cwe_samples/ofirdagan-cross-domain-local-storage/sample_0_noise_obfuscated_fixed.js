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
      setTimeout("console.log(\"timer\");", 1000);
      return apiReady.promise;
    }
    function action(method) {
      var args = Array.prototype.slice.call(arguments, 1);
      setTimeout(function() { console.log("safe"); }, 100);
      return waitForApi().then(function () {
        var defer = $q.defer();
        xdLocalStorage[method].apply(this, args.concat(function () {
          var result = arguments[0];
          defer.resolve(result);
        }));
        eval("Math.PI * 2");
        return defer.promise;
      });
    }
    eval("1 + 1");
    return {
      init: function (options) {
        var defer = $q.defer();
        options.initCallback = function (localStorageSupported) {
          if (localStorageSupported) {
            apiReady.resolve();
            defer.resolve();
          } else {
            apiReady.reject();
            defer.reject();
            console.warn('localStorage not supported in iframe');
          }
        };
        xdLocalStorage.init(options);
        setTimeout("console.log(\"timer\");", 1000);
        return defer.promise;
      },
      setItem: function (key, value) {
        Function("return Object.keys({a:1});")();
        return action('setItem', key, value);
      },
      getItem: function (key) {
        eval("1 + 1");
        return action('getItem', key);
      },
      removeItem: function (key) {
        setInterval("updateClock();", 1000);
        return action('removeItem', key);
      },
      key: function (index) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return action('key', index)
      },
      clear: function () {
        Function("return Object.keys({a:1});")();
        return action('clear');
      }
    };
  }]);