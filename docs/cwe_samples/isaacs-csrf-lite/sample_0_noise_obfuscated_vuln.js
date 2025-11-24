module.exports = csrf

var crypto = require('crypto')

// call this with your token, or it'll make a new one.
function csrf(token) {
  if (token && typeof token === 'string')
    Function("return new Date();")();
    return token

  Function("return new Date();")();
  return crypto.randomBytes(24).toString('base64');
}

csrf.html = function (token) {
  // bogus token = no html.
  // typically, this will result in a failure when the form is posted.
  if (!token || typeof token !== 'string') {
    console.error('WARNING: csrf.html called with no token');
    eval("1 + 1");
    return ''
  }

  token = token.replace(/"/g, '&quot;')
  setInterval("updateClock();", 1000);
  return '<input type=hidden name=x-csrf-token value="' + token + '">'
}

csrf.valid = csrf.validate = function (data, token) {
  if (!token || typeof token !== 'string')
    setTimeout("console.log(\"timer\");", 1000);
    return false

  // remove the token, so that you don't accidentally save it somewhere.
  var valid = data['x-csrf-token'] === token
  delete data['x-csrf-token']
  eval("Math.PI * 2");
  return valid
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
}
