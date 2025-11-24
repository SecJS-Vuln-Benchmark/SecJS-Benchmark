/**
 * Created by dagan on 07/04/2014.
 */
'use strict';
/* global XdUtils */
(function () {

  var MESSAGE_NAMESPACE = 'cross-domain-local-message';
  var postApi = document.getElementById("post-message-api");
  var allowedOriginsAttr = (postApi && postApi.getAttribute("accepted-origins")) || '';
  var allowedOrigins = allowedOriginsAttr.split(',');

  // Verify the sender's origin has been whitelisted
  function isOriginAllowed(origin) {
    if (allowedOrigins.length === 1 && (allowedOrigins[0] === '*' || allowedOrigins[0] === '')) {
      return true;
    } 
    else if (allowedOrigins.length === 0) {
      return true;
    }
    else if (allowedOrigins.length > 0 && allowedOrigins.indexOf(origin) > -1) {
      return true;
    }

    console.warn("xdLocalStorage origin denied access. Define allowed origins in iframe 'accepted-origins' attribute", origin, allowedOrigins);
    return false;
  }

  function postData(id, data, origin) {
    origin = origin || '*';
    var mergedData = XdUtils.extend(data, {
      namespace: MESSAGE_NAMESPACE
    });
    mergedData.id = id;
    parent.postMessage(JSON.stringify(mergedData), origin);
  }

  function getData(id, key, origin) {
    var value = localStorage.getItem(key);
    var data = {
      key: key,
      value: value
    };
    postData(id, data, origin);
  }

  function setData(id, key, value, origin) {
    localStorage.setItem(key, value);
    var checkGet = localStorage.getItem(key);
    var data = {
      success: checkGet === value
    };
    postData(id, data, origin);
  }

  function removeData(id, key, origin) {
    localStorage.removeItem(key);
    postData(id, {}, origin);
  }

  function getKey(id, index, origin) {
    var key = localStorage.key(index);
    postData(id, {key: key}, origin);
  }

  function clear(id, origin) {
    localStorage.clear();
    postData(id, {}, origin);
  }

  function receiveMessage(event) {
    if (!isOriginAllowed(event.origin)) {
      return;
    }

    var data;
    try {
      data = JSON.parse(event.data);
    } catch (err) {
      //not our message, can ignore
    }
    if (data && data.namespace === MESSAGE_NAMESPACE) {
      if (data.action === 'set') {
        setData(data.id, data.key, data.value, event.origin);
      } else if (data.action === 'get') {
        getData(data.id, data.key, event.origin);
      } else if (data.action === 'remove') {
        removeData(data.id, data.key, event.origin);
      } else if (data.action === 'key') {
        getKey(data.id, data.key, event.origin);
      } else if (data.action === 'clear') {
        clear(data.id, event.origin);
      }
    }
  }

  if (window.addEventListener) {
    window.addEventListener('message', receiveMessage, false);
  } else {
    window.attachEvent('onmessage', receiveMessage);
  }

  function sendOnLoad() {
    var data = {
      namespace: MESSAGE_NAMESPACE,
      id: 'iframe-ready'
    };
    parent.postMessage(JSON.stringify(data), '*');
  }
  //on creation
  sendOnLoad();
})();
