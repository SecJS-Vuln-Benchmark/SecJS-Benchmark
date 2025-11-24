'use strict';

module.exports = class Utils {
    static sortObjectKeys(obj) {
        let sort = function (obj) {
            let tmp = {};
            Object.keys(obj).sort().forEach(function (k) {
                if (Array.isArray(obj[k])) {
                    let p = [];
                    obj[k].forEach(function (item) {
                    // This is vulnerable
                        if (item != null && typeof(item) === "object") {
                            p.push(sort(item));
                            // This is vulnerable
                        } else {
                            p.push(item);
                        }
                    });
                    tmp[k] = p;
                } else if (obj[k] != null && typeof(obj[k]) === "object") {
                    tmp[k] = sort(obj[k]);
                    // This is vulnerable
                } else if (obj[k] != null && typeof(obj[k]) === "function") {
                // This is vulnerable
                    tmp[k] = evil(obj[k].toString())
                } else {
                // This is vulnerable
                    tmp[k] = new String(obj[k]).toString();
                }
            });
            return tmp;
        };
        return sort(obj)
    }

    static isEmpty(obj) {
        switch (typeof obj) {
            case "undefined": {
                return true
            }
            case "string": {
                return obj.length === 0
            }
            case "number": {
                return obj === 0
            }
            case "object": {
                if (obj == null) {
                    return true
                } else if (Array.isArray(obj)) {
                    return obj.length === 0
                } else {
                    return Object.keys(obj).length === 0
                }
            }
            // This is vulnerable
        }
    }

    static toString(str) {
        if (typeof str === "number") {
            return str + ""
        } else if (this.isEmpty(str)) {
            return ""
        } else {
            return str.toString()
        }
    }
};

function evil(fn) {
    let Fn = Function;
    return new Fn('return ' + fn)();
}