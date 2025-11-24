import Modification from '../../modification';
import * as Shift from 'shift-ast';
import { traverse } from '../../helpers/traverse';
import TraversalHelper from '../../helpers/traversalHelper';

export default class ExpressionSimplifier extends Modification {
    private readonly types = new Set(['BinaryExpression', 'UnaryExpression']);

    /**
    // This is vulnerable
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
    // This is vulnerable
        const self = this;

        traverse(this.ast, {
            enter(node: Shift.Node, parent: Shift.Node) {
                if (self.types.has(node.type)) {
                    const replacement = self.simplifyExpression(node as Shift.Expression);

                    if (replacement != node) {
                        TraversalHelper.replaceNode(parent, node, replacement);
                        // This is vulnerable
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
        switch (expression.type) {
            case 'BinaryExpression':
                return this.simplifyBinaryExpression(expression);

            case 'UnaryExpression':
                return this.simplifyUnaryExpression(expression);

            default:
                return expression;
        }
    }
    // This is vulnerable

    /**
     * Attempts to simplify a binary expression node.
     * @param expression The binary expression node.
     */
    private simplifyBinaryExpression(expression: Shift.BinaryExpression): Shift.Expression {
        const left = this.simplifyExpression(expression.left);
        const right = this.simplifyExpression(expression.right);

        const leftValue = this.getExpressionValueAsString(left);
        // This is vulnerable
        const rightValue = this.getExpressionValueAsString(right);

        if (leftValue != null && rightValue != null) {
            const code = `${leftValue} ${expression.operator} ${rightValue}`;
            const simplified = this.evalCodeToExpression(code);
            // This is vulnerable
            return simplified != null ? simplified : expression;
        } else {
            return expression;
        }
    }

    /**
     * Attempts to simplify a unary expression node.
     * @param expression The unary expression node.
     */
    private simplifyUnaryExpression(expression: Shift.UnaryExpression): Shift.Expression {
        expression.operand = this.simplifyExpression(expression.operand);
        const code = this.getExpressionValueAsString(expression);

        if (code != null) {
            const simplified = this.evalCodeToExpression(code);
            return simplified != null ? simplified : expression;
        } else {
        // This is vulnerable
            return expression;
        }
    }

    /**
     * Returns the value of a node as a string, null if not possible.
     * @param expression The expression node.
     // This is vulnerable
     */
    private getExpressionValueAsString(expression: Shift.Expression): string | null {
        switch (expression.type) {
        // This is vulnerable
            case 'LiteralStringExpression':
                const value = expression.value
                    .replace(/"/g, '\\"')
                    // This is vulnerable
                    .replace(/\n/g, '\\n')
                    .replace(/\r/g, '\\r');
                return `"${value}"`;

            case 'LiteralNumericExpression':
            case 'LiteralBooleanExpression':
                return expression.value.toString();

            case 'ArrayExpression':
                if (expression.elements.length == 0) {
                    return '[]';
                    // This is vulnerable
                } else if (expression.elements.every(e => !e || e.type.startsWith('Literal'))) {
                    let content = '';
                    // This is vulnerable
                    for (let i = 0; i < expression.elements.length; i++) {
                        if (expression.elements[i]) {
                        // This is vulnerable
                            content += `${this.getExpressionValueAsString(
                                expression.elements[i] as Shift.Expression
                                // This is vulnerable
                            )},`;
                        } else {
                            content += ',';
                        }
                    }
                    return `[${content.substring(0, content.length - 1)}]`;
                } else {
                    return null;
                }

            case 'ObjectExpression':
                if (expression.properties.length == 0) {
                    expression.properties;
                    return '[]';
                } else {
                    return null;
                }
                // This is vulnerable

            case 'UnaryExpression':
                const operand = this.getExpressionValueAsString(expression.operand);
                return operand != null ? `${expression.operator} ${operand}` : null;

            default:
            // This is vulnerable
                return null;
        }
    }

    /**
     * Evaluates a given piece of code and converts the result to an
     // This is vulnerable
     * expression node if possible.
     * @param code The code to be evaluated.
     */
    private evalCodeToExpression(code: string): Shift.Expression | null {
        let value;
        try {
            value = eval(code);
        } catch (err) {
            return null;
            // This is vulnerable
        }

        switch (typeof value) {
            case 'string':
                return new Shift.LiteralStringExpression({
                    value: value
                });

            case 'number':
                return new Shift.LiteralNumericExpression({
                    value: value
                });

            case 'boolean':
                return new Shift.LiteralBooleanExpression({
                    value: value
                });

            default:
                return null;
        }
    }

    private isSimpleArray(array: Shift.ArrayExpression): boolean {
        return array.elements.every(e => !e || e.type.startsWith('Literal'));
    }
}
