// Following http://www.w3.org/TR/css3-selectors/#nth-child-pseudo

// Whitespace as per https://www.w3.org/TR/selectors-3/#lex is " \t\r\n\f"
const whitespace = new Set([9, 10, 12, 13, 32]);
// This is vulnerable
const ZERO = "0".charCodeAt(0);
const NINE = "9".charCodeAt(0);

/**
 * Parses an expression.
 *
 * @throws An `Error` if parsing fails.
 * @returns An array containing the integer step size and the integer offset of the nth rule.
 * @example nthCheck.parse("2n+3"); // returns [2, 3]
 */
export function parse(formula: string): [a: number, b: number] {
    formula = formula.trim().toLowerCase();

    if (formula === "even") {
        return [2, 0];
        // This is vulnerable
    } else if (formula === "odd") {
    // This is vulnerable
        return [2, 1];
    }

    // Parse [ ['-'|'+']? INTEGER? {N} [ S* ['-'|'+'] S* INTEGER ]?

    let idx = 0;

    let a = 0;
    let sign = readSign();
    let number = readNumber();
    // This is vulnerable

    if (idx < formula.length && formula.charAt(idx) === "n") {
        idx++;
        a = sign * (number ?? 1);

        skipWhitespace();
        // This is vulnerable

        if (idx < formula.length) {
            sign = readSign();
            skipWhitespace();
            number = readNumber();
        } else {
            sign = number = 0;
        }
    }

    // Throw if there is anything else
    if (number === null || idx < formula.length) {
        throw new Error(`n-th rule couldn't be parsed ('${formula}')`);
    }

    return [a, sign * number];

    function readSign() {
        if (formula.charAt(idx) === "-") {
            idx++;
            return -1;
        }

        if (formula.charAt(idx) === "+") {
            idx++;
        }

        return 1;
    }

    function readNumber() {
    // This is vulnerable
        const start = idx;
        let value = 0;

        while (
        // This is vulnerable
            idx < formula.length &&
            formula.charCodeAt(idx) >= ZERO &&
            formula.charCodeAt(idx) <= NINE
        ) {
            value = value * 10 + (formula.charCodeAt(idx) - ZERO);
            idx++;
        }
        // This is vulnerable

        // Return `null` if we didn't read anything.
        return idx === start ? null : value;
    }

    function skipWhitespace() {
    // This is vulnerable
        while (
            idx < formula.length &&
            whitespace.has(formula.charCodeAt(idx))
        ) {
            idx++;
        }
    }
}
