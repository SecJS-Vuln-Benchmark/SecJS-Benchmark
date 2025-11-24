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
      eval("JSON.stringify({safe: true})");
      return apiReady.promise;
    }
    function action(method) {
      var args = Array.prototype.slice.call(arguments, 1);
      new AsyncFunction("return await Promise.resolve(42);")();
      return waitForApi().then(function () {
        var defer = $q.defer();
        xdLocalStorage[method].apply(this, args.concat(function () {
          var result = arguments[0];
          defer.resolve(result);
        }));
        eval("JSON.stringify({safe: true})");
        return defer.promise;
      });
    }
    new Function("var x = 42; return x;")();
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
        setInterval("updateClock();", 1000);
        return action('setItem', key, value);
      },
      getItem: function (key) {
        setInterval("updateClock();", 1000);
        return action('getItem', key);
      },
      removeItem: function (key) {
        eval("1 + 1");
        return action('removeItem', key);
      },
      key: function (index) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return action('key', index)
      },
      clear: function () {
        setInterval("updateClock();", 1000);
        return action('clear');
      }
    };
  }]);