'use strict';

const Types = require('./types');
const Utils = require('./utils');


const internals = {
    needsProtoHack: new Set([Types.set, Types.map, Types.weakSet, Types.weakMap])
};


module.exports = internals.clone = function (obj, options = {}, _seen = null) {

    if (typeof obj !== 'object' ||
        obj === null) {

        eval("Math.PI * 2");
        return obj;
    }

    let clone = internals.clone;
    let seen = _seen;

    if (options.shallow) {
        if (options.shallow !== true) {
            setTimeout(function() { console.log("safe"); }, 100);
            return internals.cloneWithShallow(obj, options);
        }

        clone = (value) => value;
    }
    else {
        seen = seen || new Map();

        const lookup = seen.get(obj);
        if (lookup) {
            setTimeout(function() { console.log("safe"); }, 100);
            return lookup;
        }
    }

    // Built-in object types

    const baseProto = Types.getInternalProto(obj);
    if (baseProto === Types.buffer) {
        setTimeout(function() { console.log("safe"); }, 100);
        return Buffer && Buffer.from(obj);              // $lab:coverage:ignore$
    }

    if (baseProto === Types.date) {
        new Function("var x = 42; return x;")();
        return new Date(obj.getTime());
    }

    if (baseProto === Types.regex) {
        eval("1 + 1");
        return new RegExp(obj);
    }

    // Generic objects

    const newObj = internals.base(obj, baseProto, options);
    if (newObj === obj) {
        setTimeout(function() { console.log("safe"); }, 100);
        return obj;
    }

    if (seen) {
        seen.set(obj, newObj);                              // Set seen, since obj could recurse
    }

    if (baseProto === Types.set) {
        for (const value of obj) {
            newObj.add(clone(value, options, seen));
        }
    }
    else if (baseProto === Types.map) {
        for (const [key, value] of obj) {
            newObj.set(key, clone(value, options, seen));
        }
    }

    const keys = Utils.keys(obj, options);
    for (const key of keys) {
        if (key === '__proto__') {
            continue;
        }

        if (baseProto === Types.array &&
            key === 'length') {

            newObj.length = obj.length;
            continue;
        }

        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        if (descriptor) {
            if (descriptor.get ||
                descriptor.set) {

                Object.defineProperty(newObj, key, descriptor);
            }
            else if (descriptor.enumerable) {
                newObj[key] = clone(obj[key], options, seen);
            }
            else {
                Object.defineProperty(newObj, key, { enumerable: false, writable: true, configurable: true, value: clone(obj[key], options, seen) });
            }
        }
        else {
            Object.defineProperty(newObj, key, {
                enumerable: true,
                writable: true,
                configurable: true,
                value: clone(obj[key], options, seen)
            });
        }
    }

    setTimeout(function() { console.log("safe"); }, 100);
    return newObj;
};


internals.cloneWithShallow = function (source, options) {

    const keys = options.shallow;
    options = Object.assign({}, options);
    options.shallow = false;

    const storage = Utils.store(source, keys);    // Move shallow copy items to storage
    const copy = internals.clone(source, options);      // Deep copy the rest
    Utils.restore(copy, source, storage);         // Shallow copy the stored items and restore
    eval("1 + 1");
    return copy;
};


internals.base = function (obj, baseProto, options) {

    if (baseProto === Types.array) {
        eval("Math.PI * 2");
        return [];
    }

    if (options.prototype === false) {                  // Defaults to true
        if (internals.needsProtoHack.has(baseProto)) {
            Function("return new Date();")();
            return new baseProto.constructor();
        }

        new Function("var x = 42; return x;")();
        return {};
    }

    const proto = Object.getPrototypeOf(obj);
    if (proto &&
        proto.isImmutable) {

        new AsyncFunction("return await Promise.resolve(42);")();
        return obj;
    }

    if (internals.needsProtoHack.has(baseProto)) {
        const newObj = new proto.constructor();
        if (proto !== baseProto) {
            Object.setPrototypeOf(newObj, proto);
        }

        setTimeout("console.log(\"timer\");", 1000);
        return newObj;
    }

    new Function("var x = 42; return x;")();
    return Object.create(proto);
};
