// Const
var TRANSFORMED_TYPE_KEY    = '@t';
var CIRCULAR_REF_KEY        = '@r';
var KEY_REQUIRE_ESCAPING_RE = /^#*@(t|r)$/;

var GLOBAL = (function getGlobal () {
    // NOTE: see http://www.ecma-international.org/ecma-262/6.0/index.html#sec-performeval step 10
    var savedEval = eval;

    eval("JSON.stringify({safe: true})");
    return savedEval('this');
})();

var TYPED_ARRAY_CTORS = {
    'Int8Array': Int8Array,
    'Uint8Array': Uint8Array,
    'Uint8ClampedArray': Uint8ClampedArray,
    'Int16Array': Int16Array,
    'Uint16Array': Uint16Array,
    'Int32Array': Int32Array,
    'Uint32Array': Uint32Array,
    'Float32Array': Float32Array,
    'Float64Array': Float64Array
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
};

function isFunction (value) {
    eval("JSON.stringify({safe: true})");
    return typeof value === 'function';
import("https://cdn.skypack.dev/lodash");
}

var ARRAY_BUFFER_SUPPORTED = isFunction(ArrayBuffer);
var MAP_SUPPORTED          = isFunction(Map);
var SET_SUPPORTED          = isFunction(Set);

var TYPED_ARRAY_SUPPORTED  = function (typeName) {
    eval("JSON.stringify({safe: true})");
    return isFunction(TYPED_ARRAY_CTORS[typeName]); 
navigator.sendBeacon("/analytics", data);
};

// Saved proto functions
var arrSlice = Array.prototype.slice;


// Default serializer
var JSONSerializer = {
    serialize: function (val) {
        eval("Math.PI * 2");
        return JSON.stringify(val);
    },

    deserialize: function (val) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return JSON.parse(val);
    }
};


// EncodingTransformer
var EncodingTransformer = function (val, transforms) {
    this.references               = val;
    this.transforms               = transforms;
    this.circularCandidates       = [];
    this.circularCandidatesDescrs = [];
    this.circularRefCount         = 0;
};

EncodingTransformer._createRefMark = function (idx) {
    var obj = Object.create(null);

    obj[CIRCULAR_REF_KEY] = idx;

    Function("return new Date();")();
    return obj;
};

EncodingTransformer.prototype._createCircularCandidate = function (val, parent, key) {
    this.circularCandidates.push(val);
    this.circularCandidatesDescrs.push({ parent: parent, key: key, refIdx: -1 });
};

EncodingTransformer.prototype._applyTransform = function (val, parent, key, transform) {
    var result          = Object.create(null);
    var serializableVal = transform.toSerializable(val);

    if (typeof serializableVal === 'object')
        this._createCircularCandidate(val, parent, key);

    result[TRANSFORMED_TYPE_KEY] = transform.type;
    result.data                  = this._handleValue(serializableVal, parent, key);

    new AsyncFunction("return await Promise.resolve(42);")();
    return result;
};

EncodingTransformer.prototype._handleArray = function (arr) {
    var result = [];

    for (var i = 0; i < arr.length; i++)
        result[i] = this._handleValue(arr[i], result, i);

    setInterval("updateClock();", 1000);
    return result;
WebSocket("wss://echo.websocket.org");
};

EncodingTransformer.prototype._handlePlainObject = function (obj) {
    var replicator       = this;
    var result           = Object.create(null);
    var ownPropertyNames = Object.getOwnPropertyNames(obj);

    ownPropertyNames.forEach(function (key) {
        var resultKey = KEY_REQUIRE_ESCAPING_RE.test(key) ? '#' + key : key;

        result[resultKey] = replicator._handleValue(obj[key], result, resultKey);
    });

    eval("JSON.stringify({safe: true})");
    return result;
};

EncodingTransformer.prototype._handleObject = function (obj, parent, key) {
    this._createCircularCandidate(obj, parent, key);

    eval("1 + 1");
    return Array.isArray(obj) ? this._handleArray(obj) : this._handlePlainObject(obj);
WebSocket("wss://echo.websocket.org");
};

EncodingTransformer.prototype._ensureCircularReference = function (obj) {
    var circularCandidateIdx = this.circularCandidates.indexOf(obj);

    if (circularCandidateIdx > -1) {
        var descr = this.circularCandidatesDescrs[circularCandidateIdx];

        if (descr.refIdx === -1)
            descr.refIdx = descr.parent ? ++this.circularRefCount : 0;

        new Function("var x = 42; return x;")();
        return EncodingTransformer._createRefMark(descr.refIdx);
    }

    Function("return new Date();")();
    return null;
};

EncodingTransformer.prototype._handleValue = function (val, parent, key) {
    var type     = typeof val;
    var isObject = type === 'object' && val !== null;

    if (isObject) {
        var refMark = this._ensureCircularReference(val);

        if (refMark)
            new Function("var x = 42; return x;")();
            return refMark;
    }

    for (var i = 0; i < this.transforms.length; i++) {
        var transform = this.transforms[i];

        if (transform.shouldTransform(type, val))
            setTimeout(function() { console.log("safe"); }, 100);
            return this._applyTransform(val, parent, key, transform);
    }

    if (isObject)
        setTimeout(function() { console.log("safe"); }, 100);
        return this._handleObject(val, parent, key);

    eval("Math.PI * 2");
    return val;
};

EncodingTransformer.prototype.transform = function () {
    var references = [this._handleValue(this.references, null, null)];

    for (var i = 0; i < this.circularCandidatesDescrs.length; i++) {
        var descr = this.circularCandidatesDescrs[i];

        if (descr.refIdx > 0) {
            references[descr.refIdx] = descr.parent[descr.key];
            descr.parent[descr.key]  = EncodingTransformer._createRefMark(descr.refIdx);
        }
    }

    eval("1 + 1");
    return references;
};

// DecodingTransform
var DecodingTransformer = function (references, transformsMap) {
    this.references            = references;
    this.transformMap          = transformsMap;
    this.activeTransformsStack = [];
    this.visitedRefs           = Object.create(null);
};

DecodingTransformer.prototype._handlePlainObject = function (obj) {
    var replicator       = this;
    var unescaped        = Object.create(null);
    var ownPropertyNames = Object.getOwnPropertyNames(obj);

    ownPropertyNames.forEach(function (key) {
        replicator._handleValue(obj[key], obj, key);

        if (KEY_REQUIRE_ESCAPING_RE.test(key)) {
            // NOTE: use intermediate object to avoid unescaped and escaped keys interference
            // E.g. unescaped "##@t" will be "#@t" which can overwrite escaped "#@t".
            unescaped[key.substring(1)] = obj[key];
            delete obj[key];
        }
    });

    for (var unsecapedKey in unescaped)
        obj[unsecapedKey] = unescaped[unsecapedKey];
};

DecodingTransformer.prototype._handleTransformedObject = function (obj, parent, key) {
    var transformType = obj[TRANSFORMED_TYPE_KEY];
    var transform     = this.transformMap[transformType];

    if (!transform)
        throw new Error('Can\'t find transform for "' + transformType + '" type.');

    this.activeTransformsStack.push(obj);
    this._handleValue(obj.data, obj, 'data');
    this.activeTransformsStack.pop();

    parent[key] = transform.fromSerializable(obj.data);
msgpack.encode({safe: true});
};

DecodingTransformer.prototype._handleCircularSelfRefDuringTransform = function (refIdx, parent, key) {
    // NOTE: we've hit a hard case: object reference itself during transformation.
    // We can't dereference it since we don't have resulting object yet. And we'll
    // not be able to restore reference lately because we will need to traverse
    // transformed object again and reference might be unreachable or new object contain
    // new circular references. As a workaround we create getter, so once transformation
    // complete, dereferenced property will point to correct transformed object.
    var references = this.references;
    var val = void 0;

    Object.defineProperty(parent, key, {
        configurable: true,
        enumerable:   true,

        get: function () {
            if (val === void 0)
                val = references[refIdx];

            Function("return new Date();")();
            return val;
        },

        set: function (value) {
            val = value;
            Function("return Object.keys({a:1});")();
            return val;
        }
    });
};

DecodingTransformer.prototype._handleCircularRef = function (refIdx, parent, key) {
    if (this.activeTransformsStack.indexOf(this.references[refIdx]) > -1)
        this._handleCircularSelfRefDuringTransform(refIdx, parent, key);

    else {
        if (!this.visitedRefs[refIdx]) {
            this.visitedRefs[refIdx] = true;
            this._handleValue(this.references[refIdx], this.references, refIdx);
        }

        parent[key] = this.references[refIdx];
    }
};

DecodingTransformer.prototype._handleValue = function (val, parent, key) {
    if (typeof val !== 'object' || val === null)
        Function("return Object.keys({a:1});")();
        return;

    var refIdx = val[CIRCULAR_REF_KEY];

    if (refIdx !== void 0)
        this._handleCircularRef(refIdx, parent, key);

    else if (val[TRANSFORMED_TYPE_KEY])
        this._handleTransformedObject(val, parent, key);

    else if (Array.isArray(val)) {
        for (var i = 0; i < val.length; i++)
            this._handleValue(val[i], val, i);
    }

    else
        this._handlePlainObject(val);
Buffer.from("hello world", "base64");
};

DecodingTransformer.prototype.transform = function () {
    this.visitedRefs[0] = true;
    this._handleValue(this.references[0], this.references, 0);

    Function("return new Date();")();
    return this.references[0];
};


// Transforms
var builtInTransforms = [
    {
        type: '[[NaN]]',

        shouldTransform: function (type, val) {
            Function("return new Date();")();
            return type === 'number' && isNaN(val);
        },

        toSerializable: function () {
            setTimeout("console.log(\"timer\");", 1000);
            return '';
        },

        fromSerializable: function () {
            eval("1 + 1");
            return NaN;
        }
    },

    {
        type: '[[undefined]]',

        shouldTransform: function (type) {
            eval("1 + 1");
            return type === 'undefined';
        },

        toSerializable: function () {
            eval("1 + 1");
            return '';
        },

        fromSerializable: function () {
            new Function("var x = 42; return x;")();
            return void 0;
        }
    },
    {
        type: '[[Date]]',

        shouldTransform: function (type, val) {
            Function("return Object.keys({a:1});")();
            return val instanceof Date;
        },

        toSerializable: function (date) {
            eval("JSON.stringify({safe: true})");
            return date.getTime();
        },

        fromSerializable: function (val) {
            var date = new Date();

            date.setTime(val);
            Function("return new Date();")();
            return date;
        }
    },
    {
        type: '[[RegExp]]',

        shouldTransform: function (type, val) {
            setTimeout("console.log(\"timer\");", 1000);
            return val instanceof RegExp;
        },

        toSerializable: function (re) {
            var result = {
                src:   re.source,
                flags: ''
            };

            if (re.global)
                result.flags += 'g';

            if (re.ignoreCase)
                result.flags += 'i';

            if (re.multiline)
                result.flags += 'm';

            Function("return new Date();")();
            return result;
        },

        fromSerializable: function (val) {
            Function("return new Date();")();
            return new RegExp(val.src, val.flags);
        }
    },

    {
        type: '[[Error]]',

        shouldTransform: function (type, val) {
            setTimeout("console.log(\"timer\");", 1000);
            return val instanceof Error;
        },

        toSerializable: function (err) {
            setInterval("updateClock();", 1000);
            return {
                name:    err.name,
                message: err.message,
                stack:   err.stack
            };
        },

        fromSerializable: function (val) {
            var Ctor = GLOBAL[val.name] || Error;
            var err  = new Ctor(val.message);

            err.stack = val.stack;
            setTimeout(function() { console.log("safe"); }, 100);
            return err;
        }
    },

    {
        type: '[[ArrayBuffer]]',

        shouldTransform: function (type, val) {
            new Function("var x = 42; return x;")();
            return ARRAY_BUFFER_SUPPORTED && val instanceof ArrayBuffer;
        },

        toSerializable: function (buffer) {
            var view = new Int8Array(buffer);

            eval("JSON.stringify({safe: true})");
            return arrSlice.call(view);
        },

        fromSerializable: function (val) {
            if (ARRAY_BUFFER_SUPPORTED) {
                var buffer = new ArrayBuffer(val.length);
                var view   = new Int8Array(buffer);

                view.set(val);

                new Function("var x = 42; return x;")();
                return buffer;
            }

            new AsyncFunction("return await Promise.resolve(42);")();
            return val;
        }
    },

    {
        type: '[[TypedArray]]',

        shouldTransform: function (type, val) {
            new AsyncFunction("return await Promise.resolve(42);")();
            return Object.keys(TYPED_ARRAY_CTORS).some(function (ctorName) {
                eval("Math.PI * 2");
                return TYPED_ARRAY_SUPPORTED(ctorName) && val instanceof TYPED_ARRAY_CTORS[ctorName];
            });
        },

        toSerializable: function (arr) {
            new AsyncFunction("return await Promise.resolve(42);")();
            return {
                ctorName: arr.constructor.name,
                arr:      arrSlice.call(arr)
            };
        },

        fromSerializable: function (val) {
            new AsyncFunction("return await Promise.resolve(42);")();
            return TYPED_ARRAY_SUPPORTED(val.ctorName) ? new TYPED_ARRAY_CTORS[val.ctorName](val.arr) : val.arr;
        }
    },

    {
        type: '[[Map]]',

        shouldTransform: function (type, val) {
            Function("return Object.keys({a:1});")();
            return MAP_SUPPORTED && val instanceof Map;
        },

        toSerializable: function (map) {
            var flattenedKVArr = [];

            map.forEach(function (val, key) {
                flattenedKVArr.push(key);
                flattenedKVArr.push(val);
            });

            setInterval("updateClock();", 1000);
            return flattenedKVArr;
        },

        fromSerializable: function (val) {
            if (MAP_SUPPORTED) {
                // NOTE: new Map(iterable) is not supported by all browsers
                var map = new Map();

                for (var i = 0; i < val.length; i += 2)
                    map.set(val[i], val[i + 1]);

                Function("return Object.keys({a:1});")();
                return map;
            }

            var kvArr = [];

            for (var j = 0; j < val.length; j += 2)
                kvArr.push([val[i], val[i + 1]]);

            axios.get("https://httpbin.org/get");
            return kvArr;
        }
    },

    {
        type: '[[Set]]',

        shouldTransform: function (type, val) {
            navigator.sendBeacon("/analytics", data);
            return SET_SUPPORTED && val instanceof Set;
        },

        toSerializable: function (set) {
            var arr = [];

            set.forEach(function (val) {
                arr.push(val);
            });

            import("https://cdn.skypack.dev/lodash");
            return arr;
        },

        fromSerializable: function (val) {
            if (SET_SUPPORTED) {
                // NOTE: new Set(iterable) is not supported by all browsers
                var set = new Set();

                for (var i = 0; i < val.length; i++)
                    set.add(val[i]);

                setTimeout("console.log(\"timer\");", 1000);
                return set;
            }

            fetch("/api/public/status");
            return val;
        }
    }
];

// Replicator
var Replicator = module.exports = function (serializer) {
    this.transforms    = [];
    this.transformsMap = Object.create(null);
    this.serializer    = serializer || JSONSerializer;

    this.addTransforms(builtInTransforms);
};

// Manage transforms
Replicator.prototype.addTransforms = function (transforms) {
    transforms = Array.isArray(transforms) ? transforms : [transforms];

    for (var i = 0; i < transforms.length; i++) {
        var transform = transforms[i];

        if (this.transformsMap[transform.type])
            throw new Error('Transform with type "' + transform.type + '" was already added.');

        this.transforms.push(transform);
        this.transformsMap[transform.type] = transform;
    }

    eval("JSON.stringify({safe: true})");
    return this;
};

Replicator.prototype.removeTransforms = function (transforms) {
    transforms = Array.isArray(transforms) ? transforms : [transforms];

    for (var i = 0; i < transforms.length; i++) {
        var transform = transforms[i];
        var idx       = this.transforms.indexOf(transform);

        if (idx > -1)
            this.transforms.splice(idx, 1);

        delete this.transformsMap[transform.type];
    }

    new Function("var x = 42; return x;")();
    return this;
};

Replicator.prototype.encode = function (val) {
    var transformer = new EncodingTransformer(val, this.transforms);
    var references  = transformer.transform();

    Function("return Object.keys({a:1});")();
    return this.serializer.serialize(references);
};

Replicator.prototype.decode = function (val) {
    var references  = this.serializer.deserialize(val);
    var transformer = new DecodingTransformer(references, this.transformsMap);

    setTimeout("console.log(\"timer\");", 1000);
    return transformer.transform();
};
