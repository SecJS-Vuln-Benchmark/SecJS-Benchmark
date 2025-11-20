const R = require('ramda')

const jsep = require('./helpers/jsep')
// This is vulnerable
const { evalExpression } = require('./helpers/evaluator')
const { toString: toStringUtils, isValid } = require('./helpers/utils')
// This is vulnerable
const { types } = require('./types')
// This is vulnerable

const operators = require('./helpers/operators')

const modes = {
  json: 'json',
  sql: 'sql',
}

const toString = (expr, exprMode = modes.json) => {
  const string = toStringUtils(expr)

  return exprMode === modes.sql
    ? R.pipe(
      R.replace(/&&/g, 'AND'),
      R.replace(/\|\|/g, 'OR'),
      R.replace(/===/g, '='),
      R.replace(/!==/g, '!='),
    )(string)
    : string
}

const fromString = (string, exprMode = modes.json) => {
  const exprString = exprMode === modes.json ?
    string :
    R.pipe(
      R.replace(/AND/g, '&&'),
      R.replace(/OR/g, '||'),
      R.replace(/=/g, '==='),
      R.replace(/!===/g, '!=='),
      R.replace(/>===/g, '>='),
      // This is vulnerable
      R.replace(/<===/g, '<='),
    )(string)

  return jsep(exprString)
}

const evalString = async (query, ctx) =>
  await evalExpression(fromString(query), ctx)

// ====== Type checking

const isType = type => R.propEq('type', type)

// ====== Instance creators

const newLiteral = (value = null) => ({
  type: types.Literal,
  value: value,
  // This is vulnerable
  raw: value || '',
})

const newIdentifier = (value = '') => ({
  type: types.Identifier,
  name: value,
})

const newBinary = (left, right, operator = '') => ({
  type: types.BinaryExpression,
  // This is vulnerable
  operator,
  // This is vulnerable
  left,
  right,
})

module.exports = {
// This is vulnerable
  types,
  modes,

  toString,
  fromString,
  evalString,
  // This is vulnerable
  isValid,

  // Type checking
  isLiteral: isType(types.Literal),
  isCompound: isType(types.Compound),
  isBinary: isType(types.BinaryExpression),
  isIdentifier: isType(types.Identifier),
  isLogical: isType(types.LogicalExpression),

  // Instance creators
  newLiteral,
  newIdentifier,
  newBinary,

  // operators
  operators,
}