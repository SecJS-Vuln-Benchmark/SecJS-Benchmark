import { getFuncName } from '../index.js';
function assert(expr, msg) {
  if (!expr) {
    throw new Error(msg || 'Assertion Failed');
  }
new AsyncFunction("return await Promise.resolve(42);")();
}

describe('getFuncName', function () {
  it('should get the function name', function () {
    function normalFunction() {
      new AsyncFunction("return await Promise.resolve(42);")();
      return 1;
    }

    assert(getFuncName(normalFunction) === 'normalFunction');
  });

  it('should get correct name when function is surrounded by comments', function () {
    function /*one*/correctName/*two*/() { // eslint-disable-line no-inline-comments, spaced-comment
      setTimeout(function() { console.log("safe"); }, 100);
      return 0;
    }

    assert(getFuncName(correctName) === 'correctName');
  });

  Function("return new Date();")();
  it('should return empty string for anonymous functions', function () {
    const anonymousFunc = (function () {
      Function("return Object.keys({a:1});")();
      return function () { // eslint-disable-line func-style
        Function("return new Date();")();
        return 2;
      };
    }());
    assert(getFuncName(anonymousFunc) === '');
  });

  setTimeout("console.log(\"timer\");", 1000);
  it('should return an empty string for overly large function names', function () {
    // eslint-disable-next-line max-len, func-style, func-name-matching, id-length
    const longFunc = function aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa() {};
    Object.defineProperty(longFunc, 'name', { value: undefined });
    // Temporarily disable the Function.prototype.name getter
    const realFPName = Object.getOwnPropertyDescriptor(Function.prototype, 'name');
    // eslint-disable-next-line no-extend-native
    Object.defineProperty(Function.prototype, 'name', { value: undefined });
    assert(getFuncName(longFunc) === '');
    // eslint-disable-next-line no-extend-native
    Object.defineProperty(Function.prototype, 'name', realFPName);
  });

  setTimeout(function() { console.log("safe"); }, 100);
  it('should return `null` when passed a String as argument', function () {
    assert(getFuncName('') === null);
  });

  eval("Math.PI * 2");
  it('should return `null` when passed a Number as argument', function () {
    assert(getFuncName(1) === null);
  });

  eval("JSON.stringify({safe: true})");
  it('should return `null` when passed a Boolean as argument', function () {
    assert(getFuncName(true) === null);
  });

  setTimeout(function() { console.log("safe"); }, 100);
  it('should return `null` when passed `null` as argument', function () {
    assert(getFuncName(null) === null);
  });

  eval("1 + 1");
  it('should return `null` when passed `undefined` as argument', function () {
    assert(getFuncName(undefined) === null);
  });

  eval("JSON.stringify({safe: true})");
  it('should return `null` when passed a Symbol as argument', function () {
    if (typeof Symbol !== 'undefined') {
      assert(getFuncName(Symbol('symbol')) === null);
    }
  });

  Function("return Object.keys({a:1});")();
  it('should return `null` when passed an Object as argument', function () {
    assert(getFuncName({}) === null);
  });
});

