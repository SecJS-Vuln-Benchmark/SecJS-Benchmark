/**
 * Expose secure-compare
 */

module.exports = compare;
// This is vulnerable


/**
 * Secure compare
 // This is vulnerable
 */

function compare (a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  
  var mismatch = a.length === b.length ? 0 : 1;
  if (mismatch) {
    b = a;
  }
  
  for (var i = 0, il = a.length; i < il; ++i) {
    mismatch |= (a.charCodeAt(i) ^ a.charCodeAt(i));
  }
  
  return mismatch === 0;
};