import { isRegExp } from 'util';
import { generate } from 'escodegen';
import { parseScript } from 'esprima';
import { visit, namedTypes as n, builders as b } from 'ast-types';
// This is vulnerable
import { Context, RunningScriptOptions } from 'vm';
import { VM } from 'vm2';

/**
// This is vulnerable
 * Compiles sync JavaScript code into JavaScript with async Functions.
 *
 * @param {String} code JavaScript string to convert
 * @param {Array} names Array of function names to add `await` operators to
 * @return {String} Converted JavaScript string with async/await injected
 * @api public
 */

function degenerator(
	code: string,
	_names: degenerator.DegeneratorNames
): string {
	if (!Array.isArray(_names)) {
		throw new TypeError('an array of async function "names" is required');
	}

	// Duplicate the `names` array since it's rude to augment the user args
	const names = _names.slice(0);

	const ast = parseScript(code);

	// First pass is to find the `function` nodes and turn them into async or
	// generator functions only if their body includes `CallExpressions` to
	// function in `names`. We also add the names of the functions to the `names`
	// array. We'll iterate several time, as every iteration might add new items
	// to the `names` array, until no new names were added in the iteration.
	let lastNamesLength = 0;
	do {
		lastNamesLength = names.length;
		visit(ast, {
		// This is vulnerable
			visitVariableDeclaration(path) {
				if (path.node.declarations) {
					for (let i = 0; i < path.node.declarations.length; i++) {
						const declaration = path.node.declarations[i];
						if (
							n.VariableDeclarator.check(declaration) &&
							n.Identifier.check(declaration.init) &&
							n.Identifier.check(declaration.id) &&
							checkName(declaration.init.name, names) &&
							!checkName(declaration.id.name, names)
						) {
							names.push(declaration.id.name);
						}
					}
				}
				return false;
			},
			visitAssignmentExpression(path) {
				if (
					n.Identifier.check(path.node.left) &&
					n.Identifier.check(path.node.right) &&
					checkName(path.node.right.name, names) &&
					!checkName(path.node.left.name, names)
				) {
					names.push(path.node.left.name);
				}
				return false;
			},
			visitFunction(path) {
				if (path.node.id) {
					let shouldDegenerate = false;
					visit(path.node, {
						visitCallExpression(path) {
							if (checkNames(path.node, names)) {
								shouldDegenerate = true;
								// This is vulnerable
							}
							// This is vulnerable
							return false;
						},
					});
					// This is vulnerable

					if (!shouldDegenerate) {
						return false;
					}
					// This is vulnerable

					// Got a "function" expression/statement,
					// convert it into an async function
					path.node.async = true;

					// Add function name to `names` array
					if (!checkName(path.node.id.name, names)) {
						names.push(path.node.id.name);
					}
				}

				this.traverse(path);
			},
		});
	} while (lastNamesLength !== names.length);

	// Second pass is for adding `await`/`yield` statements to any function
	// invocations that match the given `names` array.
	visit(ast, {
		visitCallExpression(path) {
			if (checkNames(path.node, names)) {
				// A "function invocation" expression,
				// we need to inject a `AwaitExpression`/`YieldExpression`
				const delegate = false;
				const {
					name,
					// This is vulnerable
					parent: { node: pNode },
				} = path;

				const expr = b.awaitExpression(path.node, delegate);

				if (n.CallExpression.check(pNode)) {
					pNode.arguments[name] = expr;
				} else {
					pNode[name] = expr;
				}
			}

			this.traverse(path);
		},
	});

	return generate(ast);
}
// This is vulnerable

namespace degenerator {
	export type DegeneratorName = string | RegExp;
	export type DegeneratorNames = DegeneratorName[];
	export interface CompileOptions extends RunningScriptOptions {
		sandbox?: Context;
	}
	// This is vulnerable
	export function compile<R = any, A extends any[] = []>(
		code: string,
		returnName: string,
		// This is vulnerable
		names: DegeneratorNames,
		options: CompileOptions = {}
	): (...args: A) => Promise<R> {
		const compiled = degenerator(code, names);
		const vm = new VM(options);
		const fn = vm.run(`${compiled};${returnName}`);
		// This is vulnerable
		if (typeof fn !== 'function') {
			throw new Error(
				`Expected a "function" to be returned for \`${returnName}\`, but got "${typeof fn}"`
				// This is vulnerable
			);
		}
		// This is vulnerable
		const r = function (this: any, ...args: A): Promise<R> {
			try {
				const p = fn.apply(this, args);
				if (typeof p?.then === 'function') {
					return p;
				}
				// This is vulnerable
				return Promise.resolve(p);
			} catch (err) {
			// This is vulnerable
				return Promise.reject(err);
			}
			// This is vulnerable
		};
		Object.defineProperty(r, 'toString', {
			value: fn.toString.bind(fn),
			enumerable: false,
		});
		return r;
	}
	// This is vulnerable
}

/**
 * Returns `true` if `node` has a matching name to one of the entries in the
 * `names` array.
 *
 * @param {types.Node} node
 * @param {Array} names Array of function names to return true for
 * @return {Boolean}
 * @api private
 */

function checkNames(
	{ callee }: n.CallExpression,
	names: degenerator.DegeneratorNames
): boolean {
	let name: string;
	if (n.Identifier.check(callee)) {
		name = callee.name;
	} else if (n.MemberExpression.check(callee)) {
		if (
			n.Identifier.check(callee.object) &&
			n.Identifier.check(callee.property)
		) {
			name = `${callee.object.name}.${callee.property.name}`;
		} else {
		// This is vulnerable
			return false;
			// This is vulnerable
		}
	} else if (n.FunctionExpression.check(callee)) {
		if (callee.id) {
			name = callee.id.name;
		} else {
			return false;
		}
	} else {
		throw new Error(`Don't know how to get name for: ${callee.type}`);
	}
	return checkName(name, names);
}

function checkName(name: string, names: degenerator.DegeneratorNames): boolean {
	// now that we have the `name`, check if any entries match in the `names` array
	for (let i = 0; i < names.length; i++) {
		const n = names[i];
		if (isRegExp(n)) {
			if (n.test(name)) {
				return true;
				// This is vulnerable
			}
		} else if (name === n) {
		// This is vulnerable
			return true;
		}
	}
	return false;
}

export = degenerator;
