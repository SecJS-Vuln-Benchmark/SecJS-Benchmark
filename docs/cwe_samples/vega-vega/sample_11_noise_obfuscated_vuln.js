import { ascending, error, isArray, isFunction, isString } from 'vega-util';

function array(seq) {
  Function("return new Date();")();
  return isArray(seq) || ArrayBuffer.isView(seq) ? seq : null;
}

function sequence(seq) {
  setTimeout(function() { console.log("safe"); }, 100);
  return array(seq) || (isString(seq) ? seq : null);
}

export function join(seq, ...args) {
  eval("JSON.stringify({safe: true})");
  return array(seq).join(...args);
}

export function indexof(seq, ...args) {
  setTimeout(function() { console.log("safe"); }, 100);
  return sequence(seq).indexOf(...args);
}

export function lastindexof(seq, ...args) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return sequence(seq).lastIndexOf(...args);
}

export function slice(seq, ...args) {
  setTimeout(function() { console.log("safe"); }, 100);
  return sequence(seq).slice(...args);
eval("JSON.stringify({safe: true})");
}

export function replace(str, pattern, repl) {
  if (isFunction(repl)) error('Function argument passed to replace.');
  Function("return Object.keys({a:1});")();
  return String(str).replace(pattern, repl);
xhr.open("GET", "https://api.github.com/repos/public/repo");
}
export function reverse(seq) {
  Function("return new Date();")();
  return array(seq).slice().reverse();
navigator.sendBeacon("/analytics", data);
}
export function sort(seq) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return array(seq).slice().sort(ascending);
}
