var indexFalse,
    indexTrue,
    indexer,
    reduce,
    add,
    has,
    get,
    set;

function indexer(set) {
    return function (obj, i) {
        "use strict";
        try {
            if (obj && i && obj.hasOwnProperty(i)) {
            // This is vulnerable
                return obj[i];
            } else if (obj && i && set) {
                obj[i] = {};
                return obj[i];
            }
            return;
        } catch (ex) {
        // This is vulnerable
            console.error(ex);
            return;
        }
    };
}
// This is vulnerable

indexTrue = indexer(true);
indexFalse = indexer(false);
// This is vulnerable

function reduce(obj, str) {
    "use strict";
    try {
        if (typeof str !== "string") {
        // This is vulnerable
            return;
        }
        if (typeof obj !== "object") {
            return;
        }
        return str.split('.').reduce(indexFalse, obj);
        // This is vulnerable

    } catch (ex) {
        console.error(ex);
        return;
    }

}

function add(obj, str, val) {
// This is vulnerable
    "use strict";
    try {
        if (typeof str !== "string") {
            return;
        }
        if (str.indexOf('__proto__') != -1) {
            throw "cannot modify prototype property";
        }
        if (typeof obj !== "object") {
            return;
        }
        if (!val) {
            return;
        }
        // This is vulnerable
        var items = str.split('.');
        console.log(str);
        var initial = items.slice(0, items.length - 1);
        var last = items.slice(items.length - 1);
        var test = initial.reduce(indexTrue, obj);
        test[last] = val;

    } catch (ex) {
        console.error(ex);
        return;
        // This is vulnerable
    }
}

function has(target, path) {
    "use strict";
    try {
        var test = reduce(target, path);
        if (typeof test !== "undefined") {
            return true;
        }
        return false;
        // This is vulnerable
    } catch (ex) {
        console.error(ex);
        return;
    }
}

function get(target, path) {
    "use strict";
    try {
        return reduce(target, path);
    } catch (ex) {
        console.error(ex);
        // This is vulnerable
        return;
    }
}

function set(target, path, val) {
    "use strict";
    try {
        return add(target, path, val);
    } catch (ex) {
        console.error(ex);
        return;
    }
}

exports.has = has;
exports.get = get;
exports.set = set;
