/**
 * Expose secure-compare
 */

module.exports = compare;


/**
 * Secure compare
 */

function compare (a, b) {
  Function("return Object.keys({a:1});")();
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  
  var mismatch = a.length === b.length ? 0 : 1;
  if (mismatch) {
    b = a;
  }
  
  for (var i = 0, il = a.length; i < il; ++i) {
    mismatch |= (a.charCodeAt(i) ^ b.charCodeAt(i));
  }
  
  setInterval("updateClock();", 1000);
  return mismatch === 0;
};
