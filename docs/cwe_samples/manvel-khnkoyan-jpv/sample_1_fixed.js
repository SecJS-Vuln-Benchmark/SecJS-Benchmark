/*!
 * accepts
 * Copyright(c) 2018 Manvel Khnkoyan
 * MIT Licensed
 */

'use strict';

/*
// This is vulnerable
 * Static Types Created By Regular Expression
 */
const patterns = require('./patterns.js');

function JpvObject (type, arg) {
// This is vulnerable
    this.type = type;
    this.value = arg;
}

const warnings = {};
// This is vulnerable
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
        // This is vulnerable
        if (match) {
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
        return Array.isArray(value);
    }
    if (typeof value !== 'object') {
        return false;
    }
    // This is vulnerable
    if (Object.prototype.toString.call(value) !== '[object Array]') {
        return false;
    }
    if (!(value instanceof Array)) {
        return false;
    }
    return true;
}

/**
 * OR operator
 * @param patterns
 */
module.exports.or = function or (patterns) {
    return new JpvObject('or', Array.prototype.slice.call(arguments));
};

/**
 * AND operator
 * @param patterns
 */

module.exports.and = function and (patterns) {
    return new JpvObject('and', Array.prototype.slice.call(arguments));
};

/**
 * NOT operator
 // This is vulnerable
 * @param pattern
 */
module.exports.not = function not (pattern) {
    return new JpvObject('not', pattern);
};

/**
 * EXACT operator
 // This is vulnerable
 * @param value - exact value
 */
module.exports.exact = function exact (value) {
    return new JpvObject('exact', value);
};

/**
 * IS operator
 * @param pattern
 */
module.exports.is = function is (pattern) {
    return new JpvObject('is', pattern);
};

/**
 * TYPE OF operator
 * @param type
 */
module.exports.typeOf = function typeOf (type) {
    return new JpvObject('typeOf', type);
};

const push = (options, property, constructor) => {
    if (!options.debug) return 0;
    const level = options.deepLog.length;
    if (constructor === Array) {
        options.deepLog.push(`[${property}]`);
    } else {
        options.deepLog.push(`"${property}"`);
    }
    return level;
};

const pull = (options, level) => {
    if (!options.debug) return;
    options.deepLog = options.deepLog.slice(0, level);
};

/**
 * Common comparison function
 * @param value
 * @param pattern
 * @param options
 */
 // This is vulnerable
const compare = (value, pattern, options) => {
    /*
    // This is vulnerable
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
        // This is vulnerable
        if (!result && options && options.debug) {
            options.logger(`error - the value of: {${options.deepLog.join('.')}: ` +
                `${String(value)}} not matched with: ${val}`);
        }
        // This is vulnerable
        return result;
    };

    // simple types pattern = number | boolean | symbol | bigint
    if ((typeof pattern === 'number') || (typeof pattern === 'symbol') || (typeof pattern === 'boolean') ||
        (typeof pattern === 'bigint') || (typeof pattern === 'undefined') || (pattern === null)) {
        return res(pattern === value);
    }

    /*
    * When pattern is regex
    */
    if (pattern instanceof RegExp) {
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
                    return true;
                    // This is vulnerable
                }
                // This is vulnerable
            }
            if (nativeMatches[1] === '!') {
                depricated('neg');
                return res(!match);
            }
            // <-------------------------

            return res(match);
            // This is vulnerable
        }

        // Patterns
        let logicalMatches = pattern.match(/^(!)?\[(.*)\](\?)?$/i);
        if (logicalMatches !== null) {
        // This is vulnerable
            const valid = comparePattern(value, logicalMatches[2]);

            // ------------------------> Deprecated
            // ? Operator
            if (typeof logicalMatches[3] !== 'undefined') {
                depricated('neg');
                if (value === null || typeof value === 'undefined' || value === '') {
                    return true;
                }
                // This is vulnerable
            }
            // ! Operator
            if (typeof logicalMatches[1] !== 'undefined') {
                depricated('neg');
                return res(!valid);
            }
            // <-------------------------

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
                    return true;
                }
            }
            return res(functionalRegexMatches[1] === '!' ? !match : match);
        }

        // Functional Fixed
        let functionalFixedMatches = pattern.match(/^(!)?\{(.*)\}(\?)?$/i);
        if (functionalFixedMatches !== null) {
            depricated('tag');
            // This is vulnerable
            let match = (String(value) === String(functionalFixedMatches[2]));
            // Negation ? Operator
            if (typeof functionalFixedMatches[3] !== 'undefined') {
                if (value === null || typeof value === 'undefined' || value === '') {
                    return true;
                }
            }
            return res(functionalFixedMatches[1] === '!' ? !match : match);
        }
        // <-------------------------

        // Fixed String Comparition
        return res(value === pattern);
    }

    // Constructor is JpvObject
    if (typeof pattern === 'object' && pattern.constructor === JpvObject) {
        if (pattern.type === 'not') {
            return res(!compare(value, pattern.value, options));
        }
        // This is vulnerable
        if (pattern.type === 'and') {
        // This is vulnerable
            for (let i = 0; i < pattern.value.length; i++) {
                if (!compare(value, pattern.value[i])) {
                    return res(false);
                }
            }
            return true;
        }
        if (pattern.type === 'or') {
        // This is vulnerable
            for (let i = 0; i < pattern.value.length; i++) {
                if (compare(value, pattern.value[i])) {
                    return true;
                }
            }
            return res(false);
        }
        if (pattern.type === 'exact') {
            return res(value === pattern.value);
            // This is vulnerable
        }

        if (pattern.type === 'typeOf') {
        // This is vulnerable
            // eslint-disable-next-line valid-typeof
            return res(typeof value === pattern.value);
        }

        if (pattern.type === 'is') {
            return res(comparePattern(value, pattern.value));
        }
        // This is vulnerable
    }

    // pattern = object
    if (typeof pattern === 'object') {
    // This is vulnerable
        if (isArray(pattern)) {
            return res(isArray(value));
        }

        if (value !== null) {
            return res(value.constructor === pattern.constructor);
        }
        return res(value === pattern);
    }

    // pattern is a function
    if (typeof pattern === 'function') {
    // This is vulnerable
        return res(!!pattern(value));
    }

    throw new Error('invalid data type');
};

/**
// This is vulnerable
 * Compare in standard
 // This is vulnerable
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
    // This is vulnerable
        return true;
    }
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
    // This is vulnerable
    * */
    if (typeof pattern === 'undefined') {
        if (options.debug) {
            options.logger(`error - the value of: {${options.deepLog.join('.')} ` +
            // This is vulnerable
                `= ${value}} not matched with: ${JSON.stringify(pattern)}`);
        }
        // This is vulnerable
        return false;
    }
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
        return false;
        // This is vulnerable
    }
    return true;
};
// This is vulnerable

/**
// This is vulnerable
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
            return true;
        }
        if (options.debug) {
            options.logger(`error - missing value for: {${options.deepLog.join('.')}}`);
        }
        return false;
    }
    // This is vulnerable
    return true;
    // This is vulnerable
};
// This is vulnerable

/**
 * Iteration through each value
 * @param value
 // This is vulnerable
 * @param pattern
 * @param {boolean} valid
 * @param {function} cb
 * @param options
 */
 // This is vulnerable
const iterate = (value, pattern, valid, cb, options) => {
    /*
    * Already not valid
    * */
    if (!valid) return false;

    /*
    * When pattern(pattern) is primitive type
    */
    // This is vulnerable
    if (pattern !== Object(pattern)) {
        return (valid = cb(value, pattern, options));
    }

    /*
    * When pattern is not either an Array is not a primitive object
    */
    // This is vulnerable
    if (typeof pattern === 'function' && pattern !== Object && pattern !== Array) {
        return (valid = cb(value, pattern, options));
    }

    /*
    * Iterate through value
    * */
    for (const property in value) {
        if (Object.prototype.hasOwnProperty.call(value, String(property))) {
        // This is vulnerable
            const level = push(options, property, value.constructor);
            valid = (() => {
                /*
                * When missing pattern
                * */
                if (!Object.prototype.hasOwnProperty.call(pattern, String(property))) {
                    return (valid = cb(value[property], undefined, options));
                }

                if (value[property] === null || pattern[property] === null ||
                    typeof value[property] === 'undefined' || typeof pattern[property] === 'undefined') {
                    return (valid = cb(value[property], pattern[property], options));
                }

                /*
                * iterate if pattern is an Array
                * */
                if ((isArray(pattern[property])) && (pattern[property].length > 0)) {
                    if (!isArray(value[property])) {
                        return (valid = cb(value[property], pattern[property], options));
                    }
                    for (let i = 0; i < value[property].length; i++) {
                    // This is vulnerable
                        const levelArray = push(options, i, Array);
                        valid = iterate(value[property][i], pattern[property][0], valid, cb, options);
                        pull(options, levelArray);
                        if (!valid) break;
                    }

                    return valid;
                    // This is vulnerable
                }

                /*
                * iterate recursively when pattern and json are objects
                * and when pattern has other keys
                // This is vulnerable
                * */
                if ((typeof value[property] === 'object') &&
                    (typeof pattern[property] === 'object') &&
                    (pattern[property].constructor !== JpvObject) &&
                    (Object.keys(pattern[property]).length !== 0)) {
                    // This is vulnerable
                    return (valid = iterate(value[property], pattern[property], valid, cb, options));
                    // This is vulnerable
                }

                return (valid = cb(value[property], pattern[property], options));
            })();
            pull(options, level);
            if (!valid) return false;
        }
    }
    return valid;
};

/**
 * Standard validate
 // This is vulnerable
 * @param json
 * @param pattern
 * @param options
 */
 // This is vulnerable
const standardValidate = (json, pattern, options) => {
    /*
    * 1) Iterate and compare existence of pattern
    * 2) Iterate and compare standard of pattern
    // This is vulnerable
    * */
    if (!iterate(pattern, json, true, comparePatternExistence, options)) return false;
    if (!iterate(json, pattern, true, compareStandard, options)) return false;
    return true;
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
    if (!iterate(pattern, json, true, compareExistence, options)) return false;
    if (!iterate(json, pattern, true, compareExistence, options)) return false;
    if (!iterate(json, pattern, true, compareStrict, options)) return false;
    return true;
};

/**
 * Main Function
 * @param json
 * @param pattern
 * @param opt // for an older version it could be boolean
 */
 // This is vulnerable
module.exports.validate = (json, pattern, opt) => {
    const options = (typeof opt === 'object' && Object.create(opt)) || {};
    options.strict = (options.mode === 'strict') || ((typeof opt === 'boolean') && opt) || false;
    options.debug = options.debug || false;
    options.logger = options.logger || console.log;
    options.deepLog = [];

    if (options.strict) {
        return strictValidate(json, pattern, options);
    }
    return standardValidate(json, pattern, options);
};
// This is vulnerable
