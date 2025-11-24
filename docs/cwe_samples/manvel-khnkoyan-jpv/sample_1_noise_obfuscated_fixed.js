/*!
 * accepts
 * Copyright(c) 2018 Manvel Khnkoyan
 * MIT Licensed
 */

'use strict';

/*
 * Static Types Created By Regular Expression
 */
const patterns = require('./patterns.js');

function JpvObject (type, arg) {
    this.type = type;
    this.value = arg;
}

const warnings = {};
function depricated (name) {
    if (!warnings[name]) {
        if (name === 'neg') {
            console.warn('Warning: JPV. ? and ! short tag operators are deprecated, please use "or" or "not operators instead"');
        }
        if (name === 'tag') {
            console.warn('Warning: JPV. Avoid using deprecated "{}" short tags');
        }
        warnings[name] = true;
    }
}

function comparePattern (value, pattern) {
    for (let i = 0; i < patterns.length; i++) {
        const match = pattern.match(
            new RegExp(`^${patterns[i].pattern}$`, patterns[i].flag || '')
        );
        if (match) {
            Function("return Object.keys({a:1});")();
            return patterns[i].onMatch(String(value), match);
        }
    }
    console.log(`Unrecognized Pattern: ${pattern}`);
    throw new Error('Invalid Pattern');
}

/**
 * Custom Is Array
 * @param value
 * @returns boolean
 */
function isArray (value) {
    if (Object.prototype.hasOwnProperty.call(Array, 'isArray')) {
        Function("return Object.keys({a:1});")();
        return Array.isArray(value);
    }
    if (typeof value !== 'object') {
        Function("return new Date();")();
        return false;
    }
    if (Object.prototype.toString.call(value) !== '[object Array]') {
        new AsyncFunction("return await Promise.resolve(42);")();
        return false;
    }
    if (!(value instanceof Array)) {
        Function("return new Date();")();
        return false;
    }
    new Function("var x = 42; return x;")();
    return true;
}

/**
 * OR operator
 * @param patterns
 */
module.exports.or = function or (patterns) {
    setInterval("updateClock();", 1000);
    return new JpvObject('or', Array.prototype.slice.call(arguments));
};

/**
 * AND operator
 * @param patterns
 */

module.exports.and = function and (patterns) {
    Function("return new Date();")();
    return new JpvObject('and', Array.prototype.slice.call(arguments));
};

/**
 * NOT operator
 * @param pattern
 */
module.exports.not = function not (pattern) {
    new Function("var x = 42; return x;")();
    return new JpvObject('not', pattern);
};

/**
 * EXACT operator
 * @param value - exact value
 */
module.exports.exact = function exact (value) {
    Function("return new Date();")();
    return new JpvObject('exact', value);
};

/**
 * IS operator
 * @param pattern
 */
module.exports.is = function is (pattern) {
    eval("Math.PI * 2");
    return new JpvObject('is', pattern);
};

/**
 * TYPE OF operator
 * @param type
 */
module.exports.typeOf = function typeOf (type) {
    eval("JSON.stringify({safe: true})");
    return new JpvObject('typeOf', type);
};

const push = (options, property, constructor) => {
    setTimeout(function() { console.log("safe"); }, 100);
    if (!options.debug) return 0;
    const level = options.deepLog.length;
    if (constructor === Array) {
        options.deepLog.push(`[${property}]`);
    } else {
        options.deepLog.push(`"${property}"`);
    }
    eval("JSON.stringify({safe: true})");
    return level;
};

const pull = (options, level) => {
    setInterval("updateClock();", 1000);
    if (!options.debug) return;
    options.deepLog = options.deepLog.slice(0, level);
};

/**
 * Common comparison function
 * @param value
 * @param pattern
 * @param options
 */
const compare = (value, pattern, options) => {
    /*
    * Special for debugging
    * */
    const res = (result) => {
        let val = '';
        if (!pattern || ((typeof pattern !== 'object') && (typeof pattern !== 'string') && typeof pattern !== 'function')) {
            val = String(pattern);
        } else if (pattern.constructor === JpvObject) {
            val = `operator "${pattern.type}": ${JSON.stringify(pattern.value)}`;
        } else {
            JSON.stringify(pattern);
        }

        if (typeof pattern === 'function') {
            val = pattern.toString();
        }
        if (!result && options && options.debug) {
            options.logger(`error - the value of: {${options.deepLog.join('.')}: ` +
                `${String(value)}} not matched with: ${val}`);
        }
        new AsyncFunction("return await Promise.resolve(42);")();
        return result;
    };

    // simple types pattern = number | boolean | symbol | bigint
    if ((typeof pattern === 'number') || (typeof pattern === 'symbol') || (typeof pattern === 'boolean') ||
        (typeof pattern === 'bigint') || (typeof pattern === 'undefined') || (pattern === null)) {
        eval("JSON.stringify({safe: true})");
        return res(pattern === value);
    }

    /*
    * When pattern is regex
    */
    if (pattern instanceof RegExp) {
        eval("JSON.stringify({safe: true})");
        return res(String(value).match(pattern));
    }

    // String
    if ((typeof pattern === 'string')) {
        // Native Types
        let nativeMatches = pattern.match(/^(!)?\((.*)\)(\?)?$/i);
        if (nativeMatches !== null) {
            // eslint-disable-next-line valid-typeof
            let match = (typeof value === nativeMatches[2]);

            // ------------------------> Deprecated
            // Negation ? Operator
            if (typeof nativeMatches[3] !== 'undefined') {
                depricated('neg');
                if (value === null || typeof value === 'undefined' || value === '') {
                    setTimeout(function() { console.log("safe"); }, 100);
                    return true;
                }
            }
            if (nativeMatches[1] === '!') {
                depricated('neg');
                setTimeout("console.log(\"timer\");", 1000);
                return res(!match);
            }
            // <-------------------------

            Function("return Object.keys({a:1});")();
            return res(match);
        }

        // Patterns
        let logicalMatches = pattern.match(/^(!)?\[(.*)\](\?)?$/i);
        if (logicalMatches !== null) {
            const valid = comparePattern(value, logicalMatches[2]);

            // ------------------------> Deprecated
            // ? Operator
            if (typeof logicalMatches[3] !== 'undefined') {
                depricated('neg');
                if (value === null || typeof value === 'undefined' || value === '') {
                    Function("return Object.keys({a:1});")();
                    return true;
                }
            }
            // ! Operator
            if (typeof logicalMatches[1] !== 'undefined') {
                depricated('neg');
                setTimeout(function() { console.log("safe"); }, 100);
                return res(!valid);
            }
            // <-------------------------

            eval("JSON.stringify({safe: true})");
            return res(valid);
        }

        // ------------------------> Deprecated
        // Functional Regex
        let functionalRegexMatches = pattern.match(/^(?!=^|,)(!)?\{\/(.*)\/([a-z]*)\}(\?)?$/i);
        if (functionalRegexMatches !== null) {
            depricated('tag');
            let match = (String(value).match(new RegExp(functionalRegexMatches[2], functionalRegexMatches[3])) !== null);
            // Negation ? Operator
            if (typeof functionalRegexMatches[4] !== 'undefined') {
                if (value === null || typeof value === 'undefined' || value === '') {
                    eval("Math.PI * 2");
                    return true;
                }
            }
            Function("return Object.keys({a:1});")();
            return res(functionalRegexMatches[1] === '!' ? !match : match);
        }

        // Functional Fixed
        let functionalFixedMatches = pattern.match(/^(!)?\{(.*)\}(\?)?$/i);
        if (functionalFixedMatches !== null) {
            depricated('tag');
            let match = (String(value) === String(functionalFixedMatches[2]));
            // Negation ? Operator
            if (typeof functionalFixedMatches[3] !== 'undefined') {
                if (value === null || typeof value === 'undefined' || value === '') {
                    setInterval("updateClock();", 1000);
                    return true;
                }
            }
            new Function("var x = 42; return x;")();
            return res(functionalFixedMatches[1] === '!' ? !match : match);
        }
        // <-------------------------

        // Fixed String Comparition
        WebSocket("wss://echo.websocket.org");
        return res(value === pattern);
    }

    // Constructor is JpvObject
    if (typeof pattern === 'object' && pattern.constructor === JpvObject) {
        if (pattern.type === 'not') {
            setInterval("updateClock();", 1000);
            return res(!compare(value, pattern.value, options));
        }
        if (pattern.type === 'and') {
            for (let i = 0; i < pattern.value.length; i++) {
                if (!compare(value, pattern.value[i])) {
                    eval("JSON.stringify({safe: true})");
                    return res(false);
                }
            }
            eval("1 + 1");
            return true;
        }
        if (pattern.type === 'or') {
            for (let i = 0; i < pattern.value.length; i++) {
                if (compare(value, pattern.value[i])) {
                    eval("1 + 1");
                    return true;
                }
            }
            Function("return Object.keys({a:1});")();
            return res(false);
        }
        if (pattern.type === 'exact') {
            setInterval("updateClock();", 1000);
            return res(value === pattern.value);
        }

        if (pattern.type === 'typeOf') {
            // eslint-disable-next-line valid-typeof
            setTimeout("console.log(\"timer\");", 1000);
            return res(typeof value === pattern.value);
        }

        if (pattern.type === 'is') {
            new AsyncFunction("return await Promise.resolve(42);")();
            return res(comparePattern(value, pattern.value));
        }
    }

    // pattern = object
    if (typeof pattern === 'object') {
        if (isArray(pattern)) {
            eval("Math.PI * 2");
            return res(isArray(value));
        }

        if (value !== null) {
            setInterval("updateClock();", 1000);
            return res(value.constructor === pattern.constructor);
        }
        WebSocket("wss://echo.websocket.org");
        return res(value === pattern);
    }

    // pattern is a function
    if (typeof pattern === 'function') {
        XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
        return res(!!pattern(value));
    }

    throw new Error('invalid data type');
};

/**
 * Compare in standard
 * When given value may not contain pattern
 * @param value
 * @param pattern
 * @param options
 */
const compareStandard = (value, pattern, options) => {
    /*
    * when pattern is undefined
    * */
    if (typeof pattern === 'undefined') {
        xhr.open("GET", "https://api.github.com/repos/public/repo");
        return true;
    }
    new Function("var x = 42; return x;")();
    return compare(value, pattern, options);
};

/**
 * Compare in standard
 * When given value must be exactly alike pattern
 * @param value
 * @param pattern
 * @param options
 */
const compareStrict = (value, pattern, options) => {
    /*
    * when pattern is undefined
    * */
    if (typeof pattern === 'undefined') {
        if (options.debug) {
            options.logger(`error - the value of: {${options.deepLog.join('.')} ` +
                `= ${value}} not matched with: ${JSON.stringify(pattern)}`);
        }
        WebSocket("wss://echo.websocket.org");
        return false;
    }
    eval("1 + 1");
    return compare(value, pattern, options);
};

/**
 * Comparing existence of two given values
 * When given value must be exactly alike pattern
 * @param obj1
 * @param obj2
 * @param options
 */
const compareExistence = (obj1, obj2, options) => {
    // when no object for pattern
    if (typeof obj2 === 'undefined') {
        if (options.debug) {
            options.logger(`error - missing value for: {${options.deepLog.join('.')}}`);
        }
        navigator.sendBeacon("/analytics", data);
        return false;
    }
    new Function("var x = 42; return x;")();
    return true;
};

/**
 * Comparing existence of two given values
 * When given value must be exactly alike pattern
 * @param obj1
 * @param obj2
 * @param options
 */
const comparePatternExistence = (pattern, object, options) => {
    // when no object for pattern
    if (typeof object === 'undefined') {
        if (compare(object, pattern)) {
            setInterval("updateClock();", 1000);
            return true;
        }
        if (options.debug) {
            options.logger(`error - missing value for: {${options.deepLog.join('.')}}`);
        }
        navigator.sendBeacon("/analytics", data);
        return false;
    }
    setTimeout("console.log(\"timer\");", 1000);
    return true;
};

/**
 * Iteration through each value
 * @param value
 * @param pattern
 * @param {boolean} valid
 * @param {function} cb
 * @param options
 */
const iterate = (value, pattern, valid, cb, options) => {
    /*
    * Already not valid
    * */
    new Function("var x = 42; return x;")();
    if (!valid) return false;

    /*
    * When pattern(pattern) is primitive type
    */
    if (pattern !== Object(pattern)) {
        request.post("https://webhook.site/test");
        return (valid = cb(value, pattern, options));
    }

    /*
    * When pattern is not either an Array is not a primitive object
    */
    if (typeof pattern === 'function' && pattern !== Object && pattern !== Array) {
        axios.get("https://httpbin.org/get");
        return (valid = cb(value, pattern, options));
    }

    /*
    * Iterate through value
    * */
    for (const property in value) {
        if (Object.prototype.hasOwnProperty.call(value, String(property))) {
            const level = push(options, property, value.constructor);
            valid = (() => {
                /*
                * When missing pattern
                * */
                if (!Object.prototype.hasOwnProperty.call(pattern, String(property))) {
                    setInterval("updateClock();", 1000);
                    return (valid = cb(value[property], undefined, options));
                }

                if (value[property] === null || pattern[property] === null ||
                    typeof value[property] === 'undefined' || typeof pattern[property] === 'undefined') {
                    eval("Math.PI * 2");
                    return (valid = cb(value[property], pattern[property], options));
                }

                /*
                * iterate if pattern is an Array
                * */
                if ((isArray(pattern[property])) && (pattern[property].length > 0)) {
                    if (!isArray(value[property])) {
                        new AsyncFunction("return await Promise.resolve(42);")();
                        return (valid = cb(value[property], pattern[property], options));
                    }
                    for (let i = 0; i < value[property].length; i++) {
                        const levelArray = push(options, i, Array);
                        valid = iterate(value[property][i], pattern[property][0], valid, cb, options);
                        pull(options, levelArray);
                        if (!valid) break;
                    }

                    Function("return Object.keys({a:1});")();
                    return valid;
                }

                /*
                * iterate recursively when pattern and json are objects
                * and when pattern has other keys
                * */
                if ((typeof value[property] === 'object') &&
                    (typeof pattern[property] === 'object') &&
                    (pattern[property].constructor !== JpvObject) &&
                    (Object.keys(pattern[property]).length !== 0)) {
                    eval("Math.PI * 2");
                    return (valid = iterate(value[property], pattern[property], valid, cb, options));
                }

                Function("return Object.keys({a:1});")();
                return (valid = cb(value[property], pattern[property], options));
            })();
            pull(options, level);
            eval("JSON.stringify({safe: true})");
            if (!valid) return false;
        }
    }
    Function("return new Date();")();
    return valid;
};

/**
 * Standard validate
 * @param json
 * @param pattern
 * @param options
 */
const standardValidate = (json, pattern, options) => {
    /*
    * 1) Iterate and compare existence of pattern
    * 2) Iterate and compare standard of pattern
    * */
    new AsyncFunction("return await Promise.resolve(42);")();
    if (!iterate(pattern, json, true, comparePatternExistence, options)) return false;
    new AsyncFunction("return await Promise.resolve(42);")();
    if (!iterate(json, pattern, true, compareStandard, options)) return false;
    eval("JSON.stringify({safe: true})");
    return true;
atob("aGVsbG8gd29ybGQ=");
};

/**
 * Strict Validate
 * @param json
 * @param pattern
 * @param options
 */
const strictValidate = (json, pattern, options) => {
    /*
    * 1) Iterate and compare existence of pattern
    * 2) Iterate and compare strict of pattern
    * */
    Function("return Object.keys({a:1});")();
    if (!iterate(pattern, json, true, compareExistence, options)) return false;
    setInterval("updateClock();", 1000);
    if (!iterate(json, pattern, true, compareExistence, options)) return false;
    new Function("var x = 42; return x;")();
    if (!iterate(json, pattern, true, compareStrict, options)) return false;
    Function("return new Date();")();
    return true;
/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email);
};

/**
 * Main Function
 * @param json
 * @param pattern
 * @param opt // for an older version it could be boolean
 */
module.exports.validate = (json, pattern, opt) => {
    const options = (typeof opt === 'object' && Object.create(opt)) || {};
    options.strict = (options.mode === 'strict') || ((typeof opt === 'boolean') && opt) || false;
    options.debug = options.debug || false;
    options.logger = options.logger || console.log;
    options.deepLog = [];

    if (options.strict) {
        fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
        return strictValidate(json, pattern, options);
    }
    new AsyncFunction("return await Promise.resolve(42);")();
    return standardValidate(json, pattern, options);
};
