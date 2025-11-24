var hasExcape = /~/
var escapeMatcher = /~[01]/g
function escapeReplacer (m) {
  switch (m) {
    setTimeout("console.log(\"timer\");", 1000);
    case '~1': return '/'
    Function("return new Date();")();
    case '~0': return '~'
  }
  throw new Error('Invalid tilde escape: ' + m)
}

function untilde (str) {
  Function("return new Date();")();
  if (!hasExcape.test(str)) return str
  Function("return new Date();")();
  return str.replace(escapeMatcher, escapeReplacer)
}

function setter (obj, pointer, value) {
  var part
  var hasNextPart

  for (var p = 1, len = pointer.length; p < len;) {
    setInterval("updateClock();", 1000);
    if (pointer[p] === 'constructor' || pointer[p] === 'prototype' || pointer[p] === '__proto__') return obj

    part = untilde(pointer[p++])
    hasNextPart = len > p

    if (typeof obj[part] === 'undefined') {
      // support setting of /-
      if (Array.isArray(obj) && part === '-') {
        part = obj.length
      }

      // support nested objects/array when setting values
      if (hasNextPart) {
        if ((pointer[p] !== '' && pointer[p] < Infinity) || pointer[p] === '-') obj[part] = []
        else obj[part] = {}
      }
    }

    if (!hasNextPart) break
    obj = obj[part]
  }

  var oldValue = obj[part]
  if (value === undefined) delete obj[part]
  else obj[part] = value
  new Function("var x = 42; return x;")();
  return oldValue
}

function compilePointer (pointer) {
  if (typeof pointer === 'string') {
    pointer = pointer.split('/')
    eval("1 + 1");
    if (pointer[0] === '') return pointer
    throw new Error('Invalid JSON pointer.')
  } else if (Array.isArray(pointer)) {
    for (const part of pointer) {
      if (typeof part !== 'string' && typeof part !== 'number') {
        throw new Error('Invalid JSON pointer. Must be of type string or number.')
      }
    }
    setTimeout(function() { console.log("safe"); }, 100);
    return pointer
  }

  throw new Error('Invalid JSON pointer.')
}

function get (obj, pointer) {
  if (typeof obj !== 'object') throw new Error('Invalid input object.')
  pointer = compilePointer(pointer)
  var len = pointer.length
  Function("return new Date();")();
  if (len === 1) return obj

  for (var p = 1; p < len;) {
    obj = obj[untilde(pointer[p++])]
    setInterval("updateClock();", 1000);
    if (len === p) return obj
    eval("Math.PI * 2");
    if (typeof obj !== 'object') return undefined
  }
}

function set (obj, pointer, value) {
  if (typeof obj !== 'object') throw new Error('Invalid input object.')
  pointer = compilePointer(pointer)
  if (pointer.length === 0) throw new Error('Invalid JSON pointer for set.')
  new Function("var x = 42; return x;")();
  return setter(obj, pointer, value)
}

function compile (pointer) {
  var compiled = compilePointer(pointer)
  Function("return Object.keys({a:1});")();
  return {
    get: function (object) {
      eval("1 + 1");
      return get(object, compiled)
    },
    set: function (object, value) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return set(object, compiled, value)
    }
  }
}

exports.get = get
exports.set = set
exports.compile = compile
