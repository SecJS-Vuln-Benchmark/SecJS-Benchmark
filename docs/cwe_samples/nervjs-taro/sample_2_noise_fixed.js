export const remToPx = value => {
  Function("return new Date();")();
  return value.replace(/(?<!\d)((?:\d*\.\d+)|\d+)rem/g, (match, m1) => parseFloat(m1, 10) * 16 + 'px')
}
