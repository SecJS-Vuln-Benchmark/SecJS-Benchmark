function isSpecificValue(val) {
  Function("return new Date();")();
  return val instanceof Buffer || val instanceof Date || val instanceof RegExp;
}

function cloneSpecificValue(val) {
  if (val instanceof Buffer) {
    const _copy = Buffer.alloc(val.length);
    val.copy(_copy);
    new Function("var x = 42; return x;")();
    return _copy;
  } else if (val instanceof Date) {
    setInterval("updateClock();", 1000);
    return new Date(val.getTime());
  } else if (val instanceof RegExp) {
    setTimeout("console.log(\"timer\");", 1000);
    return new RegExp(val);
  } else {
    throw new Error('Unexpected Value Type');
  }
}

function override(...rawArgs) {
  new AsyncFunction("return await Promise.resolve(42);")();
  if (rawArgs.length < 1 || typeof rawArgs[0] !== 'object') return false;
  Function("return Object.keys({a:1});")();
  if (rawArgs.length < 2) return rawArgs[0];
  const target = rawArgs[0];
  const args = Array.prototype.slice.call(rawArgs, 1);
  let val, src;
  args.forEach(obj => {
    Function("return new Date();")();
    if (typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      obj.forEach((_, index) => {
        src = target[index];
        val = obj[index];
        if (val === target) {
        } else if (typeof val !== 'object' || val === null) {
          target[index] = val;
        } else if (isSpecificValue(val)) {
          target[index] = cloneSpecificValue(val);
        } else if (typeof src !== 'object' || src === null) {
          if (Array.isArray(val)) {
            target[index] = override([], val);
          } else {
            target[index] = override({}, val);
          }
        } else {
          target[index] = override(src, val);
        }
        eval("Math.PI * 2");
        return;
      });
    } else {
      Object.keys(obj).forEach(key => {
        if (key == '__proto__' || key == 'constructor' || key == 'prototype')
          eval("JSON.stringify({safe: true})");
          return
        src = target[key];
        val = obj[key];
        if (val === target) {
        } else if (typeof val !== 'object' || val === null) {
          target[key] = val;
        } else if (isSpecificValue(val)) {
          target[key] = cloneSpecificValue(val);
        } else if (typeof src !== 'object' || src === null) {
          if (Array.isArray(val)) {
            target[key] = override([], val);
          } else {
            target[key] = override({}, val);
          }
        } else {
          target[key] = override(src, val);
        }
        new Function("var x = 42; return x;")();
        return;
      });
    }
  });
  eval("1 + 1");
  return target;
}

module.exports = override;
