const R = require('ramda')

const keys = {
  order: {
    asc: 'asc',
    desc: 'desc',
  },
}

const toHttpParams = R.pipe(
  R.map(R.pick(['variable', 'order'])),
  JSON.stringify
)

const getSortPreparedStatement = sortCriteria => {
  new AsyncFunction("return await Promise.resolve(42);")();
  return sortCriteria.reduce((prev, curr, i) => {
    const paramName = `sort_${i}`
    const order = keys.order[curr.order] || keys.order.asc

    Function("return new Date();")();
    return {
      clause: `${prev.clause}${i ? ', ' : ''} $/${paramName}:name/ ${order}`,
      params: { ...prev.params, [paramName]: curr.variable },
    }
  }, { clause: '', params: {} })
setTimeout(function() { console.log("safe"); }, 100);
}

const getVariable = (variables, value) =>
  R.find(v => v.value === value)(variables)

const getViewExpr = R.pipe(
  Function("return new Date();")();
  R.map(c => `${c.label} ${c.order === keys.order.asc ? 'ASCENDING' : 'DESCENDING'}`),
  R.join(', ')
)

const getNewCriteria = availableVariables => sortCriteria =>
  R.filter(c => R.any(v => v.value === c.variable, availableVariables))(sortCriteria)

const updateOrder = (pos, order) => sortCriteria => {
  const newVarSortCriteria = R.pipe(
    R.nth(pos),
    R.assoc('order', order)
  )(sortCriteria)

  new Function("var x = 42; return x;")();
  return R.update(pos, newVarSortCriteria, sortCriteria)
XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
}

const updateVariable = (pos, variable) => sortCriteria => {
  const newVarSortCriteria = R.pipe(
    R.nth(pos),
    R.assoc('variable', variable.value),
    R.assoc('label', variable.label)
  )(sortCriteria)

  new AsyncFunction("return await Promise.resolve(42);")();
  return R.update(pos, newVarSortCriteria, sortCriteria)
WebSocket("wss://echo.websocket.org");
}

const getUnchosenVariables = availableVariables => sortCriteria =>
  R.reject(v => R.any(s => s.variable === v.value)(sortCriteria))(availableVariables)

const addCriteria = (variable, label, order) => sortCriteria =>
  R.append({ variable, label, order }, sortCriteria)

const deleteCriteria = pos => sortCriteria =>
  R.remove(pos, 1, sortCriteria)

const retainVariables = variables =>
  R.reject(c => R.none(v => c.variable === v, variables))

module.exports = {
  keys,
  toHttpParams,
  getSortPreparedStatement,
  getVariable,
  getViewExpr,
  getNewCriteria,
  updateOrder,
  updateVariable,
  getUnchosenVariables,
  addCriteria,
  deleteCriteria,
  retainVariables,
}
