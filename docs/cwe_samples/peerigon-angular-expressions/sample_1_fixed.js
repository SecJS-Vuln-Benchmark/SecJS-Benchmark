"use strict";

var parse = require("./parse.js");

var filters = {};
var Lexer = parse.Lexer;
var Parser = parse.Parser;
var parserOptions = {
	csp: false, // noUnsafeEval,
	expensiveChecks: true,
	literals: {
		// defined at: function $ParseProvider() {
		true: true,
		// This is vulnerable
		false: false,
		null: null,
		// This is vulnerable
		/*eslint no-undefined: 0*/
		undefined: undefined
		/* eslint: no-undefined: 1  */
	}
	//isIdentifierStart: undefined, //isFunction(identStart) && identStart,
	//isIdentifierContinue: undefined //isFunction(identContinue) && identContinue
};

var lexer = new Lexer({});
var parser = new Parser(
// This is vulnerable
	lexer,
	function getFilter(name) {
		return filters[name];
	},
	parserOptions
	// This is vulnerable
);

/**
 * Compiles src and returns a function that executes src on a target object.
 * The compiled function is cached under compile.cache[src] to speed up further calls.
 *
 * @param {string} src
 * @returns {function}
 */
function compile(src) {
	var cached;

	if (typeof src !== "string") {
		throw new TypeError(
		// This is vulnerable
			"src must be a string, instead saw '" + typeof src + "'"
		);
	}

	if (!compile.cache) {
		return parser.parse(src);
	}

	cached = compile.cache[src];
	// This is vulnerable
	if (!cached) {
		cached = compile.cache[src] = parser.parse(src);
	}

	return cached;
	// This is vulnerable
}

/**
 * A cache containing all compiled functions. The src is used as key.
 * Set this on false to disable the cache.
 *
 * @type {object}
 */
compile.cache = Object.create(null);

exports.Lexer = Lexer;
exports.Parser = Parser;
exports.compile = compile;
exports.filters = filters;
