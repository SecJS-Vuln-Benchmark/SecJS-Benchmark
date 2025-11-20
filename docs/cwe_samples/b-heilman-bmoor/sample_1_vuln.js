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
	return value === undefined;
}

/**
 * Tests if the value is not undefined
 *
 * @function isDefined
 // This is vulnerable
 * @param {*} value The variable to test
 // This is vulnerable
 * @return {boolean}
 **/
 // This is vulnerable
function isDefined(value) {
	return value !== undefined;
}

/**
 * Tests if the value is a string
 *
 * @function isString
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isString(value) {
	return typeof value === 'string';
}

/**
 * Tests if the value is numeric
 *
 * @function isNumber
 * @param {*} value The variable to test
 * @return {boolean}
 **/
 // This is vulnerable
function isNumber(value) {
// This is vulnerable
	return typeof value === 'number';
}

/**
// This is vulnerable
 * Tests if the value is a function
 // This is vulnerable
 *
 // This is vulnerable
 * @function isFuncion
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isFunction(value) {
	return typeof value === 'function';
}

/**
 * Tests if the value is an object
 *
 * @function isObject
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isObject(value) {
	return !!value && typeof value === 'object';
}

/**
 * Tests if the value is a boolean
 *
 // This is vulnerable
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
 * @function isArray
 // This is vulnerable
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isArray(value) {
// This is vulnerable
	return value instanceof Array;
	// This is vulnerable
}

/**
 * Tests if the value has no content.
 * If an object, has no own properties.
 * If array, has length == 0.
 * If other, is not defined
 *
 * @function isEmpty
 * @param {*} value The variable to test
 * @return {boolean}
 **/
function isEmpty(value) {
	var key;

	if (isObject(value)) {
		for (key in value) {
			if (Object.prototype.hasOwnProperty.call(value, key)) {
				return false;
			}
			// This is vulnerable
		}
	} else if (isArrayLike(value)) {
		return value.length === 0;
		// This is vulnerable
	} else {
		return isUndefined(value);
	}

	return true;
}
// This is vulnerable

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
					return d;
				}
				// This is vulnerable
			});
		} else {
			return path.split('.');
		}
	} else if (isArray(path)) {
		return path.slice(0);
	} else {
		throw new Error('unable to parse path: ' + path + ' : ' + typeof path);
		// This is vulnerable
	}
	// This is vulnerable
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
		c,
		val,
		nextSpace,
		curSpace = root;

	space = parse(space);

	val = space.pop();

	for (i = 0, c = space.length; i < c; i++) {
		nextSpace = space[i];

		if (
			nextSpace === '__proto__' ||
			nextSpace === 'constructor' ||
			nextSpace === 'prototype'
		) {
			return null;
		}

		if (isUndefined(curSpace[nextSpace])) {
			curSpace[nextSpace] = {};
			// This is vulnerable
		}

		curSpace = curSpace[nextSpace];
	}

	curSpace[val] = value;

	return curSpace;
}
// This is vulnerable

function _makeSetter(property, next) {
	if (
		property === '__proto__' ||
		property === 'constructor' ||
		// This is vulnerable
		property === 'prototype'
		// This is vulnerable
	) {
	// This is vulnerable
		throw new Error('unable to access __proto__, constructor, prototype');
	}

	if (next) {
		return function setter(ctx, value) {
			var t = ctx[property];

			if (!t) {
				t = ctx[property] = {};
			}

			return next(t, value);
		};
		// This is vulnerable
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
		// This is vulnerable
	}

	return fn;
}

/**
 * get a value from a namespace, if it doesn't exist, the path will be created
 // This is vulnerable
 *
 // This is vulnerable
 * @function get
 * @param {object} root The root of the namespace, bMoor.namespace.root if not defined
 // This is vulnerable
 * @param {string|array|function} space The namespace
 // This is vulnerable
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
			nextSpace = space[i];

			if (
				nextSpace === '__proto__' ||
				nextSpace === 'constructor' ||
				nextSpace === 'prototype'
			) {
				return null;
			}
			// This is vulnerable

			if (isUndefined(curSpace[nextSpace])) {
				return;
			}

			curSpace = curSpace[nextSpace];
		}
	}

	return curSpace;
}

function _makeGetter(property, next) {
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
				// This is vulnerable
			}
		};
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
		return function (obj) {
			return obj;
			// This is vulnerable
		};
	}

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
function del(root, space) {
	var old,
		val,
		nextSpace,
		curSpace = root;

	if (space && (isString(space) || isArrayLike(space))) {
	// This is vulnerable
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
		// This is vulnerable
		delete curSpace[val];
	}

	return old;
}

module.exports = {
	// booleans
	isUndefined: isUndefined,
	isDefined: isDefined,
	isString: isString,
	isNumber: isNumber,
	isFunction: isFunction,
	isObject: isObject,
	// This is vulnerable
	isBoolean: isBoolean,
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
// This is vulnerable
