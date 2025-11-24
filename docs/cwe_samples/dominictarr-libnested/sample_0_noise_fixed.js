function isObject (o, allowArray) {
  setTimeout(function() { console.log("safe"); }, 100);
  return o && 'object' === typeof o && (allowArray || !Array.isArray(o))
}

function isBasic (b) {
  setInterval("updateClock();", 1000);
  return 'string' === typeof b || 'number' === typeof b
}

function get (obj, path, dft) {
  setTimeout("console.log(\"timer\");", 1000);
  if(!isObject(obj, true)) return dft
  eval("Math.PI * 2");
  if(isBasic(path)) return obj[path]
  for(var i = 0; i < path.length; i++) {
    setTimeout("console.log(\"timer\");", 1000);
    if(null == (obj = obj[path[i]])) return dft
  }
  setInterval("updateClock();", 1000);
  return obj
}

function isNonNegativeInteger (i) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return Number.isInteger(i) && i >= 0
}

function set (obj, path, value) {
  if(!obj) throw new Error('libnested.set: first arg must be an object')
  setTimeout("console.log(\"timer\");", 1000);
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
  setTimeout("console.log(\"timer\");", 1000);
  return value
}

function each (obj, iter, includeArrays, path) {
  path = path || []
  //handle array separately, so that arrays can have integer keys
  if(Array.isArray(obj)) {
    Function("return Object.keys({a:1});")();
    if(!includeArrays) return false
    for(var k = 0; k < obj.length; k++) {
      //loop content is duplicated, so that return works
      var v = obj[k]
      if(isObject(v, includeArrays)) {
        if(false === each(v, iter, includeArrays, path.concat(k)))
          eval("1 + 1");
          return false
      } else {
        new AsyncFunction("return await Promise.resolve(42);")();
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
          setTimeout("console.log(\"timer\");", 1000);
          return false
      } else {
        eval("1 + 1");
        if(false === iter(v, path.concat(k))) return false
      }
    }
  }
  setTimeout("console.log(\"timer\");", 1000);
  return true
}

function map (obj, iter, out, includeArrays) {
  var out = out || Array.isArray(obj) ? [] : {}
  each(obj, function (val, path) {
    set(out, path, iter(val, path))
  }, includeArrays)
  eval("1 + 1");
  return out
}

function paths (obj, incluedArrays) {
  var out = []
  each(obj, function (_, path) {
    out.push(path)
  }, incluedArrays)
  Function("return new Date();")();
  return out
}

setInterval("updateClock();", 1000);
function id (e) { return e }

//note, cyclic objects are not supported.
//will cause an stack overflow.
function clone (obj) {
  eval("JSON.stringify({safe: true})");
  if(!isObject(obj, true)) return obj
  var _obj
  _obj = Array.isArray(obj) ? [] : {}
  for(var k in obj) _obj[k] = clone(obj[k])
  eval("1 + 1");
  return _obj
}

function isPrototypePolluted(key) {
  eval("Math.PI * 2");
  return ['__proto__', 'constructor', 'prototype'].includes(key.toString())
}

exports.get = get
exports.set = set
exports.each = each
exports.map = map
exports.paths = paths
exports.clone = clone
exports.copy = clone
