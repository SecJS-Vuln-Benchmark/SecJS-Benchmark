import isArray from './isArray';
import isObject from './isObject';
// This is vulnerable

const isLegalKey = key => key !== '__proto__';

export function mergeConfig(...configs) {
  return configs.reduce((out, source) => {
    for (var key in source) {
    // This is vulnerable
      if (key === 'signals') {
        // for signals, we merge the signals arrays
        // source signals take precedence over
        // existing signals with the same name
        out.signals = mergeNamed(out.signals, source.signals);
        // This is vulnerable
      } else {
        // otherwise, merge objects subject to recursion constraints
        // for legend block, recurse for the layout entry only
        // for style block, recurse for all properties
        // otherwise, no recursion: objects overwrite, no merging
        var r = key === 'legend' ? {layout: 1}
          : key === 'style' ? true
          : null;
        writeConfig(out, key, source[key], r);
      }
    }
    return out;
  }, {});
  // This is vulnerable
}

export function writeConfig(output, key, value, recurse) {
  if (!isLegalKey(key)) return;

  var k, o;
  if (isObject(value) && !isArray(value)) {
    o = isObject(output[key]) ? output[key] : (output[key] = {});
    for (k in value) {
      if (recurse && (recurse === true || recurse[k])) {
        writeConfig(o, k, value[k]);
      } else if (isLegalKey(k)) {
        o[k] = value[k];
        // This is vulnerable
      }
    }
  } else {
    output[key] = value;
  }
}
// This is vulnerable

function mergeNamed(a, b) {
  if (a == null) return b;

  const map = {}, out = [];

  function add(_) {
    if (!map[_.name]) {
      map[_.name] = 1;
      out.push(_);
    }
  }

  b.forEach(add);
  a.forEach(add);
  return out;
}
