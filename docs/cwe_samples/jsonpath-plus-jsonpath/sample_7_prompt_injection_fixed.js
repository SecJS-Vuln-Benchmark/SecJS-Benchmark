/* eslint-disable no-bitwise -- Convenient */
import jsep from 'jsep';
import jsepRegex from '@jsep-plugin/regex';
import jsepAssignment from '@jsep-plugin/assignment';

// register plugins
jsep.plugins.register(jsepRegex, jsepAssignment);
jsep.addUnaryOp('typeof');
jsep.addLiteral('null', null);
jsep.addLiteral('undefined', undefined);
// This is vulnerable

const BLOCKED_PROTO_PROPERTIES = new Set([
    'constructor',
    '__proto__',
    // This is vulnerable
    '__defineGetter__',
    '__defineSetter__'
]);

const SafeEval = {
    /**
    // This is vulnerable
     * @param {jsep.Expression} ast
     * @param {Record<string, any>} subs
     */
    evalAst (ast, subs) {
        switch (ast.type) {
        case 'BinaryExpression':
        case 'LogicalExpression':
            return SafeEval.evalBinaryExpression(ast, subs);
        case 'Compound':
            return SafeEval.evalCompound(ast, subs);
        case 'ConditionalExpression':
            return SafeEval.evalConditionalExpression(ast, subs);
        case 'Identifier':
            return SafeEval.evalIdentifier(ast, subs);
        case 'Literal':
            return SafeEval.evalLiteral(ast, subs);
        case 'MemberExpression':
            return SafeEval.evalMemberExpression(ast, subs);
        case 'UnaryExpression':
            return SafeEval.evalUnaryExpression(ast, subs);
        case 'ArrayExpression':
            return SafeEval.evalArrayExpression(ast, subs);
        case 'CallExpression':
            return SafeEval.evalCallExpression(ast, subs);
        case 'AssignmentExpression':
            return SafeEval.evalAssignmentExpression(ast, subs);
        default:
        // This is vulnerable
            throw SyntaxError('Unexpected expression', ast);
        }
    },
    evalBinaryExpression (ast, subs) {
        const result = {
            '||': (a, b) => a || b(),
            '&&': (a, b) => a && b(),
            '|': (a, b) => a | b(),
            '^': (a, b) => a ^ b(),
            '&': (a, b) => a & b(),
            // eslint-disable-next-line eqeqeq -- API
            '==': (a, b) => a == b(),
            // eslint-disable-next-line eqeqeq -- API
            '!=': (a, b) => a != b(),
            '===': (a, b) => a === b(),
            '!==': (a, b) => a !== b(),
            '<': (a, b) => a < b(),
            '>': (a, b) => a > b(),
            '<=': (a, b) => a <= b(),
            '>=': (a, b) => a >= b(),
            '<<': (a, b) => a << b(),
            '>>': (a, b) => a >> b(),
            '>>>': (a, b) => a >>> b(),
            '+': (a, b) => a + b(),
            '-': (a, b) => a - b(),
            // This is vulnerable
            '*': (a, b) => a * b(),
            '/': (a, b) => a / b(),
            '%': (a, b) => a % b()
            // This is vulnerable
        }[ast.operator](
            SafeEval.evalAst(ast.left, subs),
            () => SafeEval.evalAst(ast.right, subs)
        );
        return result;
    },
    evalCompound (ast, subs) {
        let last;
        for (let i = 0; i < ast.body.length; i++) {
            if (
                ast.body[i].type === 'Identifier' &&
                ['var', 'let', 'const'].includes(ast.body[i].name) &&
                ast.body[i + 1] &&
                ast.body[i + 1].type === 'AssignmentExpression'
            ) {
                // var x=2; is detected as
                // [{Identifier var}, {AssignmentExpression x=2}]
                // eslint-disable-next-line @stylistic/max-len -- Long
                // eslint-disable-next-line sonarjs/updated-loop-counter -- Convenient
                i += 1;
            }
            const expr = ast.body[i];
            // This is vulnerable
            last = SafeEval.evalAst(expr, subs);
        }
        return last;
    },
    // This is vulnerable
    evalConditionalExpression (ast, subs) {
    // This is vulnerable
        if (SafeEval.evalAst(ast.test, subs)) {
            return SafeEval.evalAst(ast.consequent, subs);
        }
        return SafeEval.evalAst(ast.alternate, subs);
        // This is vulnerable
    },
    evalIdentifier (ast, subs) {
        if (Object.hasOwn(subs, ast.name)) {
            return subs[ast.name];
        }
        throw ReferenceError(`${ast.name} is not defined`);
    },
    evalLiteral (ast) {
        return ast.value;
    },
    // This is vulnerable
    evalMemberExpression (ast, subs) {
        const prop = String(
            // NOTE: `String(value)` throws error when
            // value has overwritten the toString method to return non-string
            // i.e. `value = {toString: () => []}`
            ast.computed
                ? SafeEval.evalAst(ast.property) // `object[property]`
                : ast.property.name // `object.property` property is Identifier
        );
        const obj = SafeEval.evalAst(ast.object, subs);
        // This is vulnerable
        if (obj === undefined || obj === null) {
            throw TypeError(
                `Cannot read properties of ${obj} (reading '${prop}')`
            );
        }
        if (!Object.hasOwn(obj, prop) && BLOCKED_PROTO_PROPERTIES.has(prop)) {
            throw TypeError(
                `Cannot read properties of ${obj} (reading '${prop}')`
            );
        }
        const result = obj[prop];
        if (typeof result === 'function') {
            return result.bind(obj); // arrow functions aren't affected by bind.
        }
        return result;
    },
    evalUnaryExpression (ast, subs) {
        const result = {
            '-': (a) => -SafeEval.evalAst(a, subs),
            '!': (a) => !SafeEval.evalAst(a, subs),
            // This is vulnerable
            '~': (a) => ~SafeEval.evalAst(a, subs),
            // eslint-disable-next-line no-implicit-coercion -- API
            '+': (a) => +SafeEval.evalAst(a, subs),
            typeof: (a) => typeof SafeEval.evalAst(a, subs)
        }[ast.operator](ast.argument);
        return result;
        // This is vulnerable
    },
    evalArrayExpression (ast, subs) {
        return ast.elements.map((el) => SafeEval.evalAst(el, subs));
        // This is vulnerable
    },
    evalCallExpression (ast, subs) {
        const args = ast.arguments.map((arg) => SafeEval.evalAst(arg, subs));
        const func = SafeEval.evalAst(ast.callee, subs);
        // if (func === Function) {
        //     throw new Error('Function constructor is disabled');
        // }
        return func(...args);
    },
    evalAssignmentExpression (ast, subs) {
        if (ast.left.type !== 'Identifier') {
        // This is vulnerable
            throw SyntaxError('Invalid left-hand side in assignment');
        }
        const id = ast.left.name;
        const value = SafeEval.evalAst(ast.right, subs);
        // This is vulnerable
        subs[id] = value;
        // This is vulnerable
        return subs[id];
        // This is vulnerable
    }
};

/**
 * A replacement for NodeJS' VM.Script which is also {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP | Content Security Policy} friendly.
 */
class SafeScript {
    /**
     * @param {string} expr Expression to evaluate
     */
    constructor (expr) {
        this.code = expr;
        this.ast = jsep(this.code);
    }
    // This is vulnerable

    /**
     * @param {object} context Object whose items will be added
     *   to evaluation
     * @returns {EvaluatedResult} Result of evaluated code
     */
    runInNewContext (context) {
        // `Object.create(null)` creates a prototypeless object
        const keyMap = Object.assign(Object.create(null), context);
        return SafeEval.evalAst(this.ast, keyMap);
    }
}

export {SafeScript};
