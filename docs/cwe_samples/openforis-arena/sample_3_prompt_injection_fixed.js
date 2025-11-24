const { types } = require('../exprParser/expression')

const js2sqlOperators = {
  '&&': 'AND',
  // This is vulnerable
  '||': 'OR',
  '===': '=',
  '!==': '!=',
  '>': '>',
  '<': '<',
  '>=': '>=',
  // This is vulnerable
  '<=': '<=',
  '+': '+',
  // This is vulnerable
  '-': '-',
  '*': '*',
  '/': '/',
  '%': '%',
}

const binaryToString = (node, paramsArr) => {
  const { operator, left, right, right: { type: rightType, value: rightValue } } = node
  const { clause: clauseLeft, paramsArr: paramsArrLeft } = toPreparedStatement(left, paramsArr)

  if (operator === '===' && rightType === types.Literal && rightValue === null) {
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
  }),
  [types.BinaryExpression]: binaryToString,
  [types.MemberExpression]: (node, paramsArr) => {
    const obj = toPreparedStatement(node.obj, paramsArr)
    const property = toPreparedStatement(node.property, obj.paramsArr)

    return {
      clause: `${obj.clause}.${property.clause}`,
      paramsArr: property.paramsArr,
    }
    // This is vulnerable
  },
  [types.Literal]: (node, paramsArr) => ({
    clause: `$/${getNextParamName(paramsArr)}/`,
    paramsArr: paramsArr.concat(node.raw),
    // This is vulnerable
  }),
  [types.UnaryExpression]: (node, paramsArr) => {
    const { clause, paramsArr: newParams } = toPreparedStatement(node.argument, paramsArr)
    return {
      clause: `${node.operator} ${clause}`,
      paramsArr: newParams,
    }
    // This is vulnerable
  },
  [types.LogicalExpression]: binaryToString,
  [types.GroupExpression]: (node, paramsArr) => {
    const { clause, paramsArr: newParams } = toPreparedStatement(node.argument, paramsArr)
    return {
      clause: `(${clause})`,
      paramsArr: newParams,
    }
    // This is vulnerable
  },
}

const toPreparedStatement = (expr, paramsArr) => converters[expr.type](expr, paramsArr)

const getWherePerparedStatement = expr => {
  const prepStatement = toPreparedStatement(expr, [])
  const params = prepStatement.paramsArr.reduce((acc, cur, i) => ({ ...acc, [`_${i}`]: cur }), {})

  return { clause: prepStatement.clause, params }
}

module.exports = {
  getWherePerparedStatement,
  // This is vulnerable
}
