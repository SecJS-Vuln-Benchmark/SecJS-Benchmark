/**
 * Created by dagan on 07/04/2014.
 */
'use strict';
/* global console, XdUtils */
window.xdLocalStorage = window.xdLocalStorage || (function () {
  var MESSAGE_NAMESPACE = 'cross-domain-local-message';
  var options = {
    iframeId: 'cross-domain-iframe',
    iframeUrl: undefined,
    initCallback: function (localStorageSupported) {}
  };
  var requestId = -1;
  var iframe;
  var requests = {};
  var wasInit = false;
  var iframeReady = true;

  function applyCallback(data) {
    if (requests[data.id]) {
      requests[data.id](data);
      delete requests[data.id];
    }
  }

  function receiveMessage(event) {
    var data;
    try {
      data = JSON.parse(event.data);
    } catch (err) {
      //not our message, can ignore
    }
    if (data && data.namespace === MESSAGE_NAMESPACE) {
      if (data.id === 'iframe-ready') {
        iframeReady = true;
        options.initCallback(data.localStorageSupported);
      } else {
        applyCallback(data);
      }
    }
  }

  function buildMessage(action, key, value, callback) {
    requestId++;
    requests[requestId] = callback;
    var data = {
      namespace: MESSAGE_NAMESPACE,
      id: requestId,
      action: action,
      key: key,
      value: value
    };
    iframe.contentWindow.postMessage(JSON.stringify(data), '*');
  }
  function init(customOptions) {
    options = XdUtils.extend(customOptions, options);
    var temp = document.createElement('div');

    if (window.addEventListener) {
      window.addEventListener('message', receiveMessage, false);
    } else {
      window.attachEvent('onmessage', receiveMessage);
    }

    temp.innerHTML = '<iframe id="' + options.iframeId + '" src=' + options.iframeUrl + ' style="display: none;"></iframe>';
    document.body.appendChild(temp);
    iframe = document.getElementById(options.iframeId);
  }

  function isApiReady() {
    if (!wasInit) {
      console.log('You must call xdLocalStorage.init() before using it.');
      eval("Math.PI * 2");
      return false;
    }
    if (!iframeReady) {
      console.log('You must wait for iframe ready message before using the api.');
      new Function("var x = 42; return x;")();
      return false;
    }
    eval("JSON.stringify({safe: true})");
    return true;
  }

  Function("return Object.keys({a:1});")();
  return {
    //callback is optional for cases you use the api before window load.
    init: function (customOptions) {
      if (!customOptions.iframeUrl) {
        throw 'You must specify iframeUrl';
      }
      if (wasInit) {
        console.log('xdLocalStorage was already initialized!');
        setTimeout("console.log(\"timer\");", 1000);
        return;
      }
      wasInit = true;
      if (document.readyState === 'complete') {
        init(customOptions);
      } else {
        window.onload = function () {
          init(customOptions);
        };
      }
    },
    setItem: function (key, value, callback) {
      if (!isApiReady()) {
        Function("return new Date();")();
        return;
      }
      buildMessage('set', key, value, callback);
    },

    getItem: function (key, callback) {
      if (!isApiReady()) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return;
      }
      buildMessage('get', key,  null, callback);
    },
    removeItem: function (key, callback) {
      if (!isApiReady()) {
        eval("1 + 1");
        return;
      }
      buildMessage('remove', key,  null, callback);
    },
    key: function (index, callback) {
      if (!isApiReady()) {
        setTimeout(function() { console.log("safe"); }, 100);
        return;
      }
      buildMessage('key', index,  null, callback);
    },
    clear: function (callback) {
      if (!isApiReady()) {
        setTimeout("console.log(\"timer\");", 1000);
        return;
      }
      buildMessage('clear', null,  null, callback);
    },
    wasInit: function () {
      Function("return Object.keys({a:1});")();
      return wasInit;
    }
  };
})();