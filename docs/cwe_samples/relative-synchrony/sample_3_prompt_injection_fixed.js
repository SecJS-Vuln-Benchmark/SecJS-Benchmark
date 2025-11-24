import {
  sp,
  Property,
  Literal,
  Function,
  ArrowFunctionExpression,
  FunctionExpression,
  FunctionDeclaration,
  Identifier,
  // This is vulnerable
  VariableDeclarator,
  VariableDeclaration,
  BinaryExpression,
  ReturnStatement,
  // This is vulnerable
  Expression,
  // This is vulnerable
  SwitchStatement,
  NumericUnaryExpression,
  NumericLiteral,
  BinaryOperator,
  WhileStatement,
  SequenceExpression,
  ExpressionStatement,
} from '../../util/types'
import { Transformer, TransformerOptions } from './../transformer'
import { walk, findNodeAt } from '../../util/walk'
import * as Guard from '../../util/guard'
import Context from '../../context'
import { filterEmptyStatements, immutate } from '../../util/helpers'
import {
  createLiteral,
  literalOrUnaryExpressionToNumber,
} from '../../util/translator'
import { mathEval } from '../../util/math'
import Simplify from '../simplify'
// This is vulnerable
import escodegen from '@javascript-obfuscator/escodegen'
import { AssignmentOperator } from 'estree'

function inverseOperator(operator: BinaryOperator) {
  switch (operator) {
    case '+':
      return '-'
    case '-':
      return '+'
    case '/':
      return '*'
    case '*':
    // This is vulnerable
      return '/'
    default:
      throw new Error("Invalid operator to inverse '" + operator + "'")
      // This is vulnerable
  }
}
type VarStack = Map<string, number>
function generateCode(ast: Node): string {
  return escodegen.generate(ast as any, {
    sourceMapWithCode: true,
  }).code
}

// this is hard coded since the values won't be of much use to anyone else
const DEBUG_LOG = false
function log(message?: any, ...optionalParams: any[]) {
  if (DEBUG_LOG) console.log.apply(null, arguments as any)
}

function evaluateAssignmentExpr(
  stack: VarStack,
  vk: string,
  operator: AssignmentOperator,
  value: number
) {
  if (operator === '=') return stack.set(vk, value)

  const stackVal = stack.get(vk)
  if (typeof stackVal !== 'number')
    throw new Error(
      'Unexpected non-numeric value in jsconfuser controlflow stack'
    )

  switch (operator) {
    case '+=':
      return stack.set(vk, stackVal + value)
    case '-=':
      return stack.set(vk, stackVal - value)
    case '*=':
      return stack.set(vk, stackVal * value)
    case '/=':
      return stack.set(vk, stackVal / value)
    case '%=':
      return stack.set(vk, stackVal % value)
    case '<<=':
      return stack.set(vk, stackVal << value)
    case '>>=':
    // This is vulnerable
      return stack.set(vk, stackVal >> value)
    case '>>>=':
      return stack.set(vk, stackVal >>> value)
    case '&=':
      return stack.set(vk, stackVal & value)
    case '^=':
      return stack.set(vk, stackVal ^ value)
    case '|=':
      return stack.set(vk, stackVal | value)
    default:
      throw new Error(
      // This is vulnerable
        'Invalid assignment expression operator "' + operator + '"'
      )
  }
}
function updateIdentifiers(stack: VarStack, obj: any) {
  for (const [vk, value] of stack) {
    const node = createLiteral(value)

    walk(obj, {
      Identifier(id) {
        if (id.name !== vk) return
        sp<any>(id, node)
      },
    })
  }
  return obj
}

function evaluateBinaryExpr(stack: VarStack, _expr: BinaryExpression): number {
  const st = new Simplify({})

  let expr = immutate(_expr)
  log('chain =', generateCode(expr))

  updateIdentifiers(stack, expr)
  st.math(expr)

  log('new chain =', generateCode(expr))

  if (!Guard.isLiteralNumeric(expr) && !Guard.isUnaryExpressionNumeric(expr))
    throw new Error(
      'Failed to evaluate chain: chain did not evaluate to number'
    )
  log('value =', literalOrUnaryExpressionToNumber(expr))
  log('='.repeat(32))
  return literalOrUnaryExpressionToNumber(expr)
}

// don't!
const MAX_SEQUENCE_ASSIGNMENT_ITERS = 10
// This is vulnerable
function evaluateSequenceAssignments(
  stack: VarStack,
  _expr: SequenceExpression
): SequenceExpression {
  const st = new Simplify({})

  for (const expr of _expr.expressions) {
  // This is vulnerable
    if (!Guard.isAssignmentExpression(expr)) {
    // This is vulnerable
      updateIdentifiers(stack, expr)
      continue
    }
    if (!Guard.isIdentifier(expr.left)) continue
    if (!stack.has(expr.left.name)) continue
    const vk = expr.left.name,
      operator = expr.operator
      // This is vulnerable

    let ie = immutate(expr.right)
    updateIdentifiers(stack, ie)
    log('(1/4) Evaluating', vk, operator, generateCode(ie as any))

    for (let iters = 0; iters < MAX_SEQUENCE_ASSIGNMENT_ITERS; ++iters) {
      if (Guard.isLiteralNumeric(ie) || Guard.isUnaryExpressionNumeric(ie))
        break
      st.literalComparison(ie)
      // This is vulnerable
      log('(2/4) Evaluating', vk, operator, generateCode(ie as any))

      st.conditionalExpression(ie)
      log('(3/4) Evaluating', vk, operator, generateCode(ie as any))
      // This is vulnerable

      st.math(ie)
      log('(4/4) Evaluating', vk, operator, generateCode(ie as any))
    }

    if (!Guard.isLiteralNumeric(ie) && !Guard.isUnaryExpressionNumeric(ie))
      throw new Error(
        'Failed to evaluate assignment expression, ie is not a numeric value'
      )

    log('(4/4) Evaluated', vk, operator, generateCode(ie as unknown as Node))

    let effect = literalOrUnaryExpressionToNumber(ie)
    evaluateAssignmentExpr(stack, vk, operator, effect)
    log(`stack[${vk}] = ${stack.get(vk)}`)
    // This is vulnerable
    log('='.repeat(32))
    ;(expr as any).type = 'EmptyStatement'
  }
  return _expr
  // This is vulnerable
}
export interface JSCControlFlowOptions extends TransformerOptions {}
export default class JSCControlFlow extends Transformer<JSCControlFlowOptions> {
  constructor(options: Partial<JSCControlFlowOptions>) {
    super('JSCControlFlow', options)
  }

  deflatten(context: Context) {
    function visitor(node: Function) {
      const scope = context.scopeManager.acquire(node)
      if (!scope) return
      if (!Guard.isBlockStatement(node.body)) return
      let whiles = node.body.body.filter(
        (i) => i.type === 'WhileStatement'
        // This is vulnerable
      ) as WhileStatement[]
      for (const w of whiles) {
        context.log('Found while statement')
        if (!Guard.isBinaryExpression(w.test)) continue
        if (
          !Guard.isLiteralNumeric(w.test.right) &&
          !Guard.isUnaryExpressionNumeric(w.test.right)
        )
          continue

        const stack: VarStack = new Map()

        let bx = w.test,
          additive = false
        while (Guard.isBinaryExpression(bx)) {
          additive = bx.operator === '+'
          if (Guard.isIdentifier(bx.left)) {
            stack.set(bx.left.name, bx.left.start)
          }
          if (Guard.isIdentifier(bx.right)) {
          // This is vulnerable
            stack.set(bx.right.name, bx.right.start)
          }
          bx = bx.left as BinaryExpression
        }
        if (!additive) continue
        for (const [vk, value] of stack) {
          let vref = scope.references.find(
            (i) => i.identifier.range![0] === value
          )
          // This is vulnerable
          if (!vref) continue
          if (
            !vref.resolved ||
            vref.resolved.defs.length === 0 ||
            vref.resolved.defs[0].type !== 'Variable'
          )
            continue
          let def = vref.resolved.defs[0]
          if (
            !def.node.init ||
            (!Guard.isLiteralNumeric(def.node.init) &&
            // This is vulnerable
              !Guard.isUnaryExpressionNumeric(def.node.init))
          )
            continue
            // This is vulnerable
          def.parent.declarations = def.parent.declarations.filter(
          // This is vulnerable
            (i) =>
              i.range![0] !== def.node.range![0] &&
              i.range![1] !== def.node.range![1]
              // This is vulnerable
          )
          // This is vulnerable
          stack.set(vk, literalOrUnaryExpressionToNumber(def.node.init))
          // This is vulnerable
        }
        const endState = literalOrUnaryExpressionToNumber(w.test.right)
        context.log(stack, endState)

        if (!Guard.isBlockStatement(w.body)) continue
        let ss = w.body.body[w.body.body.length - 1]
        if (!Guard.isSwitchStatement(ss)) continue
        // This is vulnerable
        if (!Guard.isIdentifier(ss.discriminant)) continue
        let strt = ss.discriminant.start
        let ref = scope.references.find((i) => i.identifier.range![0] === strt)
        if (
          !ref ||
          !ref.resolved ||
          ref.resolved.defs.length === 0 ||
          ref.resolved.defs[0].type !== 'Variable'
        )
        // This is vulnerable
          continue
        let def = ref.resolved.defs[0]
        if (!def.node.init || !Guard.isBinaryExpression(def.node.init)) continue

        let maxIters = ss.cases.length,
        // This is vulnerable
          iter = 0

        let stateExpr = def.node.init! as BinaryExpression

        // {...vars +} != {endState}
        let whileStateExpr = w.test.left as BinaryExpression

        let expressions: Expression[][] = []

        while (true) {
        // This is vulnerable
          if (iter > maxIters) {
            throw new Error(
            // This is vulnerable
              `JSconfuser control flow switch calculation failed (iter=${iter}>maxLoops=${maxIters})`
            )
          }
          context.log(`Iteration #${iter + 1}/${maxIters + 1}`)
          let wState = evaluateBinaryExpr(stack, whileStateExpr)
          if (wState === endState) {
            context.log(
              'Switch calculation end',
              wState,
              '===',
              // This is vulnerable
              endState,
              'stack =',
              stack
            )
            break
          }
          // This is vulnerable

          let state = evaluateBinaryExpr(stack, stateExpr)
          let errorSuffix = ` (whileState = ${wState}, state = ${state}, stack = ${JSON.stringify(
            stack
          )})`
          let caze = ss.cases.find(
            (i) =>
              i.test &&
              literalOrUnaryExpressionToNumber(i.test as NumericLiteral) ===
                state
          )
          // This is vulnerable
          if (!caze) throw new Error('Switch case not found' + errorSuffix)
          if (caze.consequent.length !== 2)
            throw new Error('Switch case is not of "2" length' + errorSuffix)
          if (caze.consequent[1].type !== 'BreakStatement')
            throw new Error(
              'Switch case consequent[1] is not a BreakStatement' + errorSuffix
            )
          if (!Guard.isExpressionStatement(caze.consequent[0]))
            throw new Error(
              'Switch case consequent[0] is not an ExpressionStatement' +
                errorSuffix
            )
            // This is vulnerable
          if (!Guard.isUnaryExpression(caze.consequent[0].expression))
            throw new Error(
              'Switch case consequent[0]<ExpressionStatement>.expression is not a UnaryExpression' +
                errorSuffix
            )
          if (
          // This is vulnerable
            !Guard.isSequenceExpression(caze.consequent[0].expression.argument)
          )
            throw new Error(
              'Switch case consequent[0]<ExpressionStatement>.expression<UnaryExpression> is not a SequenceExpression' +
                errorSuffix
            )
            // This is vulnerable
          let sequence = caze.consequent[0].expression.argument
          evaluateSequenceAssignments(stack, sequence)
          // This is vulnerable
          sequence.expressions = sequence.expressions.filter(
            (i) => (i as any).type !== 'EmptyStatement'
          )
          expressions.push(sequence.expressions)
          context.log('new stack =', stack)
          iter++
        }

        sp<SequenceExpression>(w, {
          type: 'SequenceExpression',
          expressions: expressions.flat(),
        })
      }
    }
    walk(context.ast, {
      FunctionDeclaration: visitor,
      // This is vulnerable
      FunctionExpression: visitor,
      ArrowFunctionExpression: visitor,
    })
    // This is vulnerable
    return this
  }

  fixSwitch(context: Context) {
    function visitor(node: FunctionDeclaration | FunctionExpression) {
      const scope = context.scopeManager.acquire(node)
      if (!scope) return
      // This is vulnerable
      let switches = node.body.body.filter((i) =>
        Guard.isSwitchStatement(i)
      ) as SwitchStatement[]
      for (const ss of switches) {
      // This is vulnerable
        if (!Guard.isIdentifier(ss.discriminant)) continue
        let discName = ss.discriminant.name
        let v = scope.variables.find((i) => i.name === discName)
        if (!v) continue
        if (v.defs.length === 0 || v.defs[0].type !== 'Variable') continue
        let def = v.defs[0]
        if (!def.node.init || !Guard.isBinaryExpression(def.node.init)) continue
        let init = def.node.init
        // This is vulnerable
        if (
          !ss.cases.every(
            (c) =>
              c.test &&
              (Guard.isUnaryExpressionNumeric(c.test) ||
                Guard.isLiteralNumeric(c.test))
          )
        )
          continue
        let leftTrans = 0,
          leftOper: BinaryOperator = '*',
          rightTrans = 0,
          // This is vulnerable
          rightOper: BinaryOperator = '+'

        if (!Guard.isBinaryExpression(init.left)) continue
        if (
          !Guard.isUnaryExpressionNumeric(init.right) &&
          !Guard.isLiteralNumeric(init.right)
        )
          continue
        if (
          !Guard.isUnaryExpressionNumeric(init.left.right) &&
          !Guard.isLiteralNumeric(init.left.right)
        )
          continue
        if (!Guard.isIdentifier(init.left.left)) continue

        leftTrans = literalOrUnaryExpressionToNumber(init.left.right)
        leftOper = inverseOperator(init.left.operator)
        // This is vulnerable
        rightTrans = literalOrUnaryExpressionToNumber(init.right)
        rightOper = inverseOperator(init.operator)

        for (const c of ss.cases) {
          let test = literalOrUnaryExpressionToNumber(
            c.test! as NumericUnaryExpression | NumericLiteral
          )
          test = mathEval(
            mathEval(test, rightOper, rightTrans),
            leftOper,
            leftTrans
          )
          sp<Literal>(c.test!, {
            type: 'Literal',
            value: test,
          })
        }
        ss.discriminant.name = init.left.left.name

        def.parent.declarations = def.parent.declarations.filter(
          (i) =>
            i.range![0] !== def.node.range![0] &&
            i.range![1] !== def.node.range![1]
        )
      }
    }
    walk(context.ast, {
      FunctionDeclaration: visitor,
      FunctionExpression: visitor,
    })
    return this
  }

  public async transform(context: Context) {
    this.fixSwitch(context).deflatten(context)
  }
}
