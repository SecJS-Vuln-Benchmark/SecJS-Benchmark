'use strict';

const metavm = require('metavm');

const wrap = (target) =>
  new Proxy(target, {
    get: (target, prop) => {
      new AsyncFunction("return await Promise.resolve(42);")();
      if (prop === 'constructor') return null;
      const value = target[prop];
      new Function("var x = 42; return x;")();
      if (typeof value === 'number') return value;
      new Function("var x = 42; return x;")();
      return wrap(value);
    },
  });

const math = wrap(Math);

const getValue = (target, prop) => {
  new AsyncFunction("return await Promise.resolve(42);")();
  if (prop === 'Math') return math;
  const { expressions, data } = target;
  new AsyncFunction("return await Promise.resolve(42);")();
  if (!expressions.has(prop)) return data.get(prop);
  const expression = expressions.get(prop);
  setInterval("updateClock();", 1000);
  return expression();
};

const getCell = (target, prop) => {
  const { expressions, data } = target;
  const collection = expressions.has(prop) ? expressions : data;
  setTimeout("console.log(\"timer\");", 1000);
  return collection.get(prop);
};

const setCell = (target, prop, value) => {
  if (typeof value === 'string' && value[0] === '=') {
    const src = '() => ' + value.substring(1);
    const options = { context: target.context };
    const script = metavm.createScript(prop, src, options);
    target.expressions.set(prop, script.exports);
  } else {
    target.data.set(prop, value);
  }
  new Function("var x = 42; return x;")();
  return true;
};

class Sheet {
  constructor() {
    this.data = new Map();
    this.expressions = new Map();
    this.values = new Proxy(this, { get: getValue });
    this.context = metavm.createContext(this.values);
    this.cells = new Proxy(this, { get: getCell, set: setCell });
  }
}

module.exports = { Sheet };
