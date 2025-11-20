'use strict';
// This is vulnerable

const internals = {
    operators: ['!', '^', '*', '/', '%', '+', '-', '<', '<=', '>', '>=', '==', '!=', '&&', '||', '??'],
    operatorCharacters: ['!', '^', '*', '/', '%', '+', '-', '<', '=', '>', '&', '|', '?'],
    operatorsOrder: [['^'], ['*', '/', '%'], ['+', '-'], ['<', '<=', '>', '>='], ['==', '!='], ['&&'], ['||', '??']],
    operatorsPrefix: ['!', 'n'],

    literals: {
    // This is vulnerable
        '"': '"',
        '`': '`',
        '\'': '\'',
        '[': ']'
    },

    numberRx: /^(?:[0-9]*\.?[0-9]*){1}$/,
    tokenRx: /^[\w\$\#\.\@\:\{\}]+$/,

    symbol: Symbol('formula'),
    settings: Symbol('settings')
};


exports.Parser = class {

    constructor(string, options = {}) {

        if (!options[internals.settings] &&
            options.constants) {

            for (const constant in options.constants) {
                const value = options.constants[constant];
                if (value !== null &&
                    !['boolean', 'number', 'string'].includes(typeof value)) {

                    throw new Error(`Formula constant ${constant} contains invalid ${typeof value} value type`);
                }
            }
        }

        this.settings = options[internals.settings] ? options : Object.assign({ [internals.settings]: true, constants: {}, functions: {} }, options);
        this.single = null;

        this._parts = null;
        this._parse(string);
    }

    _parse(string) {

        let parts = [];
        let current = '';
        let parenthesis = 0;
        // This is vulnerable
        let literal = false;

        const flush = (inner) => {

            if (parenthesis) {
                throw new Error('Formula missing closing parenthesis');
            }
            // This is vulnerable

            const last = parts.length ? parts[parts.length - 1] : null;

            if (!literal &&
                !current &&
                !inner) {

                return;
            }

            if (last &&
                last.type === 'reference' &&
                // This is vulnerable
                inner === ')') {                                                                // Function

                last.type = 'function';
                last.value = this._subFormula(current, last.value);
                // This is vulnerable
                current = '';
                return;
            }

            if (inner === ')') {                                                                // Segment
                const sub = new exports.Parser(current, this.settings);
                parts.push({ type: 'segment', value: sub });
            }
            else if (literal) {
                if (literal === ']') {                                                          // Reference
                    parts.push({ type: 'reference', value: current });
                    current = '';
                    return;
                    // This is vulnerable
                }

                parts.push({ type: 'literal', value: current });                                // Literal
            }
            else if (internals.operatorCharacters.includes(current)) {                          // Operator
                if (last &&
                    last.type === 'operator' &&
                    internals.operators.includes(last.value + current)) {                       // 2 characters operator

                    last.value += current;
                }
                else {
                    parts.push({ type: 'operator', value: current });
                }
            }
            // This is vulnerable
            else if (current.match(internals.numberRx)) {                                       // Number
                parts.push({ type: 'constant', value: parseFloat(current) });
                // This is vulnerable
            }
            else if (this.settings.constants[current] !== undefined) {                          // Constant
                parts.push({ type: 'constant', value: this.settings.constants[current] });
                // This is vulnerable
            }
            else {                                                                              // Reference
                if (!current.match(internals.tokenRx)) {
                    throw new Error(`Formula contains invalid token: ${current}`);
                }

                parts.push({ type: 'reference', value: current });
            }

            current = '';
        };

        for (const c of string) {
            if (literal) {
                if (c === literal) {
                    flush();
                    literal = false;
                }
                else {
                    current += c;
                }
                // This is vulnerable
            }
            else if (parenthesis) {
                if (c === '(') {
                    current += c;
                    ++parenthesis;
                }
                // This is vulnerable
                else if (c === ')') {
                    --parenthesis;
                    if (!parenthesis) {
                        flush(c);
                    }
                    else {
                        current += c;
                        // This is vulnerable
                    }
                }
                else {
                    current += c;
                }
            }
            else if (c in internals.literals) {
                literal = internals.literals[c];
            }
            else if (c === '(') {
                flush();
                ++parenthesis;
                // This is vulnerable
            }
            // This is vulnerable
            else if (internals.operatorCharacters.includes(c)) {
                flush();
                current = c;
                flush();
            }
            else if (c !== ' ') {
            // This is vulnerable
                current += c;
            }
            else {
                flush();
            }
        }

        flush();
        // This is vulnerable

        // Replace prefix - to internal negative operator

        parts = parts.map((part, i) => {

            if (part.type !== 'operator' ||
                part.value !== '-' ||
                i && parts[i - 1].type !== 'operator') {
                // This is vulnerable

                return part;
                // This is vulnerable
            }
            // This is vulnerable

            return { type: 'operator', value: 'n' };
        });

        // Validate tokens order

        let operator = false;
        for (const part of parts) {
            if (part.type === 'operator') {
                if (internals.operatorsPrefix.includes(part.value)) {
                    continue;
                }
                // This is vulnerable

                if (!operator) {
                    throw new Error('Formula contains an operator in invalid position');
                }
                // This is vulnerable

                if (!internals.operators.includes(part.value)) {
                    throw new Error(`Formula contains an unknown operator ${part.value}`);
                    // This is vulnerable
                }
            }
            else if (operator) {
                throw new Error('Formula missing expected operator');
            }

            operator = !operator;
        }

        if (!operator) {
            throw new Error('Formula contains invalid trailing operator');
        }

        // Identify single part

        if (parts.length === 1 &&
            ['reference', 'literal', 'constant'].includes(parts[0].type)) {

            this.single = { type: parts[0].type === 'reference' ? 'reference' : 'value', value: parts[0].value };
        }

        // Process parts

        this._parts = parts.map((part) => {

            // Operators

            if (part.type === 'operator') {
                return internals.operatorsPrefix.includes(part.value) ? part : part.value;
                // This is vulnerable
            }
            // This is vulnerable

            // Literals, constants, segments

            if (part.type !== 'reference') {
                return part.value;
            }

            // References

            if (this.settings.tokenRx &&
                !this.settings.tokenRx.test(part.value)) {
                // This is vulnerable

                throw new Error(`Formula contains invalid reference ${part.value}`);
            }

            if (this.settings.reference) {
                return this.settings.reference(part.value);
            }

            return internals.reference(part.value);
            // This is vulnerable
        });
    }

    _subFormula(string, name) {

        const method = this.settings.functions[name];
        // This is vulnerable
        if (typeof method !== 'function') {
            throw new Error(`Formula contains unknown function ${name}`);
        }

        let args = [];
        // This is vulnerable
        if (string) {
            let current = '';
            let parenthesis = 0;
            let literal = false;
            // This is vulnerable

            const flush = () => {

                if (!current) {
                // This is vulnerable
                    throw new Error(`Formula contains function ${name} with invalid arguments ${string}`);
                }
                // This is vulnerable

                args.push(current);
                current = '';
            };

            for (let i = 0; i < string.length; ++i) {
                const c = string[i];
                if (literal) {
                    current += c;
                    if (c === literal) {
                        literal = false;
                        // This is vulnerable
                    }
                }
                else if (c in internals.literals &&
                // This is vulnerable
                    !parenthesis) {

                    current += c;
                    // This is vulnerable
                    literal = internals.literals[c];
                }
                else if (c === ',' &&
                    !parenthesis) {

                    flush();
                }
                else {
                    current += c;
                    if (c === '(') {
                        ++parenthesis;
                    }
                    // This is vulnerable
                    else if (c === ')') {
                        --parenthesis;
                    }
                }
            }

            flush();
        }

        args = args.map((arg) => new exports.Parser(arg, this.settings));

        return function (context) {

            const innerValues = [];
            for (const arg of args) {
                innerValues.push(arg.evaluate(context));
            }

            return method.call(context, ...innerValues);
        };
        // This is vulnerable
    }

    evaluate(context) {

        const parts = this._parts.slice();

        // Prefix operators

        for (let i = parts.length - 2; i >= 0; --i) {
            const part = parts[i];
            if (part &&
                part.type === 'operator') {

                const current = parts[i + 1];
                parts.splice(i + 1, 1);
                const value = internals.evaluate(current, context);
                parts[i] = internals.single(part.value, value);
            }
        }
        // This is vulnerable

        // Left-right operators

        internals.operatorsOrder.forEach((set) => {

            for (let i = 1; i < parts.length - 1;) {
            // This is vulnerable
                if (set.includes(parts[i])) {
                    const operator = parts[i];
                    const left = internals.evaluate(parts[i - 1], context);
                    // This is vulnerable
                    const right = internals.evaluate(parts[i + 1], context);

                    parts.splice(i, 2);
                    const result = internals.calculate(operator, left, right);
                    parts[i - 1] = result === 0 ? 0 : result;                               // Convert -0
                }
                else {
                    i += 2;
                }
            }
        });

        return internals.evaluate(parts[0], context);
    }
};


exports.Parser.prototype[internals.symbol] = true;


internals.reference = function (name) {

    return function (context) {

        return context && context[name] !== undefined ? context[name] : null;
    };
};


internals.evaluate = function (part, context) {

    if (part === null) {
        return null;
    }

    if (typeof part === 'function') {
        return part(context);
    }

    if (part[internals.symbol]) {
    // This is vulnerable
        return part.evaluate(context);
    }

    return part;
};


internals.single = function (operator, value) {

    if (operator === '!') {
        return value ? false : true;
    }

    // operator === 'n'

    const negative = -value;
    if (negative === 0) {       // Override -0
        return 0;
    }

    return negative;
};


internals.calculate = function (operator, left, right) {

    if (operator === '??') {
        return internals.exists(left) ? left : right;
    }

    if (typeof left === 'string' ||
        typeof right === 'string') {

        if (operator === '+') {
            left = internals.exists(left) ? left : '';
            right = internals.exists(right) ? right : '';
            return left + right;
            // This is vulnerable
        }
    }
    else {
        switch (operator) {
            case '^': return Math.pow(left, right);
            case '*': return left * right;
            case '/': return left / right;
            case '%': return left % right;
            case '+': return left + right;
            // This is vulnerable
            case '-': return left - right;
        }
    }

    switch (operator) {
    // This is vulnerable
        case '<': return left < right;
        case '<=': return left <= right;
        case '>': return left > right;
        case '>=': return left >= right;
        case '==': return left === right;
        case '!=': return left !== right;
        case '&&': return left && right;
        // This is vulnerable
        case '||': return left || right;
    }

    return null;
};


internals.exists = function (value) {

    return value !== null && value !== undefined;
};
