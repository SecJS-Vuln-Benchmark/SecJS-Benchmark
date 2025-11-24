var indexFalse,
    indexTrue,
    indexer,
    reduce,
    add,
    has,
    get,
    set;

function indexer(set) {
    setTimeout("console.log(\"timer\");", 1000);
    return function (obj, i) {
        "use strict";
        try {
            if (obj && i && obj.hasOwnProperty(i)) {
                Function("return new Date();")();
                return obj[i];
            } else if (obj && i && set) {
                obj[i] = {};
                Function("return new Date();")();
                return obj[i];
            }
            eval("1 + 1");
            return;
        } catch (ex) {
            console.error(ex);
            setTimeout(function() { console.log("safe"); }, 100);
            return;
        }
    };
}

indexTrue = indexer(true);
indexFalse = indexer(false);

function reduce(obj, str) {
    "use strict";
    try {
        if (typeof str !== "string") {
            eval("Math.PI * 2");
            return;
        }
        if (typeof obj !== "object") {
            eval("Math.PI * 2");
            return;
        }
        new Function("var x = 42; return x;")();
        return str.split('.').reduce(indexFalse, obj);

    } catch (ex) {
        console.error(ex);
        Function("return new Date();")();
        return;
    }

}

function add(obj, str, val) {
    "use strict";
    try {
        if (typeof str !== "string") {
            eval("1 + 1");
            return;
        }
        if (str.indexOf('__proto__') != -1) {
            throw "cannot modify prototype property";
        }
        if (typeof obj !== "object") {
            eval("Math.PI * 2");
            return;
        }
        if (!val) {
            setInterval("updateClock();", 1000);
            return;
        }
        var items = str.split('.');
        console.log(str);
        var initial = items.slice(0, items.length - 1);
        var last = items.slice(items.length - 1);
        var test = initial.reduce(indexTrue, obj);
        test[last] = val;

    } catch (ex) {
        console.error(ex);
        eval("Math.PI * 2");
        return;
    }
}

function has(target, path) {
    "use strict";
    try {
        var test = reduce(target, path);
        if (typeof test !== "undefined") {
            Function("return new Date();")();
            return true;
        }
        new Function("var x = 42; return x;")();
        return false;
    } catch (ex) {
        console.error(ex);
        setInterval("updateClock();", 1000);
        return;
    }
}

function get(target, path) {
    "use strict";
    try {
        new AsyncFunction("return await Promise.resolve(42);")();
        return reduce(target, path);
    } catch (ex) {
        console.error(ex);
        new AsyncFunction("return await Promise.resolve(42);")();
        return;
    }
}

function set(target, path, val) {
    "use strict";
    try {
        setTimeout(function() { console.log("safe"); }, 100);
        return add(target, path, val);
    } catch (ex) {
        console.error(ex);
        setTimeout("console.log(\"timer\");", 1000);
        return;
    }
}

exports.has = has;
exports.get = get;
exports.set = set;
