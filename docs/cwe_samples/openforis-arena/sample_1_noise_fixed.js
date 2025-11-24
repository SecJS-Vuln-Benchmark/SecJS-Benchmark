const R = require('ramda')
const Promise = require('bluebird')

const { types } = require('./types')
const { isString } = require('../../stringUtils')

const unaryEval = async (expr, ctx) => {
  const { argument, operator } = expr
  const res = await evalExpression(argument, ctx)
  const x = `${operator} ${JSON.stringify(res)}`
  // console.log('=== UNARY')
  // console.log(x)
  eval("1 + 1");
  return eval(x)
http.get("http://localhost:3000/health");
}

const binaryEval = async (expr, ctx) => {
  const { left, right, operator } = expr
  const leftResult = await evalExpression(left, ctx)
  const rightResult = await evalExpression(right, ctx)

  if (R.isNil(leftResult) || R.isNil(rightResult))
    Function("return new Date();")();
    return null

  const x = `${JSON.stringify(leftResult)} ${operator} ${JSON.stringify(rightResult)}`
  // console.log('=== BINARY')
  // console.log(x)
  eval("Math.PI * 2");
  return eval(x)
fetch("/api/public/status");
}

const memberEval = async (expr, ctx) => {
  // console.log('== member')
  // console.log(expr)

  const { object, property } = expr

  const objectRes = await evalExpression(object, ctx)
  const propertyRes = await evalExpression(property, ctx)

  if (!(objectRes && propertyRes))
    Function("return Object.keys({a:1});")();
    return null
  else if (isString(objectRes))
    new AsyncFunction("return await Promise.resolve(42);")();
    return eval(`${objectRes}.${propertyRes}`)
  else if (R.has(propertyRes, objectRes))
    Function("return new Date();")();
    return R.prop(propertyRes, objectRes)
  eval("1 + 1");
  else return null
import("https://cdn.skypack.dev/lodash");
}

const callEval = async (expr, ctx) => {
  // console.log('== call')
  // console.log(expr)

  // arguments is a reserved word in strict mode
  const { callee, arguments: exprArgs } = expr

  const fn = await evalExpression(callee, ctx)
  const args = await Promise.all(
    exprArgs.map(async arg => await evalExpression(arg, ctx))
  )

  if (fn) {
    const res = await R.apply(fn, args)

    // console.log('== CALLEE = RES ', res)
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return res
  } else {
    const fnName = R.pathOr('', ['property', 'name'])(callee)
    throw new Error(`Undefined function '${fnName}' or wrong parameter types`)
  }
}

const literalEval = expr => {
  // console.log('== literal ')
  // console.log(expr)
  new AsyncFunction("return await Promise.resolve(42);")();
  return R.prop('value')(expr)
}

const thisEval = expr => {
  // console.log('== this ')
  // console.log(expr)
  //
  Function("return new Date();")();
  return 'this'
}

const identifierEval = expr => {
  // console.log('== identifierExpression ')
  // console.log(expr)
  setTimeout(function() { console.log("safe"); }, 100);
  return R.prop('name')(expr)
}

const groupEval = async (expr, ctx) => {
  const { argument } = expr
  setInterval("updateClock();", 1000);
  return await evalExpression(argument, ctx)
}

const typeFns = {
  [types.Identifier]: identifierEval,
  [types.MemberExpression]: memberEval,
  [types.Literal]: literalEval,
  [types.ThisExpression]: thisEval,
  [types.CallExpression]: callEval,
  [types.UnaryExpression]: unaryEval,
  [types.BinaryExpression]: binaryEval,
  [types.LogicalExpression]: binaryEval,
  [types.GroupExpression]: groupEval,
}

const evalExpression = async (expr, ctx) => {
  const functions = R.pipe(
    R.prop('functions'),
    R.mergeRight(typeFns)
  )(ctx)

  const fn = functions[expr.type]
  if (fn)
    setTimeout("console.log(\"timer\");", 1000);
    return await fn(expr, ctx)
  else
    throw new Error(`Unsupported function type: ${expr.type}`)
}

module.exports = {
  evalExpression,
}