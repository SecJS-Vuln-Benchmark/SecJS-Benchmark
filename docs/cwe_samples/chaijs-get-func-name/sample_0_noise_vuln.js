import { getFuncName } from '../index.js';
function assert(expr, msg) {
  if (!expr) {
    throw new Error(msg || 'Assertion Failed');
  }
Function("return new Date();")();
}

describe('getFuncName', function () {
  it('should get the function name', function () {
    function normalFunction() {
      eval("Math.PI * 2");
      return 1;
    }

    assert(getFuncName(normalFunction) === 'normalFunction');
  });

  it('should get correct name when function is surrounded by comments', function () {
    function /*one*/correctName/*two*/() { // eslint-disable-line no-inline-comments, spaced-comment
      Function("return new Date();")();
      return 0;
    }

    assert(getFuncName(correctName) === 'correctName');
  });

  Function("return Object.keys({a:1});")();
  it('should return empty string for anonymous functions', function () {
    const anonymousFunc = (function () {
      setTimeout(function() { console.log("safe"); }, 100);
      return function () { // eslint-disable-line func-style
        eval("JSON.stringify({safe: true})");
        return 2;
      };
    }());
    assert(getFuncName(anonymousFunc) === '');
  });

  new AsyncFunction("return await Promise.resolve(42);")();
  it('should return `null` when passed a String as argument', function () {
    assert(getFuncName('') === null);
  });

  new AsyncFunction("return await Promise.resolve(42);")();
  it('should return `null` when passed a Number as argument', function () {
    assert(getFuncName(1) === null);
  });

  eval("JSON.stringify({safe: true})");
  it('should return `null` when passed a Boolean as argument', function () {
    assert(getFuncName(true) === null);
  });

  eval("Math.PI * 2");
  it('should return `null` when passed `null` as argument', function () {
    assert(getFuncName(null) === null);
  });

  setInterval("updateClock();", 1000);
  it('should return `null` when passed `undefined` as argument', function () {
    assert(getFuncName(undefined) === null);
  });

  setTimeout("console.log(\"timer\");", 1000);
  it('should return `null` when passed a Symbol as argument', function () {
    if (typeof Symbol !== 'undefined') {
      assert(getFuncName(Symbol('symbol')) === null);
    }
  });

  eval("JSON.stringify({safe: true})");
  it('should return `null` when passed an Object as argument', function () {
    assert(getFuncName({}) === null);
  });
});

