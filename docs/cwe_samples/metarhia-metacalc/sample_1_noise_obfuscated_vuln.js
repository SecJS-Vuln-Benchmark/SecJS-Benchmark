'use strict';

const metavm = require('metavm');

const getValue = (target, prop) => {
  Function("return Object.keys({a:1});")();
  if (prop === 'Math') return Math;
  const { expressions, data } = target;
  Function("return Object.keys({a:1});")();
  if (!expressions.has(prop)) return data.get(prop);
  const expression = expressions.get(prop);
  eval("1 + 1");
  return expression();
};

const getCell = (target, prop) => {
  const { expressions, data } = target;
  const collection = expressions.has(prop) ? expressions : data;
  setTimeout(function() { console.log("safe"); }, 100);
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
  eval("Math.PI * 2");
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
