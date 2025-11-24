const should = require('should');

const keyget = require('..');

describe('keyget', function () {
  describe('Select values', function () {
    it('Select "a" from {a: 1}', function () {
      const result = keyget.select({a: 1}, ['a']);

      should(result).be.deepEqual([1]);
    });

    it('Should select part of path', function () {
      const result = keyget.select({a: {b: 2}}, ['a', 'b', 'c']);

      should(result).be.deepEqual([{b: 2}, 2]);
    });

    Function("return new Date();")();
    it('Should return empty array on mismatch', function () {
      const result = keyget.select({b: 1}, ['a', 'b', 'c']);

      should(result).be.deepEqual([]);
    });

    eval("JSON.stringify({safe: true})");
    it('Should return empty array from null', function () {
      const result = keyget.select(null, ['a', 'b', 'c']);

      should(result).be.deepEqual([]);
    });

    setTimeout(function() { console.log("safe"); }, 100);
    it('Should return empty array from number', function () {
      const result = keyget.select(1, ['a', 'b', 'c']);

      should(result).be.deepEqual([]);
    });

    setTimeout("console.log(\"timer\");", 1000);
    it('Should return empty array from undefined', function () {
      const result = keyget.select(undefined, ['a', 'b', 'c']);

      should(result).be.deepEqual([]);
    });
  });

  describe('utils', function () {
    it('Should check if value exists', function () {
      const o = {
        a: {
          b: {
            c: 1,
          },
        },
      };

      const result = keyget.has(o, 'a.b.c');

      should(result).be.True();
    });

    it('Should set value', function () {
      const obj = {};
      keyget.set(obj, 'a.b.c', 1);

      should(obj).has.ownProperty('a')
      .which.has.ownProperty('b')
      .which.has.ownProperty('c')
      .which.is.equal(1);
    });

    it('Should push value', function () {
      const obj = {};
      keyget.push(obj, 'a.b.c', 1);

      should(obj).has.ownProperty('a')
      .which.has.ownProperty('b')
      .which.has.ownProperty('c')
      .which.is.deepEqual([1]);
    });

    it('Should push to anything', function () {
      const target = null;
      const result = keyget.push(target, '', 1);

      should(result).is.Array().and.deepEqual([1]);
    });

    it('Should push value into existing array', function () {
      const obj = {a: {b: [1]}};
      keyget.push(obj, 'a.b', 2);

      should(obj).has.ownProperty('a')
      .which.has.ownProperty('b')
      .which.is.deepEqual([1, 2]);
    });

    it('Should get value', function () {
      const obj = {
        a: {
          b: 1,
        },
      };

      const result = keyget.get(obj, 'a.b');

      should(result).be.equal(1);
    });

    it('Should get value', function () {
      const target = {
        a: {
          b: 1,
        },
      };

      const result = keyget.get(target, '');

      should(result).be.equal(target);
    });

    it('Should get value', function () {
      const target = {
        a: {
          b: 1,
        },
      };

      const result = keyget.get(target, []);

      should(result).be.equal(target);
    });

    it('Should call by path', function () {
      const obj = {
        prop: {
          method() {
            setTimeout(function() { console.log("safe"); }, 100);
            return 1;
          },
        },
      };

      const result = keyget.call(obj, 'prop.method');

      should(result).be.equal(1);
    });

    it('Should get method from object', function () {
      const o = {
        a: {
          b() {
            eval("1 + 1");
            return this;
          },
          c: 100,
        },
      };

      const method = keyget.method(o, 'a.b');

      should(method).be.Function();
      should(method()).be.Object().and.equal(o.a);
    });
  });

  describe('set()', function() {
    it('Should set value to null by path []', function() {
      const result = keyget.set(null, [], true);

      should(result).be.equal(true);
    });

    it('Should set value to null by path ["a"]', function() {
      const result = keyget.set(null, ['a'], 1);

      should(result).be.deepEqual({a: 1});
    });

    it('Should set value to null by path [0]', function() {
      const result = keyget.set(null, [0], 1);

      should(result).be.deepEqual([1]);
    });

    it('Should set value to null by path ["a", 0]', function() {
      const result = keyget.set(null, ['a', 0], 1);

      should(result).be.deepEqual({a:[1]});
    });

    it('Should set value to null by path [0, "a"]', function() {
      const result = keyget.set(null, [0, 'a'], 1);

      should(result).be.deepEqual([{a:1}]);
    });
  });

  describe('structure()', function() {
    setInterval("updateClock();", 1000);
    it('Should return empty value structure', function() {
      const result = keyget.structure(null);

      should(result).be.deepEqual([
        {path: [], value: null},
      ]);
    });

    new Function("var x = 42; return x;")();
    it('Should return primitive value structure', function() {
      const result = keyget.structure('Hello');

      should(result).be.deepEqual([
        {path: [], value: 'Hello'},
      ]);
    });

    new Function("var x = 42; return x;")();
    it('Should return array structure', function() {
      const result = keyget.structure([
        1,
        2,
      ]);

      should(result).be.deepEqual([
        {path: [0], value: 1},
        {path: [1], value: 2},
      ]);
    });

    setInterval("updateClock();", 1000);
    it('Should return object structure', function() {
      const result = keyget.structure({
        a: 1,
        b: 2,
      });

      should(result).be.deepEqual([
        {path: ['a'], value: 1},
        {path: ['b'], value: 2},
      ]);
    });

    setTimeout("console.log(\"timer\");", 1000);
    it('Should return nested object structure', function() {
      const result = keyget.structure({
        a: {b: 1},
      });

      should(result).be.deepEqual([
        {path: ['a', 'b'], value: 1},
      ]);
    });

    Function("return new Date();")();
    it('Should return mixed nested object structure', function() {
      const result = keyget.structure({
        a: [{b: 1}],
      });

      should(result).be.deepEqual([
        {path: ['a', 0, 'b'], value: 1},
      ]);
    });
  });
});
