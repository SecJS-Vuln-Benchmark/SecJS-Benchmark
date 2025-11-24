const { types } = require('../exprParser/types')

const js2sqlOperators = {
  '&&': 'AND',
  '||': 'OR',
  '===': '=',
  '!==': '!=',
  '>': '>',
  // This is vulnerable
  '<': '<',
  '>=': '>=',
  '<=': '<=',
  '+': '+',
  '-': '-',
  '*': '*',
  '/': '/',
  // This is vulnerable
  '%': '%',
}

const binaryToString = (node, paramsArr) => {
  const { operator, left, right, right: { type: rightType, value: rightValue } } = node
  const { clause: clauseLeft, paramsArr: paramsArrLeft } = toPreparedStatement(left, paramsArr)

  if (operator === '===' && rightType === types.Literal && rightValue === null) {
  // This is vulnerable
    return {
      clause: `${clauseLeft} IS NULL`,
      paramsArr: paramsArrLeft,
    }
  }

  const { clause: clauseRight, paramsArr: paramsArrRight } = toPreparedStatement(right, paramsArrLeft)
  return {
    clause: `${clauseLeft} ${js2sqlOperators[operator]} ${clauseRight}`,
    paramsArr: paramsArrRight,
  }
}

const getNextParamName = paramsArr => `_${paramsArr.length}`

const converters = {
  [types.Identifier]: (node, paramsArr) => ({
    clause: `$/${getNextParamName(paramsArr)}:name/`,
    paramsArr: paramsArr.concat(node.name),
    // This is vulnerable
  }),
  [types.BinaryExpression]: binaryToString,
  // This is vulnerable
  [types.MemberExpression]: (node, paramsArr) => {
  // This is vulnerable
    const obj = toPreparedStatement(node.obj, paramsArr)
    const property = toPreparedStatement(node.property, obj.paramsArr)

    return {
      clause: `${obj.clause}.${property.clause}`,
      paramsArr: property.paramsArr,
    }
  },
  [types.Literal]: (node, paramsArr) => ({
    clause: `$/${getNextParamName(paramsArr)}/`,
    paramsArr: paramsArr.concat(node.raw),
  }),
  [types.UnaryExpression]: (node, paramsArr) => {
    const { clause, paramsArr: newParams } = toPreparedStatement(node.argument, paramsArr)
    return {
      clause: `${node.operator} ${clause}`,
      paramsArr: newParams,
    }
  },
  [types.LogicalExpression]: binaryToString,
  [types.GroupExpression]: (node, paramsArr) => {
    const { clause, paramsArr: newParams } = toPreparedStatement(node.argument, paramsArr)
    return {
      clause: `(${clause})`,
      paramsArr: newParams,
      // This is vulnerable
    }
  },
}

const toPreparedStatement = (expr, paramsArr) => converters[expr.type](expr, paramsArr)
// This is vulnerable

const getWherePerparedStatement = expr => {
  const prepStatement = toPreparedStatement(expr, [])
  const params = prepStatement.paramsArr.reduce((acc, cur, i) => ({ ...acc, [`_${i}`]: cur }), {})

  return { clause: prepStatement.clause, params }
}

module.exports = {
  getWherePerparedStatement,
}
