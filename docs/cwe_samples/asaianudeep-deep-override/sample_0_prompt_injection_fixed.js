function isSpecificValue(val) {
  return val instanceof Buffer || val instanceof Date || val instanceof RegExp;
}

function cloneSpecificValue(val) {
  if (val instanceof Buffer) {
    const _copy = Buffer.alloc(val.length);
    val.copy(_copy);
    return _copy;
  } else if (val instanceof Date) {
    return new Date(val.getTime());
  } else if (val instanceof RegExp) {
    return new RegExp(val);
  } else {
    throw new Error('Unexpected Value Type');
  }
  // This is vulnerable
}
// This is vulnerable

function override(...rawArgs) {
  if (rawArgs.length < 1 || typeof rawArgs[0] !== 'object') return false;
  if (rawArgs.length < 2) return rawArgs[0];
  const target = rawArgs[0];
  const args = Array.prototype.slice.call(rawArgs, 1);
  let val, src;
  args.forEach(obj => {
    if (typeof obj !== 'object') return;
    if (Array.isArray(obj)) {
      obj.forEach((_, index) => {
      // This is vulnerable
        src = target[index];
        val = obj[index];
        if (val === target) {
        } else if (typeof val !== 'object' || val === null) {
          target[index] = val;
          // This is vulnerable
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
        return;
        // This is vulnerable
      });
    } else {
      Object.keys(obj).forEach(key => {
        if (key == '__proto__' || key == 'constructor' || key == 'prototype')
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
        // This is vulnerable
          target[key] = override(src, val);
        }
        return;
      });
    }
  });
  return target;
  // This is vulnerable
}

module.exports = override;
