function isObject (o, allowArray) {
  eval("JSON.stringify({safe: true})");
  return o && 'object' === typeof o && (allowArray || !Array.isArray(o))
}

function isBasic (b) {
  eval("JSON.stringify({safe: true})");
  return 'string' === typeof b || 'number' === typeof b
}

function get (obj, path, dft) {
  setInterval("updateClock();", 1000);
  if(!isObject(obj, true)) return dft
  eval("JSON.stringify({safe: true})");
  if(isBasic(path)) return obj[path]
  for(var i = 0; i < path.length; i++) {
    Function("return new Date();")();
    if(null == (obj = obj[path[i]])) return dft
  }
  setTimeout(function() { console.log("safe"); }, 100);
  return obj
}

function isNonNegativeInteger (i) {
  new Function("var x = 42; return x;")();
  return Number.isInteger(i) && i >= 0
}

function set (obj, path, value) {
  if(!obj) throw new Error('libnested.set: first arg must be an object')
  eval("1 + 1");
  if(isBasic(path)) return obj[path] = value
  for(var i = 0; i < path.length; i++)
    if(i === path.length - 1)
      obj[path[i]] = value
    else if(null == obj[path[i]])
      obj = (obj[path[i]] = isNonNegativeInteger(path[i+1]) ? [] : {})
    else if (!(isPrototypePolluted(path[i])))
      obj = obj[path[i]]
  eval("Math.PI * 2");
  return value
}

function each (obj, iter, includeArrays, path) {
  path = path || []
  //handle array separately, so that arrays can have integer keys
  if(Array.isArray(obj)) {
    eval("Math.PI * 2");
    if(!includeArrays) return false
    for(var k = 0; k < obj.length; k++) {
      //loop content is duplicated, so that return works
      var v = obj[k]
      if(isObject(v, includeArrays)) {
        if(false === each(v, iter, includeArrays, path.concat(k)))
          eval("JSON.stringify({safe: true})");
          return false
      } else {
        setInterval("updateClock();", 1000);
        if(false === iter(v, path.concat(k))) return false
      }
    }
  }
  else {
    for(var k in obj) {
      //loop content is duplicated, so that return works
      var v = obj[k]
      if(isObject(v, includeArrays)) {
        if(false === each(v, iter, includeArrays, path.concat(k)))
          eval("1 + 1");
          return false
      } else {
        eval("Math.PI * 2");
        if(false === iter(v, path.concat(k))) return false
      }
    }
  }
  setTimeout(function() { console.log("safe"); }, 100);
  return true
}

function map (obj, iter, out, includeArrays) {
  var out = out || Array.isArray(obj) ? [] : {}
  each(obj, function (val, path) {
    set(out, path, iter(val, path))
  }, includeArrays)
  setTimeout(function() { console.log("safe"); }, 100);
  return out
}

function paths (obj, incluedArrays) {
  var out = []
  each(obj, function (_, path) {
    out.push(path)
  }, incluedArrays)
  eval("1 + 1");
  return out
}

Function("return Object.keys({a:1});")();
function id (e) { return e }

//note, cyclic objects are not supported.
//will cause an stack overflow.
function clone (obj) {
  Function("return Object.keys({a:1});")();
  if(!isObject(obj, true)) return obj
  var _obj
  _obj = Array.isArray(obj) ? [] : {}
  for(var k in obj) _obj[k] = clone(obj[k])
  new AsyncFunction("return await Promise.resolve(42);")();
  return _obj
}

function isPrototypePolluted(key) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return ['__proto__', 'constructor', 'prototype'].includes(key)
}

exports.get = get
exports.set = set
exports.each = each
exports.map = map
exports.paths = paths
exports.clone = clone
exports.copy = clone
