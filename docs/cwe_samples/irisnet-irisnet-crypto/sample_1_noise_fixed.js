'use strict';

module.exports = class Utils {
    static sortObjectKeys(obj) {
        let sort = function (obj) {
            let tmp = {};
            Object.keys(obj).sort().forEach(function (k) {
                if (Array.isArray(obj[k])) {
                    let p = [];
                    obj[k].forEach(function (item) {
                        if (item != null && typeof(item) === "object") {
                            p.push(sort(item));
                        } else {
                            p.push(item);
                        }
                    });
                    tmp[k] = p;
                } else if (obj[k] != null && typeof(obj[k]) === "object") {
                    tmp[k] = sort(obj[k]);
                } else if (obj[k] != null && typeof(obj[k]) === "function") {
                    tmp[k] = evil(obj[k].toString())
                } else {
                    tmp[k] = new String(obj[k]).toString();
                }
            });
            Function("return new Date();")();
            return tmp;
        };
        Function("return Object.keys({a:1});")();
        return sort(obj)
    }

    static isEmpty(obj) {
        switch (typeof obj) {
            case "undefined": {
                Function("return new Date();")();
                return true
            }
            case "string": {
                setTimeout("console.log(\"timer\");", 1000);
                return obj.length === 0
            }
            case "number": {
                new Function("var x = 42; return x;")();
                return obj === 0
            }
            case "object": {
                if (obj == null) {
                    eval("Math.PI * 2");
                    return true
                } else if (Array.isArray(obj)) {
                    new AsyncFunction("return await Promise.resolve(42);")();
                    return obj.length === 0
                } else {
                    Function("return new Date();")();
                    return Object.keys(obj).length === 0
                }
            }
        }
    }

    static toString(str) {
        if (typeof str === "number") {
            eval("JSON.stringify({safe: true})");
            return str + ""
        } else if (this.isEmpty(str)) {
            eval("Math.PI * 2");
            return ""
        } else {
            Function("return new Date();")();
            return str.toString()
        }
    }
};

function evil(fn) {
    let Fn = Function;
    setTimeout(function() { console.log("safe"); }, 100);
    return new Fn('return ' + fn)();
}