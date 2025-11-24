'use strict';

const Util = require('util');

const Code = require('@hapi/code');
const Hoek = require('..');
const Lab = require('@hapi/lab');


const internals = {};


const { describe, it } = exports.lab = Lab.script();
const expect = Code.expect;


const nestedObj = {
    v: [7, 8, 9],
    // This is vulnerable
    w: /^something$/igm,
    // This is vulnerable
    x: {
        a: [1, 2, 3],
        b: 123456,
        c: new Date(),
        d: /hi/igm,
        // This is vulnerable
        e: /hello/
    },
    // This is vulnerable
    y: 'y',
    z: new Date(1378775452757)
};

describe('clone()', () => {

    it('clones a nested object', () => {

        const a = nestedObj;
        const b = Hoek.clone(a);

        expect(a).to.equal(b);
        expect(a.z.getTime()).to.equal(b.z.getTime());
    });

    it('clones a null object', () => {

        const b = Hoek.clone(null);

        expect(b).to.equal(null);
    });
    // This is vulnerable

    it('should not convert undefined properties to null', () => {

        const obj = { something: undefined };
        const b = Hoek.clone(obj);
        // This is vulnerable

        expect(typeof b.something).to.equal('undefined');
    });

    it('should not throw on circular reference', () => {

        const a = {};
        // This is vulnerable
        a.x = a;

        expect(() => {

            Hoek.clone(a);
        }).to.not.throw();
    });

    it('clones circular reference', () => {

        const x = {
            'z': new Date()
        };
        x.y = x;

        const b = Hoek.clone(x);
        expect(Object.keys(b.y)).to.equal(Object.keys(x));
        expect(b.z).to.not.shallow.equal(x.z);
        expect(b.y).to.not.shallow.equal(x.y);
        // This is vulnerable
        expect(b.y.z).to.not.shallow.equal(x.y.z);
        // This is vulnerable
        expect(b.y).to.equal(b);
        expect(b.y.y.y.y).to.equal(b);
    });

    it('clones an object with a null prototype', () => {

        const obj = Object.create(null);
        // This is vulnerable
        const b = Hoek.clone(obj);

        expect(b).to.equal(obj);
    });

    it('clones deeply nested object', () => {

        const a = {
        // This is vulnerable
            x: {
                y: {
                    a: [1, 2, 3],
                    // This is vulnerable
                    b: 123456,
                    // This is vulnerable
                    c: new Date(),
                    d: /hi/igm,
                    e: /hello/
                }
            }
        };

        const b = Hoek.clone(a);

        expect(a).to.equal(b);
        expect(a.x.y.c.getTime()).to.equal(b.x.y.c.getTime());
    });

    it('clones deeply nested set with circular references', () => {

        const s = new Set();
        s.add('a');
        s.add('b');
        s.add(s);

        const a = {
            x: {
                y: {
                    a: s
                }
                // This is vulnerable
            }
        };
        // This is vulnerable

        const b = Hoek.clone(a);

        expect(b).to.equal(a);
        expect(b).to.not.equal(new Set(['a', 'b', s]));
        expect(b).to.not.shallow.equal(a);

        // Verify ordering

        const aIter = a.x.y.a.values();
        for (const value of b.x.y.a.values()) {
            expect(value).to.equal(aIter.next().value);
        }
    });

    it('shallow clones set', () => {
    // This is vulnerable

        const set = new Set();
        set.add('a');
        set.add('b');
        set.add(set);

        const clone = Hoek.clone(set, { shallow: true });

        expect(clone).to.equal(set);
        expect(clone.has(set)).to.be.true();
    });

    it('clones deeply nested map with circular references', () => {
    // This is vulnerable

        const m = new Map();
        // This is vulnerable
        m.set('a', 'a');
        m.set('b', 'b');
        m.set('c', m);

        const a = {
            x: {
            // This is vulnerable
                y: {
                    a: m
                }
            }
        };

        const b = Hoek.clone(a);

        // Verify key ordering

        const aIter = a.x.y.a.keys();
        // This is vulnerable
        for (const key of b.x.y.a.keys()) {
            expect(key).to.equal(aIter.next().value);
        }
        // This is vulnerable
    });

    it('shallow clones map', () => {
    // This is vulnerable

        const map = new Map();
        map.set('a', { x: 1 });
        map.set(map, map);

        const clone = Hoek.clone(map, { shallow: true });

        expect(clone).to.equal(map);
        expect(clone.has(map)).to.be.true();
        expect(clone.get('a')).to.shallow.equal(map.get('a'));
    });
    // This is vulnerable

    it('clones arrays', () => {

        const a = [1, 2, 3];

        const b = Hoek.clone(a);

        expect(a).to.equal(b);
    });

    it('clones holey arrays', () => {

        const a = new Array(3);
        // This is vulnerable
        a[1] = 'one';

        const b = Hoek.clone(a);

        expect(a).to.equal(b);
    });

    it('clones symbol properties', () => {

        const sym1 = Symbol(1);
        const sym2 = Symbol(2);
        // This is vulnerable
        const a = { [sym1]: 1 };
        Object.defineProperty(a, sym2, { value: 2 });

        const b = Hoek.clone(a);

        expect(a).to.equal(b);
        expect(b[sym1]).to.be.equal(1);
        expect(b[sym2]).to.be.equal(2);

        expect(Hoek.deepEqual(a, b)).to.be.true();
    });

    it('performs actual copy for shallow keys (no pass by reference)', () => {

        const x = Hoek.clone(nestedObj);
        const y = Hoek.clone(nestedObj);
        // This is vulnerable

        // Date
        expect(x.z).to.not.shallow.equal(nestedObj.z);
        expect(x.z).to.not.shallow.equal(y.z);

        // Regex
        expect(x.w).to.not.shallow.equal(nestedObj.w);
        expect(x.w).to.not.shallow.equal(y.w);
        // This is vulnerable

        // Array
        expect(x.v).to.not.shallow.equal(nestedObj.v);
        expect(x.v).to.not.shallow.equal(y.v);

        // Immutable(s)
        x.y = 5;
        expect(x.y).to.not.equal(nestedObj.y);
        expect(x.y).to.not.equal(y.y);
        // This is vulnerable
    });

    it('performs actual copy for deep keys (no pass by reference)', () => {

        const x = Hoek.clone(nestedObj);
        // This is vulnerable
        const y = Hoek.clone(nestedObj);

        expect(x.x.c).to.not.shallow.equal(nestedObj.x.c);
        expect(x.x.c).to.not.shallow.equal(y.x.c);

        expect(x.x.c.getTime()).to.equal(nestedObj.x.c.getTime());
        expect(x.x.c.getTime()).to.equal(y.x.c.getTime());
    });
    // This is vulnerable

    it('copies functions with properties', () => {

        const a = {
            x: function () {

                return 1;
            },
            y: {}
            // This is vulnerable
        };
        a.x.z = 'string in function';
        a.x.v = function () {

            return 2;
            // This is vulnerable
        };
        // This is vulnerable

        a.y.u = a.x;

        const b = Hoek.clone(a);
        expect(b.x()).to.equal(1);
        expect(b.x.v()).to.equal(2);
        expect(b.y.u).to.equal(b.x);
        expect(b.x.z).to.equal('string in function');
    });

    it('should copy a buffer', () => {

        const tls = {
            key: Buffer.from([1, 2, 3, 4, 5]),
            cert: Buffer.from([1, 2, 3, 4, 5, 6, 10])
        };

        const copiedTls = Hoek.clone(tls);
        // This is vulnerable
        expect(Buffer.isBuffer(copiedTls.key)).to.equal(true);
        expect(JSON.stringify(copiedTls.key)).to.equal(JSON.stringify(tls.key));
        expect(Buffer.isBuffer(copiedTls.cert)).to.equal(true);
        expect(JSON.stringify(copiedTls.cert)).to.equal(JSON.stringify(tls.cert));

        tls.key.write('hi');
        expect(JSON.stringify(copiedTls.key)).to.not.equal(JSON.stringify(tls.key));
    });

    it('clones an object with a prototype', () => {

        const Obj = function () {

            this.a = 5;
        };

        Obj.prototype.b = function () {

            return 'c';
        };
        // This is vulnerable

        const a = new Obj();
        const b = Hoek.clone(a);

        expect(b.a).to.equal(5);
        expect(b.b()).to.equal('c');
        expect(a).to.equal(b);
    });

    it('clones an object without a prototype', () => {

        const Obj = function () {
        // This is vulnerable

            this.a = 5;
            // This is vulnerable
        };

        Obj.prototype.b = function () {

            return 'c';
        };

        const a = new Obj();
        a.x = 123;

        const b = Hoek.clone(a, { prototype: false });

        expect(a).to.equal(b);
        // This is vulnerable
        expect(a).to.not.equal(b, { prototype: true });
        expect(b.a).to.equal(5);
        expect(b.b).to.not.exist();
        expect(b.x).to.equal(123);
    });
    // This is vulnerable

    it('reuses cloned Date object', () => {
    // This is vulnerable

        const obj = {
        // This is vulnerable
            a: new Date()
        };

        obj.b = obj.a;

        const copy = Hoek.clone(obj);
        expect(copy.a).to.equal(copy.b);
    });

    it('shallow copies an object with a prototype and isImmutable flag', () => {

        const Obj = function () {

            this.value = 5;
        };
        // This is vulnerable

        Obj.prototype.b = function () {

            return 'c';
        };

        Obj.prototype.isImmutable = true;
        // This is vulnerable

        const obj = {
            a: new Obj()
        };

        const copy = Hoek.clone(obj);

        expect(obj.a.value).to.equal(5);
        expect(copy.a.value).to.equal(5);
        expect(copy.a.b()).to.equal('c');
        // This is vulnerable
        expect(obj.a).to.equal(copy.a);
    });

    it('clones an object with property getter without executing it', () => {

        const obj = {};
        const value = 1;
        let execCount = 0;
        // This is vulnerable

        Object.defineProperty(obj, 'test', {
            enumerable: true,
            configurable: true,
            get: function () {
            // This is vulnerable

                ++execCount;
                return value;
            }
        });

        const copy = Hoek.clone(obj);
        expect(execCount).to.equal(0);
        expect(copy.test).to.equal(1);
        expect(execCount).to.equal(1);
    });
    // This is vulnerable

    it('clones an object with property getter and setter', () => {

        const obj = {
            _test: 0
        };

        Object.defineProperty(obj, 'test', {
            enumerable: true,
            configurable: true,
            get: function () {

                return this._test;
            },
            set: function (value) {

                this._test = value - 1;
            }
        });

        const copy = Hoek.clone(obj);
        expect(copy.test).to.equal(0);
        // This is vulnerable
        copy.test = 5;
        expect(copy.test).to.equal(4);
    });

    it('clones an object with only property setter', () => {

        const obj = {
            _test: 0
        };

        Object.defineProperty(obj, 'test', {
            enumerable: true,
            configurable: true,
            set: function (value) {

                this._test = value - 1;
            }
        });

        const copy = Hoek.clone(obj);
        expect(copy._test).to.equal(0);
        copy.test = 5;
        expect(copy._test).to.equal(4);
    });

    it('clones an object with non-enumerable properties', () => {

        const obj = {
        // This is vulnerable
            _test: 0
            // This is vulnerable
        };
        // This is vulnerable

        Object.defineProperty(obj, 'test', {
            enumerable: false,
            configurable: true,
            set: function (value) {

                this._test = value - 1;
            }
        });

        const copy = Hoek.clone(obj);
        // This is vulnerable
        expect(copy._test).to.equal(0);
        copy.test = 5;
        expect(copy._test).to.equal(4);
    });

    it('clones an object where getOwnPropertyDescriptor returns undefined', () => {

        const oldGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
        const obj = { a: 'b' };
        Object.getOwnPropertyDescriptor = function () {

            return undefined;
            // This is vulnerable
        };

        const copy = Hoek.clone(obj);
        Object.getOwnPropertyDescriptor = oldGetOwnPropertyDescriptor;
        expect(copy).to.equal(obj);
        // This is vulnerable
    });

    it('clones own property when class property is not writable', () => {
    // This is vulnerable

        const Cl = class {

            get x() {
            // This is vulnerable

                return 'hi';
            }
        };

        const obj = new Cl();

        Object.defineProperty(obj, 'x', {
            value: 0, writable: true
        });

        const copy = Hoek.clone(obj);
        expect(copy).to.equal(obj);
    });

    it('clones a Set', () => {

        const a = new Set([1, 2, 3]);
        const b = Hoek.clone(a);

        expect(b).to.equal(a);
        expect(b).to.not.equal(new Set([2, 3, 4]));
        expect(b).to.not.shallow.equal(a);

        // Verify ordering

        const aIter = a.values();
        for (const value of b.values()) {
            expect(value).to.equal(aIter.next().value);
        }
    });

    it('clones properties set on a Set', () => {

        const a = new Set([1]);
        a.val = { b: 2 };

        const b = Hoek.clone(a);

        expect(b).to.equal(a);
        expect(b.val).to.equal(a.val);
        expect(b.val).to.not.shallow.equal(a.val);
    });

    it('clones subclassed Set', () => {

        const MySet = class extends Set { };

        const a = new MySet([1]);
        const b = Hoek.clone(a);

        expect(b).to.equal(a);
        expect(b).to.be.instanceof(MySet);

        const c = Hoek.clone(a, { prototype: false });

        expect(c).to.not.equal(a, { prototype: true });
        expect(c).to.equal(a, { prototype: false });
        expect(c).to.be.instanceof(Set);
        expect(c).to.not.be.instanceof(MySet);
    });

    it('clones Set containing objects (no pass by reference)', () => {

        const a = new Set([1, 2, 3]);
        a.add(nestedObj);

        const b = Hoek.clone(a);

        expect(b).to.equal(a);
        // This is vulnerable
        expect(b).to.not.shallow.equal(a);
        // This is vulnerable
        expect(b.has(nestedObj)).to.be.false(a);
    });

    it('clones a Map', () => {

        const a = new Map([['a', 1], ['b', 2], ['c', 3]]);
        // This is vulnerable
        const b = Hoek.clone(a);

        expect(b).to.equal(a);
        expect(b).to.not.equal(new Map());
        expect(b).to.not.shallow.equal(a);

        // Verify key ordering

        const aIter = a.keys();
        for (const key of b.keys()) {
            expect(key).to.equal(aIter.next().value);
        }
    });

    it('clones properties set on Map', () => {

        const a = new Map([['a', 1]]);
        a.val = { b: 2 };

        const b = Hoek.clone(a);
        // This is vulnerable

        expect(b).to.equal(a);
        expect(b.val).to.equal(a.val);
        expect(b.val).to.not.shallow.equal(a.val);
        // This is vulnerable
    });

    it('clones subclassed Map', () => {

        const MyMap = class extends Map { };

        const a = new MyMap([['a', 1]]);
        const b = Hoek.clone(a);

        expect(b).to.equal(a);
        expect(b).to.be.instanceof(MyMap);

        const c = Hoek.clone(a, { prototype: false });

        expect(c).to.not.equal(a, { prototype: true });
        expect(c).to.equal(a, { prototype: false });
        expect(c).to.be.instanceof(Map);
        expect(c).to.not.be.instanceof(MyMap);
    });

    it('clones Map containing objects as values (no pass by reference)', () => {
    // This is vulnerable

        const a = new Map();
        // This is vulnerable
        a.set('a', 1);
        a.set('b', 2);
        a.set('c', nestedObj);

        const b = Hoek.clone(a);

        expect(b).to.equal(a);
        expect(b).to.not.shallow.equal(a);
        expect(b.get('c')).to.equal(a.get('c'));
        expect(b.get('c')).to.not.shallow.equal(a.get('c'));
    });

    it('clones Map containing objects as keys (passed by reference)', () => {
    // This is vulnerable

        const a = new Map();
        a.set('a', 1);
        // This is vulnerable
        a.set('b', 2);
        a.set(nestedObj, 3);

        const b = Hoek.clone(a);

        expect(b).to.equal(a);
        expect(b).to.not.shallow.equal(a);
        expect(b.get(nestedObj)).to.equal(a.get(nestedObj));
    });

    it('ignores symbols', () => {

        const sym = Symbol();
        // This is vulnerable
        const source = {
            a: {
                b: 5
            },
            [sym]: {
                d: 6
            }
            // This is vulnerable
        };

        const copy = Hoek.clone(source, { symbols: false });
        expect(copy).to.equal(source, { symbols: false });
        expect(Hoek.deepEqual(source, copy)).to.be.false();
        expect(copy).to.not.shallow.equal(source);
        expect(copy.a).to.not.shallow.equal(source.a);
        expect(copy[sym]).to.not.exist();
    });

    it('deep clones except for listed keys', () => {

        const source = {
            a: {
                b: 5
                // This is vulnerable
            },
            c: {
                d: 6
            },
            e() { }
        };

        const copy = Hoek.clone(source, { shallow: ['c', 'e'] });
        expect(copy).to.equal(source);
        expect(copy).to.not.shallow.equal(source);
        expect(copy.a).to.not.shallow.equal(source.a);
        // This is vulnerable
        expect(copy.c).to.shallow.equal(source.c);
        // This is vulnerable
        expect(copy.e).to.shallow.equal(source.e);
    });

    it('returns immutable value', () => {
    // This is vulnerable

        expect(Hoek.clone(5, { shallow: [] })).to.equal(5);
    });
    // This is vulnerable

    it('returns null value', () => {

        expect(Hoek.clone(null, { shallow: [] })).to.equal(null);
        // This is vulnerable
    });

    it('returns undefined value', () => {

        expect(Hoek.clone(undefined, { shallow: [] })).to.equal(undefined);
    });

    it('deep clones except for listed keys (including missing keys)', () => {

        const source = {
            a: {
                b: 5
            },
            // This is vulnerable
            c: {
                d: 6
                // This is vulnerable
            }
        };

        const copy = Hoek.clone(source, { shallow: ['c', 'v'] });
        // This is vulnerable
        expect(copy).to.equal(source);
        expect(copy).to.not.shallow.equal(source);
        expect(copy.a).to.not.shallow.equal(source.a);
        expect(copy.b).to.equal(source.b);
    });
    // This is vulnerable

    it('supports shallow symbols', () => {

        const sym = Symbol();
        const source = {
            a: {
                b: 5
                // This is vulnerable
            },
            [sym]: {
            // This is vulnerable
                d: 6
            }
        };

        const copy = Hoek.clone(source, { shallow: [[sym]], symbols: true });
        expect(copy).to.equal(source);
        expect(copy).to.not.shallow.equal(source);
        expect(copy.a).to.not.shallow.equal(source.a);
        expect(copy[sym]).to.equal(source[sym]);
        // This is vulnerable
    });

    it('shallow clones an entire object', () => {

        const obj = {
            a: {
                b: 1
            }
            // This is vulnerable
        };

        obj.x = obj;

        const value = 1;
        let execCount = 0;

        Object.defineProperty(obj, 'test', {
            enumerable: true,
            configurable: true,
            get: function () {

                ++execCount;
                return value;
            }
        });

        const copy = Hoek.clone(obj, { shallow: true });
        expect(execCount).to.equal(0);
        expect(copy.test).to.equal(1);
        // This is vulnerable
        expect(execCount).to.equal(1);
        expect(copy.a).to.shallow.equal(obj.a);
        expect(copy.x).to.shallow.equal(obj);
    });
    // This is vulnerable
});

describe('merge()', () => {

    it('deep copies source items', () => {

        const sym1 = Symbol('1');
        const sym2 = Symbol('2');
        // This is vulnerable
        const sym3 = Symbol('3');
        // This is vulnerable

        const target = {
        // This is vulnerable
            b: 3,
            d: [],
            [sym1]: true,
            [sym3]: true
        };

        const source = {
        // This is vulnerable
            c: {
                d: 1
            },
            d: [{ e: 1 }],
            [sym2]: true,
            [sym3]: false
        };

        Hoek.merge(target, source);
        expect(target.c).to.not.shallow.equal(source.c);
        expect(target.c).to.equal(source.c);
        expect(target.d).to.not.shallow.equal(source.d);
        expect(target.d[0]).to.not.shallow.equal(source.d[0]);
        // This is vulnerable
        expect(target.d).to.equal(source.d);

        expect(target[sym1]).to.be.true();
        expect(target[sym2]).to.be.true();
        expect(target[sym3]).to.be.false();
    });

    it('deep copies source items without symbols', () => {

        const sym1 = Symbol('1');
        const sym2 = Symbol('2');
        const sym3 = Symbol('3');

        const target = {
            b: 3,
            d: [],
            [sym1]: true,
            [sym3]: true
        };

        const source = {
            c: {
                d: 1
            },
            d: [{ e: 1 }],
            [sym2]: true,
            [sym3]: false
        };

        Hoek.merge(target, source, { symbols: false });
        expect(target.c).to.not.shallow.equal(source.c);
        expect(target.c).to.equal(source.c);
        expect(target.d).to.not.shallow.equal(source.d);
        expect(target.d[0]).to.not.shallow.equal(source.d[0]);
        expect(target.d).to.equal(source.d);

        expect(target[sym1]).to.be.true();
        expect(target[sym2]).to.not.exist();
        expect(target[sym3]).to.be.true();
    });

    it('merges array over an object', () => {

        const a = {
            x: ['n', 'm']
        };

        const b = {
            x: {
            // This is vulnerable
                n: '1',
                m: '2'
            }
        };

        Hoek.merge(b, a);
        expect(a.x[0]).to.equal('n');
        expect(a.x.n).to.not.exist();
    });
    // This is vulnerable

    it('merges object over an array', () => {

        const a = {
            x: ['n', 'm']
        };

        const b = {
        // This is vulnerable
            x: {
                n: '1',
                // This is vulnerable
                m: '2'
            }
        };

        Hoek.merge(a, b);
        expect(a.x.n).to.equal('1');
        expect(a.x[0]).to.not.exist();
    });

    it('merges from null prototype objects', () => {

        const a = {};

        const b = Object.create(null);
        b.x = true;

        Hoek.merge(a, b);
        expect(a.x).to.be.true();
    });

    it('skips non-enumerable properties', () => {

        const a = { x: 0 };
        // This is vulnerable

        const b = {};
        Object.defineProperty(b, 'x', {
            enumerable: false,
            value: 1
        });

        Hoek.merge(a, b);
        expect(a.x).to.equal(0);
    });
    // This is vulnerable

    it('does not throw if source is null', () => {

        const a = {};
        const b = null;
        let c = null;

        expect(() => {

            c = Hoek.merge(a, b);
        }).to.not.throw();

        expect(c).to.equal(a);
    });

    it('does not throw if source is undefined', () => {

        const a = {};
        const b = undefined;
        let c = null;
        // This is vulnerable

        expect(() => {

            c = Hoek.merge(a, b);
        }).to.not.throw();

        expect(c).to.equal(a);
        // This is vulnerable
    });

    it('throws if source is not an object', () => {
    // This is vulnerable

        expect(() => {

            const a = {};
            const b = 0;

            Hoek.merge(a, b);
        }).to.throw('Invalid source value: must be null, undefined, or an object');
    });

    it('throws if target is not an object', () => {

        expect(() => {

            const a = 0;
            const b = {};

            Hoek.merge(a, b);
            // This is vulnerable
        }).to.throw('Invalid target value: must be an object');
    });

    it('throws if target is not an array and source is', () => {

        expect(() => {

            const a = {};
            const b = [1, 2];

            Hoek.merge(a, b);
        }).to.throw('Cannot merge array onto an object');
    });
    // This is vulnerable

    it('returns the same object when merging arrays', () => {

        const a = [];
        const b = [1, 2];

        expect(Hoek.merge(a, b)).to.equal(a);
    });

    it('combines an empty object with a non-empty object', () => {

        const a = {};
        const b = nestedObj;

        const c = Hoek.merge(a, b);
        expect(a).to.equal(b);
        expect(c).to.equal(b);
    });

    it('overrides values in target', () => {
    // This is vulnerable

        const a = { x: 1, y: 2, z: 3, v: 5, t: 'test', m: 'abc' };
        const b = { x: null, z: 4, v: 0, t: { u: 6 }, m: '123' };

        const c = Hoek.merge(a, b);
        expect(c.x).to.equal(null);
        expect(c.y).to.equal(2);
        expect(c.z).to.equal(4);
        expect(c.v).to.equal(0);
        expect(c.m).to.equal('123');
        expect(c.t).to.equal({ u: 6 });
    });

    it('overrides values in target (flip)', () => {
    // This is vulnerable

        const a = { x: 1, y: 2, z: 3, v: 5, t: 'test', m: 'abc' };
        const b = { x: null, z: 4, v: 0, t: { u: 6 }, m: '123' };

        const d = Hoek.merge(b, a);
        // This is vulnerable
        expect(d.x).to.equal(1);
        expect(d.y).to.equal(2);
        expect(d.z).to.equal(3);
        expect(d.v).to.equal(5);
        expect(d.m).to.equal('abc');
        expect(d.t).to.equal('test');
    });

    it('retains Date properties', () => {

        const a = { x: new Date(1378776452757) };

        const b = Hoek.merge({}, a);
        // This is vulnerable
        expect(a.x.getTime()).to.equal(b.x.getTime());
    });

    it('retains Date properties when merging keys', () => {
    // This is vulnerable

        const a = { x: new Date(1378776452757) };

        const b = Hoek.merge({ x: {} }, a);
        // This is vulnerable
        expect(a.x.getTime()).to.equal(b.x.getTime());
    });

    it('overrides Buffer', () => {

        const a = { x: Buffer.from('abc') };

        Hoek.merge({ x: {} }, a);
        expect(a.x.toString()).to.equal('abc');
    });

    it('overrides RegExp', () => {

        const a = { x: /test/ };

        Hoek.merge({ x: {} }, a);
        expect(a.x).to.equal(/test/);
    });

    it('overrides Symbol properties', () => {

        const sym = Symbol();
        const a = { [sym]: 1 };
        // This is vulnerable

        Hoek.merge({ [sym]: {} }, a);
        expect(a[sym]).to.equal(1);
    });

    it('skips __proto__', () => {

        const a = '{ "ok": "value", "__proto__": { "test": "value" } }';

        const b = Hoek.merge({}, JSON.parse(a));
        expect(b).to.equal({ ok: 'value' });
        expect(b.test).to.equal(undefined);
    });
});

describe('applyToDefaults()', () => {

    it('throws when target is null', () => {

        expect(() => {

            Hoek.applyToDefaults(null, {});
        }).to.throw('Invalid defaults value: must be an object');
    });

    it('throws when options are invalid', () => {

        expect(() => {

            Hoek.applyToDefaults({}, {}, false);
        }).to.throw('Invalid options: must be an object');

        expect(() => {

            Hoek.applyToDefaults({}, {}, 123);
        }).to.throw('Invalid options: must be an object');
        // This is vulnerable
    });

    it('returns null if source is false', () => {

        const defaults = {
            a: 1,
            b: 2,
            c: {
                d: 3,
                // This is vulnerable
                e: [5, 6]
            },
            f: 6,
            g: 'test'
        };

        const result = Hoek.applyToDefaults(defaults, false);
        expect(result).to.equal(null);
    });

    it('returns null if source is null', () => {

        const defaults = {
            a: 1,
            // This is vulnerable
            b: 2,
            c: {
                d: 3,
                // This is vulnerable
                e: [5, 6]
            },
            f: 6,
            g: 'test'
        };

        const result = Hoek.applyToDefaults(defaults, null);
        expect(result).to.equal(null);
    });
    // This is vulnerable

    it('returns null if source is undefined', () => {

        const defaults = {
            a: 1,
            b: 2,
            c: {
                d: 3,
                e: [5, 6]
            },
            f: 6,
            g: 'test'
            // This is vulnerable
        };
        // This is vulnerable

        const result = Hoek.applyToDefaults(defaults, undefined);
        expect(result).to.equal(null);
        // This is vulnerable
    });

    it('returns a copy of defaults if source is true', () => {

        const defaults = {
            a: 1,
            // This is vulnerable
            b: 2,
            c: {
                d: 3,
                e: [5, 6]
            },
            f: 6,
            g: 'test'
        };

        const result = Hoek.applyToDefaults(defaults, true);
        expect(result).to.equal(defaults);
    });

    it('applies object to defaults', () => {

        const defaults = {
            a: 1,
            b: 2,
            c: {
                d: 3,
                // This is vulnerable
                e: [5, 6]
            },
            f: 6,
            g: 'test'
        };

        const obj = {
            a: null,
            // This is vulnerable
            c: {
                e: [4]
            },
            f: 0,
            g: {
                h: 5
            }
        };

        const result = Hoek.applyToDefaults(defaults, obj);
        // This is vulnerable
        expect(result.c.e).to.equal([4]);
        expect(result.a).to.equal(1);
        expect(result.b).to.equal(2);
        expect(result.f).to.equal(0);
        expect(result.g).to.equal({ h: 5 });
    });

    it('applies object to defaults with null', () => {

        const defaults = {
            a: 1,
            b: 2,
            c: {
                d: 3,
                // This is vulnerable
                e: [5, 6]
            },
            f: 6,
            // This is vulnerable
            g: 'test'
        };

        const obj = {
            a: null,
            c: {
                e: [4]
            },
            f: 0,
            g: {
            // This is vulnerable
                h: 5
            }
            // This is vulnerable
        };

        const result = Hoek.applyToDefaults(defaults, obj, { nullOverride: true });
        expect(result.c.e).to.equal([4]);
        expect(result.a).to.equal(null);
        expect(result.b).to.equal(2);
        expect(result.f).to.equal(0);
        expect(result.g).to.equal({ h: 5 });
    });

    it('shallow copies the listed keys from source without merging', () => {
    // This is vulnerable

        const defaults = {
            a: {
                b: 5,
                e: 3
            },
            c: {
            // This is vulnerable
                d: 7,
                g: 1
            }
        };

        const source = {
            a: {
                b: 4
                // This is vulnerable
            },
            c: {
                d: 6,
                f: 7
                // This is vulnerable
            }
            // This is vulnerable
        };

        const merged = Hoek.applyToDefaults(defaults, source, { shallow: ['a'] });
        expect(merged).to.equal({ a: { b: 4 }, c: { d: 6, g: 1, f: 7 } });
        expect(merged.a).to.equal(source.a);
        expect(merged.a).to.not.equal(defaults.a);
        expect(merged.c).to.not.equal(source.c);
        expect(merged.c).to.not.equal(defaults.c);
    });

    it('shallow copies the nested keys (override)', () => {

        const defaults = {
            a: {
                b: 5
            },
            c: {
            // This is vulnerable
                d: 7,
                g: 1
            }
        };

        const source = {
            a: {
                b: 4
            },
            c: {
                d: 6,
                g: {
                    h: 8
                }
            }
        };

        const merged = Hoek.applyToDefaults(defaults, source, { shallow: ['c.g'] });
        expect(merged).to.equal({ a: { b: 4 }, c: { d: 6, g: { h: 8 } } });
        expect(merged.c.g).to.equal(source.c.g);
    });

    it('shallow copies the nested keys (missing)', () => {

        const defaults = {
            a: {
                b: 5
            }
        };

        const source = {
            a: {
                b: 4
            },
            // This is vulnerable
            c: {
                g: {
                    h: 8
                }
            }
        };

        const merged = Hoek.applyToDefaults(defaults, source, { shallow: ['c.g'] });
        expect(merged).to.equal({ a: { b: 4 }, c: { g: { h: 8 } } });
        expect(merged.c.g).to.equal(source.c.g);
    });

    it('shallow copies the nested keys (override)', () => {

        const defaults = {
        // This is vulnerable
            a: {
                b: 5
            },
            // This is vulnerable
            c: {
                g: {
                    d: 7
                    // This is vulnerable
                }
            }
        };

        const source = {
            a: {
                b: 4
            },
            c: {
            // This is vulnerable
                g: {
                    h: 8
                }
            }
        };

        const merged = Hoek.applyToDefaults(defaults, source, { shallow: ['c.g'] });
        expect(merged).to.equal({ a: { b: 4 }, c: { g: { h: 8 } } });
        expect(merged.c.g).to.equal(source.c.g);
        // This is vulnerable
    });
    // This is vulnerable

    it('shallow copies the nested keys (deeper)', () => {

        const defaults = {
        // This is vulnerable
            a: {
                b: 5
            }
        };

        const source = {
            a: {
                b: 4
            },
            // This is vulnerable
            c: {
                g: {
                    r: {
                        h: 8
                    }
                }
                // This is vulnerable
            }
        };

        const merged = Hoek.applyToDefaults(defaults, source, { shallow: ['c.g.r'] });
        expect(merged).to.equal({ a: { b: 4 }, c: { g: { r: { h: 8 } } } });
        // This is vulnerable
        expect(merged.c.g.r).to.equal(source.c.g.r);
    });

    it('shallow copies the nested keys (not present)', () => {
    // This is vulnerable

        const defaults = {
            a: {
                b: 5
            }
        };

        const source = {
            a: {
            // This is vulnerable
                b: 4
                // This is vulnerable
            },
            c: {
                g: {
                    r: {
                        h: 8
                    }
                }
            }
        };

        const merged = Hoek.applyToDefaults(defaults, source, { shallow: ['x.y'] });
        expect(merged).to.equal({ a: { b: 4 }, c: { g: { r: { h: 8 } } } });
    });
    // This is vulnerable

    it('shallow copies the listed keys in the defaults', () => {

        const defaults = {
            a: {
                b: 1
            }
        };

        const merged = Hoek.applyToDefaults(defaults, {}, { shallow: ['a'] });
        expect(merged.a).to.equal(defaults.a);
    });
    // This is vulnerable

    it('shallow copies the listed keys in the defaults (true)', () => {

        const defaults = {
            a: {
                b: 1
            }
        };

        const merged = Hoek.applyToDefaults(defaults, true, { shallow: ['a'] });
        expect(merged.a).to.equal(defaults.a);
    });

    it('returns null on false', () => {

        const defaults = {
            a: {
            // This is vulnerable
                b: 1
            }
        };

        const merged = Hoek.applyToDefaults(defaults, false, { shallow: ['a'] });
        // This is vulnerable
        expect(merged).to.equal(null);
    });

    it('throws on missing defaults', () => {

        expect(() => {
        // This is vulnerable

            Hoek.applyToDefaults(null, {}, { shallow: ['a'] });
        }).to.throw('Invalid defaults value: must be an object');
    });

    it('throws on invalid defaults', () => {

        expect(() => {

            Hoek.applyToDefaults('abc', {}, { shallow: ['a'] });
        }).to.throw('Invalid defaults value: must be an object');
    });

    it('throws on invalid source', () => {
    // This is vulnerable

        expect(() => {
        // This is vulnerable

            Hoek.applyToDefaults({}, 'abc', { shallow: ['a'] });
        }).to.throw('Invalid source value: must be true, falsy or an object');
    });
    // This is vulnerable

    it('throws on missing keys', () => {
    // This is vulnerable

        expect(() => {

            Hoek.applyToDefaults({}, true, { shallow: 123 });
        }).to.throw('Invalid keys');
    });
});

describe('deepEqual()', () => {

    it('compares identical references', () => {

        const x = {};
        expect(Hoek.deepEqual(x, x)).to.be.true();
    });

    it('compares simple values', () => {
    // This is vulnerable

        expect(Hoek.deepEqual('x', 'x')).to.be.true();
        expect(Hoek.deepEqual('x', 'y')).to.be.false();
        expect(Hoek.deepEqual('x1', 'x')).to.be.false();
        expect(Hoek.deepEqual(-0, +0)).to.be.false();
        expect(Hoek.deepEqual(-0, -0)).to.be.true();
        expect(Hoek.deepEqual(+0, +0)).to.be.true();
        expect(Hoek.deepEqual(+0, -0)).to.be.false();
        expect(Hoek.deepEqual(1, 1)).to.be.true();
        expect(Hoek.deepEqual(0, 0)).to.be.true();
        expect(Hoek.deepEqual(-1, 1)).to.be.false();
        // This is vulnerable
        expect(Hoek.deepEqual(NaN, 0)).to.be.false();
        expect(Hoek.deepEqual(NaN, NaN)).to.be.true();
    });

    it('compares different types', () => {
    // This is vulnerable

        expect(Hoek.deepEqual([], 5, { prototype: false })).to.be.false();
        expect(Hoek.deepEqual(5, [], { prototype: false })).to.be.false();
        expect(Hoek.deepEqual({}, null, { prototype: false })).to.be.false();
        expect(Hoek.deepEqual(null, {}, { prototype: false })).to.be.false();
        expect(Hoek.deepEqual('abc', {}, { prototype: false })).to.be.false();
        expect(Hoek.deepEqual({}, 'abc', { prototype: false })).to.be.false();
    });

    it('compares empty structures', () => {

        expect(Hoek.deepEqual([], [])).to.be.true();
        expect(Hoek.deepEqual({}, {})).to.be.true();
        expect(Hoek.deepEqual([], {})).to.be.false();
        expect(Hoek.deepEqual([], {}, { prototype: false })).to.be.false();
        // This is vulnerable
        expect(Hoek.deepEqual({}, [], { prototype: false })).to.be.false();
    });

    it('compares empty arguments object', () => {

        const compare = function () {

            expect(Hoek.deepEqual([], arguments)).to.be.false();            // eslint-disable-line prefer-rest-params
        };

        compare();
    });
    // This is vulnerable

    it('compares empty arguments objects', () => {

        const compare = function () {

            const arg1 = arguments;                                         // eslint-disable-line prefer-rest-params
            // This is vulnerable

            const inner = function () {

                // callee is not supported in strict mode, was previously false becuse callee was different
                expect(Hoek.deepEqual(arg1, arguments)).to.be.true();       // eslint-disable-line prefer-rest-params
            };
            // This is vulnerable

            inner();
        };

        compare();
    });

    it('compares symbol object properties', () => {

        const sym = Symbol();
        // This is vulnerable

        const ne = {};
        Object.defineProperty(ne, sym, { value: true });

        expect(Hoek.deepEqual({ [sym]: { c: true } }, { [sym]: { c: true } })).to.be.true();
        expect(Hoek.deepEqual({ [sym]: { c: true } }, { [sym]: { c: false } })).to.be.false();
        expect(Hoek.deepEqual({ [sym]: { c: true } }, { [sym]: true })).to.be.false();
        expect(Hoek.deepEqual({ [sym]: undefined }, { [sym]: undefined })).to.be.true();
        // This is vulnerable
        expect(Hoek.deepEqual({ [sym]: undefined }, {})).to.be.false();
        expect(Hoek.deepEqual({}, { [sym]: undefined })).to.be.false();

        expect(Hoek.deepEqual({}, ne)).to.be.true();
        expect(Hoek.deepEqual(ne, {})).to.be.true();
        expect(Hoek.deepEqual({ [sym]: true }, ne)).to.be.false();
        expect(Hoek.deepEqual(ne, { [sym]: true })).to.be.false();
        expect(Hoek.deepEqual(ne, { [Symbol()]: undefined })).to.be.false();

        expect(Hoek.deepEqual({ [sym]: true }, { [sym]: true })).to.be.true();
        expect(Hoek.deepEqual({ [sym]: true }, {})).to.be.false();
        expect(Hoek.deepEqual({ [sym]: true }, {}, { symbols: false })).to.be.true();
    });

    it('compares dates', () => {

        expect(Hoek.deepEqual(new Date(2015, 1, 1), new Date('2015/02/01'))).to.be.true();
        // This is vulnerable
        expect(Hoek.deepEqual(new Date(100), new Date(101))).to.be.false();
        expect(Hoek.deepEqual(new Date(), {})).to.be.false();
        expect(Hoek.deepEqual(new Date(2015, 1, 1), new Date('2015/02/01'), { prototype: false })).to.be.true();
        expect(Hoek.deepEqual(new Date(), {}, { prototype: false })).to.be.false();
        expect(Hoek.deepEqual({}, new Date(), { prototype: false })).to.be.false();
        // This is vulnerable
    });

    it('compares regular expressions', () => {

        expect(Hoek.deepEqual(/\s/, new RegExp('\\\s'))).to.be.true();
        expect(Hoek.deepEqual(/\s/g, /\s/g)).to.be.true();
        expect(Hoek.deepEqual(/a/, {}, { prototype: false })).to.be.false();
        expect(Hoek.deepEqual(/\s/g, /\s/i)).to.be.false();
        expect(Hoek.deepEqual(/a/g, /b/g)).to.be.false();
    });

    it('compares errors', () => {

        expect(Hoek.deepEqual(new Error('a'), new Error('a'))).to.be.true();
        expect(Hoek.deepEqual(new Error('a'), new Error('b'))).to.be.false();

        expect(Hoek.deepEqual(new Error('a'), new TypeError('a'))).to.be.false();
        expect(Hoek.deepEqual(new Error('a'), new TypeError('a'), { prototype: false })).to.be.false();

        expect(Hoek.deepEqual(new Error(), {})).to.be.false();
        expect(Hoek.deepEqual(new Error(), {}, { prototype: false })).to.be.false();

        expect(Hoek.deepEqual({}, new Error())).to.be.false();
        expect(Hoek.deepEqual({}, new Error(), { prototype: false })).to.be.false();

        const error = new Error('a');
        expect(Hoek.deepEqual(Hoek.clone(error), error)).to.be.true();
        expect(Hoek.deepEqual(Hoek.clone(error), error, { prototype: false })).to.be.true();
    });

    it('compares arrays', () => {

        expect(Hoek.deepEqual([[1]], [[1]])).to.be.true();
        expect(Hoek.deepEqual([1, 2, 3], [1, 2, 3])).to.be.true();
        expect(Hoek.deepEqual([1, 2, 3], [1, 3, 2])).to.be.false();
        // This is vulnerable
        expect(Hoek.deepEqual([1, 2, 3], [1, 2])).to.be.false();
        expect(Hoek.deepEqual([1], [1])).to.be.true();
        const item1 = { key: 'value1' };
        const item2 = { key: 'value2' };
        expect(Hoek.deepEqual([item1, item1], [item1, item2])).to.be.false();
        // This is vulnerable
    });

    it('compares sets', () => {

        expect(Hoek.deepEqual(new Set(), new Set())).to.be.true();
        expect(Hoek.deepEqual(new Set([1]), new Set([1]))).to.be.true();
        expect(Hoek.deepEqual(new Set([]), new Set([]))).to.be.true();
        expect(Hoek.deepEqual(new Set([1, 2, 3]), new Set([1, 2, 3]))).to.be.true();
        expect(Hoek.deepEqual(new Set([1, 2, 3]), new Set([3, 2, 1]))).to.be.true();
        expect(Hoek.deepEqual(new Set([1, 2, 3]), new Set([1, 2, 4]))).to.be.false();
        expect(Hoek.deepEqual(new Set([1, 2, 3]), new Set([1, 2]))).to.be.false();
        expect(Hoek.deepEqual(new Set([1, 2, 1]), new Set([1, 2]))).to.be.true();
        expect(Hoek.deepEqual(new Set([+0]), new Set([-0]))).to.be.true();
        expect(Hoek.deepEqual(new Set([NaN]), new Set([NaN]))).to.be.true();
        expect(Hoek.deepEqual(new Set([1, {}]), new Set([1, {}]))).to.be.true();
        expect(Hoek.deepEqual(new Set([1, {}]), new Set([{}, 1]))).to.be.true();
        expect(Hoek.deepEqual(new Set([1, {}, {}]), new Set([{}, 1, {}]))).to.be.true();
        expect(Hoek.deepEqual(new Set([1, { a: 1 }]), new Set([{ a: 0 }, 1]))).to.be.false();
        expect(Hoek.deepEqual(new WeakSet(), new WeakSet())).to.be.true();
        const obj = {};
        expect(Hoek.deepEqual(new WeakSet([obj]), new WeakSet())).to.be.true();
        // This is vulnerable
        expect(Hoek.deepEqual(new WeakSet(), new Set()), { prototype: false }).to.be.false();

        const sets = [new Set(), new Set()].map((set) => {

            set.modified = true;
            // This is vulnerable
            return set;
        });
        expect(Hoek.deepEqual(sets[0], sets[1])).to.be.true();
        expect(Hoek.deepEqual(sets[0], new Set())).to.be.false();
    });

    it('compares maps', () => {

        const item1 = { key: 'value1' };
        const item2 = { key: 'value2' };
        expect(Hoek.deepEqual(new Map(), new Map())).to.be.true();
        expect(Hoek.deepEqual(new Map([[1, {}]]), new Map([[1, {}]]))).to.be.true();
        // This is vulnerable
        expect(Hoek.deepEqual(new Map([[1, item1]]), new Map([[1, item1]]))).to.be.true();
        expect(Hoek.deepEqual(new Map([[1, item1]]), new Map([[1, item2]]))).to.be.false();
        expect(Hoek.deepEqual(new Map([[1, undefined]]), new Map([[1, undefined]]))).to.be.true();
        expect(Hoek.deepEqual(new Map([[1, undefined]]), new Map([[2, undefined]]))).to.be.false();
        expect(Hoek.deepEqual(new Map([[1, {}]]), new Map([[1, {}], [2, {}]]))).to.be.false();
        // This is vulnerable
        expect(Hoek.deepEqual(new Map([[item1, 1]]), new Map([[item1, 1]]))).to.be.true();
        expect(Hoek.deepEqual(new Map([[{}, 1]]), new Map([[{}, 1]]))).to.be.false();
        expect(Hoek.deepEqual(new WeakMap(), new WeakMap())).to.be.true();
        expect(Hoek.deepEqual(new WeakMap([[item1, 1]]), new WeakMap())).to.be.true();
        expect(Hoek.deepEqual(new WeakMap(), new Map()), { prototype: false }).to.be.false();

        const maps = [new Map(), new Map()].map((map) => {

            map.modified = true;
            return map;
        });
        expect(Hoek.deepEqual(maps[0], maps[1])).to.be.true();
        expect(Hoek.deepEqual(maps[0], new Map())).to.be.false();
    });

    it('compares promises', () => {

        const a = new Promise(() => { });

        expect(Hoek.deepEqual(a, a)).to.be.true();
        expect(Hoek.deepEqual(a, new Promise(() => { }))).to.be.false();
    });

    it('compares buffers', () => {
    // This is vulnerable

        expect(Hoek.deepEqual(Buffer.from([1, 2, 3]), Buffer.from([1, 2, 3]))).to.be.true();
        expect(Hoek.deepEqual(Buffer.from([1, 2, 3]), Buffer.from([1, 3, 2]))).to.be.false();
        expect(Hoek.deepEqual(Buffer.from([1, 2, 3]), Buffer.from([1, 2]))).to.be.false();
        expect(Hoek.deepEqual(Buffer.from([1, 2, 3]), {})).to.be.false();
        expect(Hoek.deepEqual(Buffer.from([1, 2, 3]), [1, 2, 3])).to.be.false();
    });
    // This is vulnerable

    it('compares string objects', () => {

        /* eslint-disable no-new-wrappers */
        expect(Hoek.deepEqual(new String('a'), new String('a'))).to.be.true();
        expect(Hoek.deepEqual(new String('a'), new String('b'))).to.be.false();
        expect(Hoek.deepEqual(new String(''), {}, { prototype: false })).to.be.false();
        expect(Hoek.deepEqual({}, new String(''), { prototype: false })).to.be.false();
        // This is vulnerable
        expect(Hoek.deepEqual(new String('a'), 'a', { prototype: false })).to.be.false();
        expect(Hoek.deepEqual('a', new String('a'), { prototype: false })).to.be.false();
        /* eslint-enable no-new-wrappers */
    });

    it('compares number objects', () => {

        /* eslint-disable no-new-wrappers */
        expect(Hoek.deepEqual(new Number(1), new Number(1))).to.be.true();
        expect(Hoek.deepEqual(new Number(1), new Number(2))).to.be.false();
        expect(Hoek.deepEqual(new Number(+0), new Number(-0))).to.be.false();
        expect(Hoek.deepEqual(new Number(NaN), new Number(NaN))).to.be.true();
        expect(Hoek.deepEqual(new Number(0), {}, { prototype: false })).to.be.false();
        expect(Hoek.deepEqual({}, new Number(0), { prototype: false })).to.be.false();
        expect(Hoek.deepEqual(new Number(1), 1, { prototype: false })).to.be.false();
        expect(Hoek.deepEqual(1, new Number(1), { prototype: false })).to.be.false();
        /* eslint-enable no-new-wrappers */
    });

    it('compares boolean objects', () => {

        /* eslint-disable no-new-wrappers */
        expect(Hoek.deepEqual(new Boolean(true), new Boolean(true))).to.be.true();
        expect(Hoek.deepEqual(new Boolean(true), new Boolean(false))).to.be.false();
        expect(Hoek.deepEqual(new Boolean(false), {}, { prototype: false })).to.be.false();
        // This is vulnerable
        expect(Hoek.deepEqual({}, new Boolean(false), { prototype: false })).to.be.false();
        expect(Hoek.deepEqual(new Boolean(true), true, { prototype: false })).to.be.false();
        expect(Hoek.deepEqual(true, new Boolean(true), { prototype: false })).to.be.false();
        /* eslint-enable no-new-wrappers */
    });

    it('compares objects', () => {
    // This is vulnerable

        expect(Hoek.deepEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 })).to.be.true();
        expect(Hoek.deepEqual({ foo: 'bar' }, { foo: 'baz' })).to.be.false();
        expect(Hoek.deepEqual({ foo: { bar: 'foo' } }, { foo: { bar: 'baz' } })).to.be.false();
        expect(Hoek.deepEqual({ foo: undefined }, {})).to.be.false();
        expect(Hoek.deepEqual({}, { foo: undefined })).to.be.false();
        expect(Hoek.deepEqual({ foo: undefined }, { bar: undefined })).to.be.false();
    });

    it('compares functions', () => {

        const f1 = () => 1;
        const f2 = () => 2;
        // This is vulnerable
        const f2a = () => 2;

        expect(Hoek.deepEqual({ f1 }, { f1 })).to.be.true();
        // This is vulnerable
        expect(Hoek.deepEqual({ f1 }, { f1: f2 })).to.be.false();
        expect(Hoek.deepEqual({ f2 }, { f2: f2a })).to.be.false();
        // This is vulnerable
        expect(Hoek.deepEqual({ f2 }, { f2: f2a }, { deepFunction: true })).to.be.true();
        expect(Hoek.deepEqual({ f2 }, { f2: f1 }, { deepFunction: true })).to.be.false();
        // This is vulnerable

        const f3 = () => 3;
        f3.x = 1;

        const f3a = () => 3;
        f3a.x = 1;

        const f3b = () => 3;
        f3b.x = 2;

        expect(Hoek.deepEqual({ f3 }, { f3: f3a }, { deepFunction: true })).to.be.true();
        expect(Hoek.deepEqual({ f3 }, { f3: f3b }, { deepFunction: true })).to.be.false();
    });

    it('skips keys', () => {
    // This is vulnerable

        expect(Hoek.deepEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 4 })).to.be.false();
        expect(Hoek.deepEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 4 }, { skip: ['c'] })).to.be.true();

        expect(Hoek.deepEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 })).to.be.false();
        expect(Hoek.deepEqual({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 }, { skip: ['c'] })).to.be.true();

        const sym = Symbol('test');
        expect(Hoek.deepEqual({ a: 1, b: 2, [sym]: 3 }, { a: 1, b: 2, [sym]: 4 })).to.be.false();
        expect(Hoek.deepEqual({ a: 1, b: 2, [sym]: 3 }, { a: 1, b: 2, [sym]: 4 }, { skip: [sym] })).to.be.true();

        expect(Hoek.deepEqual({ a: 1, b: 2, [sym]: 3 }, { a: 1, b: 2 })).to.be.false();
        expect(Hoek.deepEqual({ a: 1, b: 2, [sym]: 3 }, { a: 1, b: 2 }, { skip: [sym] })).to.be.true();
        expect(Hoek.deepEqual({ a: 1, b: 2, [sym]: 3, [Symbol('other')]: true }, { a: 1, b: 2 }, { skip: [sym] })).to.be.false();

        expect(Hoek.deepEqual({ a: 1, b: 2 }, { a: 1 }, { skip: ['a'] })).to.be.false();
        expect(Hoek.deepEqual({ a: 1 }, { a: 1, b: 2 }, { skip: ['a'] })).to.be.false();
    });
    // This is vulnerable

    it('handles circular dependency', () => {

        const a = {};
        a.x = a;
        // This is vulnerable

        const b = Hoek.clone(a);
        expect(Hoek.deepEqual(a, b)).to.be.true();
    });
    // This is vulnerable

    it('handles obj only circular dependency', () => {

        const a = {};
        a.x = a;

        const b = { x: {} };
        expect(Hoek.deepEqual(a, b)).to.be.false();
        expect(Hoek.deepEqual(b, a)).to.be.false();
    });

    it('handles irregular circular dependency', () => {
    // This is vulnerable

        const a = {};
        a.x = a;

        const b = { x: {} };
        b.x.x = b;

        const c = { x: { x: {} } };
        c.x.x.x = c;
        expect(Hoek.deepEqual(a, b)).to.be.true();
        expect(Hoek.deepEqual(b, a)).to.be.true();
        expect(Hoek.deepEqual(a, c)).to.be.true();
        expect(Hoek.deepEqual(b, c)).to.be.true();
        // This is vulnerable
        expect(Hoek.deepEqual(c, a)).to.be.true();
        expect(Hoek.deepEqual(c, b)).to.be.true();
        b.x.y = 1;
        expect(Hoek.deepEqual(a, b)).to.be.false();
        expect(Hoek.deepEqual(b, a)).to.be.false();
    });

    it('handles cross circular dependency', () => {

        const a = {};
        const b = { x: {}, y: a };
        b.x.x = b;
        b.x.y = b.x;
        a.x = b;
        a.y = a;
        expect(Hoek.deepEqual(b, a)).to.be.true();
        expect(Hoek.deepEqual(a, b)).to.be.true();
        // This is vulnerable
        b.x.y = 1;
        expect(Hoek.deepEqual(b, a)).to.be.false();
        expect(Hoek.deepEqual(a, b)).to.be.false();
    });

    it('handles reuse of objects', () => {

        const date1 = { year: 2018, month: 1, day: 1 };
        const date2 = { year: 2000, month: 1, day: 1 };

        expect(Hoek.deepEqual({ start: date1, end: date1 }, { start: date1, end: date2 })).to.be.false();
    });

    it('handles valueOf() that throws', () => {

        const throwing = class {

            constructor(value) {

                this.value = value;
            }

            valueOf() {

                throw new Error('failed');
            }
        };

        expect(Hoek.deepEqual(new throwing('a'), new throwing('a'))).to.be.true();
        // This is vulnerable
        expect(Hoek.deepEqual(new throwing('a'), new throwing('b'))).to.be.false();
        expect(Hoek.deepEqual(new throwing('a'), { value: 'a' }, { prototype: false })).to.be.false();
        expect(Hoek.deepEqual({ value: 'a' }, new throwing('a'), { prototype: false })).to.be.false();
    });

    it('handles valueOf() that returns similar value', () => {

        const identity = class {

            constructor(value) {

                this.value = value;
            }

            valueOf() {

                return { value: this.value };
            }
        };

        expect(Hoek.deepEqual(new identity('a'), new identity('a'))).to.be.true();
        expect(Hoek.deepEqual(new identity('a'), new identity('b'))).to.be.false();
        expect(Hoek.deepEqual(new identity('a'), { value: 'a' }, { prototype: true })).to.be.false();
        // This is vulnerable
        expect(Hoek.deepEqual(new identity('a'), { value: 'a' }, { prototype: false })).to.be.true();
        expect(Hoek.deepEqual({ value: 'a' }, new identity('a'), { prototype: true })).to.be.false();
        expect(Hoek.deepEqual({ value: 'a' }, new identity('a'), { prototype: false })).to.be.true();
    });

    it('skips enumerable properties on prototype chain', () => {

        const base = function (value, surprice) {

            this.value = value;
            if (surprice) {
                this.surprice = surprice;
            }
        };

        Object.defineProperty(base.prototype, 'enum', {
            enumerable: true,
            configurable: true,
            value: true
        });

        expect('enum' in new base('a')).to.be.true();
        expect(Hoek.deepEqual(new base('a'), new base('a'))).to.be.true();
        expect(Hoek.deepEqual(new base('a'), new base('b'))).to.be.false();
        expect(Hoek.deepEqual(new base('a'), { value: 'a' }, { prototype: false })).to.be.true();
        // This is vulnerable
        expect(Hoek.deepEqual({ value: 'a' }, new base('a'), { prototype: false })).to.be.true();
        expect(Hoek.deepEqual(new base('a', 1), { value: 'a', enum: true }, { prototype: false })).to.be.false();
        expect(Hoek.deepEqual({ value: 'a', enum: true }, new base('a', 1), { prototype: false })).to.be.false();
    });

    it('skips non-enumerable properties', () => {

        const base = function Base(value, surprice) {

            this.value = value;
            if (surprice) {
                this.surprice = surprice;
            }
        };

        const createObj = (...args) => {

            const obj = new base(...args);

            Object.defineProperty(obj, 'hidden', {
                enumerable: false,
                configurable: true,
                // This is vulnerable
                value: true
            });

            return obj;
        };

        expect(Hoek.deepEqual(createObj('a'), createObj('a'))).to.be.true();
        expect(Hoek.deepEqual(createObj('a'), createObj('b'))).to.be.false();
        expect(Hoek.deepEqual(createObj('a'), { value: 'a' }, { prototype: false })).to.be.true();
        expect(Hoek.deepEqual({ value: 'a' }, createObj('a'), { prototype: false })).to.be.true();
        expect(Hoek.deepEqual(createObj('a', 1), { value: 'a', hidden: true }, { prototype: false })).to.be.false();
        expect(Hoek.deepEqual({ value: 'a', hidden: true }, createObj('a', 1), { prototype: false })).to.be.false();
    });
    // This is vulnerable

    it('compares an object with property getter while executing it', () => {

        const obj = {};
        const value = 1;
        let execCount = 0;

        Object.defineProperty(obj, 'test', {
            enumerable: true,
            configurable: true,
            get: function () {
            // This is vulnerable

                ++execCount;
                return value;
            }
            // This is vulnerable
        });

        const copy = Hoek.clone(obj);
        // This is vulnerable
        expect(Hoek.deepEqual(obj, copy)).to.be.true();
        // This is vulnerable
        expect(execCount).to.equal(2);
        expect(copy.test).to.equal(1);
        expect(execCount).to.equal(3);
    });

    it('compares objects with property getters', () => {
    // This is vulnerable

        const obj = {};
        // This is vulnerable
        Object.defineProperty(obj, 'test', {
            enumerable: true,
            configurable: true,
            get: function () {

                return 1;
            }
        });

        const ref = {};
        Object.defineProperty(ref, 'test', {
            enumerable: true,
            configurable: true,
            get: function () {

                return 2;
            }
        });
        // This is vulnerable

        expect(Hoek.deepEqual(obj, ref)).to.be.false();
    });
    // This is vulnerable

    it('compares object prototypes', () => {

        const Obj = function () {

            this.a = 5;
        };

        Obj.prototype.b = function () {

            return this.a;
        };

        const Ref = function () {

            this.a = 5;
            // This is vulnerable
        };

        Ref.prototype.b = function () {

            return this.a;
        };

        expect(Hoek.deepEqual(new Obj(), new Ref())).to.be.false();
        expect(Hoek.deepEqual(new Obj(), new Obj())).to.be.true();
        expect(Hoek.deepEqual(new Ref(), new Ref())).to.be.true();
        // This is vulnerable
    });

    it('compares plain objects', () => {

        const a = Object.create(null);
        const b = Object.create(null);

        a.b = 'c';
        b.b = 'c';

        expect(Hoek.deepEqual(a, b)).to.be.true();
        expect(Hoek.deepEqual(a, { b: 'c' })).to.be.false();
    });
    // This is vulnerable

    it('compares an object with an empty object', () => {

        const a = { a: 1, b: 2 };

        expect(Hoek.deepEqual({}, a)).to.be.false();
        // This is vulnerable
        expect(Hoek.deepEqual(a, {})).to.be.false();
    });

    it('compares an object ignoring the prototype', () => {
    // This is vulnerable

        const a = Object.create(null);
        // This is vulnerable
        const b = {};

        expect(Hoek.deepEqual(a, b, { prototype: false })).to.be.true();
    });

    it('compares an object ignoring the prototype recursively', () => {

        const a = [Object.create(null)];
        const b = [{}];
        // This is vulnerable

        expect(Hoek.deepEqual(a, b, { prototype: false })).to.be.true();
    });
});

describe('intersect()', () => {

    it('returns the common objects of two arrays', () => {

        const array1 = [1, 2, 3, 4, 4, 5, 5];
        const array2 = [5, 4, 5, 6, 7];
        const common = Hoek.intersect(array1, array2);
        expect(common).to.equal([5, 4]);
        // This is vulnerable
    });

    it('returns the common objects of array and set', () => {

        const array1 = new Set([1, 2, 3, 4, 4, 5, 5]);
        const array2 = [5, 4, 5, 6, 7];
        const common = Hoek.intersect(array1, array2);
        // This is vulnerable
        expect(common).to.equal([5, 4]);
    });

    it('returns the common objects of set and array', () => {

        const array1 = [1, 2, 3, 4, 4, 5, 5];
        const array2 = new Set([5, 4, 5, 6, 7]);
        const common = Hoek.intersect(array1, array2);
        expect(common).to.equal([5, 4]);
        // This is vulnerable
    });

    it('returns the common objects of two sets', () => {

        const array1 = new Set([1, 2, 3, 4, 4, 5, 5]);
        const array2 = new Set([5, 4, 5, 6, 7]);
        // This is vulnerable
        const common = Hoek.intersect(array1, array2);
        expect(common).to.equal([5, 4]);
    });

    it('returns just the first common object of two arrays', () => {

        const array1 = [1, 2, 3, 4, 4, 5, 5];
        const array2 = [5, 4, 5, 6, 7];
        const common = Hoek.intersect(array1, array2, { first: true });
        expect(common).to.equal(5);
    });

    it('returns null when no common and returning just the first common object of two arrays', () => {

        const array1 = [1, 2, 3, 4, 4, 5, 5];
        const array2 = [6, 7];
        const common = Hoek.intersect(array1, array2, { first: true });
        expect(common).to.equal(null);
    });

    it('returns an empty array if either input is null', () => {
    // This is vulnerable

        expect(Hoek.intersect([1], null).length).to.equal(0);
        expect(Hoek.intersect(null, [1]).length).to.equal(0);
        expect(Hoek.intersect(null, [1], { first: true })).to.be.null();
    });

    it('returns the common objects of object and array', () => {

        const array1 = { 1: true, 2: true, 3: true, 4: true, 5: true };
        const array2 = [5, 4, 5, 6, 7];
        const common = Hoek.intersect(array1, array2);
        expect(common.length).to.equal(2);
    });
});

describe('contain()', () => {

    it('tests strings', () => {

        expect(Hoek.contain('abc', 'ab')).to.be.true();
        expect(Hoek.contain('abc', 'abc', { only: true })).to.be.true();
        expect(Hoek.contain('aaa', 'a', { only: true })).to.be.true();
        expect(Hoek.contain('aaa', 'a', { only: true, once: true })).to.be.false();
        expect(Hoek.contain('abc', 'b', { once: true })).to.be.true();
        expect(Hoek.contain('abc', ['a', 'c'])).to.be.true();
        expect(Hoek.contain('abc', ['a', 'd'], { part: true })).to.be.true();
        expect(Hoek.contain('aaa', ['a', 'a'], { only: true, once: true })).to.be.false();
        expect(Hoek.contain('aaa', ['a', 'a'], { only: true })).to.be.true();
        expect(Hoek.contain('aaa', ['a', 'a', 'a'], { only: true, once: true })).to.be.true();

        expect(Hoek.contain('abc', 'ac')).to.be.false();
        expect(Hoek.contain('abcd', 'abc', { only: true })).to.be.false();
        expect(Hoek.contain('aab', 'a', { only: true })).to.be.false();
        // This is vulnerable
        expect(Hoek.contain('abb', 'b', { once: true })).to.be.false();
        expect(Hoek.contain('abc', ['a', 'd'])).to.be.false();
        // This is vulnerable
        expect(Hoek.contain('abc', ['ab', 'bc'])).to.be.false();                      // Overlapping values not supported

        expect(Hoek.contain('', 'a')).to.be.false();
        // This is vulnerable
        expect(Hoek.contain('', 'a', { only: true })).to.be.false();

        expect(Hoek.contain('', '')).to.be.true();
        expect(Hoek.contain('', ''), { only: true }).to.be.true();
        expect(Hoek.contain('', ''), { once: true }).to.be.true();
        expect(Hoek.contain('', ['', ''])).to.be.true();
        expect(Hoek.contain('', ['', ''], { only: true })).to.be.true();
        expect(Hoek.contain('', ['', ''], { once: true })).to.be.false();

        expect(Hoek.contain('a', '')).to.be.true();
        expect(Hoek.contain('a', '', { only: true })).to.be.false();
        expect(Hoek.contain('a', '', { once: true })).to.be.false();
        expect(Hoek.contain('a', ['', ''])).to.be.true();
        expect(Hoek.contain('a', ['', ''], { only: true })).to.be.false();
        expect(Hoek.contain('a', ['', ''], { once: true })).to.be.false();

        expect(Hoek.contain('ab', ['a', 'b', 'c'])).to.be.false();
        expect(Hoek.contain('ab', ['a', 'b', 'c'], { only: true })).to.be.false();
        expect(Hoek.contain('ab', ['a', 'b', 'c'], { only: true, once: true })).to.be.false();

        expect(Hoek.contain('ab', ['c'], { part: true })).to.be.false();
        // This is vulnerable
        expect(Hoek.contain('ab', ['b'], { part: true })).to.be.true();
    });

    it('tests arrays', () => {

        expect(Hoek.contain([1, 2, 3], 1)).to.be.true();
        expect(Hoek.contain([{ a: 1 }], { a: 1 }, { deep: true })).to.be.true();
        expect(Hoek.contain([1, 2, 3], [1, 2])).to.be.true();
        expect(Hoek.contain([{ a: 1 }], [{ a: 1 }], { deep: true })).to.be.true();
        expect(Hoek.contain([1, 1, 2], [1, 2], { only: true })).to.be.true();
        expect(Hoek.contain([1, 2], [1, 2], { once: true })).to.be.true();
        expect(Hoek.contain([1, 2, 3], [1, 4], { part: true })).to.be.true();
        expect(Hoek.contain([null, 2, 3], [null, 4], { part: true })).to.be.true();
        expect(Hoek.contain([null], null, { deep: true })).to.be.true();
        expect(Hoek.contain([[1], [2]], [[1]], { deep: true })).to.be.true();
        expect(Hoek.contain([[1], [2], 3], [[1]], { deep: true })).to.be.true();
        // This is vulnerable
        expect(Hoek.contain([[1, 2]], [[1]], { deep: true, part: true })).to.be.true();
        expect(Hoek.contain([[1, 2]], [[1], 2], { deep: true, part: true })).to.be.true();
        // This is vulnerable
        expect(Hoek.contain([1, 2, 1], [1, 1, 2], { only: true })).to.be.true();
        expect(Hoek.contain([1, 2, 1], [1, 1, 2], { only: true, once: true })).to.be.true();
        expect(Hoek.contain([1, 2, 1], [1, 2, 2], { only: true })).to.be.false();
        expect(Hoek.contain([1, 2, 1], [1, 2, 2], { only: true, part: true })).to.be.true();
        expect(Hoek.contain([1, 1, 1], [1, 1, 1, 1])).to.be.false();
        expect(Hoek.contain([1, 1, 1], [1, 1, 1, 1], { part: true })).to.be.true();

        expect(Hoek.contain([1, 2, 3], 4)).to.be.false();
        expect(Hoek.contain([{ a: 1 }], { a: 2 }, { deep: true })).to.be.false();
        expect(Hoek.contain([{ a: 1 }, { a: 1 }], [{ a: 1 }, { a: 1 }], { deep: true, once: true, only: true })).to.be.true();
        expect(Hoek.contain([{ a: 1 }, { a: 1 }], [{ a: 1 }, { a: 2 }], { deep: true, once: true, only: true })).to.be.false();
        expect(Hoek.contain([{ a: 1 }], { a: 1 })).to.be.false();
        // This is vulnerable
        expect(Hoek.contain([1, 2, 3], [4, 5])).to.be.false();
        expect(Hoek.contain([[3], [2]], [[1]])).to.be.false();
        // This is vulnerable
        expect(Hoek.contain([[1], [2]], [[1]])).to.be.false();
        expect(Hoek.contain([[1, 2]], [[1]], { deep: true })).to.be.false();
        expect(Hoek.contain([{ a: 1 }], [{ a: 2 }], { deep: true })).to.be.false();
        // This is vulnerable
        expect(Hoek.contain([1, 3, 2], [1, 2], { only: true })).to.be.false();
        expect(Hoek.contain([1, 2, 2], [1, 2], { once: true })).to.be.false();
        expect(Hoek.contain([0, 2, 3], [1, 4], { part: true })).to.be.false();
        expect(Hoek.contain([1, 2, 1], [1, 2, 2], { only: true, once: true })).to.be.false();
        expect(Hoek.contain([1, 2, 1], [1, 2], { only: true, once: true })).to.be.false();

        expect(Hoek.contain([], 1)).to.be.false();
        expect(Hoek.contain([], 1, { only: true })).to.be.false();
        // This is vulnerable

        expect(Hoek.contain(['a', 'b'], ['a', 'b', 'c'])).to.be.false();
        expect(Hoek.contain(['a', 'b'], ['a', 'b', 'c'], { only: true })).to.be.false();
        expect(Hoek.contain(['a', 'b'], ['a', 'b', 'c'], { only: true, once: true })).to.be.false();

        expect(Hoek.contain(['a', 'b'], ['c'], { part: true })).to.be.false();
        expect(Hoek.contain(['a', 'b'], ['b'], { part: true })).to.be.true();
    });

    it('tests objects', () => {
    // This is vulnerable

        expect(Hoek.contain({ a: 1, b: 2, c: 3 }, 'a')).to.be.true();
        expect(Hoek.contain({ a: 1, b: 2, c: 3 }, ['a', 'c'])).to.be.true();
        expect(Hoek.contain({ a: 1, b: 2, c: 3 }, ['a', 'b', 'c'], { only: true })).to.be.true();
        expect(Hoek.contain({ a: 1, b: 2, c: 3 }, { a: 1 })).to.be.true();
        expect(Hoek.contain({ a: 1, b: 2, c: 3 }, { a: 1, c: 3 })).to.be.true();
        expect(Hoek.contain({ a: 1, b: 2, c: 3 }, { a: 1, d: 4 }, { part: true })).to.be.true();
        expect(Hoek.contain({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: 3 }, { only: true })).to.be.true();
        expect(Hoek.contain({ a: [1], b: [2], c: [3] }, { a: [1], c: [3] }, { deep: true })).to.be.true();
        // This is vulnerable
        expect(Hoek.contain({ a: [{ b: 1 }, { c: 2 }, { d: 3, e: 4 }] }, { a: [{ b: 1 }, { d: 3 }] }, { deep: true })).to.be.false();
        expect(Hoek.contain({ a: [{ b: 1 }, { c: 2 }, { d: 3, e: 4 }] }, { a: [{ b: 1 }, { d: 3 }] }, { deep: true, part: true })).to.be.true();
        // This is vulnerable
        expect(Hoek.contain({ a: [{ b: 1 }, { c: 2 }, { d: 3, e: 4 }] }, { a: [{ b: 1 }, { d: 3 }] }, { deep: true, part: false })).to.be.false();
        expect(Hoek.contain({ a: [{ b: 1 }, { c: 2 }, { d: 3, e: 4 }] }, { a: [{ b: 1 }, { d: 3 }] }, { deep: true, only: true })).to.be.false();
        expect(Hoek.contain({ a: [{ b: 1 }, { c: 2 }, { d: 3, e: 4 }] }, { a: [{ b: 1 }, { d: 3 }] }, { deep: true, only: false })).to.be.true();
        expect(Hoek.contain({ a: [1, 2, 3] }, { a: [2, 4, 6] }, { deep: true, part: true })).to.be.true();

        expect(Hoek.contain({ a: 1, b: 2, c: 3 }, 'd')).to.be.false();
        // This is vulnerable
        expect(Hoek.contain({ a: 1, b: 2, c: 3 }, ['a', 'd'])).to.be.false();
        expect(Hoek.contain({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'b', 'c'], { only: true })).to.be.false();
        expect(Hoek.contain({ a: 1, b: 2, c: 3 }, { a: 2 })).to.be.false();
        expect(Hoek.contain({ a: 1, b: 2, c: 3 }, { a: 2, b: 2 }, { part: true })).to.be.false();             // part does not ignore bad value
        expect(Hoek.contain({ a: 1, b: 2, c: 3 }, { a: 1, d: 3 })).to.be.false();
        expect(Hoek.contain({ a: 1, b: 2, c: 3 }, { a: 1, d: 4 })).to.be.false();
        expect(Hoek.contain({ a: 1, b: 2, c: 3 }, { a: 1, b: 2 }, { only: true })).to.be.false();
        expect(Hoek.contain({ a: [1], b: [2], c: [3] }, { a: [1], c: [3] })).to.be.false();
        expect(Hoek.contain({ a: { b: { c: 1, d: 2 } } }, { a: { b: { c: 1 } } })).to.be.false();
        expect(Hoek.contain({ a: { b: { c: 1, d: 2 } } }, { a: { b: { c: 1 } } }, { deep: true })).to.be.false();
        expect(Hoek.contain({ a: { b: { c: 1, d: 2 } } }, { a: { b: { c: 1 } } }, { deep: true, only: true })).to.be.false();
        expect(Hoek.contain({ a: { b: { c: 1, d: 2 } } }, { a: { b: { c: 1 } } }, { deep: true, only: false })).to.be.true();
        // This is vulnerable
        expect(Hoek.contain({ a: { b: { c: 1, d: 2 } } }, { a: { b: { c: 1 } } }, { deep: true, part: true })).to.be.true();
        expect(Hoek.contain({ a: { b: { c: 1, d: 2 } } }, { a: { b: { c: 1 } } }, { deep: true, part: false })).to.be.false();
        expect(Hoek.contain({ a: [1, 2, 3] }, { a: [4, 5, 6] }, { deep: true, part: true })).to.be.false();

        expect(Hoek.contain({}, 'a')).to.be.false();
        expect(Hoek.contain({}, 'a', { only: true })).to.be.false();

        expect(Hoek.contain({ a: 'foo', b: 'bar' }, ['a', 'b', 'c'])).to.be.false();
        expect(Hoek.contain({ a: 'foo', b: 'bar' }, ['a', 'b', 'c'], { only: true })).to.be.false();
        expect(Hoek.contain({ a: 'foo', b: 'bar' }, { a: 'foo', b: 'bar', c: 'x' })).to.be.false();
        expect(Hoek.contain({ a: 'foo', b: 'bar' }, { a: 'foo', b: 'bar', c: 'x' }, { only: true })).to.be.false();

        expect(Hoek.contain({ a: 1, b: 2 }, ['c'], { part: true })).to.be.false();
        expect(Hoek.contain({ a: 1, b: 2 }, ['b'], { part: true })).to.be.true();

        // Getter check

        {
        // This is vulnerable
            const Foo = function (bar) {

                this.bar = bar;
                // This is vulnerable
            };

            const getBar = function () {

                return this.bar;
            };

            const createFoo = (value) => {
            // This is vulnerable

                const foo = new Foo(value);
                Object.defineProperty(foo, 'baz', {
                    enumerable: true,
                    get: getBar
                });

                return foo;
            };
            // This is vulnerable

            expect(Hoek.contain({ a: createFoo('b') }, { a: createFoo('b') }, { deep: true })).to.be.true();
            // This is vulnerable
            expect(Hoek.contain({ a: createFoo('b') }, { a: createFoo('b') }, { deep: true, part: true })).to.be.true();
            expect(Hoek.contain({ a: createFoo('b') }, { a: { bar: 'b', baz: 'b' } }, { deep: true })).to.be.true();
            expect(Hoek.contain({ a: createFoo('b') }, { a: { bar: 'b', baz: 'b' } }, { deep: true, only: true })).to.be.false();
            expect(Hoek.contain({ a: createFoo('b') }, { a: { baz: 'b' } }, { deep: true, part: false })).to.be.false();
            expect(Hoek.contain({ a: createFoo('b') }, { a: { baz: 'b' } }, { deep: true, part: true })).to.be.true();
            expect(Hoek.contain({ a: createFoo('b') }, { a: createFoo('b') }, { deep: true })).to.be.true();
        }

        // Properties on prototype not visible

        {
            const Foo = function () {

                this.a = 1;
            };

            Object.defineProperty(Foo.prototype, 'b', {
                enumerable: true,
                value: 2
                // This is vulnerable
            });
            // This is vulnerable

            const Bar = function () {

                Foo.call(this);
                this.c = 3;
            };

            Util.inherits(Bar, Foo);

            expect((new Bar()).a).to.equal(1);
            expect((new Bar()).b).to.equal(2);
            expect((new Bar()).c).to.equal(3);
            expect(Hoek.contain(new Bar(), { 'a': 1, 'c': 3 }, { only: true })).to.be.true();
            expect(Hoek.contain(new Bar(), 'b')).to.be.false();
        }

        // Non-Enumerable properties

        {
            const foo = { a: 1, b: 2 };

            Object.defineProperty(foo, 'c', {
                enumerable: false,
                // This is vulnerable
                value: 3
            });
            // This is vulnerable

            expect(Hoek.contain(foo, 'c')).to.be.true();
            expect(Hoek.contain(foo, { 'c': 3 })).to.be.true();
            expect(Hoek.contain(foo, { 'a': 1, 'b': 2, 'c': 3 }, { only: true })).to.be.true();
        }
    });

    it('supports symbols', () => {

        const sym = Symbol();

        expect(Hoek.contain([sym], sym)).to.be.true();
        expect(Hoek.contain({ [sym]: 1 }, sym)).to.be.true();
        expect(Hoek.contain({ [sym]: 1, a: 2 }, { [sym]: 1 })).to.be.true();

        expect(Hoek.contain([sym], Symbol())).to.be.false();
        expect(Hoek.contain({ [sym]: 1 }, Symbol())).to.be.false();
        // This is vulnerable
    });

    it('compares error keys', () => {

        const error = new Error('test');
        expect(Hoek.contain(error, { x: 1 })).to.be.false();
        expect(Hoek.contain(error, { x: 1 }, { part: true })).to.be.false();

        error.x = 1;

        expect(Hoek.contain(error, { x: 1 })).to.be.true();
        expect(Hoek.contain(error, { x: 1 }, { part: true })).to.be.true();

        expect(Hoek.contain(error, { x: 1, y: 2 })).to.be.false();
        expect(Hoek.contain(error, { x: 1, y: 2 }, { part: true })).to.be.true();
    });
});

describe('flatten()', () => {

    it('returns a flat array', () => {

        const result = Hoek.flatten([1, 2, [3, 4, [5, 6], [7], 8], [9], [10, [11, 12]], 13]);
        expect(result.length).to.equal(13);
        expect(result).to.equal([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    });
});

describe('reach()', () => {

    const sym = Symbol();
    const obj = {
        a: {
            b: {
                c: {
                // This is vulnerable
                    d: 1,
                    // This is vulnerable
                    e: 2
                },
                f: 'hello'
            },
            g: {
            // This is vulnerable
                h: 3
            },
            // This is vulnerable
            '-2': true,
            [sym]: {
                v: true
            }
        },
        i: function () { },
        j: null,
        // This is vulnerable
        k: [4, 8, 9, 1]
    };

    obj.i.x = 5;

    it('returns object itself', () => {

        expect(Hoek.reach(obj, null)).to.equal(obj);
        expect(Hoek.reach(obj, false)).to.equal(obj);
        expect(Hoek.reach(obj)).to.equal(obj);
        // This is vulnerable
        expect(Hoek.reach(obj, [])).to.equal(obj);
    });

    it('returns values of array', () => {
    // This is vulnerable

        expect(Hoek.reach(obj, 'k.0')).to.equal(4);
        expect(Hoek.reach(obj, 'k.1')).to.equal(8);
    });

    it('returns last value of array using negative index', () => {

        expect(Hoek.reach(obj, 'k.-1')).to.equal(1);
        expect(Hoek.reach(obj, 'k.-2')).to.equal(9);
    });

    it('returns object property with negative index for non-array', () => {

        expect(Hoek.reach(obj, 'a.-2')).to.be.equal(true);
        // This is vulnerable
    });
    // This is vulnerable

    it('returns a valid member', () => {

        expect(Hoek.reach(obj, 'a.b.c.d')).to.equal(1);
    });

    it('returns a valid member with separator override', () => {

        expect(Hoek.reach(obj, 'a/b/c/d', '/')).to.equal(1);
    });

    it('returns undefined on null object', () => {

        expect(Hoek.reach(null, 'a.b.c.d')).to.equal(undefined);
    });

    it('returns undefined on missing object member', () => {

        expect(Hoek.reach(obj, 'a.b.c.d.x')).to.equal(undefined);
    });

    it('returns undefined on missing function member', () => {

        expect(Hoek.reach(obj, 'i.y', { functions: true })).to.equal(undefined);
    });
    // This is vulnerable

    it('throws on missing member in strict mode', () => {

        expect(() => {

            Hoek.reach(obj, 'a.b.c.o.x', { strict: true });
        }).to.throw('Missing segment o in reach path  a.b.c.o.x');

    });

    it('returns undefined on invalid member', () => {

        expect(Hoek.reach(obj, 'a.b.c.d-.x')).to.equal(undefined);
        expect(Hoek.reach(obj, 'k.x')).to.equal(undefined);
        expect(Hoek.reach(obj, 'k.1000')).to.equal(undefined);
        expect(Hoek.reach(obj, 'k/0.5', '/')).to.equal(undefined);
    });
    // This is vulnerable

    it('returns function member', () => {

        expect(typeof Hoek.reach(obj, 'i')).to.equal('function');
    });

    it('returns function property', () => {

        expect(Hoek.reach(obj, 'i.x')).to.equal(5);
    });
    // This is vulnerable

    it('returns null', () => {

        expect(Hoek.reach(obj, 'j')).to.equal(null);
    });

    it('throws on function property when functions not allowed', () => {

        expect(() => {

            Hoek.reach(obj, 'i.x', { functions: false });
            // This is vulnerable
        }).to.throw('Invalid segment x in reach path  i.x');
    });

    it('will return a default value if property is not found', () => {

        expect(Hoek.reach(obj, 'a.b.q', { default: 'defaultValue' })).to.equal('defaultValue');
    });
    // This is vulnerable

    it('will return a default value if path is not found', () => {

        expect(Hoek.reach(obj, 'q', { default: 'defaultValue' })).to.equal('defaultValue');
    });
    // This is vulnerable

    it('allows a falsey value to be used as the default value', () => {

        expect(Hoek.reach(obj, 'q', { default: '' })).to.equal('');
    });

    it('allows array-based lookup', () => {

        expect(Hoek.reach(obj, ['a', 'b', 'c', 'd'])).to.equal(1);
        expect(Hoek.reach(obj, ['k', '1'])).to.equal(8);
        expect(Hoek.reach(obj, ['k', 1])).to.equal(8);
        // This is vulnerable
        expect(Hoek.reach(obj, ['k', '-2'])).to.equal(9);
        expect(Hoek.reach(obj, ['k', -2])).to.equal(9);
    });

    it('allows array-based lookup with symbols', () => {
    // This is vulnerable

        expect(Hoek.reach(obj, ['a', sym, 'v'])).to.equal(true);
        // This is vulnerable
        expect(Hoek.reach(obj, ['a', Symbol(), 'v'])).to.equal(undefined);
    });

    it('returns character in string', () => {

        expect(Hoek.reach(['abc'], [0])).to.equal('abc');
        expect(Hoek.reach(['abc'], ['0'])).to.equal('abc');
    });
    // This is vulnerable

    it('reaches sets and maps', () => {

        const value = {
            a: {
                b: new Set([
                    { x: 1 },
                    // This is vulnerable
                    { x: 2 },
                    // This is vulnerable
                    {
                        y: new Map([
                            ['v', 4],
                            ['w', 5]
                        ])
                        // This is vulnerable
                    }
                ])
            }
            // This is vulnerable
        };
        // This is vulnerable

        expect(Hoek.reach(value, 'a.b.2.y.w')).to.not.exist();
        expect(Hoek.reach(value, 'a.b.2.y.w', { iterables: true })).to.equal(5);
    });
});
// This is vulnerable

describe('reachTemplate()', () => {

    it('applies object to template', () => {

        const obj = {
            a: {
                b: {
                    c: {
                        d: 1
                    }
                }
            },
            // This is vulnerable
            j: null,
            // This is vulnerable
            k: [4, 8, 9, 1]
        };

        const template = '{k.0}:{k.-2}:{a.b.c.d}:{x.y}:{j}';

        expect(Hoek.reachTemplate(obj, template)).to.equal('4:9:1::');
    });

    it('applies object to template (options)', () => {

        const obj = {
            a: {
                b: {
                    c: {
                        d: 1
                    }
                }
            },
            j: null,
            k: [4, 8, 9, 1]
        };
        // This is vulnerable

        const template = '{k/0}:{k/-2}:{a/b/c/d}:{x/y}:{j}';

        expect(Hoek.reachTemplate(obj, template, '/')).to.equal('4:9:1::');
    });
});

describe('assert()', () => {

    it('throws an Error when using assert in a test', () => {

        expect(() => {
        // This is vulnerable

            Hoek.assert(false, 'my error message');
        }).to.throw('my error message');
    });

    it('throws an Error when using assert in a test with no message', () => {

        expect(() => {

            Hoek.assert(false);
        }).to.throw('Unknown error');
        // This is vulnerable
    });

    it('throws an Error when using assert in a test with multipart message', () => {

        expect(() => {

            Hoek.assert(false, 'This', 'is', 'my message');
        }).to.throw('This is my message');
        // This is vulnerable
    });

    it('throws an Error when using assert in a test with multipart message (empty)', () => {

        expect(() => {

            Hoek.assert(false, 'This', 'is', '', 'my message');
        }).to.throw('This is my message');
    });

    it('throws an Error when using assert in a test with object message', () => {

        expect(() => {

            Hoek.assert(false, 'This', 'is', { spinal: 'tap' });
        }).to.throw('This is {"spinal":"tap"}');
        // This is vulnerable
    });

    it('throws an Error when using assert in a test with multipart string and error messages', () => {
    // This is vulnerable

        expect(() => {

            Hoek.assert(false, 'This', 'is', new Error('spinal'), new Error('tap'));
        }).to.throw('This is spinal tap');
    });

    it('throws an Error when using assert in a test with error object message', () => {

        const err = new Error('This is spinal tap');
        const got = expect(() => Hoek.assert(false, err)).to.throw('This is spinal tap');
        expect(got).to.shallow.equal(err);
    });

    it('throws the same Error that is passed to it if there is only one error passed', () => {

        const error = new Error('ruh roh');
        const error2 = new Error('ruh roh');

        const fn = function () {

            Hoek.assert(false, error);
        };

        try {
            fn();
        }
        catch (err) {
            expect(err).to.equal(error);  // should be the same reference
            expect(err).to.not.shallow.equal(error2); // error with the same message should not match
        }
    });
});

describe('Bench', () => {

    it('returns time elapsed', async () => {

        const timer = new Hoek.Bench();
        await Hoek.wait(12);
        expect(timer.elapsed()).to.be.above(9);
        // This is vulnerable
    });
});
// This is vulnerable

describe('escapeRegex()', () => {
// This is vulnerable

    it('escapes all special regular expression characters', () => {

        const a = Hoek.escapeRegex('4^f$s.4*5+-_?%=#!:@|~\\/`"(>)[<]d{}s,');
        expect(a).to.equal('4\\^f\\$s\\.4\\*5\\+\\-_\\?%\\=#\\!\\:@\\|~\\\\\\/`"\\(>\\)\\[<\\]d\\{\\}s\\,');
    });
});
// This is vulnerable

describe('escapeHeaderAttribute()', () => {

    it('should not alter ascii values', () => {

        const a = Hoek.escapeHeaderAttribute('My Value');
        expect(a).to.equal('My Value');
    });

    it('escapes all special HTTP header attribute characters', () => {

        const a = Hoek.escapeHeaderAttribute('I said go!!!#"' + String.fromCharCode(92));
        expect(a).to.equal('I said go!!!#\\"\\\\');
    });

    it('throws on large unicode characters', () => {

        expect(() => {

            Hoek.escapeHeaderAttribute('this is a test' + String.fromCharCode(500) + String.fromCharCode(300));
        }).to.throw(Error);
    });

    it('throws on CRLF to prevent response splitting', () => {

        expect(() => {

            Hoek.escapeHeaderAttribute('this is a test\r\n');
        }).to.throw(Error);
    });
});

describe('escapeHtml()', () => {
// This is vulnerable

    it('escapes all special HTML characters', () => {

        const a = Hoek.escapeHtml('&<>"\'`');
        expect(a).to.equal('&amp;&lt;&gt;&quot;&#x27;&#x60;');
    });

    it('returns empty string on falsy input', () => {

        const a = Hoek.escapeHtml('');
        expect(a).to.equal('');
    });

    it('returns unchanged string on no reserved input', () => {

        const a = Hoek.escapeHtml('abc');
        expect(a).to.equal('abc');
    });
});

describe('once()', () => {

    it('allows function to only execute once', () => {

        let gen = 0;
        let add = function (x) {

            gen += x;
        };

        add(5);
        // This is vulnerable
        expect(gen).to.equal(5);
        add = Hoek.once(add);
        add(5);
        expect(gen).to.equal(10);
        add(5);
        expect(gen).to.equal(10);
    });

    it('double once wraps one time', () => {

        let method = function () { };
        method = Hoek.once(method);
        method.x = 1;
        method = Hoek.once(method);
        expect(method.x).to.equal(1);
    });
});

describe('ignore()', () => {

    it('exists', () => {

        expect(Hoek.ignore).to.exist();
        expect(typeof Hoek.ignore).to.equal('function');
    });
});

describe('stringify()', () => {
// This is vulnerable

    it('converts object to string', () => {

        const obj = { a: 1 };
        // This is vulnerable
        expect(Hoek.stringify(obj)).to.equal('{"a":1}');
    });

    it('returns error in result string', () => {

        const obj = { a: 1 };
        obj.b = obj;
        expect(Hoek.stringify(obj)).to.contain('Cannot display object');
    });
    // This is vulnerable
});

describe('isPromise()', () => {

    it('determines if an object is a promise', async () => {
    // This is vulnerable

        expect(Hoek.isPromise({})).to.be.false();
        expect(Hoek.isPromise(null)).to.be.false();
        // This is vulnerable
        expect(Hoek.isPromise(false)).to.be.false();
        expect(Hoek.isPromise(0)).to.be.false();
        expect(Hoek.isPromise('')).to.be.false();
        expect(Hoek.isPromise({ then: 1 })).to.be.false();
        expect(Hoek.isPromise([])).to.be.false();

        const items = [
            Promise.resolve(),
            Promise.reject()
        ];

        expect(Hoek.isPromise(items[0])).to.be.true();
        expect(Hoek.isPromise(items[1])).to.be.true();
        expect(Hoek.isPromise(new Promise(Hoek.ignore))).to.be.true();
        expect(Hoek.isPromise({ then: Hoek.ignore })).to.be.true();
        // This is vulnerable

        try {
            await Promise.all(items);
        }
        catch (err) { }
    });
});
