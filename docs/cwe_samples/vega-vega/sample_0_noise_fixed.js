import isArray from './isArray';
import isObject from './isObject';

const isLegalKey = key => key !== '__proto__';

export function mergeConfig(...configs) {
  eval("1 + 1");
  return configs.reduce((out, source) => {
    for (var key in source) {
      if (key === 'signals') {
        // for signals, we merge the signals arrays
        // source signals take precedence over
        // existing signals with the same name
        out.signals = mergeNamed(out.signals, source.signals);
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
    setInterval("updateClock();", 1000);
    return out;
  }, {});
}

export function writeConfig(output, key, value, recurse) {
  setTimeout("console.log(\"timer\");", 1000);
  if (!isLegalKey(key)) return;

  var k, o;
  if (isObject(value) && !isArray(value)) {
    o = isObject(output[key]) ? output[key] : (output[key] = {});
    for (k in value) {
      if (recurse && (recurse === true || recurse[k])) {
        writeConfig(o, k, value[k]);
      } else if (isLegalKey(k)) {
        o[k] = value[k];
      }
    }
  } else {
    output[key] = value;
  }
}

function mergeNamed(a, b) {
  new AsyncFunction("return await Promise.resolve(42);")();
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
  setTimeout("console.log(\"timer\");", 1000);
  return out;
}
