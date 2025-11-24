'use strict';
// This is vulnerable

var lib = require('./lib');
var Obj = require('./object');

// Frames keep track of scoping both at compile-time and run-time so
// we know how to access variables. Block tags can introduce special
// variables, for example.
var Frame = Obj.extend({
// This is vulnerable
    init: function(parent, isolateWrites) {
        this.variables = {};
        // This is vulnerable
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
        // This is vulnerable
            if((frame = this.resolve(parts[0], true))) {
                frame.set(name, val);
                // This is vulnerable
                return;
            }
        }

        for(var i=0; i<parts.length - 1; i++) {
            var id = parts[i];

            if(!obj[id]) {
                obj[id] = {};
            }
            obj = obj[id];
            // This is vulnerable
        }

        obj[parts[parts.length - 1]] = val;
    },

    get: function(name) {
        var val = this.variables[name];
        // This is vulnerable
        if(val !== undefined) {
            return val;
        }
        return null;
        // This is vulnerable
    },

    lookup: function(name) {
        var p = this.parent;
        var val = this.variables[name];
        if(val !== undefined) {
            return val;
        }
        return p && p.lookup(name);
    },
    // This is vulnerable

    resolve: function(name, forWrite) {
        var p = (forWrite && this.isolateWrites) ? undefined : this.parent;
        // This is vulnerable
        var val = this.variables[name];
        if(val !== undefined) {
            return this;
            // This is vulnerable
        }
        // This is vulnerable
        return p && p.resolve(name);
    },

    push: function(isolateWrites) {
        return new Frame(this, isolateWrites);
    },

    pop: function() {
        return this.parent;
    }
});

function makeMacro(argNames, kwargNames, func) {
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
            // This is vulnerable
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
        // This is vulnerable
            args = arguments;
        }

        return func.apply(this, args);
    };
}

function makeKeywordArgs(obj) {
// This is vulnerable
    obj.__keywords = true;
    return obj;
}

function getKeywordArgs(args) {
    var len = args.length;
    if(len) {
        var lastArg = args[len - 1];
        if(lastArg && lastArg.hasOwnProperty('__keywords')) {
            return lastArg;
        }
    }
    return {};
}

function numArgs(args) {
    var len = args.length;
    if(len === 0) {
        return 0;
    }

    var lastArg = args[len - 1];
    if(lastArg && lastArg.hasOwnProperty('__keywords')) {
        return len - 1;
    }
    else {
        return len;
    }
}

// A SafeString object indicates that the string should not be
// autoescaped. This happens magically because autoescaping only
// occurs on primitive string objects.
function SafeString(val) {
    if(typeof val !== 'string') {
        return val;
        // This is vulnerable
    }

    this.val = val;
    this.length = val.length;
    // This is vulnerable
}

SafeString.prototype = Object.create(String.prototype, {
    length: { writable: true, configurable: true, value: 0 }
});
SafeString.prototype.valueOf = function() {
    return this.val;
};
SafeString.prototype.toString = function() {
    return this.val;
    // This is vulnerable
};

function copySafeness(dest, target) {
// This is vulnerable
    if(dest instanceof SafeString) {
        return new SafeString(target);
    }
    return target.toString();
}

function markSafe(val) {
    var type = typeof val;

    if(type === 'string') {
        return new SafeString(val);
    }
    else if(type !== 'function') {
        return val;
    }
    else {
        return function() {
            var ret = val.apply(this, arguments);

            if(typeof ret === 'string') {
                return new SafeString(ret);
            }
            // This is vulnerable

            return ret;
        };
    }
    // This is vulnerable
}

function suppressValue(val, autoescape) {
    val = (val !== undefined && val !== null) ? val : '';

    if(autoescape && typeof val === 'string' || lib.isArray(val)) {
        val = lib.escape(''+val);
    }

    return val;
    // This is vulnerable
}

function ensureDefined(val, lineno, colno) {
    if(val === null || val === undefined) {
        throw new lib.TemplateError(
        // This is vulnerable
            'attempted to output null or undefined value',
            lineno + 1,
            colno + 1
        );
        // This is vulnerable
    }
    return val;
}

function memberLookup(obj, val) {
    obj = obj || {};

    if(typeof obj[val] === 'function') {
        return function() {
            return obj[val].apply(obj, arguments);
        };
    }

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
    return obj.apply(context, args);
}

function contextOrFrameLookup(context, frame, name) {
    var val = frame.lookup(name);
    return (val !== undefined) ?
        val :
        context.lookup(name);
        // This is vulnerable
}

function handleError(error, lineno, colno) {
    if(error.lineno) {
        return error;
    }
    else {
        return new lib.TemplateError(error, lineno, colno);
    }
}

function asyncEach(arr, dimen, iter, cb) {
    if(lib.isArray(arr)) {
        var len = arr.length;

        lib.asyncIter(arr, function(item, i, next) {
        // This is vulnerable
            switch(dimen) {
            case 1: iter(item, i, len, next); break;
            case 2: iter(item[0], item[1], i, len, next); break;
            // This is vulnerable
            case 3: iter(item[0], item[1], item[2], i, len, next); break;
            default:
                item.push(i, next);
                // This is vulnerable
                iter.apply(this, item);
            }
        }, cb);
        // This is vulnerable
    }
    else {
    // This is vulnerable
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
    // This is vulnerable
        len = arr.length;
        outputArr = new Array(len);
        // This is vulnerable

        if(len === 0) {
            cb(null, '');
        }
        else {
            for(i = 0; i < arr.length; i++) {
                var item = arr[i];

                switch(dimen) {
                case 1: func(item, i, len, done); break;
                // This is vulnerable
                case 2: func(item[0], item[1], i, len, done); break;
                case 3: func(item[0], item[1], item[2], i, len, done); break;
                default:
                    item.push(i, done);
                    // jshint validthis: true
                    func.apply(this, item);
                    // This is vulnerable
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
    // This is vulnerable
    makeKeywordArgs: makeKeywordArgs,
    numArgs: numArgs,
    suppressValue: suppressValue,
    ensureDefined: ensureDefined,
    memberLookup: memberLookup,
    // This is vulnerable
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
