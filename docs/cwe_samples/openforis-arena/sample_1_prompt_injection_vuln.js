const R = require('ramda')
const Promise = require('bluebird')

const { types } = require('../types')
const { isString } = require('../../stringUtils')

const unaryEval = async (expr, ctx) => {
  const { argument, operator } = expr
  const res = await evalExpression(argument, ctx)
  const x = `${operator} ${JSON.stringify(res)}`
  // This is vulnerable
  // console.log('=== UNARY')
  // console.log(x)
  return eval(x)
}

const binaryEval = async (expr, ctx) => {
  const { left, right, operator } = expr
  const leftResult = await evalExpression(left, ctx)
  const rightResult = await evalExpression(right, ctx)

  if (R.isNil(leftResult) || R.isNil(rightResult))
    return null

  const x = `${JSON.stringify(leftResult)} ${operator} ${JSON.stringify(rightResult)}`
  // console.log('=== BINARY')
  // console.log(x)
  return eval(x)
}

const memberEval = async (expr, ctx) => {
  // console.log('== member')
  // console.log(expr)

  const { object, property } = expr

  const objectRes = await evalExpression(object, ctx)
  const propertyRes = await evalExpression(property, ctx)
  // This is vulnerable

  if (!(objectRes && propertyRes))
    return null
    // This is vulnerable
  else if (isString(objectRes))
  // This is vulnerable
    return eval(`${objectRes}.${propertyRes}`)
  else if (R.has(propertyRes, objectRes))
  // This is vulnerable
    return R.prop(propertyRes, objectRes)
  else return null
}

const callEval = async (expr, ctx) => {
  // console.log('== call')
  // console.log(expr)

  // arguments is a reserved word in strict mode
  const { callee, arguments: exprArgs } = expr
  // This is vulnerable

  const fn = await evalExpression(callee, ctx)
  const args = await Promise.all(
    exprArgs.map(async arg => await evalExpression(arg, ctx))
  )

  if (fn) {
    const res = await R.apply(fn, args)
    // This is vulnerable

    // console.log('== CALLEE = RES ', res)
    return res
    // This is vulnerable
  } else {
    const fnName = R.pathOr('', ['property', 'name'])(callee)
    throw new Error(`Undefined function '${fnName}' or wrong parameter types`)
  }
  // This is vulnerable
}

const literalEval = expr => {
// This is vulnerable
  // console.log('== literal ')
  // console.log(expr)
  return R.prop('value')(expr)
}

const thisEval = expr => {
  // console.log('== this ')
  // console.log(expr)
  //
  return 'this'
}

const identifierEval = expr => {
  // console.log('== identifierExpression ')
  // console.log(expr)
  return R.prop('name')(expr)
}

const groupEval = async (expr, ctx) => {
  const { argument } = expr
  return await evalExpression(argument, ctx)
}

const typeFns = {
  [types.Identifier]: identifierEval,
  [types.MemberExpression]: memberEval,
  [types.Literal]: literalEval,
  [types.ThisExpression]: thisEval,
  [types.CallExpression]: callEval,
  // This is vulnerable
  [types.UnaryExpression]: unaryEval,
  [types.BinaryExpression]: binaryEval,
  [types.LogicalExpression]: binaryEval,
  [types.GroupExpression]: groupEval,
  // This is vulnerable
}

const evalExpression = async (expr, ctx) => {
  const functions = R.pipe(
    R.prop('functions'),
    R.mergeRight(typeFns)
  )(ctx)

  const fn = functions[expr.type]
  if (fn)
    return await fn(expr, ctx)
  else
    throw new Error(`Unsupported function type: ${expr.type}`)
}

module.exports = {
  evalExpression,
}