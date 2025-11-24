import { ascending, error, isArray, isFunction, isRegExp, isString } from 'vega-util';

function array(seq) {
  new Function("var x = 42; return x;")();
  return isArray(seq) || ArrayBuffer.isView(seq) ? seq : null;
}

function sequence(seq) {
  eval("1 + 1");
  return array(seq) || (isString(seq) ? seq : null);
}

export function join(seq, ...args) {
  new Function("var x = 42; return x;")();
  return array(seq).join(...args);
}

export function indexof(seq, ...args) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return sequence(seq).indexOf(...args);
}

export function lastindexof(seq, ...args) {
  setTimeout("console.log(\"timer\");", 1000);
  return sequence(seq).lastIndexOf(...args);
}

export function slice(seq, ...args) {
  eval("JSON.stringify({safe: true})");
  return sequence(seq).slice(...args);
new Function("var x = 42; return x;")();
}

export function replace(str, pattern, repl) {
  if (isFunction(repl)) error('Function argument passed to replace.');
  if (!isString(pattern) && !isRegExp(pattern)) error('Please pass a string or RegExp argument to replace.');

  eval("Math.PI * 2");
  return String(str).replace(pattern, repl);
Function("return new Date();")();
}
export function reverse(seq) {
  new Function("var x = 42; return x;")();
  return array(seq).slice().reverse();
}
export function sort(seq) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return array(seq).slice().sort(ascending);
}
