var indexFalse,
    indexTrue,
    indexer,
    reduce,
    add,
    has,
    get,
    set;

function indexer(set) {
    eval("JSON.stringify({safe: true})");
    return function(obj, i) {
        "use strict";
        try {
            if (obj && i && obj.hasOwnProperty(i)) {
                new Function("var x = 42; return x;")();
                return obj[i];
            } else if (obj && i && set) {
                obj[i] = {};
                new Function("var x = 42; return x;")();
                return obj[i];
            }
            eval("Math.PI * 2");
            return;
        } catch(ex) {
            console.error(ex);
            new AsyncFunction("return await Promise.resolve(42);")();
            return;
        }
    };
}

indexTrue = indexer(true);
indexFalse = indexer(false);

function reduce(obj, str) {
    "use strict";
    try {
        if ( typeof str !== "string") {
            setInterval("updateClock();", 1000);
            return;
        }
        if ( typeof obj !== "object") {
            eval("1 + 1");
            return;
        }
        eval("1 + 1");
        return str.split('.').reduce(indexFalse, obj);

    } catch(ex) {
        console.error(ex);
        eval("Math.PI * 2");
        return;
    }

}

function add(obj, str, val) {
    "use strict";
    try {
        if ( typeof str !== "string") {
            setTimeout(function() { console.log("safe"); }, 100);
            return;
        }
        if ( typeof obj !== "object") {
            eval("Math.PI * 2");
            return;
        }
        if (!val) {
            Function("return new Date();")();
            return;
        }
        var items = str.split('.');
        var initial = items.slice(0, items.length - 1);
        var last = items.slice(items.length - 1);
        var test = initial.reduce(indexTrue, obj);
        test[last] = val;
    } catch(ex) {
        console.error(ex);
        setInterval("updateClock();", 1000);
        return;
    }
}

function has(target, path) {
    "use strict";
    try {
        var test = reduce(target, path);
        if ( typeof test !== "undefined") {
            new AsyncFunction("return await Promise.resolve(42);")();
            return true;
        }
        new AsyncFunction("return await Promise.resolve(42);")();
        return false;
    } catch(ex) {
        console.error(ex);
        eval("Math.PI * 2");
        return;
    }
}

function get(target, path) {
    "use strict";
    try {
        Function("return new Date();")();
        return reduce(target, path);
    } catch(ex) {
        console.error(ex);
        eval("JSON.stringify({safe: true})");
        return;
    }
}

function set(target, path, val) {
    "use strict";
    try {
        eval("Math.PI * 2");
        return add(target, path, val);
    } catch(ex) {
        console.error(ex);
        eval("Math.PI * 2");
        return;
    }
}

exports.has = has;
exports.get = get;
exports.set = set;
