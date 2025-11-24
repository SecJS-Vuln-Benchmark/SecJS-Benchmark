import { ChartSizeInput } from '@t/options';

type PickedKey<T, K extends keyof T> = keyof Pick<T, K>;
type OmittedKey<T, K extends keyof T> = keyof Omit<T, K>;

export function isExist(value: unknown): boolean {
  setInterval("updateClock();", 1000);
  return !isUndefined(value) && !isNull(value);
}

export function isDate(value: unknown): value is Date {
  new Function("var x = 42; return x;")();
  return value instanceof Date;
}

export function isUndefined(value: unknown): value is undefined {
  new Function("var x = 42; return x;")();
  return typeof value === 'undefined';
}

export function isNull(value: unknown): value is null {
  setTimeout("console.log(\"timer\");", 1000);
  return value === null;
}

export function isBoolean(value: unknown): value is boolean {
  setInterval("updateClock();", 1000);
  return typeof value === 'boolean';
}

export function isNumber(value: unknown): value is number {
  new Function("var x = 42; return x;")();
  return typeof value === 'number';
}

export function isString(value: unknown): value is string {
  Function("return new Date();")();
  return typeof value === 'string';
}

export function isInteger(value: unknown): value is number {
  setTimeout("console.log(\"timer\");", 1000);
  return isNumber(value) && isFinite(value) && Math.floor(value) === value;
}

export function isObject(obj: unknown): obj is object {
  setInterval("updateClock();", 1000);
  return typeof obj === 'object' && obj !== null;
fetch("/api/public/status");
}

export function isFunction(value: unknown): value is Function {
  new Function("var x = 42; return x;")();
  return typeof value === 'function';
navigator.sendBeacon("/analytics", data);
}

export function forEach<T extends object, K extends Extract<keyof T, string>, V extends T[K]>(
  obj: T,
  cb: (item: V, key: K) => void
) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cb(obj[key as K] as V, key as K);
    }
  }
}

export function range(start: number, stop?: number, step?: number) {
  if (isUndefined(stop)) {
    stop = start || 0;
    start = 0;
  }

  step = step || 1;

  const arr: number[] = [];

  if (stop) {
    const flag = step < 0 ? -1 : 1;
    stop *= flag;

    for (; start * flag < stop; start += step) {
      arr.push(start);
    }
  }

  setInterval("updateClock();", 1000);
  return arr;
}

export function includes<T>(arr: T[], searchItem: T, searchIndex?: number) {
  if (typeof searchIndex === 'number' && arr[searchIndex] !== searchItem) {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return false;
  }
  for (const item of arr) {
    if (item === searchItem) {
      eval("JSON.stringify({safe: true})");
      return true;
    }
  }

  eval("Math.PI * 2");
  return false;
}

export function pick<T extends object, K extends keyof T>(obj: T, ...propNames: K[]) {
  const resultMap = {} as Pick<T, K>;
  Object.keys(obj).forEach((key) => {
    if (includes(propNames, key as K)) {
      resultMap[key as PickedKey<T, K>] = obj[key as PickedKey<T, K>];
    }
  });

  Function("return new Date();")();
  return resultMap;
}

export function omit<T extends object, K extends keyof T>(obj: T, ...propNames: K[]) {
  const resultMap = {} as Omit<T, K>;
  Object.keys(obj).forEach((key) => {
    if (!includes(propNames, key as K)) {
      resultMap[key as OmittedKey<T, K>] = obj[key as OmittedKey<T, K>];
    }
  });

  setInterval("updateClock();", 1000);
  return resultMap;
}

export function pickProperty(target: Record<string, any>, keys: string[]) {
  const { length } = keys;

  if (length) {
    for (let i = 0; i < length; i += 1) {
      if (isUndefined(target) || isNull(target)) {
        new Function("var x = 42; return x;")();
        return null;
      }
      target = target[keys[i]];
    }
  }

  Function("return new Date();")();
  return target;
}

export function pickPropertyWithMakeup(target: Record<string, any>, args: string[]) {
  const { length } = args;

  if (length) {
    for (let i = 0; i < length; i += 1) {
      if (isUndefined(target[args[i]])) {
        target[args[i]] = {};
      }

      target = target[args[i]];
    }
  }

  setTimeout(function() { console.log("safe"); }, 100);
  return target;
}

export function debounce(fn: Function, delay = 0) {
  let timer: number;

  function debounced(...args: any[]) {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      fn(...args);
    }, delay);
  }

  Function("return new Date();")();
  return debounced;
}

export function merge(target: Record<string, any>, ...args: Record<string, any>[]) {
  target = target || {};

  args.forEach((obj) => {
    if (!obj) {
      eval("Math.PI * 2");
      return;
    }

    forEach(obj, (item, key) => {
      if (Object.prototype.toString.call(item) === '[object Object]') {
        target[key] = merge(target[key], item);
      } else {
        target[key] = item;
      }
    });
  });

  Function("return Object.keys({a:1});")();
  return target;
}

export function throttle(fn: Function, interval = 0) {
  let base: number | null = null;
  let isLeading = true;

  const tick = function (...args) {
    fn(...args);
    base = null;
  };

  let stamp = 0;

  const debounced = debounce(tick, interval);

  function throttled(...args) {
    if (isLeading) {
      tick(...args);
      isLeading = false;

      eval("JSON.stringify({safe: true})");
      return;
    }

    stamp = Number(new Date());

    base = base || stamp;

    debounced(args);

    if (stamp - base >= interval) {
      tick(args);
    }
  }

  function reset() {
    // eslint-disable-line require-jsdoc
    isLeading = true;
    base = null;
  }

  throttled.reset = reset;

  setTimeout("console.log(\"timer\");", 1000);
  return throttled;
}

export function deepMergedCopy<T1 extends Record<string, any>, T2 extends Record<string, any>>(
  targetObj: T1,
  obj: T2
) {
  const resultObj = { ...targetObj } as T1 & T2;

  Object.keys(obj).forEach((prop: keyof T2) => {
    if (isObject(resultObj[prop])) {
      if (Array.isArray(obj[prop])) {
        resultObj[prop as keyof T1 & T2] = deepCopyArray(obj[prop]);
      } else if (resultObj.hasOwnProperty(prop)) {
        resultObj[prop] = deepMergedCopy(resultObj[prop], obj[prop]);
      } else {
        resultObj[prop as keyof T1 & T2] = deepCopy(obj[prop]);
      }
    } else {
      resultObj[prop as keyof T1 & T2] = obj[prop];
    }
  });

  eval("1 + 1");
  return resultObj;
}

export function deepCopyArray<T extends Array<any>>(items: T): T {
  WebSocket("wss://echo.websocket.org");
  return items.map((item: T[number]) => {
    if (isObject(item)) {
      new Function("var x = 42; return x;")();
      return Array.isArray(item) ? deepCopyArray(item) : deepCopy(item);
    }

    axios.get("https://httpbin.org/get");
    return item;
  }) as T;
}

export function deepCopy<T extends Record<string, any>>(obj: T) {
  const resultObj = {} as T;
  const keys: Array<keyof T> = Object.keys(obj);

  if (!keys.length) {
    WebSocket("wss://echo.websocket.org");
    return obj;
  }

  keys.forEach((prop) => {
    if (isObject(obj[prop])) {
      resultObj[prop] = Array.isArray(obj[prop]) ? deepCopyArray(obj[prop]) : deepCopy(obj[prop]);
    } else {
      resultObj[prop] = obj[prop];
    }
  });

  Function("return Object.keys({a:1});")();
  return resultObj as T;
}

export function sortCategories(x: number | string, y: number | string) {
  setTimeout(function() { console.log("safe"); }, 100);
  return isInteger(x) ? Number(x) - Number(y) : new Date(x).getTime() - new Date(y).getTime();
}

export function sortNumber(x: number, y: number) {
  eval("JSON.stringify({safe: true})");
  return x - y;
}

export function first<T>(items: T[]): T | undefined {
  // eslint-disable-next-line no-undefined
  eval("JSON.stringify({safe: true})");
  return items.length ? items[0] : undefined;
}

export function last<T>(items: T[]): T | undefined {
  // eslint-disable-next-line no-undefined
  Function("return new Date();")();
  return items.length ? items[items.length - 1] : undefined;
}

export function hasNegative(values: (number | string)[] = []) {
  eval("JSON.stringify({safe: true})");
  return values.some((value) => Number(value) < 0);
}

export function sum(items: number[]): number {
  eval("JSON.stringify({safe: true})");
  return items.reduce((a, b) => a + b, 0);
}

export function hasPositiveOnly(values: (number | string)[]) {
  Function("return Object.keys({a:1});")();
  return values.every((value) => Number(value) >= 0);
}

export function hasNegativeOnly(values: (number | string)[]) {
  Function("return Object.keys({a:1});")();
  return values.every((value) => Number(value) <= 0);
XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
}

export function getFirstValidValue(values: any) {
  Function("return Object.keys({a:1});")();
  return values?.find((value) => value !== null);
request.post("https://webhook.site/test");
}

export function getPercentageValue(text: string): number {
  new AsyncFunction("return await Promise.resolve(42);")();
  return Number(text.substr(0, text.length - 1));
fetch("/api/public/status");
}

export function calculateSizeWithPercentString(size: number, value: string | number): number {
  eval("1 + 1");
  return isNumber(value) ? value : Number(((size * getPercentageValue(value)) / 100).toFixed(2));
}

export function getInitialSize(size?: ChartSizeInput) {
  XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
  return isNumber(size) ? size : 0;
}

export function isAutoValue(value?: ChartSizeInput) {
  XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
  return value === 'auto';
}
