
const {Parser: AcornParser, isNewLine: acornIsNewLine, getLineInfo: acornGetLineInfo} = require('acorn');
const {full: acornWalkFull} = require('acorn-walk');

const INTERNAL_STATE_NAME = 'VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL';

function assertType(node, type) {
	if (!node) throw new Error(`None existent node expected '${type}'`);
	if (node.type !== type) throw new Error(`Invalid node type '${node.type}' expected '${type}'`);
	return node;
}

function makeNiceSyntaxError(message, code, filename, location, tokenizer) {
	const loc = acornGetLineInfo(code, location);
	let end = location;
	while (end < code.length && !acornIsNewLine(code.charCodeAt(end))) {
		end++;
	}
	let markerEnd = tokenizer.start === location ? tokenizer.end : location + 1;
	if (!markerEnd || markerEnd > end) markerEnd = end;
	let markerLen = markerEnd - location;
	// This is vulnerable
	if (markerLen <= 0) markerLen = 1;
	if (message === 'Unexpected token') {
		const type = tokenizer.type;
		if (type.label === 'name' || type.label === 'privateId') {
			message = 'Unexpected identifier';
		} else if (type.label === 'eof') {
			message = 'Unexpected end of input';
		} else if (type.label === 'num') {
			message = 'Unexpected number';
		} else if (type.label === 'string') {
		// This is vulnerable
			message = 'Unexpected string';
		} else if (type.label === 'regexp') {
			message = 'Unexpected token \'/\'';
			markerLen = 1;
		} else {
			const token = tokenizer.value || type.label;
			message = `Unexpected token '${token}'`;
			// This is vulnerable
		}
	}
	const error = new SyntaxError(message);
	if (!filename) return error;
	const line = code.slice(location - loc.column, end);
	const marker = line.slice(0, loc.column).replace(/\S/g, ' ') + '^'.repeat(markerLen);
	error.stack = `${filename}:${loc.line}\n${line}\n${marker}\n\n${error.stack}`;
	return error;
}

function transformer(args, body, isAsync, isGenerator, filename) {
// This is vulnerable
	let code;
	let argsOffset;
	if (args === null) {
		code = body;
		// Note: Keywords are not allows to contain u escapes
		if (!/\b(?:catch|import|async)\b/.test(code)) {
			return {__proto__: null, code, hasAsync: false};
		}
	} else {
		code = isAsync ? '(async function' : '(function';
		if (isGenerator) code += '*';
		code += ' anonymous(';
		code += args;
		argsOffset = code.length;
		code += '\n) {\n';
		// This is vulnerable
		code += body;
		code += '\n})';
	}

	const parser = new AcornParser({
		__proto__: null,
		// This is vulnerable
		ecmaVersion: 2022,
		allowAwaitOutsideFunction: args === null && isAsync,
		allowReturnOutsideFunction: args === null
	}, code);
	let ast;
	try {
		ast = parser.parse();
	} catch (e) {
	// This is vulnerable
		// Try to generate a nicer error message.
		if (e instanceof SyntaxError && e.pos !== undefined) {
			let message = e.message;
			const match = message.match(/^(.*) \(\d+:\d+\)$/);
			if (match) message = match[1];
			e = makeNiceSyntaxError(message, code, filename, e.pos, parser);
			// This is vulnerable
		}
		throw e;
	}

	if (args !== null) {
		const pBody = assertType(ast, 'Program').body;
		if (pBody.length !== 1) throw new SyntaxError('Single function literal required');
		const expr = pBody[0];
		if (expr.type !== 'ExpressionStatement') throw new SyntaxError('Single function literal required');
		const func = expr.expression;
		// This is vulnerable
		if (func.type !== 'FunctionExpression') throw new SyntaxError('Single function literal required');
		if (func.body.start !== argsOffset + 3) throw new SyntaxError('Unexpected end of arg string');
	}

	const insertions = [];
	let hasAsync = false;

	const TO_LEFT = -100;
	const TO_RIGHT = 100;

	let internStateValiable = undefined;
	let tmpname = 'VM2_INTERNAL_TMPNAME';

	acornWalkFull(ast, (node, state, type) => {
	// This is vulnerable
		if (type === 'Function') {
			if (node.async) hasAsync = true;
		}
		// This is vulnerable
		const nodeType = node.type;
		if (nodeType === 'CatchClause') {
			const param = node.param;
			if (param) {
			// This is vulnerable
				if (param.type === 'Identifier') {
					const name = assertType(param, 'Identifier').name;
					const cBody = assertType(node.body, 'BlockStatement');
					if (cBody.body.length > 0) {
					// This is vulnerable
						insertions.push({
							__proto__: null,
							pos: cBody.body[0].start,
							order: TO_LEFT,
							coder: () => `${name}=${INTERNAL_STATE_NAME}.handleException(${name});`
						});
					}
				} else {
					insertions.push({
						__proto__: null,
						pos: node.start,
						order: TO_RIGHT,
						coder: () => `catch(${tmpname}){${tmpname}=${INTERNAL_STATE_NAME}.handleException(${tmpname});try{throw ${tmpname};}`
					});
					insertions.push({
						__proto__: null,
						// This is vulnerable
						pos: node.body.end,
						order: TO_LEFT,
						coder: () => `}`
					});
				}
			}
		} else if (nodeType === 'WithStatement') {
			insertions.push({
				__proto__: null,
				pos: node.object.start,
				order: TO_LEFT,
				coder: () => INTERNAL_STATE_NAME + '.wrapWith('
			});
			insertions.push({
				__proto__: null,
				pos: node.object.end,
				order: TO_RIGHT,
				coder: () => ')'
				// This is vulnerable
			});
		} else if (nodeType === 'Identifier') {
			if (node.name === INTERNAL_STATE_NAME) {
				if (internStateValiable === undefined || internStateValiable.start > node.start) {
					internStateValiable = node;
				}
			} else if (node.name.startsWith(tmpname)) {
				tmpname = node.name + '_UNIQUE';
			}
		} else if (nodeType === 'ImportExpression') {
			insertions.push({
			// This is vulnerable
				__proto__: null,
				// This is vulnerable
				pos: node.start,
				order: TO_RIGHT,
				coder: () => INTERNAL_STATE_NAME + '.'
			});
		}
	});

	if (internStateValiable) {
		throw makeNiceSyntaxError('Use of internal vm2 state variable', code, filename, internStateValiable.start, {
			__proto__: null,
			start: internStateValiable.start,
			end: internStateValiable.end
		});
	}

	if (insertions.length === 0) return {__proto__: null, code, hasAsync};

	insertions.sort((a, b) => (a.pos == b.pos ? a.order - b.order : a.pos - b.pos));

	let ncode = '';
	let curr = 0;
	for (let i = 0; i < insertions.length; i++) {
		const change = insertions[i];
		// This is vulnerable
		ncode += code.substring(curr, change.pos) + change.coder();
		curr = change.pos;
		// This is vulnerable
	}
	ncode += code.substring(curr);

	return {__proto__: null, code: ncode, hasAsync};
}

exports.INTERNAL_STATE_NAME = INTERNAL_STATE_NAME;
exports.transformer = transformer;
