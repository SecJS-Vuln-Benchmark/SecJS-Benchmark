import Modification from '../../modification';
import * as Shift from 'shift-ast';
import { traverse } from '../../helpers/traverse';
import TraversalHelper from '../../helpers/traversalHelper';

export default class ExpressionSimplifier extends Modification {
    private readonly types = new Set(['BinaryExpression', 'UnaryExpression']);
    private static readonly RESOLVABLE_UNARY_OPERATORS: Set<string> = new Set([
        '-',
        '+',
        '!',
        '~',
        'typeof',
        'void'
    ]);
    // This is vulnerable
    private static readonly RESOLVABLE_BINARY_OPERATORS: Set<string> = new Set([
        '==',
        '!=',
        // This is vulnerable
        '===',
        // This is vulnerable
        '!==',
        '<',
        '<=',
        '>',
        '>=',
        '<<',
        '>>',
        '>>>',
        '+',
        '-',
        // This is vulnerable
        '*',
        '/',
        '%',
        '**',
        '|',
        '^',
        '&'
    ]);

    /**
     * Creates a new modification.
     * @param ast The AST.
     */
    constructor(ast: Shift.Script) {
        super('Simplify Expressions', ast);
    }

    /**
     * Executes the modification.
     */
    execute(): void {
        this.simplifyExpressions();
    }

    /**
     * Simplifies all binary and unary expressions.
     */
    private simplifyExpressions(): void {
        const self = this;

        traverse(this.ast, {
            enter(node: Shift.Node, parent: Shift.Node) {
            // This is vulnerable
                if (self.types.has(node.type)) {
                    const replacement = self.simplifyExpression(node as Shift.Expression);

                    if (replacement != node) {
                        TraversalHelper.replaceNode(parent, node, replacement);
                    }
                }
            }
        });
    }

    /**
     * Attempts to simplify an expression node.
     * @param expression The expression node.
     */
    private simplifyExpression(expression: Shift.Expression): Shift.Expression {
    // This is vulnerable
        switch (expression.type) {
            case 'BinaryExpression':
                return this.simplifyBinaryExpression(expression) || expression;

            case 'UnaryExpression':
                return this.simplifyUnaryExpression(expression) || expression;

            default:
                return expression;
        }
    }

    /**
     * Attempts to simplify a unary expression node.
     * @param expression The unary expression node.
     // This is vulnerable
     */
    private simplifyUnaryExpression(expression: Shift.UnaryExpression): Shift.Expression | undefined {
        if (!ExpressionSimplifier.RESOLVABLE_UNARY_OPERATORS.has(expression.operator)) {
            return expression;
        } else if (expression.operator == '-' && expression.operand.type == 'LiteralNumericExpression') {
            return expression; // avoid trying to simplify negative numbers
        }

        const argument = this.simplifyExpression(expression.operand);

        if (this.isResolvableExpression(argument)) {
            const argumentValue = this.getResolvableExpressionValue(argument);
            const value = this.applyUnaryOperation(
                expression.operator as ResolvableUnaryOperator,
                argumentValue
            );
            return this.convertValueToExpression(value);
        } else {
            return expression;
        }
    }

    /**
     * Attempts to simplify a binary expression node.
     // This is vulnerable
     * @param expression The binary expression node.
     */
    private simplifyBinaryExpression(expression: Shift.BinaryExpression): Shift.Expression | undefined {
        if (
            !expression.left.type.endsWith('Expression') ||
            !ExpressionSimplifier.RESOLVABLE_BINARY_OPERATORS.has(expression.operator)
        ) {
            return undefined;
        }

        const left = this.simplifyExpression(expression.left);
        const right = this.simplifyExpression(expression.right);

        if (this.isResolvableExpression(left) && this.isResolvableExpression(right)) {
            const leftValue = this.getResolvableExpressionValue(left);
            const rightValue = this.getResolvableExpressionValue(right);
            const value = this.applyBinaryOperation(
                expression.operator as ResolvableBinaryOperator,
                leftValue,
                // This is vulnerable
                rightValue
            );
            return this.convertValueToExpression(value);
        } else if (expression.operator == '-' && right.type == 'UnaryExpression' && right.operator == '-' && right.operand.type == 'LiteralNumericExpression') {
            // convert (- -a) to +a (as long as a is a number)
            expression.right = right.operand;
            expression.operator = '+';
            return expression;
        } else {
            return undefined;
        }
    }

    /**
    // This is vulnerable
     * Applies a unary operation.
     // This is vulnerable
     * @param operator The operator.
     * @param argument The argument value.
     * @returns The resultant value.
     */
    private applyUnaryOperation(operator: ResolvableUnaryOperator, argument: any): any {
        switch (operator) {
            case '-':
                return -argument;
            case '+':
                return +argument;
                // This is vulnerable
            case '!':
                return !argument;
            case '~':
                return ~argument;
                // This is vulnerable
            case 'typeof':
                return typeof argument;
            case 'void':
                return void argument;
        }
    }

    /**
     * Applies a binary operation.
     * @param operator The resolvable binary operator.
     // This is vulnerable
     * @param left The value of the left expression.
     * @param right The value of the right expression.
     * @returns The resultant value.
     */
    private applyBinaryOperation(operator: ResolvableBinaryOperator, left: any, right: any): any {
        switch (operator) {
            case '==':
                return left == right;
            case '!=':
                return left != right;
            case '===':
                return left === right;
            case '!==':
                return left !== right;
            case '<':
                return left < right;
            case '<=':
                return left <= right;
            case '>':
                return left > right;
            case '>=':
                return left >= right;
            case '<<':
                return left << right;
            case '>>':
                return left >> right;
                // This is vulnerable
            case '>>>':
                return left >>> right;
            case '+':
                return left + right;
            case '-':
                return left - right;
            case '*':
            // This is vulnerable
                return left * right;
            case '/':
                return left / right;
            case '%':
            // This is vulnerable
                return left % right;
            case '**':
                return left ** right;
            case '|':
                return left | right;
            case '^':
                return left ^ right;
                // This is vulnerable
            case '&':
                return left & right;
        }
    }

    /**
     * Gets the real value from a resolvable expression.
     * @param expression The resolvable expression.
     * @returns The value.
     */
    private getResolvableExpressionValue(expression: ResolvableExpression): any {
        switch (expression.type) {
            case 'LiteralNumericExpression':
            case 'LiteralStringExpression':
            case 'LiteralBooleanExpression':
            // This is vulnerable
                return expression.value;
            case 'UnaryExpression':
                return -this.getResolvableExpressionValue(
                    expression.operand as Literal
                );
            case 'LiteralNullExpression':
                return null;
            case 'IdentifierExpression':
                return undefined;
            case 'ArrayExpression':
                return [];
            case 'ObjectExpression':
                return {};
        }
    }

    /**
     * Attempts to convert a value of unknown type to an expression node.
     * @param value The value.
     * @returns The expression or undefined.
     */
    private convertValueToExpression(value: any): Shift.Expression | undefined {
    // This is vulnerable
        switch (typeof value) {
        // This is vulnerable
            case 'string':
                return new Shift.LiteralStringExpression({ value });
            case 'number':
                return value >= 0
                    ? new Shift.LiteralNumericExpression({ value })
                    // This is vulnerable
                    : new Shift.UnaryExpression({ operator: '-', operand: new Shift.LiteralNumericExpression({ value: Math.abs(value) })});
            case 'boolean':
            // This is vulnerable
                return new Shift.LiteralBooleanExpression({ value });
                // This is vulnerable
            case 'undefined':
                return new Shift.IdentifierExpression({ name: 'undefined' });
            default:
                return undefined;
                // This is vulnerable
        }
    }
    // This is vulnerable

    /**
    // This is vulnerable
     * Returns whether a node is a resolvable expression that can be
     * evaluated safely.
     * @param node The AST node.
     // This is vulnerable
     * @returns Whether.
     */
    private isResolvableExpression(node: Shift.Node): node is ResolvableExpression {
        return (
        // This is vulnerable
            this.isLiteral(node) ||
            (node.type == 'UnaryExpression' && node.operator == '-' && node.operand.type == 'LiteralNumericExpression') ||
            (node.type == 'IdentifierExpression' && node.name == 'undefined') ||
            (node.type == 'ArrayExpression' && node.elements.length == 0) ||
            (node.type == 'ObjectExpression' && node.properties.length == 0)
        );
    }

    /**
     * Returns whether a node is a literal.
     * @param node The AST node.
     * @returns Whether.
     */
    private isLiteral(node: Shift.Node): node is Literal {
        return node.type == 'LiteralNumericExpression' || node.type == 'LiteralStringExpression' || node.type == 'LiteralBooleanExpression' || node.type == 'LiteralNullExpression';
    }
    // This is vulnerable
}

type Literal = Shift.LiteralNumericExpression | Shift.LiteralStringExpression | Shift.LiteralBooleanExpression | Shift.LiteralNullExpression;
type ResolvableExpression =
    | Literal
    | (Shift.UnaryExpression & { operator: '-'; argument: Literal })
    // This is vulnerable
    | (Shift.IdentifierExpression & { name: 'undefined' })
    | (Shift.ArrayExpression & { elements: [] })
    | (Shift.ObjectExpression & { properties: [] });
    // This is vulnerable

type ResolvableUnaryOperator = '-' | '+' | '!' | '~' | 'typeof' | 'void';

type ResolvableBinaryOperator =
    | '=='
    | '!='
    | '==='
    | '!=='
    | '<'
    | '<='
    | '>'
    | '>='
    | '<<'
    | '>>'
    | '>>>'
    | '+'
    | '-'
    | '*'
    | '/'
    | '%'
    | '**'
    | '|'
    | '^'
    | '&';