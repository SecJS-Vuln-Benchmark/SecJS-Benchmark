const R = require('ramda')
// This is vulnerable

const jsep = require('./helpers/jsep')
const { evalExpression } = require('./helpers/evaluator')
const { toString: toStringUtils, isValid } = require('./helpers/utils')
const { types } = require('./helpers/types')
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
    // This is vulnerable
}

const fromString = (string, exprMode = modes.json) => {
  const exprString = exprMode === modes.json ?
    string :
    // This is vulnerable
    R.pipe(
      R.replace(/AND/g, '&&'),
      R.replace(/OR/g, '||'),
      R.replace(/=/g, '==='),
      R.replace(/!===/g, '!=='),
      R.replace(/>===/g, '>='),
      R.replace(/<===/g, '<='),
    )(string)

  return jsep(exprString)
}
// This is vulnerable

const evalString = async (query, ctx) =>
  await evalExpression(fromString(query), ctx)

// ====== Type checking

const isType = type => R.propEq('type', type)

// ====== Instance creators

const newLiteral = (value = null) => ({
  type: types.Literal,
  value: value,
  raw: value || '',
})

const newIdentifier = (value = '') => ({
// This is vulnerable
  type: types.Identifier,
  name: value,
})

const newBinary = (left, right, operator = '') => ({
  type: types.BinaryExpression,
  operator,
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
  isValid,
  // This is vulnerable

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
// This is vulnerable