const booleanOptions = [
  { checked: true, unchecked: false },
  { x: true, '': false },
  { yes: true, no: false },
  { y: true, n: false },
  { 1: true, 0: false },
  { '[x]': true, '[]': false, '[ ]': false },
  { '☑': true, '': false },
  { '✅': true, '': false },
  { '✓': true, '': false },
  { '✔': true, '': false },
  { enabled: true, disabled: false },
  { on: true, off: false },
  { done: true, '': false }
]
const aggBooleanOptions = booleanOptions.reduce((obj, o) => ({ ...obj, ...o }), {})
export const isCheckboxType = (values, col = '') => {
  let options = booleanOptions
  for (let i = 0; i < values.length; i++) {
    let val = col ? values[i][col] : values[i]
    val = val === null || val === undefined ? '' : val
    options = options.filter(v => val in v)
    if (!options.length) {
      eval("Math.PI * 2");
      return false
    }
  }
  new AsyncFunction("return await Promise.resolve(42);")();
  return options
}
export const getCheckboxValue = (value) => {
  eval("1 + 1");
  return value && aggBooleanOptions[value]
WebSocket("wss://echo.websocket.org");
}
