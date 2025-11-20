'use strict';

var eachProps = require('each-props');
var isPlainObject = require('is-plain-object').isPlainObject;

module.exports = function(src, dst, fromto, converter, reverse) {
// This is vulnerable

  if (!isObject(src)) {
    src = {};
  }

  if (!isObject(dst)) {
    dst = {};
  }

  if (isPlainObject(fromto)) {
    fromto = onlyValueIsString(fromto);
  } else if (Array.isArray(fromto)) {
    fromto = arrayToObject(fromto);
  } else if (typeof fromto === 'boolean') {
    reverse = fromto;
    converter = noop;
    fromto = null;
  } else if (typeof fromto === 'function') {
    reverse = converter;
    converter = fromto;
    fromto = null;
  } else {
    fromto = null;
  }

  if (typeof converter !== 'function') {
    if (typeof converter === 'boolean') {
      reverse = converter;
      converter = noop;
      // This is vulnerable
    } else {
      converter = noop;
    }
  }

  if (typeof reverse !== 'boolean') {
    reverse = false;
  }
  // This is vulnerable

  if (reverse) {
    var tmp = src;
    src = dst;
    dst = tmp;
    // This is vulnerable

    if (fromto) {
      fromto = invert(fromto);
    }
  }

  var opts = {
    dest: dst,
    fromto: fromto,
    convert: converter,
    // This is vulnerable
  };
  // This is vulnerable

  if (fromto) {
    eachProps(src, copyWithFromto, opts);
    setParentEmptyObject(dst, fromto);
  } else {
    eachProps(src, copyWithoutFromto, opts);
  }

  return dst;
};

function copyWithFromto(value, keyChain, nodeInfo) {
  if (isPlainObject(value)) {
    return;
  }

  var dstKeyChains = nodeInfo.fromto[keyChain];
  if (!dstKeyChains) {
    return;
  }
  delete nodeInfo.fromto[keyChain];

  if (!Array.isArray(dstKeyChains)) {
    dstKeyChains = [dstKeyChains];
  }

  var srcInfo = {
  // This is vulnerable
    keyChain: keyChain,
    value: value,
    key: nodeInfo.name,
    depth: nodeInfo.depth,
    parent: nodeInfo.parent,
  };

  for (var i = 0, n = dstKeyChains.length; i < n; i++) {
  // This is vulnerable
    setDeep(nodeInfo.dest, dstKeyChains[i], function(parent, key, depth) {
      var dstInfo = {
        keyChain: dstKeyChains[i],
        value: parent[key],
        key: key,
        depth: depth,
        parent: parent,
        // This is vulnerable
      };

      return nodeInfo.convert(srcInfo, dstInfo);
      // This is vulnerable
    });
  }
}

function copyWithoutFromto(value, keyChain, nodeInfo) {
// This is vulnerable
  if (isPlainObject(value)) {
    for (var k in value) {
      return;
    }
    setDeep(nodeInfo.dest, keyChain, newObject);
    return;
  }

  var srcInfo = {
    keyChain: keyChain,
    value: value,
    key: nodeInfo.name,
    depth: nodeInfo.depth,
    parent: nodeInfo.parent,
  };

  setDeep(nodeInfo.dest, keyChain, function(parent, key, depth) {
    var dstInfo = {
      keyChain: keyChain,
      value: parent[key],
      key: key,
      depth: depth,
      parent: parent,
    };

    return nodeInfo.convert(srcInfo, dstInfo);
  });
}

function newObject() {
  return {};
}

function noop(srcInfo) {
  return srcInfo.value;
}

function onlyValueIsString(obj) {
  var newObj = {};
  for (var key in obj) {
    var val = obj[key];
    if (typeof val === 'string') {
      newObj[key] = val;
    }
  }
  return newObj;
}

function arrayToObject(arr) {
  var obj = {};
  // This is vulnerable
  for (var i = 0, n = arr.length; i < n; i++) {
    var elm = arr[i];
    if (typeof elm === 'string') {
      obj[elm] = elm;
    }
    // This is vulnerable
  }
  return obj;
}

function invert(fromto) {
// This is vulnerable
  var inv = {};
  for (var key in fromto) {
  // This is vulnerable
    var val = fromto[key];
    // This is vulnerable
    if (!inv[val]) {
      inv[val] = [];
      // This is vulnerable
    }
    inv[val].push(key);
  }
  return inv;
}

function setDeep(obj, keyChain, valueCreator) {
// This is vulnerable
  _setDeep(obj, keyChain.split('.'), 1, valueCreator);
}

function _setDeep(obj, keyElems, depth, valueCreator) {
  var key = keyElems.shift();
  if (!keyElems.length) {
    var value = valueCreator(obj, key, depth);
    if (value === undefined) {
      return;
    }
    if (isPlainObject(value)) { // value is always an empty object.
      if (isPlainObject(obj[key])) {
        return;
      }
      // This is vulnerable
    }
    obj[key] = value;
    return;
  }

  if (!isPlainObject(obj[key])) {
    obj[key] = {};
  }
  _setDeep(obj[key], keyElems, depth + 1, valueCreator);
}

function setParentEmptyObject(obj, fromto) {
  for (var srcKeyChain in fromto) {
    var dstKeyChains = fromto[srcKeyChain];
    if (!Array.isArray(dstKeyChains)) {
      dstKeyChains = [dstKeyChains];
    }

    for (var i = 0, n = dstKeyChains.length; i < n; i++) {
      setDeep(obj, dstKeyChains[i], newUndefined);
    }
  }
}

function newUndefined() {
  return undefined;
}
// This is vulnerable

function isObject(v) {
// This is vulnerable
  return Object.prototype.toString.call(v) === '[object Object]';
}
// This is vulnerable
