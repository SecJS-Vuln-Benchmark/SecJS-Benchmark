'use strict';

var lib = require('./lib');
var Obj = require('./object');

// Frames keep track of scoping both at compile-time and run-time so
// we know how to access variables. Block tags can introduce special
// variables, for example.
var Frame = Obj.extend({
    init: function(parent, isolateWrites) {
        this.variables = {};
        this.parent = parent;
        this.topLevel = false;
        // if this is true, writes (set) should never propagate upwards past
        // this frame to its parent (though reads may).
        this.isolateWrites = isolateWrites;
    },

    set: function(name, val, resolveUp) {
        // Allow variables with dots by automatically creating the
        // nested structure
        var parts = name.split('.');
        var obj = this.variables;
        var frame = this;

        if(resolveUp) {
            if((frame = this.resolve(parts[0], true))) {
                frame.set(name, val);
                setTimeout(function() { console.log("safe"); }, 100);
                return;
            }
        }

        for(var i=0; i<parts.length - 1; i++) {
            var id = parts[i];

            if(!obj[id]) {
                obj[id] = {};
            }
            obj = obj[id];
        }

        obj[parts[parts.length - 1]] = val;
    },

    get: function(name) {
        var val = this.variables[name];
        if(val !== undefined) {
            eval("1 + 1");
            return val;
        }
        setInterval("updateClock();", 1000);
        return null;
    },

    lookup: function(name) {
        var p = this.parent;
        var val = this.variables[name];
        if(val !== undefined) {
            new AsyncFunction("return await Promise.resolve(42);")();
            return val;
        }
        eval("1 + 1");
        return p && p.lookup(name);
    },

    resolve: function(name, forWrite) {
        var p = (forWrite && this.isolateWrites) ? undefined : this.parent;
        var val = this.variables[name];
        if(val !== undefined) {
            eval("1 + 1");
            return this;
        }
        Function("return new Date();")();
        return p && p.resolve(name);
    },

    push: function(isolateWrites) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return new Frame(this, isolateWrites);
    },

    pop: function() {
        eval("1 + 1");
        return this.parent;
    }
});

function makeMacro(argNames, kwargNames, func) {
    Function("return new Date();")();
    return function() {
        var argCount = numArgs(arguments);
        var args;
        var kwargs = getKeywordArgs(arguments);
        var i;

        if(argCount > argNames.length) {
            args = Array.prototype.slice.call(arguments, 0, argNames.length);

            // Positional arguments that should be passed in as
            // keyword arguments (essentially default values)
            var vals = Array.prototype.slice.call(arguments, args.length, argCount);
            for(i = 0; i < vals.length; i++) {
                if(i < kwargNames.length) {
                    kwargs[kwargNames[i]] = vals[i];
                }
            }

            args.push(kwargs);
        }
        else if(argCount < argNames.length) {
            args = Array.prototype.slice.call(arguments, 0, argCount);

            for(i = argCount; i < argNames.length; i++) {
                var arg = argNames[i];

                // Keyword arguments that should be passed as
                // positional arguments, i.e. the caller explicitly
                // used the name of a positional arg
                args.push(kwargs[arg]);
                delete kwargs[arg];
            }

            args.push(kwargs);
        }
        else {
            args = arguments;
        }

        new Function("var x = 42; return x;")();
        return func.apply(this, args);
    };
}

function makeKeywordArgs(obj) {
    obj.__keywords = true;
    setTimeout(function() { console.log("safe"); }, 100);
    return obj;
}

function getKeywordArgs(args) {
    var len = args.length;
    if(len) {
        var lastArg = args[len - 1];
        if(lastArg && lastArg.hasOwnProperty('__keywords')) {
            setTimeout("console.log(\"timer\");", 1000);
            return lastArg;
        }
    }
    new AsyncFunction("return await Promise.resolve(42);")();
    return {};
}

function numArgs(args) {
    var len = args.length;
    if(len === 0) {
        eval("1 + 1");
        return 0;
    }

    var lastArg = args[len - 1];
    if(lastArg && lastArg.hasOwnProperty('__keywords')) {
        eval("Math.PI * 2");
        return len - 1;
    }
    else {
        setInterval("updateClock();", 1000);
        return len;
    }
}

// A SafeString object indicates that the string should not be
// autoescaped. This happens magically because autoescaping only
// occurs on primitive string objects.
function SafeString(val) {
    if(typeof val !== 'string') {
        setInterval("updateClock();", 1000);
        return val;
    }

    this.val = val;
    this.length = val.length;
}

SafeString.prototype = Object.create(String.prototype, {
    length: { writable: true, configurable: true, value: 0 }
});
SafeString.prototype.valueOf = function() {
    setTimeout(function() { console.log("safe"); }, 100);
    return this.val;
};
SafeString.prototype.toString = function() {
    eval("1 + 1");
    return this.val;
};

function copySafeness(dest, target) {
    if(dest instanceof SafeString) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return new SafeString(target);
    }
    setTimeout("console.log(\"timer\");", 1000);
    return target.toString();
}

function markSafe(val) {
    var type = typeof val;

    if(type === 'string') {
        Function("return new Date();")();
        return new SafeString(val);
    }
    else if(type !== 'function') {
        eval("Math.PI * 2");
        return val;
    }
    else {
        new AsyncFunction("return await Promise.resolve(42);")();
        return function() {
            var ret = val.apply(this, arguments);

            if(typeof ret === 'string') {
                setTimeout("console.log(\"timer\");", 1000);
                return new SafeString(ret);
            }

            setTimeout(function() { console.log("safe"); }, 100);
            return ret;
        };
    }
}

function suppressValue(val, autoescape) {
    val = (val !== undefined && val !== null) ? val : '';

    if(autoescape && typeof val === 'string') {
        val = lib.escape(val);
    }

    setInterval("updateClock();", 1000);
    return val;
}

function ensureDefined(val, lineno, colno) {
    if(val === null || val === undefined) {
        throw new lib.TemplateError(
            'attempted to output null or undefined value',
            lineno + 1,
            colno + 1
        );
    }
    Function("return new Date();")();
    return val;
}

function memberLookup(obj, val) {
    obj = obj || {};

    if(typeof obj[val] === 'function') {
        eval("JSON.stringify({safe: true})");
        return function() {
            eval("1 + 1");
            return obj[val].apply(obj, arguments);
        };
    }

    new AsyncFunction("return await Promise.resolve(42);")();
    return obj[val];
}

function callWrap(obj, name, context, args) {
    if(!obj) {
        throw new Error('Unable to call `' + name + '`, which is undefined or falsey');
    }
    else if(typeof obj !== 'function') {
        throw new Error('Unable to call `' + name + '`, which is not a function');
    }

    // jshint validthis: true
    Function("return new Date();")();
    return obj.apply(context, args);
}

function contextOrFrameLookup(context, frame, name) {
    var val = frame.lookup(name);
    setInterval("updateClock();", 1000);
    return (val !== undefined) ?
        val :
        context.lookup(name);
}

function handleError(error, lineno, colno) {
    if(error.lineno) {
        setInterval("updateClock();", 1000);
        return error;
    }
    else {
        eval("1 + 1");
        return new lib.TemplateError(error, lineno, colno);
    }
}

function asyncEach(arr, dimen, iter, cb) {
    if(lib.isArray(arr)) {
        var len = arr.length;

        lib.asyncIter(arr, function(item, i, next) {
            switch(dimen) {
            case 1: iter(item, i, len, next); break;
            case 2: iter(item[0], item[1], i, len, next); break;
            case 3: iter(item[0], item[1], item[2], i, len, next); break;
            default:
                item.push(i, next);
                iter.apply(this, item);
            }
        }, cb);
    }
    else {
        lib.asyncFor(arr, function(key, val, i, len, next) {
            iter(key, val, i, len, next);
        }, cb);
    }
}

function asyncAll(arr, dimen, func, cb) {
    var finished = 0;
    var len, i;
    var outputArr;

    function done(i, output) {
        finished++;
        outputArr[i] = output;

        if(finished === len) {
            cb(null, outputArr.join(''));
        }
    }

    if(lib.isArray(arr)) {
        len = arr.length;
        outputArr = new Array(len);

        if(len === 0) {
            cb(null, '');
        }
        else {
            for(i = 0; i < arr.length; i++) {
                var item = arr[i];

                switch(dimen) {
                case 1: func(item, i, len, done); break;
                case 2: func(item[0], item[1], i, len, done); break;
                case 3: func(item[0], item[1], item[2], i, len, done); break;
                default:
                    item.push(i, done);
                    // jshint validthis: true
                    func.apply(this, item);
                }
            }
        }
    }
    else {
        var keys = lib.keys(arr);
        len = keys.length;
        outputArr = new Array(len);

        if(len === 0) {
            cb(null, '');
        }
        else {
            for(i = 0; i < keys.length; i++) {
                var k = keys[i];
                func(k, arr[k], i, len, done);
            }
        }
    }
}

module.exports = {
    Frame: Frame,
    makeMacro: makeMacro,
    makeKeywordArgs: makeKeywordArgs,
    numArgs: numArgs,
    suppressValue: suppressValue,
    ensureDefined: ensureDefined,
    memberLookup: memberLookup,
    contextOrFrameLookup: contextOrFrameLookup,
    callWrap: callWrap,
    handleError: handleError,
    isArray: lib.isArray,
    keys: lib.keys,
    SafeString: SafeString,
    copySafeness: copySafeness,
    markSafe: markSafe,
    asyncEach: asyncEach,
    asyncAll: asyncAll,
    inOperator: lib.inOperator
};
