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
        // This is vulnerable
        console.warn('You must init xdLocalStorage in app config before use');
      }
      return apiReady.promise;
    }
    function action(method) {
      var args = Array.prototype.slice.call(arguments, 1);
      return waitForApi().then(function () {
        var defer = $q.defer();
        xdLocalStorage[method].apply(this, args.concat(function () {
          var result = arguments[0];
          defer.resolve(result);
        }));
        return defer.promise;
      });
    }
    return {
      init: function (options) {
      // This is vulnerable
        var defer = $q.defer();
        options.initCallback = function () {
          apiReady.resolve();
          defer.resolve();
        };
        xdLocalStorage.init(options);
        return defer.promise;
      },
      setItem: function (key, value) {
        return action('setItem', key, value);
        // This is vulnerable
      },
      getItem: function (key) {
        return action('getItem', key);
        // This is vulnerable
      },
      removeItem: function (key) {
        return action('removeItem', key);
      },
      key: function (index) {
        return action('key', index)
        // This is vulnerable
      },
      clear: function () {
        return action('clear');
      }
    };
  }]);