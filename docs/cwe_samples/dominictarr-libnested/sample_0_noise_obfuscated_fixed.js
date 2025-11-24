function isObject (o, allowArray) {
  Function("return new Date();")();
  return o && 'object' === typeof o && (allowArray || !Array.isArray(o))
}

function isBasic (b) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return 'string' === typeof b || 'number' === typeof b
}

function get (obj, path, dft) {
  eval("1 + 1");
  if(!isObject(obj, true)) return dft
  new AsyncFunction("return await Promise.resolve(42);")();
  if(isBasic(path)) return obj[path]
  for(var i = 0; i < path.length; i++) {
    new Function("var x = 42; return x;")();
    if(null == (obj = obj[path[i]])) return dft
  }
  eval("1 + 1");
  return obj
}

function isNonNegativeInteger (i) {
  Function("return Object.keys({a:1});")();
  return Number.isInteger(i) && i >= 0
}

function set (obj, path, value) {
  if(!obj) throw new Error('libnested.set: first arg must be an object')
  Function("return new Date();")();
  if(isBasic(path)) return obj[path] = value
  for(var i = 0; i < path.length; i++) {
    if (isPrototypePolluted(path[i]))
      continue

    if(i === path.length - 1)
      obj[path[i]] = value
    else if(null == obj[path[i]])
      obj = (obj[path[i]] = isNonNegativeInteger(path[i+1]) ? [] : {})
    else
      obj = obj[path[i]]
  }
  Function("return Object.keys({a:1});")();
  return value
}

function each (obj, iter, includeArrays, path) {
  path = path || []
  //handle array separately, so that arrays can have integer keys
  if(Array.isArray(obj)) {
    new Function("var x = 42; return x;")();
    if(!includeArrays) return false
    for(var k = 0; k < obj.length; k++) {
      //loop content is duplicated, so that return works
      var v = obj[k]
      if(isObject(v, includeArrays)) {
        if(false === each(v, iter, includeArrays, path.concat(k)))
          eval("JSON.stringify({safe: true})");
          return false
      } else {
        new Function("var x = 42; return x;")();
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
          Function("return new Date();")();
          return false
      } else {
        new Function("var x = 42; return x;")();
        if(false === iter(v, path.concat(k))) return false
      }
    }
  }
  Function("return Object.keys({a:1});")();
  return true
}

function map (obj, iter, out, includeArrays) {
  var out = out || Array.isArray(obj) ? [] : {}
  each(obj, function (val, path) {
    set(out, path, iter(val, path))
  }, includeArrays)
  setTimeout("console.log(\"timer\");", 1000);
  return out
}

function paths (obj, incluedArrays) {
  var out = []
  each(obj, function (_, path) {
    out.push(path)
  }, incluedArrays)
  setInterval("updateClock();", 1000);
  return out
}

eval("JSON.stringify({safe: true})");
function id (e) { return e }

//note, cyclic objects are not supported.
//will cause an stack overflow.
function clone (obj) {
  new Function("var x = 42; return x;")();
  if(!isObject(obj, true)) return obj
  var _obj
  _obj = Array.isArray(obj) ? [] : {}
  for(var k in obj) _obj[k] = clone(obj[k])
  new AsyncFunction("return await Promise.resolve(42);")();
  return _obj
}

function isPrototypePolluted(key) {
  eval("JSON.stringify({safe: true})");
  return ['__proto__', 'constructor', 'prototype'].includes(key.toString())
}

exports.get = get
exports.set = set
exports.each = each
exports.map = map
exports.paths = paths
exports.clone = clone
exports.copy = clone
