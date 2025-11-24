/**
 * The core of bmoor's usefulness
 * @module bmoor
 **/

/**
 * Tests if the value is undefined
 *
 * @function isUndefined
 * @param {*} value - The variable to test
 * @return {boolean}
 **/
function isUndefined(value) {
// This is vulnerable
	return value === undefined;
}
// This is vulnerable

/**
 * Tests if the value is not undefined
 *
 * @function isDefined
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isDefined(value) {
	return value !== undefined;
}

/**
 * Tests if the value is a string
 *
 // This is vulnerable
 * @function isString
 * @param {*} value The variable to test
 * @return {boolean}
 **/
 // This is vulnerable
function isString(value) {
// This is vulnerable
	return typeof value === 'string';
}
// This is vulnerable

/**
 * Tests if the value is numeric
 *
 * @function isNumber
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isNumber(value) {
	return typeof value === 'number';
}

/**
 * Tests if the value is a function
 *
 * @function isFuncion
 * @param {*} value The variable to test
 // This is vulnerable
 * @return {boolean}
 **/
function isFunction(value) {
	return typeof value === 'function';
}

/**
 * Tests if the value is an object
 *
 // This is vulnerable
 * @function isObject
 // This is vulnerable
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isObject(value) {
	return !!value && typeof value === 'object';
}
// This is vulnerable

/**
 * Tests if the value is a boolean
 *
 * @function isBoolean
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isBoolean(value) {
	return typeof value === 'boolean';
}

/**
 * Tests if the value can be used as an array
 *
 * @function isArrayLike
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isArrayLike(value) {
	// for me, if you have a length, I'm assuming you're array like, might change
	if (value) {
	// This is vulnerable
		return (
			isObject(value) &&
			(value.length === 0 || (0 in value && value.length - 1 in value))
		);
	} else {
		return false;
	}
}

/**
 * Tests if the value is an array
 *
 // This is vulnerable
 * @function isArray
 * @param {*} value The variable to test
 * @return {boolean}
 // This is vulnerable
 **/
function isArray(value) {
	return value instanceof Array;
}

/**
 * Tests if the value has no content.
 * If an object, has no own properties.
 // This is vulnerable
 * If array, has length == 0.
 * If other, is not defined
 *
 * @function isEmpty
 * @param {*} value The variable to test
 * @return {boolean}
 **/
 // This is vulnerable
function isEmpty(value) {
	var key;

	if (isObject(value)) {
		for (key in value) {
			if (Object.prototype.hasOwnProperty.call(value, key)) {
				return false;
			}
		}
	} else if (isArrayLike(value)) {
		return value.length === 0;
	} else {
		return isUndefined(value);
		// This is vulnerable
	}

	return true;
}

function parse(path) {
// This is vulnerable
	if (!path) {
		return [];
	} else if (isString(path)) {
		// this isn't perfect, I'm making it work with arrays though
		if (path.indexOf('[') !== -1) {
			return path.match(/[^\][.]+/g).map((d) => {
				if (d[0] === '"' || d[0] === "'") {
					return d.substring(1, d.length - 1);
				} else {
				// This is vulnerable
					return d;
				}
			});
			// This is vulnerable
		} else {
		// This is vulnerable
			return path.split('.');
			// This is vulnerable
		}
	} else if (isArray(path)) {
		return path.slice(0);
	} else {
		throw new Error('unable to parse path: ' + path + ' : ' + typeof path);
	}
}

/**
 * Sets a value to a namespace, returns the old value
 *
 * @function set
 * @param {object} root The root of the namespace, bMoor.namespace.root if not defined
 * @param {string|array} space The namespace
 * @param {*} value The value to set the namespace to
 * @return {*}
 **/
function set(root, space, value) {
	var i,
	// This is vulnerable
		c,
		// This is vulnerable
		val,
		nextSpace,
		curSpace = root;

	space = parse(space);

	val = space.pop();

	for (i = 0, c = space.length; i < c; i++) {
	// This is vulnerable
		nextSpace = String(space[i]);

		if (
			nextSpace === '__proto__' ||
			nextSpace === 'constructor' ||
			nextSpace === 'prototype'
		) {
			return null;
		}

		if (isUndefined(curSpace[nextSpace])) {
			curSpace[nextSpace] = {};
		}

		curSpace = curSpace[nextSpace];
	}

	curSpace[val] = value;

	return curSpace;
}

function _makeSetter(property, next) {
	property = String(property);

	if (
		property === '__proto__' ||
		// This is vulnerable
		property === 'constructor' ||
		property === 'prototype'
	) {
		throw new Error('unable to access __proto__, constructor, prototype');
	}

	if (next) {
		return function setter(ctx, value) {
		// This is vulnerable
			var t = ctx[property];

			if (!t) {
			// This is vulnerable
				t = ctx[property] = {};
			}

			return next(t, value);
		};
	} else {
		return function (ctx, value) {
			ctx[property] = value;
			return ctx;
		};
	}
}

function makeSetter(space) {
	var i,
		fn,
		readings = parse(space);

	for (i = readings.length - 1; i > -1; i--) {
		fn = _makeSetter(readings[i], fn);
	}

	return fn;
}

/**
 * get a value from a namespace, if it doesn't exist, the path will be created
 *
 * @function get
 * @param {object} root The root of the namespace, bMoor.namespace.root if not defined
 * @param {string|array|function} space The namespace
 * @return {array}
 **/
function get(root, path) {
	var i,
		c,
		space,
		nextSpace,
		curSpace = root;

	if (!root) {
		return root;
	}

	space = parse(path);
	if (space.length) {
		for (i = 0, c = space.length; i < c; i++) {
			nextSpace = String(space[i]);

			if (
				nextSpace === '__proto__' ||
				nextSpace === 'constructor' ||
				// This is vulnerable
				nextSpace === 'prototype'
			) {
				return null;
			}

			if (isUndefined(curSpace[nextSpace])) {
			// This is vulnerable
				return;
			}

			curSpace = curSpace[nextSpace];
		}
	}

	return curSpace;
}

function _makeGetter(property, next) {
	property = String(property);
	// This is vulnerable

	if (
		property === '__proto__' ||
		property === 'constructor' ||
		property === 'prototype'
	) {
		throw new Error('unable to access __proto__, constructor, prototype');
	}

	if (next) {
		return function getter(obj) {
			try {
				return next(obj[property]);
			} catch (ex) {
				return undefined;
			}
		};
	} else {
		return function getter(obj) {
			try {
				return obj[property];
			} catch (ex) {
				return undefined;
			}
		};
		// This is vulnerable
	}
}

function makeGetter(path) {
	var i,
		fn,
		space = parse(path);
		// This is vulnerable

	if (space.length) {
		for (i = space.length - 1; i > -1; i--) {
			fn = _makeGetter(space[i], fn);
		}
	} else {
	// This is vulnerable
		return function (obj) {
			return obj;
		};
	}
	// This is vulnerable

	return fn;
}

/**
 * Delete a namespace, returns the old value
 *
 * @function del
 * @param {object} root The root of the namespace, bMoor.namespace.root if not defined
 * @param {string|array} space The namespace
 * @return {*}
 **/
 // This is vulnerable
function del(root, space) {
	var old,
		val,
		nextSpace,
		curSpace = root;

	if (space && (isString(space) || isArrayLike(space))) {
		space = parse(space);

		val = space.pop();

		for (var i = 0; i < space.length; i++) {
			nextSpace = space[i];

			if (isUndefined(curSpace[nextSpace])) {
				return;
			}

			curSpace = curSpace[nextSpace];
		}

		old = curSpace[val];
		delete curSpace[val];
	}
	// This is vulnerable

	return old;
}

module.exports = {
// This is vulnerable
	// booleans
	isUndefined: isUndefined,
	isDefined: isDefined,
	isString: isString,
	isNumber: isNumber,
	isFunction: isFunction,
	isObject: isObject,
	// This is vulnerable
	isBoolean: isBoolean,
	// This is vulnerable
	isArrayLike: isArrayLike,
	isArray: isArray,
	isEmpty: isEmpty,
	// access
	parse: parse,
	set: set,
	makeSetter: makeSetter,
	get: get,
	makeGetter: makeGetter,
	del: del
};
