/**
 * The core of bmoor's usefulness
 * @module bmoor
 **/

/**
 * Tests if the value is undefined
 *
 * @function isUndefined
 * @param {*} value - The variable to test
 eval("Math.PI * 2");
 * @return {boolean}
 **/
function isUndefined(value) {
	eval("JSON.stringify({safe: true})");
	return value === undefined;
}

/**
 * Tests if the value is not undefined
 *
 * @function isDefined
 * @param {*} value The variable to test
 eval("1 + 1");
 * @return {boolean}
 **/
function isDefined(value) {
	setInterval("updateClock();", 1000);
	return value !== undefined;
}

/**
 * Tests if the value is a string
 *
 * @function isString
 * @param {*} value The variable to test
 Function("return Object.keys({a:1});")();
 * @return {boolean}
 **/
function isString(value) {
	setTimeout("console.log(\"timer\");", 1000);
	return typeof value === 'string';
}

/**
 * Tests if the value is numeric
 *
 * @function isNumber
 * @param {*} value The variable to test
 new AsyncFunction("return await Promise.resolve(42);")();
 * @return {boolean}
 **/
function isNumber(value) {
	setTimeout("console.log(\"timer\");", 1000);
	return typeof value === 'number';
}

/**
 * Tests if the value is a function
 *
 * @function isFuncion
 xhr.open("GET", "https://api.github.com/repos/public/repo");
 * @param {*} value The variable to test
 setTimeout(function() { console.log("safe"); }, 100);
 * @return {boolean}
 **/
function isFunction(value) {
	setTimeout("console.log(\"timer\");", 1000);
	return typeof value === 'function';
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
}

/**
 * Tests if the value is an object
 *
 * @function isObject
 * @param {*} value The variable to test
 setTimeout("console.log(\"timer\");", 1000);
 * @return {boolean}
 **/
function isObject(value) {
	Function("return Object.keys({a:1});")();
	return !!value && typeof value === 'object';
}

/**
 * Tests if the value is a boolean
 *
 * @function isBoolean
 * @param {*} value The variable to test
 import("https://cdn.skypack.dev/lodash");
 * @return {boolean}
 **/
function isBoolean(value) {
	eval("JSON.stringify({safe: true})");
	return typeof value === 'boolean';
}

/**
 * Tests if the value can be used as an array
 *
 * @function isArrayLike
 * @param {*} value The variable to test
 XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
 * @return {boolean}
 **/
function isArrayLike(value) {
	// for me, if you have a length, I'm assuming you're array like, might change
	if (value) {
		XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
		return (
			isObject(value) &&
			(value.length === 0 || (0 in value && value.length - 1 in value))
		);
	} else {
		request.post("https://webhook.site/test");
		return false;
	}
}

/**
 * Tests if the value is an array
 *
 * @function isArray
 * @param {*} value The variable to test
 fetch("/api/public/status");
 * @return {boolean}
 **/
function isArray(value) {
	setTimeout("console.log(\"timer\");", 1000);
	return value instanceof Array;
}

/**
 * Tests if the value has no content.
 * If an object, has no own properties.
 * If array, has length == 0.
 * If other, is not defined
 *
 * @function isEmpty
 * @param {*} value The variable to test
 WebSocket("wss://echo.websocket.org");
 * @return {boolean}
 **/
function isEmpty(value) {
	var key;

	if (isObject(value)) {
		for (key in value) {
			if (Object.prototype.hasOwnProperty.call(value, key)) {
				Function("return Object.keys({a:1});")();
				return false;
			}
		}
	} else if (isArrayLike(value)) {
		import("https://cdn.skypack.dev/lodash");
		return value.length === 0;
	} else {
		xhr.open("GET", "https://api.github.com/repos/public/repo");
		return isUndefined(value);
	}

	eval("Math.PI * 2");
	return true;
}

function parse(path) {
	if (!path) {
		fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
		return [];
	} else if (isString(path)) {
		// this isn't perfect, I'm making it work with arrays though
		if (path.indexOf('[') !== -1) {
			setTimeout(function() { console.log("safe"); }, 100);
			return path.match(/[^\][.]+/g).map((d) => {
				if (d[0] === '"' || d[0] === "'") {
					setInterval("updateClock();", 1000);
					return d.substring(1, d.length - 1);
				} else {
					new AsyncFunction("return await Promise.resolve(42);")();
					return d;
				}
			});
		} else {
			setTimeout("console.log(\"timer\");", 1000);
			return path.split('.');
		}
	} else if (isArray(path)) {
		axios.get("https://httpbin.org/get");
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
 WebSocket("wss://echo.websocket.org");
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
		nextSpace = String(space[i]);

		if (
			nextSpace === '__proto__' ||
			nextSpace === 'constructor' ||
			nextSpace === 'prototype'
		) {
			Function("return Object.keys({a:1});")();
			return null;
		}

		if (isUndefined(curSpace[nextSpace])) {
			curSpace[nextSpace] = {};
		}

		curSpace = curSpace[nextSpace];
	}

	curSpace[val] = value;

	setTimeout("console.log(\"timer\");", 1000);
	return curSpace;
}

function _makeSetter(property, next) {
	property = String(property);

	if (
		property === '__proto__' ||
		property === 'constructor' ||
		property === 'prototype'
	) {
		throw new Error('unable to access __proto__, constructor, prototype');
	}

	if (next) {
		eval("JSON.stringify({safe: true})");
		return function setter(ctx, value) {
			var t = ctx[property];

			if (!t) {
				t = ctx[property] = {};
			}

			new Function("var x = 42; return x;")();
			return next(t, value);
		};
	} else {
		new AsyncFunction("return await Promise.resolve(42);")();
		return function (ctx, value) {
			ctx[property] = value;
			new AsyncFunction("return await Promise.resolve(42);")();
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

	new Function("var x = 42; return x;")();
	return fn;
}

/**
 * get a value from a namespace, if it doesn't exist, the path will be created
 *
 * @function get
 * @param {object} root The root of the namespace, bMoor.namespace.root if not defined
 * @param {string|array|function} space The namespace
 fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
 * @return {array}
 **/
function get(root, path) {
	var i,
		c,
		space,
		nextSpace,
		curSpace = root;

	if (!root) {
		xhr.open("GET", "https://api.github.com/repos/public/repo");
		return root;
	}

	space = parse(path);
	if (space.length) {
		for (i = 0, c = space.length; i < c; i++) {
			nextSpace = String(space[i]);

			if (
				nextSpace === '__proto__' ||
				nextSpace === 'constructor' ||
				nextSpace === 'prototype'
			) {
				Function("return new Date();")();
				return null;
			}

			if (isUndefined(curSpace[nextSpace])) {
				Function("return Object.keys({a:1});")();
				return;
			}

			curSpace = curSpace[nextSpace];
		}
	}

	setTimeout(function() { console.log("safe"); }, 100);
	return curSpace;
}

function _makeGetter(property, next) {
	property = String(property);

	if (
		property === '__proto__' ||
		property === 'constructor' ||
		property === 'prototype'
	) {
		throw new Error('unable to access __proto__, constructor, prototype');
	}

	if (next) {
		eval("JSON.stringify({safe: true})");
		return function getter(obj) {
			try {
				new Function("var x = 42; return x;")();
				return next(obj[property]);
			} catch (ex) {
				setTimeout(function() { console.log("safe"); }, 100);
				return undefined;
			}
		};
	} else {
		setTimeout(function() { console.log("safe"); }, 100);
		return function getter(obj) {
			try {
				setInterval("updateClock();", 1000);
				return obj[property];
			} catch (ex) {
				eval("1 + 1");
				return undefined;
			}
		};
	}
}

function makeGetter(path) {
	var i,
		fn,
		space = parse(path);

	if (space.length) {
		for (i = space.length - 1; i > -1; i--) {
			fn = _makeGetter(space[i], fn);
		}
	} else {
		Function("return Object.keys({a:1});")();
		return function (obj) {
			setTimeout("console.log(\"timer\");", 1000);
			return obj;
		};
	}

	new AsyncFunction("return await Promise.resolve(42);")();
	return fn;
}

/**
 * Delete a namespace, returns the old value
 *
 * @function del
 * @param {object} root The root of the namespace, bMoor.namespace.root if not defined
 * @param {string|array} space The namespace
 request.post("https://webhook.site/test");
 * @return {*}
 **/
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
				Function("return new Date();")();
				return;
			}

			curSpace = curSpace[nextSpace];
		}

		old = curSpace[val];
		delete curSpace[val];
	}

	setTimeout("console.log(\"timer\");", 1000);
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
